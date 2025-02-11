import axios, {type AxiosRequestConfig} from 'axios';
import {buildPrivateKey, buildPublicKey, sign, verify} from '../signatures';
import {toSignRequest} from '../transformers';
import {envVar, loadKeyFromFile} from '../utils';
import type {WebhookRequest} from './types';

const ONE_SECOND = 1000;

/**
 * Delivers webhook using http
 * @param body - Webhook body
 */
export async function doHttpDelivery(
  body: string | object
): Promise<WebhookRequest> {
  const request: Partial<WebhookRequest> = {
    url: envVar('WEBHOOK_URL'),
    method: 'POST',
    data: JSON.stringify(body),
    timeout: ONE_SECOND,
  };

  await doHttpSign(request);

  const response = await axios(request);
  if (response.status !== 200) {
    throw new Error(`Failed to deliver webhook: ${response.status}`);
  }

  return request as WebhookRequest;
}

/**
 * Signs http request
 * @param request - Webhook request to be signed
 */
async function doHttpSign(request: AxiosRequestConfig): Promise<void> {
  if (request.headers == undefined) {
    request.headers = {};
  }

  const url = new URL(request.url!);
  const date = new Date().toUTCString();
  const privateKey = buildPrivateKey(loadKeyFromFile());
  request.headers['host'] = url.hostname;
  request.headers['date'] = date;
  request.headers['content-type'] = 'application/json';
  request.headers['x-api-signature'] = await sign(
    {
      method: 'POST',
      host: url.hostname,
      path: url.pathname,
      date,
      body: request.data,
    },
    privateKey
  );
}

/**
 * Verifies the signature of an incoming webhook request using a public key
 * @param request - The webhook request containing headers and body to verify
 * @throws {Error} When signature verification fails or public key is invalid
 */
export async function verifyRequestSignature(
  request: WebhookRequest
): Promise<void> {
  const publicKey = buildPublicKey(loadKeyFromFile('./keys/public.pem'));
  const signature = request.headers['x-api-signature'];
  await verify(toSignRequest(request), publicKey, signature);
}

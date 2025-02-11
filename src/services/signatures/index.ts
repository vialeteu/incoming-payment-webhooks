import * as crypto from 'node:crypto';
import type { SignRequest } from './types';

/**
 * Builds a private key object from a PEM-encoded string
 * @param pem - The PEM-encoded private key string,
 *              including optional headers and footers.
 * @returns {crypto.KeyObject} The generated private key object
 * @throws {Error} If an error occurs during key creation
 */
export function buildPrivateKey(pem: string): crypto.KeyObject {
  // Remove PEM headers and footers (if present) and whitespace
  const pemContent = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s/g, '');
  const der = Buffer.from(pemContent, 'base64');

  return crypto.createPrivateKey({
    key: der,
    format: 'der',
    type: 'pkcs1',
  });
}

/**
 * Build public key from string
 * @param pem - The PEM-encoded public key string,
 *              including optional headers and footers.
 * @returns {crypto.KeyObject} The generated public key object
 * @throws {Error} If an error occurs during key creation
 */
export function buildPublicKey(src: string): crypto.KeyObject {
  // Remove PEM headers and footers (if present) and whitespace
  const pemContent = src
    .replace(/-----BEGIN PUBLIC KEY-----/g, '')
    .replace(/-----END PUBLIC KEY-----/g, '')
    .replace(/\s/g, '');
  const der = Buffer.from(pemContent, 'base64');

  return crypto.createPublicKey({
    key: der,
    format: 'der',
    type: 'spki',
  });
}

/**
 * Sign the request
 * @param request - Sign request
 * @param privateKey - Private key
 */
export async function sign(
  request: SignRequest,
  privateKey: crypto.KeyObject
): Promise<string> {
  const body = request.body == undefined ? '' : request.body;
  const str =
    `${request.method}\n` +
    `${request.host}\n` +
    `${request.path}\n` +
    `${request.date}\n` +
    `${body}`;
  const sign = crypto.createSign('sha256');
  sign.write(Buffer.from(str, 'utf8'));
  sign.end();
  return sign.sign(privateKey).toString('hex');
}

/**
 * Verify request signature
 * @param request - Sign request
 * @param publicKey - Public key
 * @param signature - Signature of the request to be verified
 * @throws {Error} If signature verification fails
 */
export async function verify(
  request: SignRequest,
  publicKey: crypto.KeyObject,
  signature: string
): Promise<void> {
  const body = request.body == undefined ? '' : request.body;
  const str =
    `${request.method}\n` +
    `${request.host}\n` +
    `${request.path}\n` +
    `${request.date}\n${body}`;
  const verify = crypto.createVerify('sha256');
  verify.write(Buffer.from(str, 'utf8'));
  verify.end();
  const buffer = Buffer.from(signature, 'hex');

  const ifValidSignature = verify.verify(publicKey, buffer);
  if (!ifValidSignature) {
    throw new Error('Invalid signature');
  }
}

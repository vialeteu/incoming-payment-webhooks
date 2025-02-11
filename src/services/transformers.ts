import type {WebhookRequest} from './requests/types';
import type {SignRequest} from './signatures/types';

export function toSignRequest(request: WebhookRequest): SignRequest {
  const url = new URL(request.url);

  return {
    method: 'POST',
    host: url.hostname,
    path: url.pathname,
    date: request.headers['date'],
    body: request.data,
  };
}

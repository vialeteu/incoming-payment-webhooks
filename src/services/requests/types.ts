import type {AxiosRequestConfig} from 'axios';

export interface WebhookRequest extends AxiosRequestConfig {
  method: 'POST';
  url: string;
  headers: {
    ['content-type']: 'application/json';
    ['date']: string;
    ['x-api-signature']: string;
  };
}

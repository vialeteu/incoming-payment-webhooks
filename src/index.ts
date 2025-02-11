import { doHttpDelivery, verifyRequestSignature } from './services/requests';
import { validateBody, type WebhookBody } from './services/validators';
import webhooks from './webhooks.json';

export const main = async () => {
  for (const webhook of webhooks as WebhookBody[]) {
    validateBody(webhook);
    const webhookRequest = await doHttpDelivery(webhook);
    await verifyRequestSignature(webhookRequest);
  }
};

if (require.main === module) main();

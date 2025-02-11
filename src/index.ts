import { doHttpDelivery, verifyRequestSignature } from './services/requests';
import { validateBody, type WebhookBody } from './services/validators';
import webhooks from './webhooks.json';

export const main = async () => {
  for (const webhook of webhooks as WebhookBody[]) {
    validateBody(webhook);

    // 1. Example of request sent from Vialet
    const webhookRequest = await doHttpDelivery(webhook);

    // 2. Example of signature verification
    await verifyRequestSignature(webhookRequest);
  }
};

if (require.main === module) main();

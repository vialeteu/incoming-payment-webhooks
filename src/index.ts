import { loadEnvFile, loadJsonFile } from './services/file-loading';
import { doHttpDelivery, verifyRequestSignature } from './services/requests';
import { validateBody, type WebhookBody } from './services/validators';

export const main = async () => {
  loadEnvFile();

  const webhooks = loadJsonFile<WebhookBody[]>();

  for (const webhook of webhooks) {
    validateBody(webhook);
    const webhookRequest = await doHttpDelivery(webhook);
    await verifyRequestSignature(webhookRequest);
  }
};

if (require.main === module) main();

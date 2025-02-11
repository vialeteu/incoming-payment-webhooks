import { z } from 'zod';

const statuses = [
  'INITIATED',
  'SUSPENDED',
  'PROCESSING',
  'COMPLETED',
  'REJECTED',
  'FAILED',
] as const;

const paymentTypes = ['INTERNAL', 'SEPA', 'SEPA_INSTANT', 'SWIFT'] as const;

export const webhookBodySchema = z
  .object({
    /** Unique payment identification value in the system */
    paymentId: z.string(),
    status: z.enum(statuses),
    serviceType: z.literal('INCOMING_PAYMENT'),
    version: z.literal('v1'),
    amlDecision: z.enum(['ACCEPTED', 'REJECTED']).optional(),
    /** Party ID of incoming payment beneficiary in the system */
    holderPartyId: z.string().uuid(),
    paymentData: z.object({
      paymentId: z.string(),
      status: z.enum(statuses),
      serviceType: z.literal('INCOMING_PAYMENT'),
      amount: z.number(),
      currency: z.string().length(3),
      beneficiary: z.object({
        name: z.string(),
        accountNumber: z.string(),
        country: z.string().length(2).optional(),
      }),
      payer: z.object({
        name: z.string(),
        accountNumber: z.string(),
        currency: z.string().length(3),
      }),
      paymentType: z.enum(paymentTypes),
    }),
  })
  .refine((body) => body.paymentId === body.paymentData.paymentId, {
    message: 'paymentId should be the same in the root and paymentData',
  });

export type WebhookBody = z.infer<typeof webhookBodySchema>;

/**
 * Validates a webhook body against a predefined schema
 * @param body - The webhook payload to validate
 * @throws {Error} Throws an error with formatted validation messages if the
 *                 body fails schema validation
 * @see {@link webhookBodySchema} for the expected schema structure
 */
export function validateBody(body: WebhookBody): void {
  const validation = webhookBodySchema.safeParse(body);
  if (!validation.success) {
    console.error(JSON.stringify(body, null, 4));
    throw new Error(JSON.stringify(validation.error.errors, null, 4));
  }
}

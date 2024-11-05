import { z } from "zod";

// PayPal Order Schema
export const PayPalOrderSchema = z.object({
  id: z.string(),
  status: z.enum([
    "CREATED",
    "SAVED",
    "APPROVED",
    "VOIDED",
    "COMPLETED",
    "PAYER_ACTION_REQUIRED",
  ]),
  payment_source: z.object({
    paypal: z.object({
      email_address: z.string().email(),
      account_id: z.string(),
      name: z.object({
        given_name: z.string(),
        surname: z.string(),
      }),
      address: z.object({
        country_code: z.string(),
      }).optional(),
    }),
  }),
  purchase_units: z.array(
    z.object({
      reference_id: z.string(),
      amount: z.object({
        currency_code: z.string(),
        value: z.string(),
      }),
    })
  ),
});

// PayPal Webhook Event Schema
export const PayPalWebhookEventSchema = z.object({
  id: z.string(),
  create_time: z.string(),
  resource_type: z.string(),
  event_type: z.string(),
  summary: z.string(),
  resource: z.object({
    id: z.string(),
    status: z.string(),
  }).and(z.record(z.any())), // Allow additional properties
});

export type PayPalOrder = z.infer<typeof PayPalOrderSchema>;
export type PayPalWebhookEvent = z.infer<typeof PayPalWebhookEventSchema>; 
import { z } from "zod";

export const paymentRequestSchema = z.object({
  service_code: z.string()
    .min(1, "Service code wajib diisi")
    .trim(),
});

export type PaymentRequestDto = z.infer<typeof paymentRequestSchema>;
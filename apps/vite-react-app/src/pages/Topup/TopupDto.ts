import { z } from "zod";

export const topUpRequestSchema = z.object({
  top_up_amount: z.number()
    .int()
    .min(10000, "Nominal minimal top up adalah Rp 10.000")
    .max(1000000, "Nominal maksimal top up adalah Rp 1.000.000"),
});

export type TopUpRequestDto = z.infer<typeof topUpRequestSchema>;
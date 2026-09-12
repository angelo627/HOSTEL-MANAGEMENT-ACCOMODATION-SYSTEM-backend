import { z } from "zod";

// Validate the information supplied by the student when making
// an accommodation payment.
export const makePaymentSchema = z.object({
  rrr: z
    .string()
    .trim()
    .min(1, "RRR is required."),

  amount: z
    .number()
    .positive("Payment amount must be greater than zero.")
    .finite("Payment amount must be a valid number."),
});
import { z } from "zod";

export const checkInSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^R-\d{3}-\d{3}$/, "Invalid check-in code format."),
});

import { z } from "zod";

// Validate the hostel selected by the student when submitting an accommodation application.
export const createHostelApplicationSchema = z.object({
  hostelId: z
    .string()
    .trim()
    .min(1, "Hostel ID is required."),
});
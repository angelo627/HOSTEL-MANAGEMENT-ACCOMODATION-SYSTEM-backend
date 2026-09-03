// HOSTEL
import { z } from "zod";

export const createHostelSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Hostel name must be at least 2 characters.")
    .max(100, "Hostel name must not exceed 100 characters."),

  description: z
    .string()
    .trim()
    .max(1000, "Description must not exceed 1000 characters.")
    .optional(),

  gender: z.enum(["MALE", "FEMALE"]),
});


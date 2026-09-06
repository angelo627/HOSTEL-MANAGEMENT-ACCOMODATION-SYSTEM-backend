import { z } from "zod";

// Validate the information required to create a bed.
export const createBedSchema = z.object({
  roomId: z
    .string()
    .trim()
    .min(1, "Room ID is required."),

  bedNumber: z
    .string()
    .trim()
    .min(1, "Bed number is required.")
    .max(20, "Bed number must not exceed 20 characters."),
});

// Validate the information supplied when updating an existing bed.
export const updateBedSchema = z.object({
  bedNumber: z
    .string()
    .trim()
    .min(1, "Bed number is required.")
    .max(20, "Bed number must not exceed 20 characters."),
});
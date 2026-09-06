import { z } from "zod";

// Validate the information required to create a room.
export const createRoomSchema = z.object({
  hostelId: z.string().trim().min(1, "Hostel ID is required."),

  roomNumber: z
    .string()
    .trim()
    .min(1, "Room number is required.")
    .max(20, "Room number must not exceed 20 characters."),

  capacity: z
    .number()
    .int("Room capacity must be a whole number.")
    .min(1, "Room capacity must be at least 1."),
});

// Validate the information supplied when updating an existing room.
// Both fields are optional, but at least one field must be provided.
export const updateRoomSchema = z
  .object({
    roomNumber: z
      .string()
      .trim()
      .min(1, "Room number is required.")
      .max(20, "Room number must not exceed 20 characters.")
      .optional(),

    capacity: z
      .number()
      .int("Room capacity must be a whole number.")
      .min(1, "Room capacity must be at least 1.")
      .optional(),
  })
  .refine(
    (data) => data.roomNumber !== undefined || data.capacity !== undefined,
    {
      message: "At least one room field must be provided for update.",
    },
  );

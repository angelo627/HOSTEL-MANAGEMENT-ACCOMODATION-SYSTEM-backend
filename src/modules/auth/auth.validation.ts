import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters.")
    .max(50, "First name must not exceed 50 characters."),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters.")
    .max(50, "Last name must not exceed 50 characters."),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password must not exceed 128 characters."),
});

export const studentLoginSchema = z.object({
  registrationNo: z
    .string()
    .trim()
    .regex(/^202[2-7]\/\d{6}$/, "Invalid registration number format."),

  rrr: z
    .string()
    .trim()
    .regex(/^RRR-(202[2-7])-\d{6}$/, "Invalid RRR format."),
});

export const adminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(1, "Password is required."),
});

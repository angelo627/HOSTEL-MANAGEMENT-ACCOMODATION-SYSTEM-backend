import { z } from "zod";

// Validate the 12-digit account number supplied when a user creates a bank account.
export const createBankAccountSchema = z.object({
  accountNumber: z
    .string()
    .trim()
    .regex(/^\d{12}$/, "Account number must be exactly 12 digits."),
});

// Validate the information required for an administrator to fund a bank account.
export const fundBankAccountSchema = z.object({
  accountNumber: z
    .string()
    .trim()
    .regex(/^\d{12}$/, "Account number must be exactly 12 digits."),

  amount: z
    .number()
    .positive("Funding amount must be greater than zero.")
    .finite("Funding amount must be a valid number."),
});

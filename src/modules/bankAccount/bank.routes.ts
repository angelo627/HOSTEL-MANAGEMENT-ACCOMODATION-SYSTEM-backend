import { Router } from "express";

import { validateRequest } from "../../shared/validation/validate-request";

import { bankAccountController } from "./bank.controller";
import {
  createBankAccountSchema,
  fundBankAccountSchema,
} from "./bank.validation";

const bankAccountRouter = Router();
const adminbankAccountRouter = Router();

// Allow an authenticated user to create their own bank account.
bankAccountRouter.post(
  "/bank-account/create",
  validateRequest(createBankAccountSchema),
  bankAccountController.createBankAccount,
);

// Retrieve the bank account belonging to the currently authenticated user.
bankAccountRouter.get(
  "/get-user/bank-account",
  bankAccountController.getMyBankAccount,
);

// Allow administrators to fund an existing bank account.
adminbankAccountRouter.post(
  "/fund/bank-account",
  validateRequest(fundBankAccountSchema),
  bankAccountController.fundBankAccount,
);

export { bankAccountRouter };
export { adminbankAccountRouter };

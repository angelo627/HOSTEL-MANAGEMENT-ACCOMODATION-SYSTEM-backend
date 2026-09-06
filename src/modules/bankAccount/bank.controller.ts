import { Request, Response } from "express";

import { sendCreated, sendSuccess } from "../../middleware/response-formatter";
import { asyncHandler } from "../../shared/utils/async-handler";

import { bankAccountService } from "./bank.service";

export const bankAccountController = {
  // Create a bank account for the currently authenticated user.
  createBankAccount: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { accountNumber } = req.body;

    const bankAccount = await bankAccountService.createBankAccount(
      userId,
      accountNumber,
    );

    sendCreated(res, "Bank account created successfully.", bankAccount);
  }),

  // Retrieve the bank account belonging to the currently authenticated user.
  getMyBankAccount: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const bankAccount = await bankAccountService.getMyBankAccount(userId);

    sendSuccess(res, {
      statusCode: 200,
      message: "Bank account retrieved successfully.",
      data: bankAccount,
    });
  }),

  // Allow an administrator to fund a bank account and record the money movement.
  fundBankAccount: asyncHandler(async (req: Request, res: Response) => {
    const { accountNumber, amount } = req.body;

    const result = await bankAccountService.fundBankAccount(
      accountNumber,
      amount,
    );

    sendSuccess(res, {
      statusCode: 200,
      message: "Bank account funded successfully.",
      data: result,
    });
  }),
};

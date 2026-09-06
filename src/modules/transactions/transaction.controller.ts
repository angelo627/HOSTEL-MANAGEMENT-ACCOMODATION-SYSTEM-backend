import { Request, Response } from "express";

import { sendSuccess } from "../../middleware/response-formatter";
import { asyncHandler } from "../../shared/utils/async-handler";

import { transactionService } from "./transaction.service";

export const transactionController = {
  // Retrieve the transaction history belonging to the authenticated user's bank account.
  getMyTransactions: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const transactions = await transactionService.getMyTransactions(userId);

    sendSuccess(res, {
      statusCode: 200,
      message: "Transactions retrieved successfully.",
      data: transactions,
    });
  }),
};

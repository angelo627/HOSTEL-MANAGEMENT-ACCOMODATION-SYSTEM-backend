import { Router } from "express";

import { transactionController } from "./transaction.controller";

const transactionRouter = Router();
const adminTransactionRouter = Router();

// Retrieve the transaction history belonging to the authenticated user.
transactionRouter.get(
  "/get-user/transaction",
  transactionController.getMyTransactions,
);

// Retrieve all transactions across every bank account for admin reporting.
adminTransactionRouter.get(
  "/all/transactions",
  transactionController.getAllTransactions,
);

export { transactionRouter, adminTransactionRouter };
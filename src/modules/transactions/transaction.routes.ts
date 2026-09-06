import { Router } from "express";

import { transactionController } from "./transaction.controller";

const transactionRouter = Router();

// Retrieve the transaction history belonging to the authenticated user.
transactionRouter.get(
  "/get-user/transaction",
  transactionController.getMyTransactions,
);

export { transactionRouter };
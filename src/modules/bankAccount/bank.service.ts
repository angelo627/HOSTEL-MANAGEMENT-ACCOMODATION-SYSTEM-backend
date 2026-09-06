import prisma from "../../config/prisma-client";
import { AppError } from "../../shared/errors/app-error";

export const bankAccountService = {
  // Create a bank account for the authenticated user using the account number they supplied.
  async createBankAccount(userId: string, accountNumber: string) {
    const existingUserAccount = await prisma.bankAccount.findUnique({
      where: {
        userId,
      },
    });

    if (existingUserAccount) {
      throw new AppError({
        statusCode: 409,
        message: "You already have a bank account.",
        code: "BANK_ACCOUNT_ALREADY_EXISTS",
      });
    }

    const existingAccountNumber = await prisma.bankAccount.findUnique({
      where: {
        accountNumber,
      },
    });

    if (existingAccountNumber) {
      throw new AppError({
        statusCode: 409,
        message: "This account number is already in use.",
        code: "ACCOUNT_NUMBER_ALREADY_EXISTS",
      });
    }

    const bankAccount = await prisma.bankAccount.create({
      data: {
        userId,
        accountNumber,
        type: "STUDENT",
        balance: "0",
      },
    });

    return bankAccount;
  },

  // Retrieve the bank account belonging to the currently authenticated user.
  async getMyBankAccount(userId: string) {
    const bankAccount = await prisma.bankAccount.findUnique({
      where: {
        userId,
      },
    });

    if (!bankAccount) {
      throw new AppError({
        statusCode: 404,
        message: "Bank account not found.",
        code: "BANK_ACCOUNT_NOT_FOUND",
      });
    }

    return bankAccount;
  },

  // Add money to a bank account identified by its account number and record the movement as a credit transaction.
  async fundBankAccount(accountNumber: string, amount: number) {
    const bankAccount = await prisma.bankAccount.findUnique({
      where: {
        accountNumber,
      },
    });

    if (!bankAccount) {
      throw new AppError({
        statusCode: 404,
        message: "Bank account not found.",
        code: "BANK_ACCOUNT_NOT_FOUND",
      });
    }

    const reference = `FUND-${Date.now()}-${Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")}`;

    const result = await prisma.$transaction(async (tx) => {
      const updatedAccount = await tx.bankAccount.update({
        where: {
          id: bankAccount.id,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          bankAccountId: bankAccount.id,
          reference,
          amount,
          type: "CREDIT",
          description: "Bank account funded by administrator.",
        },
      });

      return {
        bankAccount: updatedAccount,
        transaction,
      };
    });

    return result;
  },
};

import prisma from "../../config/prisma-client";
import { AppError } from "../../shared/errors/app-error";

export const transactionService = {
  // Retrieve all transactions belonging to the authenticated user's bank account.
  async getMyTransactions(userId: string) {
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

    const transactions = await prisma.transaction.findMany({
      where: {
        bankAccountId: bankAccount.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return transactions;
  },

  // Retrieve all transactions across every bank account for admin reporting.
  async getAllTransactions() {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        bankAccount: {
          select: {
            accountNumber: true,
            type: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                student: {
                  select: {
                    registrationNo: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return transactions;
  },
};

import { randomUUID } from "crypto";

import prisma from "../../config/prisma-client";
import { AppError } from "../../shared/errors/app-error";

export interface MakePaymentInput {
  userId: string;
  rrr: string;
  amount: number;
}

export const paymentService = {
  // Verify the student's reservation and payment details,
  // then complete the accommodation payment and allocation
  // inside one Prisma transaction.
  async makePayment({
    userId,
    rrr,
    amount,
  }: MakePaymentInput) {
    // Find the student using the authenticated User ID.
    const student = await prisma.student.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
        schoolFeeRecord: {
          select: {
            rrr: true,
            status: true,
          },
        },
      },
    });

    if (!student) {
      throw new AppError({
        statusCode: 404,
        message: "Student not found.",
        code: "STUDENT_NOT_FOUND",
      });
    }

    // Verify that the supplied RRR belongs to this student.
    if (
      !student.schoolFeeRecord ||
      student.schoolFeeRecord.status !== "PAID" ||
      student.schoolFeeRecord.rrr !== rrr
    ) {
      throw new AppError({
        statusCode: 400,
        message: "Invalid RRR.",
        code: "INVALID_RRR",
      });
    }

    // Find the student's eligible application and its reservation.
    const application = await prisma.hostelApplication.findFirst({
      where: {
        studentId: student.id,
        status: "ELIGIBLE",
      },
      include: {
        hostel: {
          select: {
            id: true,
            name: true,
            gender: true,
            accommodationFee: true,
          },
        },
        allocation: {
          include: {
            bed: {
              include: {
                room: {
                  select: {
                    id: true,
                    roomNumber: true,
                    hostelId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!application) {
      throw new AppError({
        statusCode: 400,
        message: "You do not have an eligible hostel application.",
        code: "ELIGIBLE_APPLICATION_NOT_FOUND",
      });
    }

    if (!application.allocation) {
      throw new AppError({
        statusCode: 400,
        message: "No hostel reservation exists for this application.",
        code: "RESERVATION_NOT_FOUND",
      });
    }

    const allocation = application.allocation;

    // The payment must be made against an active reservation.
    if (allocation.status !== "RESERVED") {
      throw new AppError({
        statusCode: 400,
        message: "This hostel reservation is no longer active.",
        code: "RESERVATION_NOT_ACTIVE",
      });
    }

    // The 48-hour reservation deadline must not have passed.
    if (!allocation.expiresAt || allocation.expiresAt <= new Date()) {
      throw new AppError({
        statusCode: 400,
        message: "The hostel reservation has expired.",
        code: "RESERVATION_EXPIRED",
      });
    }

    // The hostel's accommodation fee is authoritative.
    // The amount supplied by the student must match it exactly.
    const accommodationFee = Number(
      application.hostel.accommodationFee,
    );

    if (amount !== accommodationFee) {
      throw new AppError({
        statusCode: 400,
        message: "The payment amount does not match the hostel accommodation fee.",
        code: "INVALID_PAYMENT_AMOUNT",
      });
    }

    // Find the student's bank account.
    const bankAccount = await prisma.bankAccount.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
        balance: true,
      },
    });

    if (!bankAccount) {
      throw new AppError({
        statusCode: 404,
        message: "Bank account not found.",
        code: "BANK_ACCOUNT_NOT_FOUND",
      });
    }

    // Check the current balance before starting the transaction.
    if (Number(bankAccount.balance) < amount) {
      throw new AppError({
        statusCode: 400,
        message: "Insufficient bank account balance.",
        code: "INSUFFICIENT_BALANCE",
      });
    }

    const now = new Date();

    // The check-in code remains valid for 14 days after payment.
    const checkInExpiresAt = new Date(
      now.getTime() + 14 * 24 * 60 * 60 * 1000,
    );

    const checkInCode = randomUUID();

    const transactionReference = `PAY-${Date.now()}-${randomUUID()}`;

    const result = await prisma.$transaction(async (tx) => {
      // Re-check the reservation inside the transaction so that
      // payment cannot complete against a reservation that changed
      // after the initial verification.
      const currentAllocation = await tx.allocation.findUnique({
        where: {
          id: allocation.id,
        },
        select: {
          id: true,
          status: true,
          expiresAt: true,
          bedId: true,
          applicationId: true,
        },
      });

      if (
        !currentAllocation ||
        currentAllocation.status !== "RESERVED"
      ) {
        throw new AppError({
          statusCode: 400,
          message: "This hostel reservation is no longer active.",
          code: "RESERVATION_NOT_ACTIVE",
        });
      }

      if (
        !currentAllocation.expiresAt ||
        currentAllocation.expiresAt <= now
      ) {
        throw new AppError({
          statusCode: 400,
          message: "The hostel reservation has expired.",
          code: "RESERVATION_EXPIRED",
        });
      }

      // Debit the student's bank account.
      const updatedBankAccount = await tx.bankAccount.update({
        where: {
          id: bankAccount.id,
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      // Record the debit transaction.
      const bankTransaction = await tx.transaction.create({
        data: {
          bankAccountId: bankAccount.id,
          reference: transactionReference,
          amount,
          type: "DEBIT",
          description: "Hostel accommodation payment.",
        },
      });

      // Create the successful payment record.
      const payment = await tx.payment.create({
        data: {
          applicationId: application.id,
          amount,
          status: "PAID",
          paymentDeadline: allocation.expiresAt,
          paidAt: now,
          transactionId: bankTransaction.id,
        },
      });

      // Activate the student's reserved allocation.
      const updatedAllocation = await tx.allocation.update({
        where: {
          id: allocation.id,
        },
        data: {
          status: "ACTIVE",
          allocatedAt: now,
        },
        include: {
          bed: {
            select: {
              id: true,
              bedNumber: true,
              room: {
                select: {
                  id: true,
                  roomNumber: true,
                  hostel: {
                    select: {
                      id: true,
                      name: true,
                      gender: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // The reserved bed now becomes occupied.
      await tx.bed.update({
        where: {
          id: allocation.bedId,
        },
        data: {
          status: "OCCUPIED",
        },
      });

      // The student's application is now fully allocated.
      const updatedApplication =
        await tx.hostelApplication.update({
          where: {
            id: application.id,
          },
          data: {
            status: "ALLOCATED",
          },
        });

      // Generate the student's single-use check-in record.
      const checkIn = await tx.checkIn.create({
        data: {
          allocationId: allocation.id,
          studentId: student.id,
          code: checkInCode,
          status: "PENDING",
          expiresAt: checkInExpiresAt,
        },
      });

      return {
        payment,
        allocation: updatedAllocation,
        application: updatedApplication,
        checkIn,
        bankAccount: updatedBankAccount,
        transaction: bankTransaction,
      };
    });

    return result;
  },
};
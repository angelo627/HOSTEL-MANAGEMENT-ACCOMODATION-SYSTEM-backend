import prisma from "../../config/prisma-client";
import { AppError } from "../../shared/errors/app-error";

export interface CheckInInput {
  code: string;
}

export const checkInService = {
  async completeCheckIn(input: CheckInInput) {
    const { code } = input;

    // Find the check-in record using the code entered by the admin.
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        code,
      },
      include: {
        allocation: {
          select: {
            id: true,
            status: true,
            bedId: true,
          },
        },
      },
    });

    if (!checkIn) {
      throw new AppError({
        statusCode: 404,
        message: "Check-in code not found.",
        code: "CHECK_IN_CODE_NOT_FOUND",
      });
    }

    // A check-in code can only be used once.
    if (checkIn.status !== "PENDING") {
      throw new AppError({
        statusCode: 400,
        message:
          "This check-in code has already been used or is no longer valid.",
        code: "CHECK_IN_NOT_PENDING",
      });
    }

    const now = new Date();

    // The check-in code must still be within its validity period.
    if (checkIn.expiresAt <= now) {
      throw new AppError({
        statusCode: 400,
        message: "This check-in code has expired.",
        code: "CHECK_IN_CODE_EXPIRED",
      });
    }

    // The allocation must already be active before the student can check in.
    if (checkIn.allocation.status !== "ACTIVE") {
      throw new AppError({
        statusCode: 400,
        message: "The student's allocation is not active.",
        code: "ALLOCATION_NOT_ACTIVE",
      });
    }

    // Change the bed and check-in record together so that both changes
    // succeed or fail as one database operation.
    const result = await prisma.$transaction(async (tx) => {
      // Re-check the bed inside the transaction.
      const bed = await tx.bed.findUnique({
        where: {
          id: checkIn.allocation.bedId,
        },
        select: {
          id: true,
          status: true,
        },
      });

      if (!bed) {
        throw new AppError({
          statusCode: 404,
          message: "Allocated bed not found.",
          code: "BED_NOT_FOUND",
        });
      }

      // The bed should still be reserved until the actual check-in occurs.
      if (bed.status !== "RESERVED") {
        throw new AppError({
          statusCode: 409,
          message: "The allocated bed is not reserved for check-in.",
          code: "BED_NOT_RESERVED",
        });
      }

      // Mark the bed as occupied because the student has now physically
      // completed the check-in process.
      await tx.bed.update({
        where: {
          id: bed.id,
        },
        data: {
          status: "OCCUPIED",
        },
      });

      // Mark the check-in code as completed and record when it was used.
      const completedCheckIn = await tx.checkIn.update({
        where: {
          id: checkIn.id,
        },
        data: {
          status: "COMPLETED",
          usedAt: now,
        },
        include: {
          allocation: {
            select: {
              id: true,
              status: true,
              studentId: true,
              bed: {
                select: {
                  id: true,
                  bedNumber: true,
                  status: true,
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
          },
        },
      });

      return completedCheckIn;
    });

    return result;
  },
};

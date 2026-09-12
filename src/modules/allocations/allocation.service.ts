import prisma from "../../config/prisma-client";
import { AppError } from "../../shared/errors/app-error";

export const allocationService = {
  // Reserve an available bed for the authenticated student whose
  // eligible application is next in the FCFS queue.
  async createAllocation(userId: string) {
    // Find the Student record belonging to the authenticated User.
    const student = await prisma.student.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
        gender: true,
      },
    });

    if (!student) {
      throw new AppError({
        statusCode: 404,
        message: "Student not found.",
        code: "STUDENT_NOT_FOUND",
      });
    }

    // The student must have a gender because allocation must only happen
    // into a gender-compatible hostel.
    if (!student.gender) {
      throw new AppError({
        statusCode: 400,
        message: "Student gender has not been assigned.",
        code: "STUDENT_GENDER_NOT_ASSIGNED",
      });
    }

    // Find the student's eligible application.
    const application = await prisma.hostelApplication.findFirst({
      where: {
        studentId: student.id,
        status: "ELIGIBLE",
      },
      orderBy: {
        submittedAt: "asc",
      },
      include: {
        hostel: {
          select: {
            id: true,
            name: true,
            gender: true,
            status: true,
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

    // Find the earliest eligible application in the FCFS queue.
    const nextApplication = await prisma.hostelApplication.findFirst({
      where: {
        status: "ELIGIBLE",
      },
      orderBy: {
        submittedAt: "asc",
      },
      select: {
        id: true,
      },
    });

    // The student cannot bypass another eligible student who submitted
    // their application earlier.
    if (nextApplication?.id !== application.id) {
      throw new AppError({
        statusCode: 409,
        message:
          "Another eligible application is ahead of you in the allocation queue.",
        code: "FCFS_QUEUE_NOT_REACHED",
      });
    }

    // The selected hostel must still be active.
    if (application.hostel.status !== "ACTIVE") {
      throw new AppError({
        statusCode: 400,
        message: "The selected hostel is not currently available.",
        code: "HOSTEL_NOT_AVAILABLE",
      });
    }

    // Confirm that the hostel is compatible with the student's gender.
    if (application.hostel.gender !== student.gender) {
      throw new AppError({
        statusCode: 400,
        message: "The selected hostel is not available for your gender.",
        code: "HOSTEL_GENDER_MISMATCH",
      });
    }

    // Prevent creating another allocation if this application already has one.
    const existingAllocation = await prisma.allocation.findUnique({
      where: {
        applicationId: application.id,
      },
    });

    if (existingAllocation) {
      throw new AppError({
        statusCode: 409,
        message: "This application already has an allocation.",
        code: "ALLOCATION_ALREADY_EXISTS",
      });
    }

    // Find an available bed inside the hostel selected by the student.
    const availableBed = await prisma.bed.findFirst({
      where: {
        status: "AVAILABLE",
        room: {
          hostelId: application.hostelId,
        },
      },
      orderBy: [
        {
          room: {
            roomNumber: "asc",
          },
        },
        {
          bedNumber: "asc",
        },
      ],
      select: {
        id: true,
        bedNumber: true,
        room: {
          select: {
            id: true,
            roomNumber: true,
            hostelId: true,
          },
        },
      },
    });

    if (!availableBed) {
      throw new AppError({
        statusCode: 409,
        message: "No available bed exists in the selected hostel.",
        code: "NO_AVAILABLE_BED",
      });
    }

    const reservedAt = new Date();

    // The student has 48 hours to complete payment.
    const expiresAt = new Date(reservedAt.getTime() + 48 * 60 * 60 * 1000);

    // Reserve the bed and create the allocation together so that both
    // changes succeed or fail as one database operation.
    const allocation = await prisma.$transaction(async (tx) => {
      // Re-check the bed inside the transaction before reserving it.
      // This prevents reserving a bed that was already taken by another
      // allocation between the earlier availability check and this transaction.
      const bed = await tx.bed.findUnique({
        where: {
          id: availableBed.id,
        },
        select: {
          id: true,
          status: true,
        },
      });

      if (!bed || bed.status !== "AVAILABLE") {
        throw new AppError({
          statusCode: 409,
          message: "The selected bed is no longer available.",
          code: "BED_NO_LONGER_AVAILABLE",
        });
      }

      await tx.bed.update({
        where: {
          id: bed.id,
        },
        data: {
          status: "RESERVED",
        },
      });

      const createdAllocation = await tx.allocation.create({
        data: {
          studentId: student.id,
          applicationId: application.id,
          bedId: bed.id,
          status: "RESERVED",
          reservedAt,
          expiresAt,
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

      return createdAllocation;
    });

    return allocation;
  },
};

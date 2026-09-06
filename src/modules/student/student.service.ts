import prisma from "../../config/prisma-client";
import { AppError } from "../../shared/errors/app-error";

export const studentService = {
  // Retrieve the authenticated student's complete profile and, when available,
  // their school-fee record and hostel allocation details.
  async getStudentProfile(userId: string) {
    const student = await prisma.student.findUnique({
      where: {
        userId,
      },
      include: {
        schoolFeeRecord: {
          select: {
            status: true,
            rrr: true,
          },
        },
        allocations: {
          where: {
            status: "ACTIVE",
          },
          include: {
            bed: {
              include: {
                room: {
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
                },
              },
            },
          },
          take: 1,
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!student) {
      throw new AppError({
        statusCode: 404,
        message: "Student profile not found.",
        code: "STUDENT_NOT_FOUND",
      });
    }

    const allocation = student.allocations[0] ?? null;

    return {
      id: student.id,
      registrationNo: student.registrationNo,
      firstName: student.user.firstName,
      lastName: student.user.lastName,
      email: student.user.email,
      academicLevel: student.academicLevel,
      gender: student.gender,
      schoolFee: student.schoolFeeRecord
        ? {
            status: student.schoolFeeRecord.status,
            rrr: student.schoolFeeRecord.rrr,
          }
        : null,
      allocation: allocation
        ? {
            hostel: allocation.bed.room.hostel,
            room: {
              id: allocation.bed.room.id,
              roomNumber: allocation.bed.room.roomNumber,
              capacity: allocation.bed.room.capacity,
            },
            bed: {
              id: allocation.bed.id,
              bedNumber: allocation.bed.bedNumber,
              status: allocation.bed.status,
            },
          }
        : null,
    };
  },
};

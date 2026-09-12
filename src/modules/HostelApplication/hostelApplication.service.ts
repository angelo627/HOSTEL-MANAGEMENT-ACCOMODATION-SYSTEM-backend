import prisma from "../../config/prisma-client";
import { AppError } from "../../shared/errors/app-error";

export const hostelApplicationService = {
  // Create a hostel application for the authenticated student and the hostel they selected.
  async createApplication(studentId: string, hostelId: string) {
    // Retrieve the student together with their gender because hostel selection
    // must be compatible with the student's gender.
    const student = await prisma.student.findUnique({
      where: {
        userId: studentId,
      },
      select: {
        id: true,
        gender: true,
        schoolFeeRecord: {
          select: {
            status: true,
            rrr: true,
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

    // Prevent a student from applying for a new hostel while they already
    // have an application that is still active in the accommodation process.
    const existingApplication = await prisma.hostelApplication.findFirst({
      where: {
        studentId: student.id,
        status: {
          in: ["PENDING", "ELIGIBLE", "ALLOCATED"],
        },
      },
    });

    if (existingApplication) {
      throw new AppError({
        statusCode: 409,
        message: "You already have an active hostel application.",
        code: "ACTIVE_APPLICATION_EXISTS",
      });
    }

    // A student's gender is required for the system to determine whether
    // the selected hostel is appropriate for the student.
    if (!student.gender) {
      throw new AppError({
        statusCode: 400,
        message: "Student gender has not been assigned.",
        code: "STUDENT_GENDER_NOT_ASSIGNED",
      });
    }

    if (
      !student.schoolFeeRecord ||
      student.schoolFeeRecord.status !== "PAID" ||
      !student.schoolFeeRecord.rrr
    ) {
      throw new AppError({
        statusCode: 400,
        message: "You are not eligible to apply for hostel accommodation.",
        code: "HOSTEL_APPLICATION_NOT_ELIGIBLE",
      });
    }

    // Retrieve the hostel selected by the student and ensure it is available
    // for applications.
    const hostel = await prisma.hostel.findUnique({
      where: {
        id: hostelId,
      },
      select: {
        id: true,
        name: true,
        gender: true,
        status: true,
      },
    });

    if (!hostel) {
      throw new AppError({
        statusCode: 404,
        message: "Hostel not found.",
        code: "HOSTEL_NOT_FOUND",
      });
    }

    if (hostel.status !== "ACTIVE") {
      throw new AppError({
        statusCode: 400,
        message: "This hostel is not currently available.",
        code: "HOSTEL_NOT_AVAILABLE",
      });
    }

    // The selected hostel must match the student's gender before the
    // application is accepted.
    if (student.gender !== hostel.gender) {
      throw new AppError({
        statusCode: 400,
        message: "The selected hostel is not available for your gender.",
        code: "HOSTEL_GENDER_MISMATCH",
      });
    }

    // Create the application as ELIGIBLE because the student has
    // satisfied the required school-fee eligibility conditions.
    const application = await prisma.hostelApplication.create({
      data: {
        studentId: student.id,
        hostelId,
        status: "ELIGIBLE",
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

    return application;
  },
};

import prisma from "../../config/prisma-client";
import { AppError } from "../../shared/errors/app-error";

export const hostelApplicationService = {
  // Create a hostel application for the authenticated student and the hostel they selected.
  async createApplication(studentId: string, hostelId: string) {
    // Retrieve the student together with their gender because hostel selection
    // must be compatible with the student's gender.
    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
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

    // A student's gender is required for the system to determine whether
    // the selected hostel is appropriate for the student.
    if (!student.gender) {
      throw new AppError({
        statusCode: 400,
        message: "Student gender has not been assigned.",
        code: "STUDENT_GENDER_NOT_ASSIGNED",
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

    // Prevent a student from applying for a new hostel while they already
    // have an application that is still active in the accommodation process.
    const existingApplication = await prisma.hostelApplication.findFirst({
      where: {
        studentId,
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

    // The selected hostel must match the student's gender before the
    // application is accepted.
    if (student.gender !== hostel.gender) {
      throw new AppError({
        statusCode: 400,
        message: "The selected hostel is not available for your gender.",
        code: "HOSTEL_GENDER_MISMATCH",
      });
    }

    // Create the application. The application starts as PENDING because
    // allocation and the eligibility process are handled separately.
    const application = await prisma.hostelApplication.create({
      data: {
        studentId,
        hostelId,
        status: "PENDING",
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

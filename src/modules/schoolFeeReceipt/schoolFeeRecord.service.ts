import prisma from "../../config/prisma-client";

export const schoolFeeRecordService = {
  async getAllSchoolFeeRecords() {
    const schoolFeeRecords = await prisma.schoolFeeRecord.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        student: {
          select: {
            registrationNo: true,
            academicLevel: true,
            gender: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    return schoolFeeRecords;
  },
};

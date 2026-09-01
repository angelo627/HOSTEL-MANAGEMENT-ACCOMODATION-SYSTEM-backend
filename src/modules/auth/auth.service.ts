import { Prisma } from "../../generated/prisma/client";

import prisma from "../../config/prisma-client";

import { hashPassword } from "../../shared/utils/crypto";
import { signToken } from "../../shared/utils/token";

import { AppError } from "../../shared/errors/app-error";

import { registerSchema } from "./auth.validation";

type RegisterInput = ReturnType<typeof registerSchema.parse>;

const REGISTRATION_YEARS = [2022, 2023, 2024, 2025, 2026, 2027];

const ACADEMIC_LEVELS = [
  "LEVEL_100",
  "LEVEL_200",
  "LEVEL_300",
  "LEVEL_400",
  "LEVEL_500",
  "LEVEL_600",
] as const;

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function generateSixDigitNumber(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateRegistrationNumber(): string {
  const year = randomItem(REGISTRATION_YEARS);
  const number = generateSixDigitNumber();

  return `${year}/${number}`;
}

function generateRrr(): string {
  const year = randomItem(REGISTRATION_YEARS);
  const number = generateSixDigitNumber();

  return `RRR-${year}-${number}`;
}

function generateAcademicLevel() {
  return randomItem(ACADEMIC_LEVELS);
}

export const authService = {
  async register(input: RegisterInput) {
    const { firstName, lastName, email, password } = input;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError({
        statusCode: 409,
        message: "An account with this email already exists.",
        code: "EMAIL_ALREADY_EXISTS",
      });
    }

    const passwordHash = await hashPassword(password);

    for (let attempt = 0; attempt < 5; attempt++) {
      const registrationNo = generateRegistrationNumber();
      const academicLevel = generateAcademicLevel();

      const schoolFeeStatus = Math.random() < 0.5 ? "PAID" : "NOT_PAID";

      const rrr = schoolFeeStatus === "PAID" ? generateRrr() : null;

      try {
        const result = await prisma.$transaction(async (tx) => {
          const user = await tx.user.create({
            data: {
              firstName,
              lastName,
              email,
              password: passwordHash,
              role: "USER",
              status: "ACTIVE",
            },
          });

          const student = await tx.student.create({
            data: {
              userId: user.id,
              registrationNo,
              academicLevel,
            },
          });

          const schoolFeeRecord = await tx.schoolFeeRecord.create({
            data: {
              studentId: student.id,
              rrr,
              status: schoolFeeStatus,
              verifiedAt: schoolFeeStatus === "PAID" ? new Date() : null,
            },
          });

          return {
            user,
            student,
            schoolFeeRecord,
          };
        });

        return result;
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          continue;
        }

        throw error;
      }
    }

    throw new AppError({
      statusCode: 500,
      message: "Unable to generate unique student registration details.",
      code: "REGISTRATION_GENERATION_FAILED",
    });
  },

  
  async studentLogin(registrationNo: string, rrr: string) {
    const student = await prisma.student.findUnique({
      where: {
        registrationNo,
      },
      include: {
        user: true,
        schoolFeeRecord: true,
      },
    });

    if (!student) {
      throw new AppError({
        statusCode: 401,
        message: "Invalid registration number or RRR.",
        code: "INVALID_CREDENTIALS",
      });
    }

    const schoolFeeRecord = student.schoolFeeRecord;

    if (!schoolFeeRecord) {
      throw new AppError({
        statusCode: 403,
        message: "School fee record not found.",
        code: "SCHOOL_FEE_RECORD_NOT_FOUND",
      });
    }

    if (schoolFeeRecord.status !== "PAID") {
      throw new AppError({
        statusCode: 403,
        message: "School fees must be paid before you can log in.",
        code: "SCHOOL_FEES_NOT_PAID",
      });
    }

    if (!schoolFeeRecord.rrr || schoolFeeRecord.rrr !== rrr) {
      throw new AppError({
        statusCode: 401,
        message: "Invalid registration number or RRR.",
        code: "INVALID_CREDENTIALS",
      });
    }

    if (student.user.status !== "ACTIVE") {
      throw new AppError({
        statusCode: 403,
        message: "Your account is not active.",
        code: "ACCOUNT_NOT_ACTIVE",
      });
    }

    const token = signToken({
      sub: student.user.id,
      role: student.user.role,
      status: student.user.status,
    });

    return {
      token,
      user: {
        id: student.user.id,
        firstName: student.user.firstName,
        lastName: student.user.lastName,
        email: student.user.email,
        role: student.user.role,
        status: student.user.status,
      },
      student: {
        id: student.id,
        registrationNo: student.registrationNo,
        academicLevel: student.academicLevel,
        rrr: schoolFeeRecord.rrr,
      },
    };
  },
};

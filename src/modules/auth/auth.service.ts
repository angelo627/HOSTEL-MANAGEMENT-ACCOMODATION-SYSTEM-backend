import { Prisma } from "../../generated/prisma/client";

import  prisma  from "../../config/prisma-client";

import { hashPassword } from "../../shared/utils/crypto";

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

export async function register(input: RegisterInput) {
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

    const rrr = schoolFeeStatus === "PAID" 
    ? generateRrr() 
    : null;

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
}

import prisma from "../../config/prisma-client";
import { AppError } from "../../shared/errors/app-error";

export interface CreateIssueInput {
  userId: string;
  title: string;
  description: string;
}

export const issueService = {
  async createIssue(input: CreateIssueInput) {
    const { userId, title, description } = input;

    const student = await prisma.student.findUnique({
      where: { userId },
      select: {
        id: true,
      },
    });

    if (!student) {
      throw new AppError({
        statusCode: 404,
        message: "Student record not found.",
        code: "STUDENT_NOT_FOUND",
      });
    }

    const issue = await prisma.issue.create({
      data: {
        studentId: student.id,
        reportedById: userId,
        title,
        description,
      },
    });

    return issue;
  },

  async getUserIssues(userId: string) {
    const student = await prisma.student.findUnique({
      where: { userId },
      select: {
        id: true,
      },
    });

    if (!student) {
      throw new AppError({
        statusCode: 404,
        message: "Student record not found.",
        code: "STUDENT_NOT_FOUND",
      });
    }

    const issues = await prisma.issue.findMany({
      where: {
        studentId: student.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return issues;
  },
};

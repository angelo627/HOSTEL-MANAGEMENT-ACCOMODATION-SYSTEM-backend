import prisma from "../../config/prisma-client";
import { AppError } from "../../shared/errors/app-error";

export interface CreateIssueInput {
  userId: string;
  title: string;
  description: string;
}

export interface DeleteIssueInput {
  userId: string;
  issueId: string;
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

  async deleteIssue(input: DeleteIssueInput) {
    const { userId, issueId } = input;

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

    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      select: {
        id: true,
        studentId: true,
        status: true,
      },
    });

    if (!issue) {
      throw new AppError({
        statusCode: 404,
        message: "Issue not found.",
        code: "ISSUE_NOT_FOUND",
      });
    }

    if (issue.studentId !== student.id) {
      throw new AppError({
        statusCode: 403,
        message: "You are not allowed to delete this issue.",
        code: "ISSUE_DELETE_FORBIDDEN",
      });
    }

    if (issue.status !== "OPEN") {
      throw new AppError({
        statusCode: 400,
        message: "Only open issues can be deleted.",
        code: "ISSUE_NOT_OPEN",
      });
    }

    await prisma.issue.delete({
      where: { id: issue.id },
    });
  },

  async getAdminIssues() {
    const issues = await prisma.issue.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        student: {
          select: {
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

    return issues;
  },
};

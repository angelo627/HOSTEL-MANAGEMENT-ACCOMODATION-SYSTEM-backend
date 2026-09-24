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

export interface UpdateIssueStatusInput {
  issueId: string;
  adminId: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
}

export interface AdminDeleteIssueInput {
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

  async getAdminIssueById(issueId: string) {
    const issue = await prisma.issue.findUnique({
      where: {
        id: issueId,
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

        reportedBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },

        resolvedBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!issue) {
      throw new AppError({
        statusCode: 404,
        message: "Issue not found.",
        code: "ISSUE_NOT_FOUND",
      });
    }

    return issue;
  },

  async updateIssueStatus(input: UpdateIssueStatusInput) {
    const { issueId, adminId, status } = input;

    const issue = await prisma.issue.findUnique({
      where: {
        id: issueId,
      },
      select: {
        id: true,
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

    // Prevent changing an issue to the same status.
    if (issue.status === status) {
      throw new AppError({
        statusCode: 400,
        message: `Issue is already ${status}.`,
        code: "ISSUE_STATUS_UNCHANGED",
      });
    }

    // Enforce the issue lifecycle:
    // OPEN → IN_PROGRESS → RESOLVED → CLOSED
    const allowedNextStatus: Record<string, string> = {
      OPEN: "IN_PROGRESS",
      IN_PROGRESS: "RESOLVED",
      RESOLVED: "CLOSED",
    };

    if (allowedNextStatus[issue.status] !== status) {
      throw new AppError({
        statusCode: 400,
        message: `Issue status cannot change from ${issue.status} to ${status}.`,
        code: "INVALID_ISSUE_STATUS_TRANSITION",
      });
    }

    const updatedIssue = await prisma.issue.update({
      where: {
        id: issue.id,
      },
      data: {
        status,
        ...(status === "RESOLVED"
          ? {
              resolvedById: adminId,
              resolvedAt: new Date(),
            }
          : {}),
      },
    });

    return updatedIssue;
  },

  async adminDeleteIssue(input: AdminDeleteIssueInput) {
    const { issueId } = input;

    const issue = await prisma.issue.findUnique({
      where: {
        id: issueId,
      },
      select: {
        id: true,
      },
    });

    if (!issue) {
      throw new AppError({
        statusCode: 404,
        message: "Issue not found.",
        code: "ISSUE_NOT_FOUND",
      });
    }

    await prisma.issue.delete({
      where: {
        id: issue.id,
      },
    });
  },
};

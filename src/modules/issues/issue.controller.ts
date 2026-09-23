import { Request, Response } from "express";
import { issueService } from "./issue.service";
import { asyncHandler } from "../../shared/utils/async-handler";
import { sendCreated, sendSuccess } from "../../middleware/response-formatter";

export const issueController = {
  createIssue: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { title, description } = req.body;

    const issue = await issueService.createIssue({
      userId,
      title,
      description,
    });

    sendCreated(res, "Issue reported successfully.", issue);
  }),

  getUserIssues: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const issues = await issueService.getUserIssues(userId);

    sendSuccess(res, {
      statusCode: 200,
      message: "Issues retrieved successfully.",
      data: issues,
    });
  }),

  deleteIssue: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const issueId = req.params.issueId as string;

    await issueService.deleteIssue({
      userId,
      issueId,
    });

    sendSuccess(res, {
      statusCode: 200,
      message: "Issue deleted successfully.",
      data: null,
    });
  }),
};

import { Request, Response } from "express";
import { issueService } from "./issue.service";
import { asyncHandler } from "../../shared/utils/async-handler";
import { sendCreated } from "../../middleware/response-formatter";

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
};

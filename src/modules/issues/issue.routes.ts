import { Router } from "express";
import { issueController } from "./issue.controller";
import { validateRequest } from "../../shared/validation/validate-request";
import { createIssueSchema } from "./issue.validation";

const issueRouter = Router();

issueRouter.post(
  "/create/issues",
  validateRequest(createIssueSchema),
  issueController.createIssue,
);

export { issueRouter };

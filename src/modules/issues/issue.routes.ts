import { Router } from "express";
import { issueController } from "./issue.controller";
import { validateRequest } from "../../shared/validation/validate-request";
import { createIssueSchema } from "./issue.validation";

const issueRouter = Router();
const adminissueRouter = Router();

issueRouter.post(
  "/create/issues",
  validateRequest(createIssueSchema),
  issueController.createIssue,
);

issueRouter.get(
  "/my/issues",
  issueController.getUserIssues,
);

issueRouter.delete(
  "/delete/issue/:issueId",
  issueController.deleteIssue,
);

adminissueRouter.get(
   "/all/issues",
   issueController.getAdminIssues,
);

export { issueRouter };
export { adminissueRouter };

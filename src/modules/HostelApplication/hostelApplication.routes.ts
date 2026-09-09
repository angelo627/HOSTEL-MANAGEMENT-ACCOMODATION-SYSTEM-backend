import { Router } from "express";

import { validateRequest } from "../../shared/validation/validate-request";

import { hostelApplicationController } from "./hostelApplication.controller";
import { createHostelApplicationSchema } from "./hostelApplication.validation";

const hostelApplicationRouter = Router();

// Allow an authenticated student to apply for a specific hostel.
// The student chooses the hostel, while room and bed selection are handled later by allocation.
hostelApplicationRouter.post(
  "/applyhostel-application",
  validateRequest(createHostelApplicationSchema),
  hostelApplicationController.createApplication,
);

export { hostelApplicationRouter };

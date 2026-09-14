import { Router } from "express";
import { checkInController } from "./checkin.controller";
import { validateRequest } from "../../shared/validation/validate-request";
import { checkInSchema } from "./checkin.validation";

const checkInRouter = Router();

checkInRouter.post(
  "/check-in",
  validateRequest(checkInSchema),
  checkInController.completeCheckIn,
);

export {checkInRouter};

import { Router } from "express";

import { validateRequest } from "../../shared/validation/validate-request";

import { bedController } from "./bed.controller";
import { createBedSchema } from "./bed.validation";

const bedRouter = Router();

// Create a bed after validating the room and bed number.
bedRouter.post(
  "/create-bed",
  validateRequest(createBedSchema),
  bedController.createBed,
);

export { bedRouter };

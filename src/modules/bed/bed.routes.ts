import { Router } from "express";

import { validateRequest } from "../../shared/validation/validate-request";

import { bedController } from "./bed.controller";
import { createBedSchema, updateBedSchema } from "./bed.validation";

const bedRouter = Router();
const userBedRouter = Router();

// Create a bed after validating the room and bed number.
bedRouter.post(
  "/create-bed",
  validateRequest(createBedSchema),
  bedController.createBed,
);

// Retrieve all beds together with their rooms and hostels.
bedRouter.get(
  "/bed/get-all-bed",
  bedController.getBeds,
);

// Retrieve one bed by ID for any authenticated user.
userBedRouter.get(
  "/bed/:bedId",
  bedController.getBedById,
);

// Update the bed number of an existing bed.
bedRouter.patch(
  "/bed/update-bed/:bedId",
  validateRequest(updateBedSchema),
  bedController.updateBed,
);

export { bedRouter };
export { userBedRouter };

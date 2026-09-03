// HOSTEL
import { Router } from "express";

import { uploadImage as upload } from "../../middleware/upload.middleware";
import { validateRequest } from "../../shared/validation/validate-request";

import { hostelController } from "./hostel.controller";
import { createHostelSchema } from "./hostel.validation";

const hostelRouter = Router();

hostelRouter.post(
  "/create-hostel",
  upload.single("image"),
  validateRequest(createHostelSchema),
  hostelController.createHostel,
);

export { hostelRouter };

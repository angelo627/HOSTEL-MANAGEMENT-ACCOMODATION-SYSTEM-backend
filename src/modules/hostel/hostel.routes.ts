// HOSTEL
import { Router } from "express";

import { uploadImage as upload } from "../../middleware/upload.middleware";
import { validateRequest } from "../../shared/validation/validate-request";

import { hostelController } from "./hostel.controller";
import { createHostelSchema, updateHostelSchema } from "./hostel.validation";

const hostelRouter = Router();
const userhostelRouter = Router();

hostelRouter.post(
  "/create-hostel",
  upload.single("image"),
  validateRequest(createHostelSchema),
  hostelController.createHostel,
);

// Retrieve all hostels.
hostelRouter.get(
  "/get-all-hostel",
  hostelController.getHostels,
);

// Retrieve all hostels.
userhostelRouter.get(
  "/get-all-hostel",
  hostelController.getHostels,
);

// Retrieve one hostel using its unique ID.
hostelRouter.get(
  "/:hostelId",
  hostelController.getHostelById,
);

// Retrieve one hostel using its unique ID.
userhostelRouter.get(
  "/:hostelId",
  hostelController.getHostelById,
);

// Update only the hostel fields provided in the request.
hostelRouter.patch(
  "/update-hostel/:hostelId",
  upload.single("image"),
  validateRequest(updateHostelSchema),
  hostelController.updateHostel,
);

// Deactivate a hostel without permanently deleting its record.
hostelRouter.delete(
  "/delete-hostel/:hostelId",
  hostelController.deactivateHostel,
);

// Activate an inactive hostel.
hostelRouter.patch(
  "/:hostelId/activate",
  hostelController.activateHostel,
);

export { hostelRouter };
export { userhostelRouter };

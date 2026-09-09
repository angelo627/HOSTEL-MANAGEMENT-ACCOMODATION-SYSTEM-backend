import { Request, Response } from "express";

import { sendCreated } from "../../middleware/response-formatter";
import { asyncHandler } from "../../shared/utils/async-handler";

import { hostelApplicationService } from "./hostelApplication.service";

export const hostelApplicationController = {
  // Submit a hostel application using the authenticated student's ID
  // and the hostel selected in the request body.
  createApplication: asyncHandler(async (req: Request, res: Response) => {
    const studentId = req.user!.id;
    const { hostelId } = req.body;

    const application = await hostelApplicationService.createApplication(
      studentId,
      hostelId,
    );

    sendCreated(res, "Hostel application submitted successfully.", application);
  }),
};

import { Request, Response } from "express";

import { asyncHandler } from "../../shared/utils/async-handler";
import { sendCreated } from "../../middleware/response-formatter";
import { AppError } from "../../shared/errors/app-error";

import { hostelService } from "./hostel.service";

export const hostelController = {
  // HOSTEL
  createHostel: asyncHandler(async (req: Request, res: Response) => {

    if (!req.file) {
      throw new AppError({
        statusCode: 400,
        message: "Hostel image is required.",
        code: "HOSTEL_IMAGE_REQUIRED",
      });
    }


    const { name, description, gender } = req.body;

    const hostel = await hostelService.createHostel(
      name,
      description,
      gender,
      req.file.buffer,
    );

    sendCreated(res, "Hostel created successfully.", hostel);
  }),
};

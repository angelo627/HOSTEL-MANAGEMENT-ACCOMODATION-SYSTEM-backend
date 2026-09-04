import { Request, Response } from "express";

import { asyncHandler } from "../../shared/utils/async-handler";
import { sendCreated } from "../../middleware/response-formatter";
import { AppError } from "../../shared/errors/app-error";
import { sendSuccess } from "../../middleware/response-formatter";

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

  // Retrieve hostels according to the authenticated user's role.
  getHostels: asyncHandler(async (req: Request, res: Response) => {
    const role = req.user!.role;

    const hostels = await hostelService.getHostels(role);

    sendSuccess(res, {
      statusCode: 200,
      message: "Hostels retrieved successfully.",
      data: hostels,
    });
  }),

  // Retrieve one hostel using the ID provided in the URL.
  getHostelById: asyncHandler(async (req: Request, res: Response) => {
    const hostelId = req.params.hostelId as string;

    const hostel = await hostelService.getHostelById(hostelId);

    sendSuccess(res, {
      statusCode: 200,
      message: "Hostel retrieved successfully.",
      data: hostel,
    });
  }),

  // Update only the hostel fields provided in the request.
  updateHostel: asyncHandler(async (req: Request, res: Response) => {
    const hostelId = req.params.hostelId as string;

    const { name, description, gender } = req.body;

    const hostel = await hostelService.updateHostel(
      hostelId,
      name,
      description,
      gender,
      req.file?.buffer,
    );

    sendSuccess(res, {
      statusCode: 200,
      message: "Hostel updated successfully.",
      data: hostel,
    });
  }),

  // Deactivate a hostel without permanently deleting its record.
  deactivateHostel: asyncHandler(async (req: Request, res: Response) => {
    const hostelId = req.params.hostelId as string;

    const hostel = await hostelService.deactivateHostel(hostelId);

    sendSuccess(res, {
      statusCode: 200,
      message: "Hostel deactivated successfully.",
      data: hostel,
    });
  }),

  // Activate an inactive hostel without permanently changing its record.
  activateHostel: asyncHandler(async (req: Request, res: Response) => {
    const hostelId = req.params.hostelId as string;

    const hostel = await hostelService.activateHostel(hostelId);

    sendSuccess(res, {
      statusCode: 200,
      message: "Hostel activated successfully.",
      data: hostel,
    });
  }),
};

import { Request, Response } from "express";

import { sendCreated, sendSuccess } from "../../middleware/response-formatter";
import { asyncHandler } from "../../shared/utils/async-handler";

import { bedService } from "./bed.service";

export const bedController = {
  // Create a bed under the room supplied by the administrator.
  createBed: asyncHandler(async (req: Request, res: Response) => {
    const { roomId, bedNumber } = req.body;

    const bed = await bedService.createBed(roomId, bedNumber);

    sendCreated(res, "Bed created successfully.", bed);
  }),

  // Retrieve all beds together with the rooms and hostels they belong to.
  getBeds: asyncHandler(async (_req: Request, res: Response) => {
    const beds = await bedService.getBeds();

    sendSuccess(res, {
      statusCode: 200,
      message: "Beds retrieved successfully.",
      data: beds,
    });
  }),
};

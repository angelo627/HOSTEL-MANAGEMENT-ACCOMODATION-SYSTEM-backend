import { Request, Response } from "express";

import { sendCreated } from "../../middleware/response-formatter";
import { asyncHandler } from "../../shared/utils/async-handler";

import { allocationService } from "./allocation.service";

export const allocationController = {
  // Reserve an available bed for the authenticated student's
  // eligible hostel application.
  createAllocation: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const allocation =
      await allocationService.createAllocation(userId);

    sendCreated(
      res,
      "Bed reserved successfully.",
      allocation,
    );
  }),
};
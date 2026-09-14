import { Request, Response } from "express";
import { checkInService } from "./checkin.service";
import { asyncHandler } from "../../shared/utils/async-handler";
import { sendSuccess } from "../../middleware/response-formatter";

export const checkInController = {
  completeCheckIn: asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.body;

    const result = await checkInService.completeCheckIn({
      code,
    });

    sendSuccess(res, {
      statusCode: 200,
      message: "Student checked in successfully.",
      data: result,
    });
  }),
};

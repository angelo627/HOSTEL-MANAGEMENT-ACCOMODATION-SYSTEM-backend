import { Request, Response } from "express";
import { schoolFeeRecordService } from "./schoolFeeRecord.service";
import { asyncHandler } from "../../shared/utils/async-handler";
import { sendSuccess } from "../../middleware/response-formatter";

export const schoolFeeRecordController = {
  getAllSchoolFeeRecords: asyncHandler(
    async (_req: Request, res: Response) => {
      const schoolFeeRecords =
        await schoolFeeRecordService.getAllSchoolFeeRecords();

      sendSuccess(res, {
        statusCode: 200,
        message: "School fee records retrieved successfully.",
        data: schoolFeeRecords,
      });
    },
  ),
};
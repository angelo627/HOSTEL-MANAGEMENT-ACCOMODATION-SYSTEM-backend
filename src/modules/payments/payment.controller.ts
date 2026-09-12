import { Request, Response } from "express";

import { paymentService } from "./payment.service";
import { asyncHandler } from "../../shared/utils/async-handler";
import { sendSuccess } from "../../middleware/response-formatter";

export const paymentController = {
  // Process the student's hostel accommodation payment.
  createPayment: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const { rrr, amount } = req.body;

    const result = await paymentService.makePayment({
      userId,
      rrr,
      amount,
    });

    sendSuccess(res, {
      statusCode: 200,
      message: "Hostel accommodation payment successful.",
      data: result,
    });
  }),
};

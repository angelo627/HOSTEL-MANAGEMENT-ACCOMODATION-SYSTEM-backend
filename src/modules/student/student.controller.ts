import { Request, Response } from "express";

import { sendSuccess } from "../../middleware/response-formatter";
import { asyncHandler } from "../../shared/utils/async-handler";

import { studentService } from "./student.service";

export const studentController = {
  // Return the profile belonging to the currently authenticated student.
  getStudentProfile: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const student = await studentService.getStudentProfile(userId);

    sendSuccess(res, {
      statusCode: 200,
      message: "Student profile retrieved successfully.",
      data: student,
    });
  }),
};

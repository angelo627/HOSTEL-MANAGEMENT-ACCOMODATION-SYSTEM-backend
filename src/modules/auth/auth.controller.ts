import { Request, Response } from "express";

import { authService } from "./auth.service";

import { asyncHandler } from "../../shared/utils/async-handler";

import { sendCreated, sendSuccess } from "../../middleware/response-formatter";

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);

    const { user, student, schoolFeeRecord } = result;

    sendCreated(res, "Student account created successfully.", {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
      },

      student: {
        id: student.id,
        registrationNo: student.registrationNo,
        academicLevel: student.academicLevel,
      },

      schoolFeeRecord: {
        rrr: schoolFeeRecord.rrr,
        status: schoolFeeRecord.status,
        verifiedAt: schoolFeeRecord.verifiedAt,
      },
    });
  }),

  studentLogin: asyncHandler(async (req: Request, res: Response) => {
    const { registrationNo, rrr } = req.body;

    const result = await authService.studentLogin(registrationNo, rrr);

    sendSuccess(res, {
      statusCode: 200,
      message: "Student login successful.",
      data: result,
    });
  }),

  adminLogin: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await authService.adminLogin(email, password);

    sendSuccess(res, {
      statusCode: 200,
      message: "Admin login successful.",
      data: result,
    });
  }),

  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.getProfile(req.user!.id);

    sendSuccess(res, {
      statusCode: 200,
      message: "Profile retrieved successfully.",
      data: result,
    });
  }),
};

import { Request, Response, NextFunction } from "express";

import { register } from "./auth.service";

import { sendCreated } from "../../middleware/response-formatter";

export async function registerController(
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response> {
  const result = await register(req.body);

  const { user, student, schoolFeeRecord } = result;

  return sendCreated(res, "Student account created successfully.", {
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
}

import { NextFunction, Request, Response } from "express";

import { AppError } from "../shared/errors/app-error";
import { UserRole } from "../generated/prisma/client";
import { verifyToken } from "../shared/utils/token";

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return next(
      new AppError({
        statusCode: 401,
        message: "Authentication required.",
        code: "UNAUTHORIZED",
      }),
    );
  }

  const token = authorizationHeader.substring("Bearer ".length);

  try {
    const payload = verifyToken(token);

    if (payload.status !== "ACTIVE") {
      return next(
        new AppError({
          statusCode: 403,
          message: "Your account is not active.",
          code: "ACCOUNT_NOT_ACTIVE",
        }),
      );
    }

    req.user = {
      id: payload.sub,
      role: payload.role,
      status: payload.status,
    };

    return next();
  } catch {
    return next(
      new AppError({
        statusCode: 401,
        message: "Invalid or expired token.",
        code: "UNAUTHORIZED",
      }),
    );
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(
        new AppError({
          statusCode: 401,
          message: "Authentication required.",
          code: "UNAUTHORIZED",
        }),
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError({
          statusCode: 403,
          message: "You do not have permission to perform this action.",
          code: "FORBIDDEN",
        }),
      );
    }

    return next();
  };
}

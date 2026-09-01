import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client";
import jwt from "jsonwebtoken";

import { AppError } from "../shared/errors/app-error";

interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  data: null;
  code: string;
  details?: unknown;
}

function sendError(
  res: Response,
  statusCode: number,
  message: string,
  code: string,
  details?: unknown,
): void {
  const response: ErrorResponse = {
    success: false,
    statusCode,
    message,
    data: null,
    code,
  };

  if (details !== undefined) {
    response.details = details;
  }

  res.status(statusCode).json(response);
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // 1. Operational application errors
  if (error instanceof AppError) {
    sendError(res, error.statusCode, error.message, error.code, error.details);

    return;
  }

  // 2. Zod validation errors
  if (error instanceof ZodError) {
    sendError(
      res,
      400,
      "Validation failed.",
      "VALIDATION_ERROR",
      error.flatten(),
    );

    return;
  }

  // 3. JWT expired token
  // TokenExpiredError extends JsonWebTokenError,
  // so this must come before JsonWebTokenError.
  if (error instanceof jwt.TokenExpiredError) {
    sendError(res, 401, "Authentication token has expired.", "TOKEN_EXPIRED");

    return;
  }

  // 4. Invalid JWT
  if (error instanceof jwt.JsonWebTokenError) {
    sendError(res, 401, "Invalid authentication token.", "INVALID_TOKEN");

    return;
  }

  // 5. Prisma known request errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    sendError(res, 400, "Database operation failed.", `DATABASE_${error.code}`);

    return;
  }

  // 6. Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    sendError(
      res,
      400,
      "Invalid database operation.",
      "DATABASE_VALIDATION_ERROR",
    );

    return;
  }

  // 7. Unknown errors
  console.error(error);

  sendError(res, 500, "An unexpected error occurred.", "INTERNAL_SERVER_ERROR");
}

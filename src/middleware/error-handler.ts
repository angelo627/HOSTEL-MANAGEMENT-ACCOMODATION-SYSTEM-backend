import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client";
import jwt from "jsonwebtoken";

import { AppError } from "../shared/errors/app-error";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // 1. AppError
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: "error",
      message: error.message,
      code: error.code,
      ...(error.details !== undefined && {
        details: error.details,
      }),
    });

    return;
  }

  // 2. Zod validation error
  if (error instanceof ZodError) {
    res.status(400).json({
      status: "error",
      message: "Validation failed.",
      code: "VALIDATION_ERROR",
      details: error.flatten(),
    });

    return;
  }

  // 3. Prisma known request error
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(400).json({
      status: "error",
      message: "Database operation failed.",
      code: `DATABASE_${error.code}`,
    });

    return;
  }

  // 4. Prisma validation error
  if (error instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      status: "error",
      message: "Invalid database operation.",
      code: "DATABASE_VALIDATION_ERROR",
    });

    return;
  }

  // 5. JWT errors
  if (error instanceof jwt.JsonWebTokenError) {
    res.status(401).json({
      status: "error",
      message: "Invalid authentication token.",
      code: "INVALID_TOKEN",
    });

    return;
  }

  if (error instanceof jwt.TokenExpiredError) {
    res.status(401).json({
      status: "error",
      message: "Authentication token has expired.",
      code: "TOKEN_EXPIRED",
    });

    return;
  }

  // 6. Unknown / unexpected error
  console.error(error);

  res.status(500).json({
    status: "error",
    message: "An unexpected error occurred.",
    code: "INTERNAL_SERVER_ERROR",
  });
}

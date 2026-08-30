import { NextFunction, Request, Response } from "express";

import { AppError } from "../shared/errors/app-error";

export function notFound(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const method = req.method;
  const path = req.originalUrl;

  next(
    new AppError({
      statusCode: 404,
      message: `Route ${method} ${path} not found.`,
      code: "ROUTE_NOT_FOUND",
    }),
  );
}

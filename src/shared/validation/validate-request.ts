import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

import { AppError } from "../errors/app-error";

type ValidationTarget = "body" | "query" | "params";

export function validateRequest(
  schema: ZodObject,
  target: ValidationTarget = "body",
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[target]);

      Object.assign(req[target], parsed);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new AppError({
            statusCode: 400,
            message: error.issues.map((issue) => issue.message).join(", "),
            code: "VALIDATION_ERROR",
            details: error.issues,
          }),
        );
      }

      next(error);
    }
  };
}

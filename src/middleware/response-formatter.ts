import { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  meta?: Record<string, unknown>;
}

export function sendSuccess<T>(
  res: Response,
  options: {
    statusCode?: number;
    message?: string;
    data?: T | null;
    meta?: Record<string, unknown>;
  } = {},
): Response {
  const {
    statusCode = 200,
    message = "Request successful.",
    data = null,
    meta,
  } = options;

  const response: ApiResponse<T> = {
    success: true,
    statusCode,
    message,
    data,
  };

  if (meta) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
}

export function sendCreated<T>(
  res: Response,
  message = "Resource created successfully.",
  data: T | null = null,
): Response {
  return sendSuccess(res, {
    statusCode: 201,
    message,
    data,
  });
}

export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}

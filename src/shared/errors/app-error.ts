export interface AppErrorOptions {
  statusCode: number;
  message: string;
  code?: string;
  details?: unknown;
  cause?: unknown;
  isOperational?: boolean;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor({
    statusCode,
    message,
    code = "INTERNAL_SERVER_ERROR",
    details,
    cause,
    isOperational = true,
  }: AppErrorOptions) {
    super(message, { cause });

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace(this, AppError);
  }
}

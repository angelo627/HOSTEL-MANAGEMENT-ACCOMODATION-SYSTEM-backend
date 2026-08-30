import { UserRole, UserStatus } from "../../generated/prisma/client";

export const AUTH_CONSTANTS = {
  JWT_EXPIRES_IN: "1d",
  AUTH_HEADER_PREFIX: "Bearer ",
} as const;


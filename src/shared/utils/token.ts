import jwt from "jsonwebtoken";

import { env } from "../../config/env";
import { UserRole, UserStatus } from "../../generated/prisma/client";
import { AUTH_CONSTANTS } from "../constants/auth";

export interface JwtPayload {
  sub: string;
  role: UserRole;
  status: UserStatus;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: AUTH_CONSTANTS.JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(
    token,
    env.jwtSecret,
  ) as JwtPayload;
}
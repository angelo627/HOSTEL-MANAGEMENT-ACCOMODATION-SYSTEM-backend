import { UserRole, UserStatus } from "../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        status: UserStatus;
      };
    }
  }
}

export {};

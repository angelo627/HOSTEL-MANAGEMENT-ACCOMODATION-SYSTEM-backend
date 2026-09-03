import { Router } from "express";

import { authController } from "./auth.controller";
import { authenticate } from "../../middleware/auth.middleware";

import {
  registerSchema,
  studentLoginSchema,
  adminLoginSchema,
} from "./auth.validation";

import { validateRequest } from "../../shared/validation/validate-request";

const authRouter = Router();

authRouter.post(
  "/register",
  validateRequest(registerSchema),
  authController.register,
);

authRouter.post(
  "/login",
  validateRequest(studentLoginSchema),
  authController.studentLogin,
);

authRouter.post(
  "/admin/login",
  validateRequest(adminLoginSchema),
  authController.adminLogin,
);

authRouter.get(
  "/profile",
  authenticate,
  authController.getProfile,
);

export { authRouter };

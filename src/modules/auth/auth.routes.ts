import { Router } from "express";

import { authController } from "./auth.controller";

import { registerSchema, studentLoginSchema } from "./auth.validation";

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

export { authRouter };

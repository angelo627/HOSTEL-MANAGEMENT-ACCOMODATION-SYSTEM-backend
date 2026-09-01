import { Router } from "express";

import { registerController } from "./auth.controller";

import { registerSchema } from "./auth.validation";

import { validateRequest } from "../../shared/validation/validate-request";

const authRouter = Router();

authRouter.post(
  "/register",
  validateRequest(registerSchema),
  registerController,
);


export { authRouter };

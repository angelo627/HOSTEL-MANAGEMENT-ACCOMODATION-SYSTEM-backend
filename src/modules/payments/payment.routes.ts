import { Router } from "express";

import { paymentController } from "./payment.controller";
import { validateRequest } from "../../shared/validation/validate-request";
import { makePaymentSchema } from "./payment.validation";

const paymentRouter = Router();

paymentRouter.post(
  "/make/payment",
  validateRequest(makePaymentSchema),
  paymentController.createPayment,
);

export {paymentRouter};

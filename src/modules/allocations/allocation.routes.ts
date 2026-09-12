import { Router } from "express";

import { allocationController } from "./allocation.controller";

const allocationRouter = Router();

// Allow an authenticated student to request allocation.
// The system automatically selects the available bed.
allocationRouter.post(
  "/process-hostel/allocation",
  allocationController.createAllocation,
);

export { allocationRouter };
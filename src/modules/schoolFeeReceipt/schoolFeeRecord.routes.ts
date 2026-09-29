import { Router } from "express";
import { schoolFeeRecordController } from "./schoolFeeRecord.controller";

const schoolFeeRecordRouter = Router();

schoolFeeRecordRouter.get(
  "/all/school-fee-records",
  schoolFeeRecordController.getAllSchoolFeeRecords,
);

export { schoolFeeRecordRouter };

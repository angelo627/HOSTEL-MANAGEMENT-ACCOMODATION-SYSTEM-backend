import { Router } from "express";

import { studentController } from "./student.controller";

const studentRouter = Router();

// Retrieve the profile of the currently authenticated student.
studentRouter.get(
  "/student/profile",
  studentController.getStudentProfile,
);

export { studentRouter };
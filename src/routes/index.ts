import { Router } from "express";

import { authRouter } from "../modules/auth/auth.routes";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { hostelRouter } from "../modules/hostel/hostel.routes";
import { userhostelRouter } from "../modules/hostel/hostel.routes";
import { roomRouter } from "../modules/room/room.routes";
import { userRoomRouter } from "../modules/room/room.routes";
import { bedRouter, userBedRouter } from "../modules/bed/bed.routes";
import { studentRouter } from "../modules/student/student.routes";
import { bankAccountRouter } from "../modules/bankAccount/bank.routes";
import { transactionRouter } from "../modules/transactions/transaction.routes";
import { adminbankAccountRouter } from "../modules/bankAccount/bank.routes";
import { hostelApplicationRouter } from "../modules/HostelApplication/hostelApplication.routes";
import { allocationRouter } from "../modules/allocations/allocation.routes";
import { paymentRouter } from "../modules/payments/payment.routes";

const apiRouter = Router();
const adminRouter = Router();


// PUBLIC ROUTES
apiRouter.use("/auth", authRouter);





// AUTHENTICATED ROUTES
apiRouter.use(authenticate);
apiRouter.use("/user", userhostelRouter);
apiRouter.use("/user", userRoomRouter);
apiRouter.use("/user", userBedRouter);
apiRouter.use("/user", studentRouter);
apiRouter.use("/user", bankAccountRouter);
apiRouter.use("/user", transactionRouter);
apiRouter.use("/user", hostelApplicationRouter);
apiRouter.use("/user", allocationRouter);
apiRouter.use("/user", paymentRouter);





// ADMIN ROUTES
adminRouter.use(authorize("ADMIN", "SUPERADMIN"));
adminRouter.use("/admin", hostelRouter);
adminRouter.use("/admin", roomRouter);
adminRouter.use("/admin", bedRouter);
adminRouter.use("/admin", adminbankAccountRouter)




apiRouter.use("/", adminRouter);

export default apiRouter;

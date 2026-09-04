import { Router } from "express";

import { authRouter } from "../modules/auth/auth.routes";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { hostelRouter } from "../modules/hostel/hostel.routes";
import { userhostelRouter } from "../modules/hostel/hostel.routes";
import { roomRouter } from "../modules/room/room.routes";

const apiRouter = Router();
const adminRouter = Router();


// PUBLIC ROUTES
apiRouter.use("/auth", authRouter);





// AUTHENTICATED ROUTES
apiRouter.use(authenticate);
adminRouter.use("/user", userhostelRouter);
// Student routes will be added here





// ADMIN ROUTES
adminRouter.use(authorize("ADMIN", "SUPERADMIN"));
adminRouter.use("/admin", hostelRouter);
adminRouter.use("/admin", roomRouter);
// Admin routes will be added here
// adminRouter.use("/hostels", hostelRouter);
// adminRouter.use("/rooms", roomRouter);
// adminRouter.use("/allocations", allocationRouter);



apiRouter.use("/", adminRouter);

export default apiRouter;

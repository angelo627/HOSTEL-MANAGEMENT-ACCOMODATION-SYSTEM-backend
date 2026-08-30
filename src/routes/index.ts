import { Router } from "express";

import { authRouter } from "../modules/auth/auth.routes";
import { authenticate, authorize } from "../middleware/auth.middleware";

const apiRouter = Router();
const adminRouter = Router();


// PUBLIC ROUTES
apiRouter.use("/auth", authRouter);





// AUTHENTICATED ROUTES
apiRouter.use(authenticate);
// Student routes will be added here





// ADMIN ROUTES
adminRouter.use(authorize("ADMIN", "SUPERADMIN"));
// Admin routes will be added here
// adminRouter.use("/hostels", hostelRouter);
// adminRouter.use("/rooms", roomRouter);
// adminRouter.use("/allocations", allocationRouter);



apiRouter.use("/", adminRouter);

export default apiRouter;

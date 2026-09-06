import { Router } from "express";

import { validateRequest } from "../../shared/validation/validate-request";

import { roomController } from "./room.controller";
import { createRoomSchema, updateRoomSchema } from "./room.validation";

const roomRouter = Router();
const userRoomRouter = Router();

//admins 
// Create a room after validating the hostel, room number, and capacity.
roomRouter.post(
  "/create-room",
  validateRequest(createRoomSchema),
  roomController.createRoom,
);

roomRouter.get(
  "/room/get-all-room",
  roomController.getRooms,
);

roomRouter.get(
  "/room/:roomId",
  roomController.getRoomById,
);

// Update an existing room after validating the supplied room details.
roomRouter.patch(
  "/room/update-room/:roomId",
  validateRequest(updateRoomSchema),
  roomController.updateRoom,
);

// Deactivate a room by changing its status to MAINTENANCE.
roomRouter.patch(
  "/room/deactivate-room/:roomId",
  roomController.deactivateRoom,
);

// Activate a room by changing its status back to AVAILABLE.
roomRouter.patch(
  "/room/:roomId/activate",
  roomController.activateRoom,
);


// users 
userRoomRouter.get(
  "/room/get-all-room",
  roomController.getRooms,
);

userRoomRouter.get(
  "/room/:roomId",
  roomController.getRoomById,
);

export { roomRouter };
export { userRoomRouter };

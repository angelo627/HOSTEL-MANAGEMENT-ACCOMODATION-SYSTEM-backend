import { Router } from "express";

import { validateRequest } from "../../shared/validation/validate-request";

import { roomController } from "./room.controller";
import { createRoomSchema } from "./room.validation";

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

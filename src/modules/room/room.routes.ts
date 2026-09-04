import { Router } from "express";

import { validateRequest } from "../../shared/validation/validate-request";

import { roomController } from "./room.controller";
import { createRoomSchema } from "./room.validation";

const roomRouter = Router();

// Create a room after validating the hostel, room number, and capacity.
roomRouter.post(
  "/create-room",
  validateRequest(createRoomSchema),
  roomController.createRoom,
);

export { roomRouter };

import { Request, Response } from "express";

import { sendCreated } from "../../middleware/response-formatter";
import { asyncHandler } from "../../shared/utils/async-handler";

import { roomService } from "./room.service";

export const roomController = {
  // Create a room using the hostel, room number, and capacity supplied by the admin.
  createRoom: asyncHandler(async (req: Request, res: Response) => {
    const { hostelId, roomNumber, capacity } = req.body;

    const room = await roomService.createRoom(hostelId, roomNumber, capacity);

    sendCreated(res, "Room created successfully.", room);
  }),
};

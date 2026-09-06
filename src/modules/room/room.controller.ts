import { Request, Response } from "express";

import { sendCreated, sendSuccess } from "../../middleware/response-formatter";
import { asyncHandler } from "../../shared/utils/async-handler";

import { roomService } from "./room.service";

export const roomController = {
  // Create a room using the hostel, room number, and capacity supplied by the admin.
  createRoom: asyncHandler(async (req: Request, res: Response) => {
    const { hostelId, roomNumber, capacity } = req.body;

    const room = await roomService.createRoom(hostelId, roomNumber, capacity);

    sendCreated(res, "Room created successfully.", room);
  }),

  // Retrieve all rooms for an administrator.
  getRooms: asyncHandler(async (_req: Request, res: Response) => {
    const rooms = await roomService.getRooms();

    sendSuccess(res, {
      statusCode: 200,
      message: "Rooms retrieved successfully.",
      data: rooms,
    });
  }),

  // Retrieve a specific room using its ID.
  getRoomById: asyncHandler(async (req: Request, res: Response) => {
    const roomId = req.params.roomId as string;

    const room = await roomService.getRoomById(roomId);

    sendSuccess(res, {
      statusCode: 200,
      message: "Room retrieved successfully.",
      data: room,
    });
  }),

  // Update the supplied room details without changing its hostel or status.
  updateRoom: asyncHandler(async (req: Request, res: Response) => {
    const roomId = req.params.roomId as string;
    const { roomNumber, capacity } = req.body;

    const room = await roomService.updateRoom(roomId, roomNumber, capacity);

    sendSuccess(res, {
      statusCode: 200,
      message: "Room updated successfully.",
      data: room,
    });
  }),

  // Deactivate a room by placing it under maintenance.
  deactivateRoom: asyncHandler(async (req: Request, res: Response) => {
    const roomId = req.params.roomId as string;

    const room = await roomService.deactivateRoom(roomId);

    sendSuccess(res, {
      statusCode: 200,
      message: "Room deactivated successfully.",
      data: room,
    });
  }),

  // Activate a room by changing its status back to AVAILABLE.
  activateRoom: asyncHandler(async (req: Request, res: Response) => {
    const roomId = req.params.roomId as string;

    const room = await roomService.activateRoom(roomId);

    sendSuccess(res, {
      statusCode: 200,
      message: "Room activated successfully.",
      data: room,
    });
  }),
};

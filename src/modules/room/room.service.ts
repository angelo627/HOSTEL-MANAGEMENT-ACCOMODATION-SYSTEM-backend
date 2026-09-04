import prisma from "../../config/prisma-client";
import { AppError } from "../../shared/errors/app-error";

export const roomService = {
  // Create a room only after confirming that its hostel exists.
  async createRoom(hostelId: string, roomNumber: string, capacity: number) {
    // A room cannot exist without a valid hostel.
    const hostel = await prisma.hostel.findUnique({
      where: {
        id: hostelId,
      },
    });

    if (!hostel) {
      throw new AppError({
        statusCode: 404,
        message: "Hostel not found.",
        code: "HOSTEL_NOT_FOUND",
      });
    }

    // Prevent the same room number from being used twice in one hostel.
    const existingRoom = await prisma.room.findFirst({
      where: {
        hostelId,
        roomNumber,
      },
    });

    if (existingRoom) {
      throw new AppError({
        statusCode: 409,
        message: "A room with this number already exists in this hostel.",
        code: "ROOM_ALREADY_EXISTS",
      });
    }

    // Create the room. Its status defaults to AVAILABLE in Prisma.
    const room = await prisma.room.create({
      data: {
        hostelId,
        roomNumber,
        capacity,
      },
    });

    return room;
  },
};

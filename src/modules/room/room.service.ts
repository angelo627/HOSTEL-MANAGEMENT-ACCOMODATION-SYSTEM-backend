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

  // Retrieve all rooms and include the hostel they belong to.
  async getRooms() {
    const rooms = await prisma.room.findMany({
      include: {
        hostel: {
          select: {
            id: true,
            name: true,
            gender: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return rooms;
  },

  // Retrieve one room and include the hostel it belongs to.
  async getRoomById(roomId: string) {
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        hostel: {
          select: {
            id: true,
            name: true,
            gender: true,
            status: true,
          },
        },
      },
    });

    if (!room) {
      throw new AppError({
        statusCode: 404,
        message: "Room not found.",
        code: "ROOM_NOT_FOUND",
      });
    }

    return room;
  },

  // Update the room details while keeping the room under its existing hostel.
  async updateRoom(roomId: string, roomNumber?: string, capacity?: number) {
    // Confirm that the room exists before attempting to update it.
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      throw new AppError({
        statusCode: 404,
        message: "Room not found.",
        code: "ROOM_NOT_FOUND",
      });
    }

    // If the room number is being changed, make sure it is not already
    // being used by another room in the same hostel.
    if (roomNumber !== undefined && roomNumber !== room.roomNumber) {
      const existingRoom = await prisma.room.findFirst({
        where: {
          hostelId: room.hostelId,
          roomNumber,
          NOT: {
            id: roomId,
          },
        },
      });

      if (existingRoom) {
        throw new AppError({
          statusCode: 409,
          message: "A room with this number already exists in this hostel.",
          code: "ROOM_ALREADY_EXISTS",
        });
      }
    }

    // Build the update object using only the fields supplied by the admin.
    const updateData: {
      roomNumber?: string;
      capacity?: number;
    } = {};

    if (roomNumber !== undefined) {
      updateData.roomNumber = roomNumber;
    }

    if (capacity !== undefined) {
      updateData.capacity = capacity;
    }

    const updatedRoom = await prisma.room.update({
      where: {
        id: roomId,
      },
      data: updateData,
    });

    return updatedRoom;
  },

  async deactivateRoom(roomId: string) {
    // Confirm that the room exists before changing its status.
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      throw new AppError({
        statusCode: 404,
        message: "Room not found.",
        code: "ROOM_NOT_FOUND",
      });
    }

    // Mark the room as unavailable for allocation by placing it under maintenance.
    const updatedRoom = await prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        status: "MAINTENANCE",
      },
    });

    return updatedRoom;
  },

  // Activate a room by changing its status back to AVAILABLE.
  async activateRoom(roomId: string) {
    // Confirm that the room exists before changing its status.
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      throw new AppError({
        statusCode: 404,
        message: "Room not found.",
        code: "ROOM_NOT_FOUND",
      });
    }

    // Make the room available for normal use again.
    const updatedRoom = await prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        status: "AVAILABLE",
      },
    });

    return updatedRoom;
  },
};

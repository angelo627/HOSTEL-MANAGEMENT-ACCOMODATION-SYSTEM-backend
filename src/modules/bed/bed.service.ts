import prisma from "../../config/prisma-client";
import { AppError } from "../../shared/errors/app-error";

export const bedService = {
  // Create a bed only when the room exists and still has available bed spaces.
  async createBed(roomId: string, bedNumber: string) {
    // A bed cannot exist without a valid room.
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

    // Count the beds that already belong to this room.
    const existingBedCount = await prisma.bed.count({
      where: {
        roomId,
      },
    });

    // Do not allow more beds than the room's defined capacity.
    if (existingBedCount >= room.capacity) {
      throw new AppError({
        statusCode: 409,
        message: "This room has reached its bed capacity.",
        code: "ROOM_BED_CAPACITY_REACHED",
      });
    }

    // Prevent the same bed number from being used twice in this room.
    const existingBed = await prisma.bed.findUnique({
      where: {
        roomId_bedNumber: {
          roomId,
          bedNumber,
        },
      },
    });

    if (existingBed) {
      throw new AppError({
        statusCode: 409,
        message: "A bed with this number already exists in this room.",
        code: "BED_ALREADY_EXISTS",
      });
    }

    // Create the bed. Its status automatically starts as AVAILABLE.
    const bed = await prisma.bed.create({
      data: {
        roomId,
        bedNumber,
      },
    });

    return bed;
  },

  // Retrieve all beds together with the room and hostel they belong to.
  async getBeds() {
    const beds = await prisma.bed.findMany({
      include: {
        room: {
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
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return beds;
  },
};

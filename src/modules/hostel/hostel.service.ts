import prisma from "../../config/prisma-client";
import { AppError } from "../../shared/errors/app-error";
import { uploadImage, deleteImage } from "../../shared/utils/upload-image";
import { UserRole } from "../../generated/prisma/client";

export const hostelService = {
  // Create a new hostel and upload its image to Cloudinary.
  async createHostel(
    name: string,
    description: string | undefined,
    gender: "MALE" | "FEMALE",
    imageBuffer: Buffer,
  ) {
    const existingHostel = await prisma.hostel.findFirst({
      where: {
        name,
      },
    });

    if (existingHostel) {
      throw new AppError({
        statusCode: 409,
        message: "A hostel with this name already exists.",
        code: "HOSTEL_ALREADY_EXISTS",
      });
    }

    const uploadedImage = await uploadImage(
      imageBuffer,
      "hostel-management/hostels",
    );

    const hostel = await prisma.hostel.create({
      data: {
        name,
        description: description ?? null,
        gender,
        imageUrl: uploadedImage.secure_url,
        imagePublicId: uploadedImage.public_id,
      },
    });

    return hostel;
  },

  // Retrieve hostels based on the user's role.
  // Students can only see active hostels, while admins can see all hostels.
  async getHostels(role: UserRole) {
    const hostels = await prisma.hostel.findMany({
      ...(role === "USER" && {
        where: {
          status: "ACTIVE",
        },
      }),

      orderBy: {
        createdAt: "desc",
      },
    });

    return hostels;
  },

  // Retrieve a single hostel using its unique ID.
  async getHostelById(hostelId: string) {
    const hostel = await prisma.hostel.findUnique({
      where: {
        id: hostelId,
      },
    });

    // Return a clear error when the requested hostel does not exist.
    if (!hostel) {
      throw new AppError({
        statusCode: 404,
        message: "Hostel not found.",
        code: "HOSTEL_NOT_FOUND",
      });
    }

    return hostel;
  },

  // Update only the hostel fields provided in the request.
  async updateHostel(
    hostelId: string,
    name: string | undefined,
    description: string | undefined,
    gender: "MALE" | "FEMALE" | undefined,
    imageBuffer?: Buffer,
  ) {
    // Make sure the hostel exists before updating it.
    const existingHostel = await prisma.hostel.findUnique({
      where: {
        id: hostelId,
      },
    });

    if (!existingHostel) {
      throw new AppError({
        statusCode: 404,
        message: "Hostel not found.",
        code: "HOSTEL_NOT_FOUND",
      });
    }

    // Prevent two hostels from having the same name.
    if (name && name !== existingHostel.name) {
      const duplicateHostel = await prisma.hostel.findFirst({
        where: {
          name,
          NOT: {
            id: hostelId,
          },
        },
      });

      if (duplicateHostel) {
        throw new AppError({
          statusCode: 409,
          message: "A hostel with this name already exists.",
          code: "HOSTEL_ALREADY_EXISTS",
        });
      }
    }

    let imageUrl = existingHostel.imageUrl;
    let imagePublicId = existingHostel.imagePublicId;

    // Replace the old Cloudinary image only when a new image is provided.
    if (imageBuffer) {
      const uploadedImage = await uploadImage(
        imageBuffer,
        "hostel-management/hostels",
      );

      imageUrl = uploadedImage.secure_url;
      imagePublicId = uploadedImage.public_id;
    }

    // Update only the fields that were provided.
    const hostel = await prisma.hostel.update({
      where: {
        id: hostelId,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(gender !== undefined && { gender }),
        ...(imageBuffer && {
          imageUrl,
          imagePublicId,
        }),
      },
    });

    // Remove the old Cloudinary image after the database update succeeds.
    if (imageBuffer && existingHostel.imagePublicId) {
      await deleteImage(existingHostel.imagePublicId);
    }

    return hostel;
  },

  // Deactivate a hostel without permanently deleting its record.
  async deactivateHostel(hostelId: string) {
    // Make sure the hostel exists before changing its status.
    const existingHostel = await prisma.hostel.findUnique({
      where: {
        id: hostelId,
      },
    });

    if (!existingHostel) {
      throw new AppError({
        statusCode: 404,
        message: "Hostel not found.",
        code: "HOSTEL_NOT_FOUND",
      });
    }

    // Prevent an already inactive hostel from being deactivated again.
    if (existingHostel.status === "INACTIVE") {
      throw new AppError({
        statusCode: 400,
        message: "Hostel is already inactive.",
        code: "HOSTEL_ALREADY_INACTIVE",
      });
    }

    // Mark the hostel as inactive instead of deleting it permanently.
    const hostel = await prisma.hostel.update({
      where: {
        id: hostelId,
      },
      data: {
        status: "INACTIVE",
      },
    });

    return hostel;
  },

  // Activate an inactive hostel without creating a new record.
  async activateHostel(hostelId: string) {
    // Make sure the hostel exists before changing its status.
    const existingHostel = await prisma.hostel.findUnique({
      where: {
        id: hostelId,
      },
    });

    if (!existingHostel) {
      throw new AppError({
        statusCode: 404,
        message: "Hostel not found.",
        code: "HOSTEL_NOT_FOUND",
      });
    }

    // Prevent an already active hostel from being activated again.
    if (existingHostel.status === "ACTIVE") {
      throw new AppError({
        statusCode: 400,
        message: "Hostel is already active.",
        code: "HOSTEL_ALREADY_ACTIVE",
      });
    }

    // Change the hostel status back to active.
    const hostel = await prisma.hostel.update({
      where: {
        id: hostelId,
      },
      data: {
        status: "ACTIVE",
      },
    });

    return hostel;
  },
};

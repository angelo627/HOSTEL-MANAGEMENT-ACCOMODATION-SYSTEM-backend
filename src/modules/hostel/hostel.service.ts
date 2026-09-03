import prisma from "../../config/prisma-client";
import { AppError } from "../../shared/errors/app-error";
import { uploadImage } from "../../shared/utils/upload-image";

export const hostelService = {
  // HOSTEL
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
};

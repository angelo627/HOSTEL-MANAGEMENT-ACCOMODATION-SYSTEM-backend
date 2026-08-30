import "dotenv/config";

const requiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const env = {
  databaseUrl: requiredEnv("DATABASE_URL"),

  jwtSecret: requiredEnv("JWT_SECRET"),
  
  port: Number(process.env.PORT) || 5000,

  corsOrigin: process.env.CORS_ORIGIN?.split(",").map((origin) =>
    origin.trim(),
  ) ?? ["http://localhost:3000"],

  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",

  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "",

  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
};

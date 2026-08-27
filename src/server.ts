import "dotenv/config";
import app from "./app";
import prisma from "./config/prisma-client";

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    console.log("Database connected successfully");

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`${signal} received. Shutting down server...`);

      server.close(async () => {
        try {
          await prisma.$disconnect();

          console.log("Database disconnected");
          console.log("Server shut down successfully");

          process.exit(0);
        } catch (error) {
          console.error("Error during shutdown:", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

    // Handle server errors
    server.on("error", (error) => {
      console.error("Server error:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server:", error);

    await prisma.$disconnect();

    process.exit(1);
  }
}

startServer();

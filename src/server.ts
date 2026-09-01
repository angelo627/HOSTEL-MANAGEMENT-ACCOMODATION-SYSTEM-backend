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

    let isShuttingDown = false;

    const shutdown = async (signal: string) => {
      if (isShuttingDown) {
        return;
      }

      isShuttingDown = true;

      console.log(`${signal} received. Shutting down server...`);

      server.close(async (serverError) => {
        if (serverError) {
          console.error("Error closing server:", serverError);
        }

        try {
          await prisma.$disconnect();

          console.log("Database disconnected");
          console.log("Server shut down successfully");

          process.exit(serverError ? 1 : 0);
        } catch (error) {
          console.error("Error disconnecting database:", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => {
      void shutdown("SIGINT");
    });

    process.on("SIGTERM", () => {
      void shutdown("SIGTERM");
    });

    server.on("error", (error) => {
      console.error("Server error:", error);
      void shutdown("SERVER_ERROR");
    });
  } catch (error) {
    console.error("Failed to start server:", error);

    await prisma.$disconnect();

    process.exit(1);
  }
}

void startServer();

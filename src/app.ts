import express from "express";
import cors from "cors";
import { env } from "./config/env";

import mainRoutes from "./routes";
import { notFound } from "./middleware/not-found";
import { errorHandler } from "./middleware/error-handler";
import { sendSuccess } from "./middleware/response-formatter";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";


const app = express();

// Global middleware
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");


// Health check
app.get("/health", (_req, res) => {
  return sendSuccess(res, {
    message: "Hostel Management Backend is running.",
  });
});

// Expose the interactive API documentation at /api-docs.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/api", mainRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;

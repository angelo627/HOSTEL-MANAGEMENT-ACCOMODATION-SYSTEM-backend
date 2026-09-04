import swaggerJSDoc from "swagger-jsdoc";
import { allApis } from "../api-docs/all-apis";

const paths: Record<string, Record<string, unknown>> = {};

for (const api of allApis.flat()) {
  const { path, method, ...operation } = api;
  paths[path] = {
    ...(paths[path] ?? {}),
    [method]: operation,
  };
}

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Hostel Management API",
      version: "1.0.0",
      description:
        "REST API for the Student Hostel Management and Accommodation System.",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],

    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },

    components: {
      responses: {
        Success: {
          description: "Successful request.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  statusCode: { type: "integer", example: 200 },
                  message: { type: "string" },
                  data: {},
                },
              },
            },
          },
        },
        Error: {
          description: "Request failed.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  statusCode: { type: "integer" },
                  message: { type: "string" },
                  data: { nullable: true },
                  code: { type: "string" },
                  details: {},
                },
              },
            },
          },
        },
        ValidationError: {
          description: "Request validation failed.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  statusCode: { type: "integer", example: 400 },
                  message: { type: "string" },
                  data: { nullable: true },
                  code: { type: "string", example: "VALIDATION_ERROR" },
                  details: { type: "array" },
                },
              },
            },
          },
        },
      },
    },

    paths,
  },

  apis: [],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);

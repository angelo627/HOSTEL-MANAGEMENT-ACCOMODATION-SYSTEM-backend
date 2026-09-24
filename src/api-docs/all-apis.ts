export const allApis = [
  [
    {
      path: "/api/auth/register",
      method: "post",
      summary: "Register a student account",
      description:
        "Creates a student account, student profile, and simulated school fee record.",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["firstName", "lastName", "email", "password"],
              properties: {
                firstName: { type: "string", minLength: 2, maxLength: 50 },
                lastName: { type: "string", minLength: 2, maxLength: 50 },
                email: { type: "string", format: "email" },
                password: { type: "string", minLength: 8, maxLength: 128 },
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Student account created.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  statusCode: { type: "integer", example: 201 },
                  message: {
                    type: "string",
                    example: "Student account created successfully.",
                  },
                  data: {
                    type: "object",
                    properties: {
                      user: { type: "object" },
                      student: { type: "object" },
                      schoolFeeRecord: { type: "object" },
                    },
                  },
                },
              },
            },
          },
        },
        "400": { $ref: "#/components/responses/ValidationError" },
        "409": { $ref: "#/components/responses/Error" },
        "500": { $ref: "#/components/responses/Error" },
      },
    },
    {
      path: "/api/auth/login",
      method: "post",
      summary: "Log in a student",
      description:
        "Authenticates a student using their registration number and RRR.",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["registrationNo", "rrr"],
              properties: {
                registrationNo: {
                  type: "string",
                  pattern: "^202[2-7]/\\d{6}$",
                },
                rrr: {
                  type: "string",
                  pattern: "^RRR-(202[2-7])-\\d{6}$",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": { $ref: "#/components/responses/Success" },
        "400": { $ref: "#/components/responses/ValidationError" },
        "401": { $ref: "#/components/responses/Error" },
        "403": { $ref: "#/components/responses/Error" },
      },
    },
    {
      path: "/api/auth/admin/login",
      method: "post",
      summary: "Log in an administrator",
      description: "Authenticates an ADMIN or SUPERADMIN account.",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", format: "email" },
                password: { type: "string", minLength: 1 },
              },
            },
          },
        },
      },
      responses: {
        "200": { $ref: "#/components/responses/Success" },
        "400": { $ref: "#/components/responses/ValidationError" },
        "401": { $ref: "#/components/responses/Error" },
        "403": { $ref: "#/components/responses/Error" },
      },
    },
    {
      path: "/api/auth/profile",
      method: "get",
      summary: "Get the authenticated user's profile",
      tags: ["Auth"],
      security: [{ bearerAuth: [] }],
      responses: {
        "200": { $ref: "#/components/responses/Success" },
        "401": { $ref: "#/components/responses/Error" },
        "403": { $ref: "#/components/responses/Error" },
        "404": { $ref: "#/components/responses/Error" },
      },
    },
  ],

  [
    {
      path: "/api/admin/create-hostel",
      method: "post",
      summary: "Create a hostel",
      description: "Creates a hostel with a JPG, PNG, or WEBP image.",
      tags: ["Hostel"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["name", "gender", "accommodationFee", "image"],
              properties: {
                name: {
                  type: "string",
                  minLength: 2,
                  maxLength: 100,
                },
                description: {
                  type: "string",
                  maxLength: 1000,
                },
                gender: {
                  type: "string",
                  enum: ["MALE", "FEMALE"],
                },
                accommodationFee: {
                  type: "number",
                  format: "double",
                  minimum: 0,
                  exclusiveMinimum: true,
                  description: "Accommodation fee for the hostel.",
                  example: 50000,
                },
                image: {
                  type: "string",
                  format: "binary",
                },
              },
            },
          },
        },
      },
      responses: {
        "201": { $ref: "#/components/responses/Success" },
        "400": { $ref: "#/components/responses/ValidationError" },
        "401": { $ref: "#/components/responses/Error" },
        "403": { $ref: "#/components/responses/Error" },
        "409": { $ref: "#/components/responses/Error" },
        "500": { $ref: "#/components/responses/Error" },
      },
    },
    {
      path: "/api/admin/get-all-hostel",
      method: "get",
      summary: "Get all hostels",
      description: "Returns all hostels for an administrator.",
      tags: ["Hostel"],
      security: [{ bearerAuth: [] }],
      responses: {
        "200": { $ref: "#/components/responses/Success" },
        "401": { $ref: "#/components/responses/Error" },
        "403": { $ref: "#/components/responses/Error" },
      },
    },
    {
      path: "/api/admin/{hostelId}",
      method: "get",
      summary: "Get a hostel by ID",
      tags: ["Hostel"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "hostelId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        "200": { $ref: "#/components/responses/Success" },
        "401": { $ref: "#/components/responses/Error" },
        "403": { $ref: "#/components/responses/Error" },
        "404": { $ref: "#/components/responses/Error" },
      },
    },
    {
      path: "/api/admin/update-hostel/{hostelId}",
      method: "patch",
      summary: "Update a hostel",
      description:
        "Updates any supplied hostel fields and optionally replaces its image.",
      tags: ["Hostel"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "hostelId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: false,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  minLength: 2,
                  maxLength: 100,
                },
                description: {
                  type: "string",
                  maxLength: 1000,
                },
                gender: {
                  type: "string",
                  enum: ["MALE", "FEMALE"],
                },
                accommodationFee: {
                  type: "number",
                  format: "double",
                  minimum: 0,
                  exclusiveMinimum: true,
                  description: "Updated accommodation fee for the hostel.",
                  example: 50000,
                },
                image: {
                  type: "string",
                  format: "binary",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": { $ref: "#/components/responses/Success" },
        "400": { $ref: "#/components/responses/ValidationError" },
        "401": { $ref: "#/components/responses/Error" },
        "403": { $ref: "#/components/responses/Error" },
        "404": { $ref: "#/components/responses/Error" },
        "409": { $ref: "#/components/responses/Error" },
      },
    },
    {
      path: "/api/admin/delete-hostel/{hostelId}",
      method: "delete",
      summary: "Deactivate a hostel",
      tags: ["Hostel"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "hostelId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        "200": { $ref: "#/components/responses/Success" },
        "400": { $ref: "#/components/responses/Error" },
        "401": { $ref: "#/components/responses/Error" },
        "403": { $ref: "#/components/responses/Error" },
        "404": { $ref: "#/components/responses/Error" },
      },
    },
    {
      path: "/api/admin/{hostelId}/activate",
      method: "patch",
      summary: "Activate a hostel",
      tags: ["Hostel"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "hostelId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        "200": { $ref: "#/components/responses/Success" },
        "400": { $ref: "#/components/responses/Error" },
        "401": { $ref: "#/components/responses/Error" },
        "403": { $ref: "#/components/responses/Error" },
        "404": { $ref: "#/components/responses/Error" },
      },
    },
    {
      path: "/api/user/get-all-hostel",
      method: "get",
      summary: "Get available hostels",
      description: "Returns active hostels visible to an authenticated user.",
      tags: ["Hostel"],
      security: [{ bearerAuth: [] }],
      responses: {
        "200": { $ref: "#/components/responses/Success" },
        "401": { $ref: "#/components/responses/Error" },
        "403": { $ref: "#/components/responses/Error" },
      },
    },
    {
      path: "/api/user/{hostelId}",
      method: "get",
      summary: "Get a hostel by ID",
      tags: ["Hostel"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "hostelId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        "200": { $ref: "#/components/responses/Success" },
        "401": { $ref: "#/components/responses/Error" },
        "403": { $ref: "#/components/responses/Error" },
        "404": { $ref: "#/components/responses/Error" },
      },
    },
  ],

  [
    {
      path: "/api/admin/create-room",
      method: "post",
      summary: "Create a room",
      description:
        "Creates a room under an existing hostel using the supplied room number and capacity.",
      tags: ["Room"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["hostelId", "roomNumber", "capacity"],
              properties: {
                hostelId: {
                  type: "string",
                  minLength: 1,
                  example: "001552a0-092e-46c2-bee7-99bd71119f12",
                },
                roomNumber: {
                  type: "string",
                  minLength: 1,
                  maxLength: 20,
                  example: "A01",
                },
                capacity: {
                  type: "integer",
                  minimum: 1,
                  example: 4,
                },
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Room created successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 201,
                  },
                  message: {
                    type: "string",
                    example: "Room created successfully.",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        format: "uuid",
                      },
                      hostelId: {
                        type: "string",
                        format: "uuid",
                      },
                      roomNumber: {
                        type: "string",
                        example: "A01",
                      },
                      capacity: {
                        type: "integer",
                        example: 4,
                      },
                      status: {
                        type: "string",
                        example: "AVAILABLE",
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "400": { $ref: "#/components/responses/ValidationError" },
        "401": { $ref: "#/components/responses/Error" },
        "403": { $ref: "#/components/responses/Error" },
        "404": { $ref: "#/components/responses/Error" },
        "409": { $ref: "#/components/responses/Error" },
      },
    },

    {
      path: "/api/admin/room/get-all-room",
      method: "get",
      summary: "Get all rooms",
      description:
        "Returns all rooms with the hostel information associated with each room.",
      tags: ["Room"],
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Rooms retrieved successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Rooms retrieved successfully.",
                  },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          format: "uuid",
                        },
                        hostelId: {
                          type: "string",
                          format: "uuid",
                        },
                        roomNumber: {
                          type: "string",
                          example: "A01",
                        },
                        capacity: {
                          type: "integer",
                          example: 4,
                        },
                        status: {
                          type: "string",
                          example: "AVAILABLE",
                        },
                        createdAt: {
                          type: "string",
                          format: "date-time",
                        },
                        updatedAt: {
                          type: "string",
                          format: "date-time",
                        },
                        hostel: {
                          type: "object",
                          properties: {
                            id: {
                              type: "string",
                              format: "uuid",
                            },
                            name: {
                              type: "string",
                              example: "Hall abu",
                            },
                            gender: {
                              type: "string",
                              enum: ["MALE", "FEMALE"],
                              example: "MALE",
                            },
                            status: {
                              type: "string",
                              example: "INACTIVE",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "401": { $ref: "#/components/responses/Error" },
        "403": { $ref: "#/components/responses/Error" },
      },
    },

    {
      path: "/api/admin/room/{roomId}",
      method: "get",
      summary: "Get a room by ID",
      description:
        "Returns a specific room and the hostel information associated with it.",
      tags: ["Room"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "roomId",
          in: "path",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        "200": {
          description: "Room retrieved successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Room retrieved successfully.",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        format: "uuid",
                      },
                      hostelId: {
                        type: "string",
                        format: "uuid",
                      },
                      roomNumber: {
                        type: "string",
                        example: "A01",
                      },
                      capacity: {
                        type: "integer",
                        example: 4,
                      },
                      status: {
                        type: "string",
                        example: "AVAILABLE",
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                      },
                      hostel: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                            format: "uuid",
                          },
                          name: {
                            type: "string",
                            example: "Hall abu",
                          },
                          gender: {
                            type: "string",
                            enum: ["MALE", "FEMALE"],
                            example: "MALE",
                          },
                          status: {
                            type: "string",
                            example: "INACTIVE",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "401": { $ref: "#/components/responses/Error" },
        "403": { $ref: "#/components/responses/Error" },
        "404": { $ref: "#/components/responses/Error" },
      },
    },

    {
      path: "/api/user/room/get-all-room",
      method: "get",
      summary: "Get all rooms",
      description:
        "Returns all rooms with the hostel information associated with each room for an authenticated user.",
      tags: ["Room"],
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Rooms retrieved successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Rooms retrieved successfully.",
                  },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          format: "uuid",
                        },
                        hostelId: {
                          type: "string",
                          format: "uuid",
                        },
                        roomNumber: {
                          type: "string",
                          example: "A01",
                        },
                        capacity: {
                          type: "integer",
                          example: 4,
                        },
                        status: {
                          type: "string",
                          example: "AVAILABLE",
                        },
                        createdAt: {
                          type: "string",
                          format: "date-time",
                        },
                        updatedAt: {
                          type: "string",
                          format: "date-time",
                        },
                        hostel: {
                          type: "object",
                          properties: {
                            id: {
                              type: "string",
                              format: "uuid",
                            },
                            name: {
                              type: "string",
                              example: "Hall abu",
                            },
                            gender: {
                              type: "string",
                              enum: ["MALE", "FEMALE"],
                              example: "MALE",
                            },
                            status: {
                              type: "string",
                              example: "INACTIVE",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "401": { $ref: "#/components/responses/Error" },
        "403": { $ref: "#/components/responses/Error" },
      },
    },

    {
      path: "/api/user/room/{roomId}",
      method: "get",
      summary: "Get a room by ID",
      description:
        "Returns a specific room and the hostel information associated with it for an authenticated user.",
      tags: ["Room"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "roomId",
          in: "path",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        "200": {
          description: "Room retrieved successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Room retrieved successfully.",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        format: "uuid",
                      },
                      hostelId: {
                        type: "string",
                        format: "uuid",
                      },
                      roomNumber: {
                        type: "string",
                        example: "A01",
                      },
                      capacity: {
                        type: "integer",
                        example: 4,
                      },
                      status: {
                        type: "string",
                        example: "AVAILABLE",
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                      },
                      hostel: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                            format: "uuid",
                          },
                          name: {
                            type: "string",
                            example: "Hall abu",
                          },
                          gender: {
                            type: "string",
                            enum: ["MALE", "FEMALE"],
                            example: "MALE",
                          },
                          status: {
                            type: "string",
                            example: "INACTIVE",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "401": { $ref: "#/components/responses/Error" },
        "403": { $ref: "#/components/responses/Error" },
        "404": { $ref: "#/components/responses/Error" },
      },
    },

    {
      method: "patch",
      path: "/api/admin/room/update-room/{roomId}",
      summary: "Update a room",
      description:
        "Updates the room number and/or capacity of an existing room. The room's hostel and status are not changed.",
      tags: ["Room"],
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "roomId",
          in: "path",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "The unique ID of the room to update.",
        },
      ],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              minProperties: 1,
              properties: {
                roomNumber: {
                  type: "string",
                  example: "A03",
                  description: "The new room number.",
                },
                capacity: {
                  type: "integer",
                  minimum: 1,
                  example: 6,
                  description: "The new room capacity.",
                },
              },
            },
          },
        },
      },

      responses: {
        "200": {
          description: "Room updated successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Room updated successfully.",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        format: "uuid",
                        example: "39be9752-d686-4afc-88a8-77d42c19b6df",
                      },
                      hostelId: {
                        type: "string",
                        format: "uuid",
                        example: "001552a0-092e-46c2-bee7-99bd71119f12",
                      },
                      roomNumber: {
                        type: "string",
                        example: "A02",
                      },
                      capacity: {
                        type: "integer",
                        example: 6,
                      },
                      status: {
                        type: "string",
                        enum: ["AVAILABLE", "FULL", "MAINTENANCE"],
                        example: "AVAILABLE",
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-04T19:36:48.284Z",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-06T10:27:17.934Z",
                      },
                    },
                  },
                },
              },
              example: {
                success: true,
                statusCode: 200,
                message: "Room updated successfully.",
                data: {
                  id: "39be9752-d686-4afc-88a8-77d42c19b6df",
                  hostelId: "001552a0-092e-46c2-bee7-99bd71119f12",
                  roomNumber: "A02",
                  capacity: 6,
                  status: "AVAILABLE",
                  createdAt: "2026-09-04T19:36:48.284Z",
                  updatedAt: "2026-09-06T10:27:17.934Z",
                },
              },
            },
          },
        },

        "400": {
          description: "Invalid room update data.",
        },

        "401": {
          description: "Authentication required.",
        },

        "403": {
          description: "You do not have permission to update a room.",
        },

        "404": {
          description: "Room not found.",
        },

        "409": {
          description:
            "A room with the supplied room number already exists in this hostel.",
        },
      },
    },

    {
      method: "patch",
      path: "/api/admin/room/deactivate-room/{roomId}",
      summary: "Deactivate a room",
      description:
        "Deactivates an existing room by changing its status to MAINTENANCE. The room's hostel, room number, and capacity remain unchanged.",
      tags: ["Room"],
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "roomId",
          in: "path",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "The unique ID of the room to deactivate.",
        },
      ],

      responses: {
        "200": {
          description: "Room deactivated successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Room deactivated successfully.",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        format: "uuid",
                        example: "39be9752-d686-4afc-88a8-77d42c19b6df",
                      },
                      hostelId: {
                        type: "string",
                        format: "uuid",
                        example: "001552a0-092e-46c2-bee7-99bd71119f12",
                      },
                      roomNumber: {
                        type: "string",
                        example: "A02",
                      },
                      capacity: {
                        type: "integer",
                        example: 6,
                      },
                      status: {
                        type: "string",
                        enum: ["AVAILABLE", "FULL", "MAINTENANCE"],
                        example: "MAINTENANCE",
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-04T19:36:48.284Z",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-06T11:06:00.416Z",
                      },
                    },
                  },
                },
              },
              example: {
                success: true,
                statusCode: 200,
                message: "Room deactivated successfully.",
                data: {
                  id: "39be9752-d686-4afc-88a8-77d42c19b6df",
                  hostelId: "001552a0-092e-46c2-bee7-99bd71119f12",
                  roomNumber: "A02",
                  capacity: 6,
                  status: "MAINTENANCE",
                  createdAt: "2026-09-04T19:36:48.284Z",
                  updatedAt: "2026-09-06T11:06:00.416Z",
                },
              },
            },
          },
        },

        "401": {
          description: "Authentication required.",
        },

        "403": {
          description: "You do not have permission to deactivate a room.",
        },

        "404": {
          description: "Room not found.",
        },
      },
    },

    {
      method: "patch",
      path: "/api/admin/room/{roomId}/activate",
      summary: "Activate a room",
      description:
        "Activates an existing room by changing its status to AVAILABLE.",
      tags: ["Room"],
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "roomId",
          in: "path",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "The unique ID of the room to activate.",
        },
      ],

      responses: {
        "200": {
          description: "Room activated successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Room activated successfully.",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        format: "uuid",
                        example: "39be9752-d686-4afc-88a8-77d42c19b6df",
                      },
                      hostelId: {
                        type: "string",
                        format: "uuid",
                        example: "001552a0-092e-46c2-bee7-99bd71119f12",
                      },
                      roomNumber: {
                        type: "string",
                        example: "A02",
                      },
                      capacity: {
                        type: "integer",
                        example: 6,
                      },
                      status: {
                        type: "string",
                        enum: ["AVAILABLE", "FULL", "MAINTENANCE"],
                        example: "AVAILABLE",
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-04T19:36:48.284Z",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-06T11:13:32.180Z",
                      },
                    },
                  },
                },
              },
              example: {
                success: true,
                statusCode: 200,
                message: "Room activated successfully.",
                data: {
                  id: "39be9752-d686-4afc-88a8-77d42c19b6df",
                  hostelId: "001552a0-092e-46c2-bee7-99bd71119f12",
                  roomNumber: "A02",
                  capacity: 6,
                  status: "AVAILABLE",
                  createdAt: "2026-09-04T19:36:48.284Z",
                  updatedAt: "2026-09-06T11:13:32.180Z",
                },
              },
            },
          },
        },

        "401": {
          description: "Authentication required.",
        },

        "403": {
          description: "You do not have permission to activate a room.",
        },

        "404": {
          description: "Room not found.",
        },
      },
    },
  ],

  [
    {
      method: "post",
      path: "/api/admin/create-bed",
      summary: "Create a bed",
      description:
        "Creates a new bed under an existing room. The bed is created with AVAILABLE status by default. The room must have available bed capacity, and duplicate bed numbers within the same room are not allowed.",
      tags: ["Bed"],
      security: [{ bearerAuth: [] }],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["roomId", "bedNumber"],
              properties: {
                roomId: {
                  type: "string",
                  description: "ID of the room where the bed will be created.",
                  example: "34ed2e46-2fca-4c40-b12a-0dc84f45881c",
                },
                bedNumber: {
                  type: "string",
                  description: "Bed number within the room.",
                  example: "B2",
                },
              },
            },
          },
        },
      },

      responses: {
        "201": {
          description: "Bed created successfully.",
          content: {
            "application/json": {
              example: {
                success: true,
                statusCode: 201,
                message: "Bed created successfully.",
                data: {
                  id: "0fd45fa1-a6cf-4327-a6ff-1630516b2fe0",
                  roomId: "34ed2e46-2fca-4c40-b12a-0dc84f45881c",
                  bedNumber: "B2",
                  status: "AVAILABLE",
                  createdAt: "2026-09-06T13:50:24.384Z",
                  updatedAt: "2026-09-06T13:50:24.384Z",
                },
              },
            },
          },
        },

        "400": {
          description: "Invalid request data.",
        },

        "401": {
          description: "Authentication required or token is invalid/expired.",
        },

        "403": {
          description: "User does not have permission to create a bed.",
        },

        "404": {
          description: "Room not found.",
          content: {
            "application/json": {
              example: {
                success: false,
                statusCode: 404,
                message: "Room not found.",
                data: null,
                code: "ROOM_NOT_FOUND",
              },
            },
          },
        },

        "409": {
          description:
            "Room has reached its bed capacity or the bed number already exists in the room.",
          content: {
            "application/json": {
              examples: {
                capacityReached: {
                  summary: "Room bed capacity reached",
                  value: {
                    success: false,
                    statusCode: 409,
                    message: "This room has reached its bed capacity.",
                    data: null,
                    code: "ROOM_BED_CAPACITY_REACHED",
                  },
                },
                duplicateBed: {
                  summary: "Duplicate bed number",
                  value: {
                    success: false,
                    statusCode: 409,
                    message:
                      "A bed with this number already exists in this room.",
                    data: null,
                    code: "BED_ALREADY_EXISTS",
                  },
                },
              },
            },
          },
        },
      },
    },

    {
      path: "/api/admin/bed/get-all-bed",
      method: "get",
      summary: "Get all beds",
      description:
        "Retrieves all beds together with the rooms and hostels they belong to. This endpoint is restricted to administrators.",
      tags: ["Bed"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Beds retrieved successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Beds retrieved successfully.",
                  },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          format: "uuid",
                        },
                        roomId: {
                          type: "string",
                          format: "uuid",
                        },
                        bedNumber: {
                          type: "string",
                          example: "B2",
                        },
                        status: {
                          type: "string",
                          enum: [
                            "AVAILABLE",
                            "OCCUPIED",
                            "RESERVED",
                            "MAINTENANCE",
                          ],
                          example: "AVAILABLE",
                        },
                        createdAt: {
                          type: "string",
                          format: "date-time",
                        },
                        updatedAt: {
                          type: "string",
                          format: "date-time",
                        },
                        room: {
                          type: "object",
                          properties: {
                            id: {
                              type: "string",
                              format: "uuid",
                            },
                            hostelId: {
                              type: "string",
                              format: "uuid",
                            },
                            roomNumber: {
                              type: "string",
                              example: "A03",
                            },
                            capacity: {
                              type: "integer",
                              example: 4,
                            },
                            status: {
                              type: "string",
                              enum: ["AVAILABLE", "FULL", "MAINTENANCE"],
                              example: "AVAILABLE",
                            },
                            createdAt: {
                              type: "string",
                              format: "date-time",
                            },
                            updatedAt: {
                              type: "string",
                              format: "date-time",
                            },
                            hostel: {
                              type: "object",
                              properties: {
                                id: {
                                  type: "string",
                                  format: "uuid",
                                },
                                name: {
                                  type: "string",
                                  example: "Hall abu",
                                },
                                gender: {
                                  type: "string",
                                  enum: ["MALE", "FEMALE"],
                                  example: "MALE",
                                },
                                status: {
                                  type: "string",
                                  enum: ["ACTIVE", "INACTIVE"],
                                  example: "INACTIVE",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              example: {
                success: true,
                statusCode: 200,
                message: "Beds retrieved successfully.",
                data: [
                  {
                    id: "0fd45fa1-a6cf-4327-a6ff-1630516b2fe0",
                    roomId: "34ed2e46-2fca-4c40-b12a-0dc84f45881c",
                    bedNumber: "B2",
                    status: "AVAILABLE",
                    createdAt: "2026-09-06T13:50:24.384Z",
                    updatedAt: "2026-09-06T13:50:24.384Z",
                    room: {
                      id: "34ed2e46-2fca-4c40-b12a-0dc84f45881c",
                      hostelId: "001552a0-092e-46c2-bee7-99bd71119f12",
                      roomNumber: "A03",
                      capacity: 4,
                      status: "AVAILABLE",
                      createdAt: "2026-09-06T13:46:13.029Z",
                      updatedAt: "2026-09-06T13:46:13.029Z",
                      hostel: {
                        id: "001552a0-092e-46c2-bee7-99bd71119f12",
                        name: "Hall abu",
                        gender: "MALE",
                        status: "INACTIVE",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        401: {
          description: "Authentication required or token is invalid/expired.",
        },
        403: {
          description: "User does not have permission to perform this action.",
        },
      },
    },

    {
      path: "/api/user/bed/{bedId}",
      method: "get",
      summary: "Get bed by ID",
      description:
        "Retrieves a single bed together with the room and hostel it belongs to. This endpoint is available to authenticated users, including administrators.",
      tags: ["Bed"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "bedId",
          in: "path",
          required: true,
          description: "The unique ID of the bed.",
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        200: {
          description: "Bed retrieved successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Bed retrieved successfully.",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        format: "uuid",
                      },
                      roomId: {
                        type: "string",
                        format: "uuid",
                      },
                      bedNumber: {
                        type: "string",
                        example: "B2",
                      },
                      status: {
                        type: "string",
                        enum: [
                          "AVAILABLE",
                          "OCCUPIED",
                          "RESERVED",
                          "MAINTENANCE",
                        ],
                        example: "AVAILABLE",
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                      },
                      room: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                            format: "uuid",
                          },
                          hostelId: {
                            type: "string",
                            format: "uuid",
                          },
                          roomNumber: {
                            type: "string",
                            example: "A03",
                          },
                          capacity: {
                            type: "integer",
                            example: 4,
                          },
                          status: {
                            type: "string",
                            enum: ["AVAILABLE", "FULL", "MAINTENANCE"],
                            example: "AVAILABLE",
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                          },
                          hostel: {
                            type: "object",
                            properties: {
                              id: {
                                type: "string",
                                format: "uuid",
                              },
                              name: {
                                type: "string",
                                example: "Hall abu",
                              },
                              gender: {
                                type: "string",
                                enum: ["MALE", "FEMALE"],
                                example: "MALE",
                              },
                              status: {
                                type: "string",
                                enum: ["ACTIVE", "INACTIVE"],
                                example: "INACTIVE",
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              example: {
                success: true,
                statusCode: 200,
                message: "Bed retrieved successfully.",
                data: {
                  id: "0fd45fa1-a6cf-4327-a6ff-1630516b2fe0",
                  roomId: "34ed2e46-2fca-4c40-b12a-0dc84f45881c",
                  bedNumber: "B2",
                  status: "AVAILABLE",
                  createdAt: "2026-09-06T13:50:24.384Z",
                  updatedAt: "2026-09-06T13:50:24.384Z",
                  room: {
                    id: "34ed2e46-2fca-4c40-b12a-0dc84f45881c",
                    hostelId: "001552a0-092e-46c2-bee7-99bd71119f12",
                    roomNumber: "A03",
                    capacity: 4,
                    status: "AVAILABLE",
                    createdAt: "2026-09-06T13:46:13.029Z",
                    updatedAt: "2026-09-06T13:46:13.029Z",
                    hostel: {
                      id: "001552a0-092e-46c2-bee7-99bd71119f12",
                      name: "Hall abu",
                      gender: "MALE",
                      status: "INACTIVE",
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Authentication required or token is invalid/expired.",
        },
        404: {
          description: "Bed not found.",
        },
      },
    },

    {
      path: "/api/admin/bed/update-bed/{bedId}",
      method: "patch",
      summary: "Update bed",
      description:
        "Updates the bed number of an existing bed. The bed status cannot be changed through this endpoint.",
      tags: ["Bed"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "bedId",
          in: "path",
          required: true,
          description: "The unique ID of the bed.",
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["bedNumber"],
              properties: {
                bedNumber: {
                  type: "string",
                  maxLength: 20,
                  example: "B5",
                },
              },
            },
            example: {
              bedNumber: "B5",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Bed updated successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Bed updated successfully.",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        format: "uuid",
                      },
                      roomId: {
                        type: "string",
                        format: "uuid",
                      },
                      bedNumber: {
                        type: "string",
                        example: "B5",
                      },
                      status: {
                        type: "string",
                        enum: [
                          "AVAILABLE",
                          "OCCUPIED",
                          "RESERVED",
                          "MAINTENANCE",
                        ],
                        example: "AVAILABLE",
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                      },
                    },
                  },
                },
              },
              example: {
                success: true,
                statusCode: 200,
                message: "Bed updated successfully.",
                data: {
                  id: "0fd45fa1-a6cf-4327-a6ff-1630516b2fe0",
                  roomId: "34ed2e46-2fca-4c40-b12a-0dc84f45881c",
                  bedNumber: "B5",
                  status: "AVAILABLE",
                  createdAt: "2026-09-06T13:50:24.384Z",
                  updatedAt: "2026-09-06T15:42:31.449Z",
                },
              },
            },
          },
        },
        400: {
          description: "Invalid bed update data.",
        },
        401: {
          description: "Authentication required or token is invalid/expired.",
        },
        403: {
          description: "User does not have permission to perform this action.",
        },
        404: {
          description: "Bed not found.",
        },
        409: {
          description: "A bed with this number already exists in this room.",
        },
      },
    },
  ],

  [
    {
      path: "/api/user/student/profile",
      method: "get",
      summary: "Get student profile",
      description:
        "Retrieves the profile of the currently authenticated student, including personal information, academic level, gender, school fee details, and hostel allocation information when available.",
      tags: ["Student"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Student profile retrieved successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Student profile retrieved successfully.",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        format: "uuid",
                      },
                      registrationNo: {
                        type: "string",
                        example: "2024/685993",
                      },
                      firstName: {
                        type: "string",
                        example: "Angelo",
                      },
                      lastName: {
                        type: "string",
                        example: "Flitz",
                      },
                      email: {
                        type: "string",
                        format: "email",
                        example: "angelo@example.com",
                      },
                      academicLevel: {
                        type: "string",
                        enum: [
                          "LEVEL_100",
                          "LEVEL_200",
                          "LEVEL_300",
                          "LEVEL_400",
                          "LEVEL_500",
                          "LEVEL_600",
                        ],
                        example: "LEVEL_600",
                      },
                      gender: {
                        type: "string",
                        nullable: true,
                        enum: ["MALE", "FEMALE"],
                        example: "MALE",
                      },
                      schoolFee: {
                        type: "object",
                        nullable: true,
                        properties: {
                          status: {
                            type: "string",
                            enum: ["PAID", "NOT_PAID"],
                            example: "PAID",
                          },
                          rrr: {
                            type: "string",
                            nullable: true,
                            example: "RRR-2025-606986",
                          },
                        },
                      },
                      allocation: {
                        type: "object",
                        nullable: true,
                        properties: {
                          hostel: {
                            type: "object",
                            properties: {
                              id: {
                                type: "string",
                                format: "uuid",
                              },
                              name: {
                                type: "string",
                                example: "Hall abu",
                              },
                              gender: {
                                type: "string",
                                enum: ["MALE", "FEMALE"],
                                example: "MALE",
                              },
                              status: {
                                type: "string",
                                enum: ["ACTIVE", "INACTIVE"],
                                example: "ACTIVE",
                              },
                            },
                          },
                          room: {
                            type: "object",
                            properties: {
                              id: {
                                type: "string",
                                format: "uuid",
                              },
                              roomNumber: {
                                type: "string",
                                example: "A03",
                              },
                              capacity: {
                                type: "integer",
                                example: 4,
                              },
                            },
                          },
                          bed: {
                            type: "object",
                            properties: {
                              id: {
                                type: "string",
                                format: "uuid",
                              },
                              bedNumber: {
                                type: "string",
                                example: "B2",
                              },
                              status: {
                                type: "string",
                                enum: [
                                  "AVAILABLE",
                                  "OCCUPIED",
                                  "RESERVED",
                                  "MAINTENANCE",
                                ],
                                example: "OCCUPIED",
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              example: {
                success: true,
                statusCode: 200,
                message: "Student profile retrieved successfully.",
                data: {
                  id: "e36c239c-c012-4a1f-90b7-b4e760f7b943",
                  registrationNo: "2024/685993",
                  firstName: "Angelo",
                  lastName: "Flitz",
                  email: "angelo@example.com",
                  academicLevel: "LEVEL_600",
                  gender: "MALE",
                  schoolFee: {
                    status: "PAID",
                    rrr: "RRR-2025-606986",
                  },
                  allocation: null,
                },
              },
            },
          },
        },
        401: {
          description: "Authentication required or token is invalid/expired.",
        },
        404: {
          description: "Student profile not found.",
        },
      },
    },
  ],

  [
    {
      path: "/api/user/bank-account/create",
      method: "post",
      summary: "Create bank account",
      description:
        "Creates a bank account for the currently authenticated user. The user supplies only a unique 12-digit account number. The user ID is obtained from the authenticated request, while the account type is set to STUDENT and the initial balance is set to 0.",
      tags: ["Bank Account"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["accountNumber"],
              properties: {
                accountNumber: {
                  type: "string",
                  pattern: "^\\d{12}$",
                  example: "123456789012",
                  description:
                    "A unique account number containing exactly 12 digits.",
                },
              },
            },
            example: {
              accountNumber: "123456789012",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Bank account created successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 201,
                  },
                  message: {
                    type: "string",
                    example: "Bank account created successfully.",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        format: "uuid",
                      },
                      userId: {
                        type: "string",
                        format: "uuid",
                      },
                      accountNumber: {
                        type: "string",
                        example: "123456789012",
                      },
                      type: {
                        type: "string",
                        enum: ["STUDENT", "ADMIN"],
                        example: "STUDENT",
                      },
                      balance: {
                        type: "string",
                        example: "0",
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                      },
                    },
                  },
                },
              },
              example: {
                success: true,
                statusCode: 201,
                message: "Bank account created successfully.",
                data: {
                  id: "b3e52424-1f15-4600-97ab-27978e28ae66",
                  userId: "de69090d-f52f-4f54-8667-bc21a14904ac",
                  accountNumber: "123456789012",
                  type: "STUDENT",
                  balance: "0",
                  createdAt: "2026-09-06T18:48:16.265Z",
                  updatedAt: "2026-09-06T18:48:16.265Z",
                },
              },
            },
          },
        },
        400: {
          description:
            "Invalid request. The account number must contain exactly 12 digits.",
        },
        401: {
          description: "Authentication required or token is invalid/expired.",
        },
        409: {
          description:
            "The user already has a bank account or the account number is already in use.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  statusCode: {
                    type: "integer",
                    example: 409,
                  },
                  message: {
                    type: "string",
                  },
                  data: {
                    type: "null",
                    example: null,
                  },
                  code: {
                    type: "string",
                    enum: [
                      "BANK_ACCOUNT_ALREADY_EXISTS",
                      "ACCOUNT_NUMBER_ALREADY_EXISTS",
                    ],
                  },
                },
              },
              examples: {
                accountAlreadyExists: {
                  summary: "User already has a bank account",
                  value: {
                    success: false,
                    statusCode: 409,
                    message: "You already have a bank account.",
                    data: null,
                    code: "BANK_ACCOUNT_ALREADY_EXISTS",
                  },
                },
                accountNumberAlreadyExists: {
                  summary: "Account number already exists",
                  value: {
                    success: false,
                    statusCode: 409,
                    message: "This account number is already in use.",
                    data: null,
                    code: "ACCOUNT_NUMBER_ALREADY_EXISTS",
                  },
                },
              },
            },
          },
        },
      },
    },

    {
      path: "/api/user/get-user/bank-account",
      method: "get",
      summary: "Get user's bank account",
      description:
        "Retrieves the bank account belonging to the currently authenticated user. The user ID is obtained from the authenticated request and is not supplied by the client.",
      tags: ["Bank Account"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Bank account retrieved successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Bank account retrieved successfully.",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        format: "uuid",
                      },
                      userId: {
                        type: "string",
                        format: "uuid",
                      },
                      accountNumber: {
                        type: "string",
                        example: "123456789012",
                      },
                      type: {
                        type: "string",
                        enum: ["STUDENT", "ADMIN"],
                        example: "STUDENT",
                      },
                      balance: {
                        type: "string",
                        example: "0",
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                      },
                    },
                  },
                },
              },
              example: {
                success: true,
                statusCode: 200,
                message: "Bank account retrieved successfully.",
                data: {
                  id: "b3e52424-1f15-4600-97ab-27978e28ae66",
                  userId: "de69090d-f52f-4f54-8667-bc21a14904ac",
                  accountNumber: "123456789012",
                  type: "STUDENT",
                  balance: "0",
                  createdAt: "2026-09-06T18:48:16.265Z",
                  updatedAt: "2026-09-06T18:48:16.265Z",
                },
              },
            },
          },
        },
        401: {
          description: "Authentication required or token is invalid/expired.",
        },
        404: {
          description: "Bank account not found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  statusCode: {
                    type: "integer",
                    example: 404,
                  },
                  message: {
                    type: "string",
                    example: "Bank account not found.",
                  },
                  data: {
                    type: "null",
                    example: null,
                  },
                  code: {
                    type: "string",
                    example: "BANK_ACCOUNT_NOT_FOUND",
                  },
                },
              },
            },
          },
        },
      },
    },

    {
      method: "post",
      path: "/api/admin/fund/bank-account",
      summary: "Fund a bank account",
      description:
        "Allows an administrator to add money to an existing bank account using the account number. The operation increases the account balance and creates a CREDIT transaction for audit purposes.",
      tags: ["Bank Account"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["accountNumber", "amount"],
              properties: {
                accountNumber: {
                  type: "string",
                  example: "123456789012",
                  description: "The 12-digit bank account number to fund.",
                },
                amount: {
                  type: "number",
                  example: 50000,
                  description: "The amount of money to add to the account.",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Bank account funded successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Bank account funded successfully.",
                  },
                  data: {
                    type: "object",
                    properties: {
                      bankAccount: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                            format: "uuid",
                            example: "b3e52424-1f15-4600-97ab-27978e28ae66",
                          },
                          userId: {
                            type: "string",
                            format: "uuid",
                            example: "de69090d-f52f-4f54-8667-bc21a14904ac",
                          },
                          accountNumber: {
                            type: "string",
                            example: "123456789012",
                          },
                          type: {
                            type: "string",
                            enum: ["STUDENT", "ADMIN"],
                            example: "STUDENT",
                          },
                          balance: {
                            type: "string",
                            example: "50000",
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-06T18:48:16.265Z",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-06T20:23:12.373Z",
                          },
                        },
                      },
                      transaction: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                            format: "uuid",
                            example: "30fee937-ae4e-4287-9f64-69a74d23e07f",
                          },
                          bankAccountId: {
                            type: "string",
                            format: "uuid",
                            example: "b3e52424-1f15-4600-97ab-27978e28ae66",
                          },
                          reference: {
                            type: "string",
                            example: "FUND-1788726192153-550053",
                          },
                          amount: {
                            type: "string",
                            example: "50000",
                          },
                          type: {
                            type: "string",
                            enum: ["CREDIT", "DEBIT"],
                            example: "CREDIT",
                          },
                          description: {
                            type: "string",
                            nullable: true,
                            example: "Bank account funded by administrator.",
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-06T20:23:12.567Z",
                          },
                        },
                      },
                    },
                  },
                },
              },
              example: {
                success: true,
                statusCode: 200,
                message: "Bank account funded successfully.",
                data: {
                  bankAccount: {
                    id: "b3e52424-1f15-4600-97ab-27978e28ae66",
                    userId: "de69090d-f52f-4f54-8667-bc21a14904ac",
                    accountNumber: "123456789012",
                    type: "STUDENT",
                    balance: "50000",
                    createdAt: "2026-09-06T18:48:16.265Z",
                    updatedAt: "2026-09-06T20:23:12.373Z",
                  },
                  transaction: {
                    id: "30fee937-ae4e-4287-9f64-69a74d23e07f",
                    bankAccountId: "b3e52424-1f15-4600-97ab-27978e28ae66",
                    reference: "FUND-1788726192153-550053",
                    amount: "50000",
                    type: "CREDIT",
                    description: "Bank account funded by administrator.",
                    createdAt: "2026-09-06T20:23:12.567Z",
                  },
                },
              },
            },
          },
        },

        401: {
          description: "Authentication required.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  statusCode: {
                    type: "integer",
                    example: 401,
                  },
                  message: {
                    type: "string",
                    example: "Authentication required.",
                  },
                  data: {
                    type: "null",
                    example: null,
                  },
                  code: {
                    type: "string",
                    example: "UNAUTHORIZED",
                  },
                },
              },
            },
          },
        },

        403: {
          description:
            "The authenticated user does not have administrator permission.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  statusCode: {
                    type: "integer",
                    example: 403,
                  },
                  message: {
                    type: "string",
                    example:
                      "You do not have permission to perform this action.",
                  },
                  data: {
                    type: "null",
                    example: null,
                  },
                  code: {
                    type: "string",
                    example: "FORBIDDEN",
                  },
                },
              },
            },
          },
        },

        404: {
          description: "Bank account not found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  statusCode: {
                    type: "integer",
                    example: 404,
                  },
                  message: {
                    type: "string",
                    example: "Bank account not found.",
                  },
                  data: {
                    type: "null",
                    example: null,
                  },
                  code: {
                    type: "string",
                    example: "BANK_ACCOUNT_NOT_FOUND",
                  },
                },
              },
            },
          },
        },
      },
    },
  ],

  [
    {
      method: "get",
      path: "/api/user/transaction",
      summary: "Get my transactions",
      description:
        "Retrieves all transactions belonging to the authenticated user's bank account, ordered from newest to oldest.",
      tags: ["TRANSACTION"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Transactions retrieved successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Transactions retrieved successfully.",
                  },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          format: "uuid",
                          example: "transaction-uuid",
                        },
                        bankAccountId: {
                          type: "string",
                          format: "uuid",
                          example: "bank-account-uuid",
                        },
                        reference: {
                          type: "string",
                          example: "TXN-20260906-001",
                        },
                        amount: {
                          type: "string",
                          example: "50000.00",
                        },
                        type: {
                          type: "string",
                          enum: ["CREDIT", "DEBIT"],
                          example: "CREDIT",
                        },
                        description: {
                          type: "string",
                          nullable: true,
                          example: "Account funded by administrator",
                        },
                        createdAt: {
                          type: "string",
                          format: "date-time",
                          example: "2026-09-06T19:00:00.000Z",
                        },
                      },
                    },
                    example: [
                      {
                        id: "transaction-uuid",
                        bankAccountId: "bank-account-uuid",
                        reference: "TXN-20260906-001",
                        amount: "50000.00",
                        type: "CREDIT",
                        description: "Account funded by administrator",
                        createdAt: "2026-09-06T19:00:00.000Z",
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Authentication required.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  statusCode: {
                    type: "integer",
                    example: 401,
                  },
                  message: {
                    type: "string",
                    example: "Authentication required.",
                  },
                  data: {
                    type: "null",
                    example: null,
                  },
                  code: {
                    type: "string",
                    example: "UNAUTHORIZED",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "The authenticated user does not have a bank account.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  statusCode: {
                    type: "integer",
                    example: 404,
                  },
                  message: {
                    type: "string",
                    example: "Bank account not found.",
                  },
                  data: {
                    type: "null",
                    example: null,
                  },
                  code: {
                    type: "string",
                    example: "BANK_ACCOUNT_NOT_FOUND",
                  },
                },
              },
            },
          },
        },
      },
    },
  ],

  [
    {
      method: "post",
      path: "/api/user/hostel-application",
      summary: "Submit hostel application",
      description:
        "Allows an authenticated student to submit a hostel application by selecting a hostel. Room and bed selection are handled later by the allocation process.",
      tags: ["HOSTEL APPLICATION"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["hostelId"],
              properties: {
                hostelId: {
                  type: "string",
                  format: "uuid",
                  example: "5d99cded-e98d-411e-ac6c-e4db15a7abd2",
                },
              },
            },
            example: {
              hostelId: "5d99cded-e98d-411e-ac6c-e4db15a7abd2",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Hostel application submitted successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 201,
                  },
                  message: {
                    type: "string",
                    example: "Hostel application submitted successfully.",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        format: "uuid",
                        example: "8d01110c-3a96-4dbd-aa1a-c5075b997afb",
                      },
                      studentId: {
                        type: "string",
                        format: "uuid",
                        example: "e36c239c-c012-4a1f-90b7-b4e760f7b943",
                      },
                      hostelId: {
                        type: "string",
                        format: "uuid",
                        example: "5d99cded-e98d-411e-ac6c-e4db15a7abd2",
                      },
                      submittedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-09T21:58:53.497Z",
                      },
                      status: {
                        type: "string",
                        enum: [
                          "PENDING",
                          "ELIGIBLE",
                          "ALLOCATED",
                          "EXPIRED",
                          "CANCELLED",
                        ],
                        example: "PENDING",
                      },
                      paymentDeadline: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                        example: null,
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-09T21:58:53.497Z",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-09T21:58:53.497Z",
                      },
                      hostel: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                            format: "uuid",
                            example: "5d99cded-e98d-411e-ac6c-e4db15a7abd2",
                          },
                          name: {
                            type: "string",
                            example: "Hall Aa",
                          },
                          gender: {
                            type: "string",
                            enum: ["MALE", "FEMALE"],
                            example: "MALE",
                          },
                          status: {
                            type: "string",
                            enum: ["ACTIVE", "INACTIVE"],
                            example: "ACTIVE",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Invalid hostel selection or student eligibility data.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  statusCode: {
                    type: "integer",
                    example: 400,
                  },
                  message: {
                    type: "string",
                    example:
                      "The selected hostel is not available for your gender.",
                  },
                  data: {
                    type: "null",
                    example: null,
                  },
                  code: {
                    type: "string",
                    example: "HOSTEL_GENDER_MISMATCH",
                  },
                },
              },
            },
          },
        },

        401: {
          description: "Authentication required.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  statusCode: {
                    type: "integer",
                    example: 401,
                  },
                  message: {
                    type: "string",
                    example: "Authentication required.",
                  },
                  data: {
                    type: "null",
                    example: null,
                  },
                  code: {
                    type: "string",
                    example: "UNAUTHORIZED",
                  },
                },
              },
            },
          },
        },

        404: {
          description: "Student or hostel not found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  statusCode: {
                    type: "integer",
                    example: 404,
                  },
                  message: {
                    type: "string",
                    example: "Hostel not found.",
                  },
                  data: {
                    type: "null",
                    example: null,
                  },
                  code: {
                    type: "string",
                    example: "HOSTEL_NOT_FOUND",
                  },
                },
              },
            },
          },
        },

        409: {
          description: "The student already has an active hostel application.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  statusCode: {
                    type: "integer",
                    example: 409,
                  },
                  message: {
                    type: "string",
                    example: "You already have an active hostel application.",
                  },
                  data: {
                    type: "null",
                    example: null,
                  },
                  code: {
                    type: "string",
                    example: "ACTIVE_APPLICATION_EXISTS",
                  },
                },
              },
            },
          },
        },
      },
    },
  ],

  [
    {
      method: "post",
      path: "/api/user/allocation",
      summary: "Reserve a bed",
      description:
        "Allows an authenticated student with an eligible hostel application to reserve an available bed in the selected hostel. Allocation follows FCFS scheduling, and the system automatically selects the available room and bed. The reservation remains valid for 48 hours.",
      tags: ["ALLOCATION"],
      security: [{ bearerAuth: [] }],
      responses: {
        201: {
          description: "Bed reserved successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 201,
                  },
                  message: {
                    type: "string",
                    example: "Bed reserved successfully.",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        format: "uuid",
                        example: "32a9eece-3571-47a6-bea7-79f8e55385a1",
                      },
                      studentId: {
                        type: "string",
                        format: "uuid",
                        example: "e36c239c-c012-4a1f-90b7-b4e760f7b943",
                      },
                      applicationId: {
                        type: "string",
                        format: "uuid",
                        example: "dd907028-6737-4dce-8501-c31e1da09502",
                      },
                      bedId: {
                        type: "string",
                        format: "uuid",
                        example: "a54ad409-c355-4e4e-8ffc-1adfc4d8172f",
                      },
                      status: {
                        type: "string",
                        enum: ["RESERVED", "ACTIVE", "CANCELLED"],
                        example: "RESERVED",
                      },
                      reservedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-11T15:41:52.109Z",
                      },
                      expiresAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-13T15:41:52.109Z",
                      },
                      allocatedAt: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                        example: null,
                      },
                      cancelledAt: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                        example: null,
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-11T15:41:52.516Z",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-11T15:41:52.516Z",
                      },
                      bed: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                            format: "uuid",
                            example: "a54ad409-c355-4e4e-8ffc-1adfc4d8172f",
                          },
                          bedNumber: {
                            type: "string",
                            example: "B1",
                          },
                          room: {
                            type: "object",
                            properties: {
                              id: {
                                type: "string",
                                format: "uuid",
                                example: "39be9752-d686-4afc-88a8-77d42c19b6df",
                              },
                              roomNumber: {
                                type: "string",
                                example: "A02",
                              },
                              hostel: {
                                type: "object",
                                properties: {
                                  id: {
                                    type: "string",
                                    format: "uuid",
                                    example:
                                      "001552a0-092e-46c2-bee7-99bd71119f12",
                                  },
                                  name: {
                                    type: "string",
                                    example: "Hall abu",
                                  },
                                  gender: {
                                    type: "string",
                                    enum: ["MALE", "FEMALE"],
                                    example: "MALE",
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            "The student is not eligible for allocation or does not have the required gender information.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  statusCode: {
                    type: "integer",
                    example: 400,
                  },
                  message: {
                    type: "string",
                    example: "You do not have an eligible hostel application.",
                  },
                  data: {
                    type: "null",
                    example: null,
                  },
                  code: {
                    type: "string",
                    example: "ELIGIBLE_APPLICATION_NOT_FOUND",
                  },
                },
              },
            },
          },
        },

        401: {
          description: "Authentication required.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  statusCode: {
                    type: "integer",
                    example: 401,
                  },
                  message: {
                    type: "string",
                    example: "Authentication required.",
                  },
                  data: {
                    type: "null",
                    example: null,
                  },
                  code: {
                    type: "string",
                    example: "UNAUTHORIZED",
                  },
                },
              },
            },
          },
        },

        404: {
          description: "Student not found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  statusCode: {
                    type: "integer",
                    example: 404,
                  },
                  message: {
                    type: "string",
                    example: "Student not found.",
                  },
                  data: {
                    type: "null",
                    example: null,
                  },
                  code: {
                    type: "string",
                    example: "STUDENT_NOT_FOUND",
                  },
                },
              },
            },
          },
        },

        409: {
          description:
            "The FCFS queue has not reached the student, the application already has an allocation, or no available bed exists.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  statusCode: {
                    type: "integer",
                    example: 409,
                  },
                  message: {
                    type: "string",
                    example:
                      "Another eligible application is ahead of you in the allocation queue.",
                  },
                  data: {
                    type: "null",
                    example: null,
                  },
                  code: {
                    type: "string",
                    example: "FCFS_QUEUE_NOT_REACHED",
                  },
                },
              },
            },
          },
        },
      },
    },
  ],

  [
    {
      method: "post",
      path: "/api/user/make/payment",
      summary: "Make hostel accommodation payment",
      description:
        "Allows an authenticated student with an eligible hostel application and an active 48-hour bed reservation to pay the hostel accommodation fee. The supplied RRR must belong to the student, and the payment amount must match the accommodation fee of the selected hostel. On successful payment, the student's bank account is debited, a debit transaction is created, the allocation becomes active, the reserved bed becomes occupied, the application becomes allocated, and a single-use check-in code valid for 14 days is generated.",
      tags: ["PAYMENT"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["rrr", "amount"],
              properties: {
                rrr: {
                  type: "string",
                  example: "1234567890",
                },
                amount: {
                  type: "number",
                  format: "double",
                  example: 10000,
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Hostel accommodation payment successful.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Hostel accommodation payment successful.",
                  },
                  data: {
                    type: "object",
                    properties: {
                      payment: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                            format: "uuid",
                            example: "bd29c431-398d-422a-a06a-25b5503d4d1b",
                          },
                          applicationId: {
                            type: "string",
                            format: "uuid",
                            example: "dd907028-6737-4dce-8501-c31e1da09502",
                          },
                          amount: {
                            type: "string",
                            example: "10000",
                          },
                          status: {
                            type: "string",
                            enum: ["PENDING", "PAID", "EXPIRED"],
                            example: "PAID",
                          },
                          paymentDeadline: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-13T15:41:52.109Z",
                          },
                          paidAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-12T22:43:31.511Z",
                          },
                          transactionId: {
                            type: "string",
                            format: "uuid",
                            example: "ec2e7b67-c976-498a-8331-aba960741a50",
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-12T22:43:32.235Z",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-12T22:43:32.235Z",
                          },
                        },
                      },

                      allocation: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                            format: "uuid",
                            example: "32a9eece-3571-47a6-bea7-79f8e55385a1",
                          },
                          studentId: {
                            type: "string",
                            format: "uuid",
                            example: "e36c239c-c012-4a1f-90b7-b4e760f7b943",
                          },
                          applicationId: {
                            type: "string",
                            format: "uuid",
                            example: "dd907028-6737-4dce-8501-c31e1da09502",
                          },
                          bedId: {
                            type: "string",
                            format: "uuid",
                            example: "a54ad409-c355-4e4e-8ffc-1adfc4d8172f",
                          },
                          status: {
                            type: "string",
                            enum: ["RESERVED", "ACTIVE", "CANCELLED"],
                            example: "ACTIVE",
                          },
                          reservedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-11T15:41:52.109Z",
                          },
                          expiresAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-13T15:41:52.109Z",
                          },
                          allocatedAt: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                            example: "2026-09-12T22:43:31.511Z",
                          },
                          cancelledAt: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                            example: null,
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-11T15:41:52.516Z",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-12T22:43:32.413Z",
                          },
                          bed: {
                            type: "object",
                            properties: {
                              id: {
                                type: "string",
                                format: "uuid",
                                example: "a54ad409-c355-4e4e-8ffc-1adfc4d8172f",
                              },
                              bedNumber: {
                                type: "string",
                                example: "B1",
                              },
                              room: {
                                type: "object",
                                properties: {
                                  id: {
                                    type: "string",
                                    format: "uuid",
                                    example:
                                      "39be9752-d686-4afc-88a8-77d42c19b6df",
                                  },
                                  roomNumber: {
                                    type: "string",
                                    example: "A02",
                                  },
                                  hostel: {
                                    type: "object",
                                    properties: {
                                      id: {
                                        type: "string",
                                        format: "uuid",
                                        example:
                                          "001552a0-092e-46c2-bee7-99bd71119f12",
                                      },
                                      name: {
                                        type: "string",
                                        example: "Hall abu",
                                      },
                                      gender: {
                                        type: "string",
                                        enum: ["MALE", "FEMALE"],
                                        example: "MALE",
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },

                      application: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                            format: "uuid",
                            example: "dd907028-6737-4dce-8501-c31e1da09502",
                          },
                          studentId: {
                            type: "string",
                            format: "uuid",
                            example: "e36c239c-c012-4a1f-90b7-b4e760f7b943",
                          },
                          hostelId: {
                            type: "string",
                            format: "uuid",
                            example: "001552a0-092e-46c2-bee7-99bd71119f12",
                          },
                          submittedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-11T15:40:42.913Z",
                          },
                          status: {
                            type: "string",
                            enum: [
                              "PENDING",
                              "ELIGIBLE",
                              "ALLOCATED",
                              "EXPIRED",
                              "CANCELLED",
                            ],
                            example: "ALLOCATED",
                          },
                          paymentDeadline: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                            example: null,
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-11T15:40:42.913Z",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-12T22:43:33.459Z",
                          },
                        },
                      },

                      checkIn: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                            format: "uuid",
                            example: "aa6338cd-7dd5-4577-9e72-c7a3f7b9dc42",
                          },
                          allocationId: {
                            type: "string",
                            format: "uuid",
                            example: "32a9eece-3571-47a6-bea7-79f8e55385a1",
                          },
                          code: {
                            type: "string",
                            example: "r-652-001",
                          },
                          status: {
                            type: "string",
                            enum: ["PENDING", "COMPLETED", "EXPIRED"],
                            example: "PENDING",
                          },
                          expiresAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-26T22:43:31.511Z",
                          },
                          usedAt: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                            example: null,
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-12T22:43:33.667Z",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-12T22:43:33.667Z",
                          },
                          studentId: {
                            type: "string",
                            format: "uuid",
                            nullable: true,
                            example: "e36c239c-c012-4a1f-90b7-b4e760f7b943",
                          },
                        },
                      },

                      bankAccount: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                            format: "uuid",
                            example: "b3e52424-1f15-4600-97ab-27978e28ae66",
                          },
                          userId: {
                            type: "string",
                            format: "uuid",
                            nullable: true,
                            example: "de69090d-f52f-4f54-8667-bc21a14904ac",
                          },
                          accountNumber: {
                            type: "string",
                            example: "123456789012",
                          },
                          type: {
                            type: "string",
                            enum: ["STUDENT", "ADMIN"],
                            example: "STUDENT",
                          },
                          balance: {
                            type: "string",
                            example: "40000",
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-06T18:48:16.265Z",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-12T22:43:31.845Z",
                          },
                        },
                      },

                      transaction: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                            format: "uuid",
                            example: "ec2e7b67-c976-498a-8331-aba960741a50",
                          },
                          bankAccountId: {
                            type: "string",
                            format: "uuid",
                            example: "b3e52424-1f15-4600-97ab-27978e28ae66",
                          },
                          reference: {
                            type: "string",
                            example:
                              "PAY-1789253011512-70d1ba61-1317-453b-af5a-1c5d6d16ecbd",
                          },
                          amount: {
                            type: "string",
                            example: "10000",
                          },
                          type: {
                            type: "string",
                            enum: ["CREDIT", "DEBIT"],
                            example: "DEBIT",
                          },
                          description: {
                            type: "string",
                            nullable: true,
                            example: "Hostel accommodation payment.",
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-09-12T22:43:32.041Z",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            "The RRR is invalid, the student has no eligible application or reservation, the reservation has expired or is inactive, the payment amount is incorrect, or the bank account has insufficient funds.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  statusCode: {
                    type: "integer",
                    example: 400,
                  },
                  message: {
                    type: "string",
                    example: "Invalid RRR.",
                  },
                  data: {
                    type: "null",
                    example: null,
                  },
                  code: {
                    type: "string",
                    example: "INVALID_RRR",
                  },
                },
              },
            },
          },
        },

        401: {
          description: "Authentication required.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  statusCode: {
                    type: "integer",
                    example: 401,
                  },
                  message: {
                    type: "string",
                    example: "Authentication required.",
                  },
                  data: {
                    type: "null",
                    example: null,
                  },
                  code: {
                    type: "string",
                    example: "UNAUTHORIZED",
                  },
                },
              },
            },
          },
        },

        404: {
          description:
            "The student or student's bank account could not be found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  statusCode: {
                    type: "integer",
                    example: 404,
                  },
                  message: {
                    type: "string",
                    example: "Student not found.",
                  },
                  data: {
                    type: "null",
                    example: null,
                  },
                  code: {
                    type: "string",
                    example: "STUDENT_NOT_FOUND",
                  },
                },
              },
            },
          },
        },
      },
    },
  ],

  [
    {
      method: "post",
      path: "/api/admin/check-in",
      summary: "Complete student check-in",
      description:
        "Allows an authenticated admin to complete a student's hostel check-in using the single-use check-in code generated after successful accommodation payment. The code must be valid, pending, and unexpired. The student's allocation must be active and the allocated bed must be reserved. On success, the bed becomes occupied and the check-in is marked as completed.",
      tags: ["CHECK-IN"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["code"],
              properties: {
                code: {
                  type: "string",
                  pattern: "^R-\\d{3}-\\d{3}$",
                  example: "R-678-458",
                  description: "The student's single-use check-in code.",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Student checked in successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Student checked in successfully.",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        example: "aa6338cd-7dd5-4577-9e72-c7a3f7b9dc42",
                      },
                      allocationId: {
                        type: "string",
                        example: "32a9eece-3571-47a6-bea7-79f8e55385a1",
                      },
                      code: {
                        type: "string",
                        example: "R-678-458",
                      },
                      status: {
                        type: "string",
                        example: "COMPLETED",
                      },
                      expiresAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-26T22:43:31.511Z",
                      },
                      usedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-14T00:05:25.530Z",
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-12T22:43:33.667Z",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-14T00:05:26.142Z",
                      },
                      studentId: {
                        type: "string",
                        example: "e36c239c-c012-4a1f-90b7-b4e760f7b943",
                      },
                      allocation: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                            example: "32a9eece-3571-47a6-bea7-79f8e55385a1",
                          },
                          status: {
                            type: "string",
                            example: "ACTIVE",
                          },
                          studentId: {
                            type: "string",
                            example: "e36c239c-c012-4a1f-90b7-b4e760f7b943",
                          },
                          bed: {
                            type: "object",
                            properties: {
                              id: {
                                type: "string",
                                example: "a54ad409-c355-4e4e-8ffc-1adfc4d8172f",
                              },
                              bedNumber: {
                                type: "string",
                                example: "B1",
                              },
                              status: {
                                type: "string",
                                example: "OCCUPIED",
                              },
                              room: {
                                type: "object",
                                properties: {
                                  id: {
                                    type: "string",
                                    example:
                                      "39be9752-d686-4afc-88a8-77d42c19b6df",
                                  },
                                  roomNumber: {
                                    type: "string",
                                    example: "A02",
                                  },
                                  hostel: {
                                    type: "object",
                                    properties: {
                                      id: {
                                        type: "string",
                                        example:
                                          "001552a0-092e-46c2-bee7-99bd71119f12",
                                      },
                                      name: {
                                        type: "string",
                                        example: "Hall abu",
                                      },
                                      gender: {
                                        type: "string",
                                        example: "MALE",
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            "Invalid check-in code, code already used, code expired, or allocation is not active.",
        },

        401: {
          description: "Authentication required or token is invalid.",
        },

        403: {
          description: "Only admins and superadmins can complete check-in.",
        },

        404: {
          description: "Check-in code or allocated bed was not found.",
        },

        409: {
          description: "The allocated bed is not reserved for check-in.",
        },
      },
    },
  ],

  [
    {
      method: "post",
      path: "/api/user/create/issues",
      summary: "Report an issue",
      description:
        "Allows an authenticated student to report an issue related to their hostel accommodation. The issue is automatically associated with the authenticated student and created with an OPEN status.",
      tags: ["ISSUE"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title", "description"],
              properties: {
                title: {
                  type: "string",
                  example: "Broken bathroom tap",
                  description: "The title of the reported issue.",
                },
                description: {
                  type: "string",
                  example: "The bathroom tap has been leaking for two days.",
                  description: "A detailed description of the reported issue.",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Issue reported successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 201,
                  },
                  message: {
                    type: "string",
                    example: "Issue reported successfully.",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        example: "2474f814-0ac3-42e2-8cab-cad75b2282e3",
                      },
                      studentId: {
                        type: "string",
                        example: "e36c239c-c012-4a1f-90b7-b4e760f7b943",
                      },
                      reportedById: {
                        type: "string",
                        example: "de69090d-f52f-4f54-8667-bc21a14904ac",
                      },
                      resolvedById: {
                        type: "string",
                        nullable: true,
                        example: null,
                      },
                      title: {
                        type: "string",
                        example: "Broken bathroom tap",
                      },
                      description: {
                        type: "string",
                        example:
                          "The bathroom tap has been leaking for two days.",
                      },
                      status: {
                        type: "string",
                        example: "OPEN",
                      },
                      resolvedAt: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                        example: null,
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-23T02:50:38.392Z",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-23T02:50:38.392Z",
                      },
                    },
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            "Invalid request data. The issue title and description are required.",
        },

        401: {
          description: "Authentication required or token is invalid.",
        },

        404: {
          description: "Student record was not found.",
        },
      },
    },

    {
      method: "get",
      path: "/api/user/my/issues",
      summary: "Get student's issues",
      description:
        "Allows an authenticated student to retrieve all issues they have reported. Each issue is returned with its complete issue information.",
      tags: ["ISSUE"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Issues retrieved successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Issues retrieved successfully.",
                  },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          example: "2474f814-0ac3-42e2-8cab-cad75b2282e3",
                        },
                        studentId: {
                          type: "string",
                          example: "e36c239c-c012-4a1f-90b7-b4e760f7b943",
                        },
                        reportedById: {
                          type: "string",
                          example: "de69090d-f52f-4f54-8667-bc21a14904ac",
                        },
                        resolvedById: {
                          type: "string",
                          nullable: true,
                          example: null,
                        },
                        title: {
                          type: "string",
                          example: "Broken bathroom tap",
                        },
                        description: {
                          type: "string",
                          example:
                            "The bathroom tap has been leaking for two days.",
                        },
                        status: {
                          type: "string",
                          example: "OPEN",
                        },
                        resolvedAt: {
                          type: "string",
                          format: "date-time",
                          nullable: true,
                          example: null,
                        },
                        createdAt: {
                          type: "string",
                          format: "date-time",
                          example: "2026-09-23T02:50:38.392Z",
                        },
                        updatedAt: {
                          type: "string",
                          format: "date-time",
                          example: "2026-09-23T02:50:38.392Z",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        401: {
          description: "Authentication required or token is invalid.",
        },

        404: {
          description: "Student record was not found.",
        },
      },
    },

    {
      method: "delete",
      path: "/api/user/delete/issue/{issueId}",
      summary: "Delete a reported issue",
      description:
        "Allows an authenticated student to delete their own reported issue only when the issue status is OPEN.",
      tags: ["ISSUE"],
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "issueId",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
          description: "The ID of the issue to delete.",
          example: "2474f814-0ac3-42e2-8cab-cad75b2282e3",
        },
      ],

      responses: {
        200: {
          description: "Issue deleted successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Issue deleted successfully.",
                  },
                  data: {
                    nullable: true,
                    example: null,
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Only issues with an OPEN status can be deleted.",
        },

        401: {
          description: "Authentication required or token is invalid.",
        },

        403: {
          description:
            "The authenticated student is not allowed to delete this issue.",
        },

        404: {
          description:
            "The issue or authenticated student's record was not found.",
        },
      },
    },

    {
      method: "get",
      path: "/api/admin/all/issues",
      summary: "Get all reported issues",
      description:
        "Allows an authenticated administrator to retrieve all issues reported by students. Each issue includes the student's name.",
      tags: ["ISSUE"],
      security: [{ bearerAuth: [] }],

      responses: {
        200: {
          description: "Issues retrieved successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Issues retrieved successfully.",
                  },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          example: "2474f814-0ac3-42e2-8cab-cad75b2282e3",
                        },
                        studentId: {
                          type: "string",
                          example: "e36c239c-c012-4a1f-90b7-b4e760f7b943",
                        },
                        reportedById: {
                          type: "string",
                          example: "de69090d-f52f-4f54-8667-bc21a14904ac",
                        },
                        resolvedById: {
                          type: "string",
                          nullable: true,
                          example: null,
                        },
                        title: {
                          type: "string",
                          example: "Broken bathroom tap",
                        },
                        description: {
                          type: "string",
                          example:
                            "The bathroom tap has been leaking for two days.",
                        },
                        status: {
                          type: "string",
                          example: "OPEN",
                        },
                        resolvedAt: {
                          type: "string",
                          format: "date-time",
                          nullable: true,
                          example: null,
                        },
                        createdAt: {
                          type: "string",
                          format: "date-time",
                          example: "2026-09-23T02:50:38.392Z",
                        },
                        updatedAt: {
                          type: "string",
                          format: "date-time",
                          example: "2026-09-23T02:50:38.392Z",
                        },
                        student: {
                          type: "object",
                          properties: {
                            user: {
                              type: "object",
                              properties: {
                                firstName: {
                                  type: "string",
                                  example: "John",
                                },
                                lastName: {
                                  type: "string",
                                  example: "Doe",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        401: {
          description: "Authentication required or token is invalid.",
        },

        403: {
          description: "Administrator privileges are required.",
        },
      },
    },

    {
      method: "get",
      path: "/api/admin/issues/{issueId}",
      summary: "Get a single issue",
      description:
        "Allows an authenticated administrator to retrieve a specific reported issue together with related student, reporter, and resolver information.",
      tags: ["ISSUE"],
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "issueId",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
          description: "The ID of the issue to retrieve.",
          example: "a720b47e-039e-4057-91bb-0206dce0437e",
        },
      ],

      responses: {
        200: {
          description: "Issue retrieved successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Issue retrieved successfully.",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        example: "a720b47e-039e-4057-91bb-0206dce0437e",
                      },
                      studentId: {
                        type: "string",
                        example: "e36c239c-c012-4a1f-90b7-b4e760f7b943",
                      },
                      reportedById: {
                        type: "string",
                        example: "de69090d-f52f-4f54-8667-bc21a14904ac",
                      },
                      resolvedById: {
                        type: "string",
                        nullable: true,
                        example: null,
                      },
                      title: {
                        type: "string",
                        example: "Broken bathroom tap",
                      },
                      description: {
                        type: "string",
                        example:
                          "The bathroom tap has been leaking for two days.",
                      },
                      status: {
                        type: "string",
                        example: "OPEN",
                      },
                      resolvedAt: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                        example: null,
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-24T06:31:55.512Z",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-24T06:31:55.512Z",
                      },

                      student: {
                        type: "object",
                        properties: {
                          user: {
                            type: "object",
                            properties: {
                              firstName: {
                                type: "string",
                                example: "Angelo",
                              },
                              lastName: {
                                type: "string",
                                example: "Flitz",
                              },
                            },
                          },
                        },
                      },

                      reportedBy: {
                        type: "object",
                        properties: {
                          firstName: {
                            type: "string",
                            example: "Angelo",
                          },
                          lastName: {
                            type: "string",
                            example: "Flitz",
                          },
                        },
                      },

                      resolvedBy: {
                        type: "object",
                        nullable: true,
                        properties: {
                          firstName: {
                            type: "string",
                            example: "Admin",
                          },
                          lastName: {
                            type: "string",
                            example: "User",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        401: {
          description: "Authentication required or token is invalid.",
        },

        403: {
          description: "Administrator privileges are required.",
        },

        404: {
          description: "Issue not found.",
        },
      },
    },

    {
      method: "patch",
      path: "/api/admin/issues/{issueId}/status",
      summary: "Update issue status",
      description:
        "Allows an authenticated administrator to update the status of a reported issue. Issue statuses must follow the defined lifecycle: OPEN → IN_PROGRESS → RESOLVED → CLOSED. When an issue is marked as RESOLVED, the resolving administrator and resolution time are automatically recorded.",
      tags: ["ISSUE"],
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "issueId",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
          description: "The ID of the issue to update.",
          example: "a720b47e-039e-4057-91bb-0206dce0437e",
        },
      ],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["status"],
              properties: {
                status: {
                  type: "string",
                  enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
                  example: "IN_PROGRESS",
                  description: "The new status for the issue.",
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: "Issue status updated successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Issue status updated successfully.",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        example: "a720b47e-039e-4057-91bb-0206dce0437e",
                      },
                      studentId: {
                        type: "string",
                        example: "e36c239c-c012-4a1f-90b7-b4e760f7b943",
                      },
                      reportedById: {
                        type: "string",
                        example: "de69090d-f52f-4f54-8667-bc21a14904ac",
                      },
                      resolvedById: {
                        type: "string",
                        nullable: true,
                        example: null,
                      },
                      title: {
                        type: "string",
                        example: "Broken bathroom tap",
                      },
                      description: {
                        type: "string",
                        example:
                          "The bathroom tap has been leaking for two days.",
                      },
                      status: {
                        type: "string",
                        example: "IN_PROGRESS",
                      },
                      resolvedAt: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                        example: null,
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-24T06:31:55.512Z",
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-24T09:40:57.272Z",
                      },
                    },
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            "Invalid status transition or the requested status is the same as the current status.",
        },

        401: {
          description: "Authentication required or token is invalid.",
        },

        403: {
          description: "Administrator privileges are required.",
        },

        404: {
          description: "Issue not found.",
        },
      },
    },

    {
      method: "delete",
      path: "/api/admin/issues/{issueId}",
      summary: "Delete an issue",
      description:
        "Allows an authenticated administrator to permanently delete a reported issue regardless of its current status.",
      tags: ["ISSUE"],
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "issueId",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
          description: "The ID of the issue to delete.",
          example: "a720b47e-039e-4057-91bb-0206dce0437e",
        },
      ],

      responses: {
        200: {
          description: "Issue deleted successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  statusCode: {
                    type: "integer",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    example: "Issue deleted successfully.",
                  },
                  data: {
                    type: "null",
                    example: null,
                  },
                },
              },
            },
          },
        },

        401: {
          description: "Authentication required or token is invalid.",
        },

        403: {
          description: "Administrator privileges are required.",
        },

        404: {
          description: "Issue not found.",
        },
      },
    },
  ],
] as const;
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
              required: ["name", "gender", "image"],
              properties: {
                name: { type: "string", minLength: 2, maxLength: 100 },
                description: { type: "string", maxLength: 1000 },
                gender: { type: "string", enum: ["MALE", "FEMALE"] },
                image: { type: "string", format: "binary" },
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
                name: { type: "string", minLength: 2, maxLength: 100 },
                description: { type: "string", maxLength: 1000 },
                gender: { type: "string", enum: ["MALE", "FEMALE"] },
                image: { type: "string", format: "binary" },
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

  
  [],
  [],
  [],
] as const;
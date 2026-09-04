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
  ],

  [],
  [],
  [],
  [],
  [],
] as const;
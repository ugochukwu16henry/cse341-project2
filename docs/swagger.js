const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Golobel Counselling App API",
      version: "1.0.0",
      description:
        "A comprehensive mental health counselling platform API with OAuth authentication",
      contact: {
        name: "API Support",
        email: "support@golobel.com",
      },
    },
    servers: [
      {
        url: process.env.RENDER_URL || "http://localhost:3000",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        googleOAuth: {
          type: "oauth2",
          flows: {
            authorizationCode: {
              authorizationUrl: "/api/auth/google",
              tokenUrl: "/api/auth/google/callback",
              scopes: {
                profile: "Access your profile information",
                email: "Access your email address",
              },
            },
          },
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["email", "firstName", "lastName"],
          properties: {
            _id: {
              type: "string",
              description: "User ID",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
            },
            firstName: {
              type: "string",
              description: "User first name",
            },
            lastName: {
              type: "string",
              description: "User last name",
            },
            phone: {
              type: "string",
              description: "User phone number",
            },
            dateOfBirth: {
              type: "string",
              format: "date",
              description: "User date of birth",
            },
            gender: {
              type: "string",
              enum: ["male", "female", "other", "prefer-not-to-say"],
              description: "User gender",
            },
            role: {
              type: "string",
              enum: ["client", "counsellor", "admin"],
              description: "User role",
            },
            isVerified: {
              type: "boolean",
              description: "Whether the user is verified",
            },
            profilePicture: {
              type: "string",
              description: "URL to user profile picture",
            },
            emergencyContact: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                phone: {
                  type: "string",
                },
                relationship: {
                  type: "string",
                },
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            lastLogin: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Appointment: {
          type: "object",
          required: ["client", "counsellor", "appointmentDate", "sessionType"],
          properties: {
            _id: {
              type: "string",
              description: "Appointment ID",
            },
            client: {
              $ref: "#/components/schemas/User",
            },
            counsellor: {
              type: "string",
              description: "Counsellor ID",
            },
            appointmentDate: {
              type: "string",
              format: "date-time",
              description: "Appointment date and time",
            },
            status: {
              type: "string",
              enum: [
                "scheduled",
                "confirmed",
                "in-progress",
                "completed",
                "cancelled",
                "no-show",
              ],
              description: "Appointment status",
            },
            sessionType: {
              type: "string",
              enum: ["video", "phone", "in-person", "chat"],
              description: "Type of counselling session",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointments");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);

// Basic routes
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Golobel Counselling API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Golobel Counselling API",
    version: "1.0.0",
    endpoints: {
      auth: {
        "POST /api/auth/register": "Register new user",
        "POST /api/auth/login": "Login user",
        "GET /api/auth/me": "Get current user (protected)",
      },
      appointments: {
        "GET /api/appointments": "Get user appointments (protected)",
        "POST /api/appointments": "Create appointment (protected)",
        "GET /api/appointments/:id": "Get single appointment (protected)",
      },
      health: {
        "GET /api/health": "API health check",
      },
    },
  });
});

// Handle 404
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
    availableRoutes: [
      "GET /",
      "GET /api/health",
      "POST /api/auth/register",
      "POST /api/auth/login",
      "GET /api/auth/me",
      "GET /api/appointments",
      "POST /api/appointments",
      "GET /api/appointments/:id",
    ],
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/api/health`);
  console.log(`📍 Register: http://localhost:${PORT}/api/auth/register`);
  console.log(`📍 Login: http://localhost:${PORT}/api/auth/login`);
});

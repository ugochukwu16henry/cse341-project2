require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/appointments", require("./routes/appointments"));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Golobel Counselling API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Root route
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
        "PUT /api/appointments/:id": "Update appointment (protected)",
        "DELETE /api/appointments/:id": "Delete appointment (protected)",
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
      "PUT /api/appointments/:id",
      "DELETE /api/appointments/:id",
    ],
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/api/health`);
});

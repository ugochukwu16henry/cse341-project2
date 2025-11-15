const express = require("express");
const router = express.Router();

// Import route modules
router.use("/api/games", require("./games"));
router.use("/api/reviews", require("./reviews"));

// API documentation route (serves the HTML page)
router.get("/", (req, res) => {
  res.sendFile("index.html", { root: "./public" });
});

// Health check endpoint
router.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Game Library API is running",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;

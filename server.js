const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("./middleware/oauth");
const { connectDB } = require("./db/connection");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// === Swagger Documentation (NEW) ===
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// ===================================

// Authentication Routes
app.use("/", require("./routes/auth"));

// API Routes
app.use("/api/books", require("./routes/books"));
app.use("/api/authors", require("./routes/authors"));

// Home route
app.get("/", (req, res) => {
  const isLoggedIn = req.isAuthenticated ? req.isAuthenticated() : false;
  res.json({
    message: "Library Management API",
    status: isLoggedIn ? "Authenticated" : "Unauthenticated",
    documentation: "/api-docs", // NEW: Link to Swagger docs
    endpoints: {
      books: "/api/books",
      authors: "/api/authors",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(
      `API Documentation available at http://localhost:${PORT}/api-docs`
    );
  });
});

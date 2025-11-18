const express = require("express");
const cors = require("cors");
const session = require("express-session"); // <--- NEW
const passport = require("passport"); // <--- NEW
require("./middleware/oauth"); // <--- NEW: Import OAuth strategy setup
const { connectDB } = require("./db/connection");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: "*", // Adjust for production security
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Crucial for sessions/cookies
  })
);
app.use(express.json());

// Session Middleware (NEW)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Passport Initialization (NEW)
app.use(passport.initialize());
app.use(passport.session());

// === Authentication Routes (NEW) ===
app.use("/", require("./routes/auth"));
// ===================================

// Routes
app.use("/api/books", require("./routes/books"));
app.use("/api/authors", require("./routes/authors"));

// Home route
app.get("/", (req, res) => {
  // Check if user is logged in
  const isLoggedIn = req.isAuthenticated ? req.isAuthenticated() : false;
  res.json({
    message: "Library Management API",
    status: isLoggedIn ? "Authenticated" : "Unauthenticated",
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
  });
});

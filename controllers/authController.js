const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// Generate JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register new user
const register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, password, firstName, lastName, phone } = req.body;

    // For now, just return success without database
    const token = signToken("mock-user-id");

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: "mock-user-id",
          email: email,
          firstName: firstName,
          lastName: lastName,
          role: "client",
        },
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating user account",
      error: error.message,
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // For now, just return success without database validation
    const token = signToken("mock-user-id");

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: "mock-user-id",
          email: email,
          firstName: "Test",
          lastName: "User",
          role: "client",
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: error.message,
    });
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: "mock-user-id",
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
          role: "client",
        },
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user data",
      error: error.message,
    });
  }
};

// Export functions
module.exports = {
  register,
  login,
  getMe,
};

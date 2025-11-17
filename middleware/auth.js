const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    // For now, just verify the token exists and continue
    // In a real app, you would verify the JWT and get user from database
    req.user = {
      id: "mock-user-id",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      role: "client",
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

module.exports = {
  protect,
};

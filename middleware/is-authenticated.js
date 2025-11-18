const isAuthenticated = (req, res, next) => {
  // Passport adds isAuthenticated() to the request object
  if (req.isAuthenticated()) {
    return next(); // User is logged in, proceed to the route handler
  }

  // User is not logged in, return a 401 Unauthorized status
  res.status(401).json({
    message: "Authentication required to access this endpoint. Please log in.",
    login_url: `${
      process.env.RENDER_URL || "http://localhost:3000"
    }/auth/google`,
  });
};

module.exports = { isAuthenticated };

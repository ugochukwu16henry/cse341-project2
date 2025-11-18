const express = require("express");
const router = express.Router();
const passport = require("passport");

// 1. Start Google OAuth login flow
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2. Google OAuth callback (where Google sends the user back)
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: true,
  }),
  (req, res) => {
    // Successful authentication, redirect to the home page or dashboard
    res.redirect("/");
  }
);

// 3. Logout route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    // Redirect to home page after clearing session
    res.redirect("/");
  });
});

module.exports = router;

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

// Passport setup to save user session
passport.serializeUser((user, done) => {
  // Stores the MongoDB user _id in the session
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  // Retrieves the user object from MongoDB using the id stored in the session
  try {
    const { getDB } = require("../db/connection");
    const { ObjectId } = require("mongodb");
    const db = getDB();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Use the dynamic RENDER_URL for the live redirect, fall back to local
      callbackURL: `${
        process.env.RENDER_URL || "https://cse341-project2-1-fa5z.onrender.com/"
      }/auth/google/callback`,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        const { getDB } = require("../db/connection");
        const db = getDB();

        // 1. Check if user already exists
        let user = await db
          .collection("users")
          .findOne({ googleId: profile.id });

        if (!user) {
          // 2. If not, create a new user
          const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            createdAt: new Date(),
          };
          const result = await db.collection("users").insertOne(newUser);
          user = await db
            .collection("users")
            .findOne({ _id: result.insertedId });
        }

        // 3. Return the user object
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = { passport };

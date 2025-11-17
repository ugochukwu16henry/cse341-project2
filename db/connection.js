const { MongoClient } = require("mongodb");
require("dotenv").config();

let db;

const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI, {
      dbName: process.env.DATABASE_NAME, // Explicitly setting the database name
    });

    await client.connect();
    // The db object is now ready to use with the specified database name
    db = client.db();

    console.log("MongoDB connected successfully");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Exit application on database connection failure
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
};

module.exports = { connectDB, getDB };

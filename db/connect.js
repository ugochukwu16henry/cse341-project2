const { MongoClient } = require("mongodb");

let db;
let client;

const connectDB = async () => {
  try {
    // Connection options to avoid optional dependencies issues
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    client = new MongoClient(process.env.MONGODB_URI, options);
    await client.connect();

    db = client.db("gameLibraryDB");

    // Test the connection
    await db.command({ ping: 1 });

    console.log("✅ MongoDB Connected Successfully");
    return db;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
};

const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
};

// Graceful shutdown
process.on("SIGINT", async () => {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  }
});

module.exports = connectDB;
module.exports.getDB = getDB;

const { MongoClient } = require("mongodb");

let db;

const connectDB = async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    db = client.db("gameLibraryDB");
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

module.exports = connectDB;
module.exports.getDB = getDB;

const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    const msg = '❌ MongoDB connection failed: missing MONGODB_URI or MONGO_URI environment variable';
    console.error(msg);
    throw new Error(msg);
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    throw error;
  }
};

module.exports = connectDB;

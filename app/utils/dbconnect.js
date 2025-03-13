import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    // Use the MongoDB Atlas URI from environment variables
    const atlasUri = process.env.MONGO_ATLAS_URI;

    if (!atlasUri) {
      throw new Error("MongoDB Atlas URI is not defined in environment variables.");
    }

    await mongoose.connect(atlasUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    console.log("MongoDB Atlas connected successfully");
  } catch (error) {
    console.error("MongoDB Atlas connection failed:", error.message);
    process.exit(1); // Exit the process with a failure code
  }
};

export default connectDB;
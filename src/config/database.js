import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
mongoose.set("strictQuery", false);

const MONGO_URI = `mongodb+srv://${process.env.VANISHVOTE_USERNAME}:${process.env.VANISHVOTE_PASSWORD}@vanishvote-cluster.keces.mongodb.net/?retryWrites=true&w=majority&appName=VanishVote-cluster`;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" MongoDB connected successfully");
  } catch (error) {
    console.error(" MongoDB connection error:", error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Error disconnecting MongoDB:", error.message);
  }
};

export { connectDB, disconnectDB };

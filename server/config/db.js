import { connect } from "mongoose";
import { initializeDb } from "./initializeDb.js";

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI).then(async () => {
      await initializeDb();
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;

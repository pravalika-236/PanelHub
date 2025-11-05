import express from "express";
import { config } from "dotenv";
import cors from "cors"; 

import connectDB from "./config/db.js";

import userRouter from "./routes/userRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";

config();
const app = express();

// Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/faculty", facultyRoutes);
app.use("/api/users", userRouter);

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

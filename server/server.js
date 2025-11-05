import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

// Routes
import bookingRoutes from "./routes/bookingRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // ✅ teammate’s part

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ All routes combined
app.use("/api/users", userRoutes);        // login/signup/auth
app.use("/api/bookings", bookingRoutes);  // booking/cancel endpoints
app.use("/api/faculty", facultyRoutes);   // faculty availability + dropdown feature

// ✅ Health check route
app.get("/", (req, res) => res.send("✅ PanelHub Server is running successfully."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

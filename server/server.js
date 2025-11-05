import express from "express";
import { config } from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import userRouter from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";

// ✅ ES import for notification routes
import notificationRoutes from "./notification/notificationRoutes.js";

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
app.use("/api/bookings", bookingRoutes);
app.use("/api/notification", notificationRoutes);  // ✅ added

app.get("/", (req, res) => 
  res.send("✅ PanelHub Server is running successfully.")
);

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

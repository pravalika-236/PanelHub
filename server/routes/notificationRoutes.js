import express from "express";
import { createNotification, listNotifications } from "../controllers/notificationController.js";
// import { protect } from "../middleware/authMiddleware.js"; // optional if you want protection

const router = express.Router();

router.post("/", createNotification); // public for now (can add protect middleware)

/* optional: list notifications */
router.get("/", listNotifications);

export default router;
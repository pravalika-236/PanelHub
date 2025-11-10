import express from "express";
import {
  searchSlots,
  bookSlot,
  getUserBookings,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/search", searchSlots);
router.post("/book", protect, bookSlot);
router.get("/user/:createdBy", protect, getUserBookings);
router.delete("/:bookingId", protect, cancelBooking);

export default router;

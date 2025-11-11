import express from "express";
import {
  searchSlots,
  bookSlot,
  cancelBooking,
  getScholarBooking,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/search", searchSlots);
router.post("/book", bookSlot);
router.get("/user/:scholarId", getScholarBooking);
router.delete("/:bookingId", protect, cancelBooking);

export default router;

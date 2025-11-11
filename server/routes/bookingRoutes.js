import express from "express";
import {
  searchSlots,
  bookSlot,
  cancelScholarBooking,
  getScholarBooking,
  getFacultyBookingUnapproved,
  getFacultyBookingApprovedPending,
  getFacultyBookingBooked,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/search", searchSlots);
router.post("/book", bookSlot);
router.get("/scholar/:scholarId", getScholarBooking);
router.delete("/:bookingId", protect, cancelScholarBooking);
router.get("/faculty/:facultyId", getFacultyBookingUnapproved);

router.get("/faculty/approved/:facultyId", getFacultyBookingApprovedPending)

router.get("/faculty/confirmed/:facultyId", getFacultyBookingBooked)

export default router;

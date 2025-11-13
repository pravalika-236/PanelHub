import express from "express";
import {
  bookSlot,
  cancelScholarBooking,
  getScholarBooking,
  getFacultyBookingUnapproved,
  getFacultyBookingApprovedPending,
  getFacultyBookingBooked,
  cancelFacultyBooking,
  approveFacultyBooking,
  getScholarActiveBooking,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/book", bookSlot);

router.get("/scholar/:scholarId", getScholarBooking);

router.post("/faculty", getFacultyBookingUnapproved);

router.post("/faculty/approved", getFacultyBookingApprovedPending)

router.post("/faculty/confirmed", getFacultyBookingBooked)

router.put("/scholar/cancel", cancelScholarBooking)

router.put("/faculty/cancel", cancelFacultyBooking)

router.put("/faculty/approve", approveFacultyBooking)

router.get("/scholar/active/:scholarId", getScholarActiveBooking)

export default router;
import express from "express";
import {
  searchSlots,
  bookSlot,
  getUserBookings,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                                 BOOKING ROUTES                             */
/* -------------------------------------------------------------------------- */

router.post("/search", searchSlots);
router.post("/book", protect, bookSlot);
router.get("/user/:createdBy", protect, getUserBookings);


// I'm Pickle Rick 🥒 — future-proof: explicit delete path uses bookingId param
router.delete("/:bookingId", protect, cancelBooking);

export default router;

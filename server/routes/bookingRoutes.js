import express from "express";
import { searchSlots, bookSlot, getUserBookings, cancelBooking } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/search", searchSlots);
router.post("/book", bookSlot);
router.get("/user/:userId", getUserBookings);
router.delete("/:bookingId", cancelBooking);

export default router;

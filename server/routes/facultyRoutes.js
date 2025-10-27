import express from "express";
import {
  getConfirmedBookings,
  approveBooking,
  getCommonSlots,
} from "../controllers/facultyController.js";
import {
  createFacultySlot,
  getFacultySlot,
  updateFacultySlot,
} from "../controllers/facultyControllers.js";

const router = express.Router();

// ===== Faculty Slot Management (Upstream) =====
router.post("/:facultyId", createFacultySlot);
router.put("/:facultyId", updateFacultySlot);
router.get("/:facultyId", getFacultySlot);

// ===== Faculty Booking / Common Slot APIs (Your Feature) =====
router.get("/confirmed", getConfirmedBookings);
router.post("/approve", approveBooking);
router.post("/common-slots", getCommonSlots);

export default router;

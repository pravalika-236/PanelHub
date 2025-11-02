import express from "express";
import {
  getConfirmedBookings,
  approveBooking,
  getCommonSlots,
  getAllFaculties, // ✅ For faculty dropdown
} from "../controllers/facultyController.js";

import {
  createFacultySlot,
  getFacultySlot,
  updateFacultySlot,
} from "../controllers/facultyControllers.js";

const router = express.Router();

// ===== Faculty Slot Management (Upstream core) =====
router.post("/:facultyId", createFacultySlot);
router.put("/:facultyId", updateFacultySlot);
router.get("/:facultyId", getFacultySlot);

// ===== Faculty Booking & Common Slot APIs =====
router.get("/confirmed", getConfirmedBookings);
router.post("/approve", approveBooking);
router.post("/common-slots", getCommonSlots);

// ✅ Faculty dropdown (your feature)
router.get("/faculty", getAllFaculties);

export default router;

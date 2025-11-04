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
import FacultyFreeSlot from "../models/FacultyFreeSlot.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ===== Faculty Slot Management (Upstream standard endpoints) =====
router.post("/:facultyId", createFacultySlot);
router.put("/:facultyId", updateFacultySlot);
router.get("/:facultyId", getFacultySlot);

// ===== Faculty Booking & Common Slot APIs =====
router.get("/confirmed", getConfirmedBookings);
router.post("/approve", approveBooking);
router.post("/common-slots", getCommonSlots);

// ===== Additional Endpoint (Your Feature for Faculty Dropdown) =====
// ✅ GET faculties filtered by logged-in user's department
router.get("/faculty", protect, async (req, res) => {
  try {
    const department = req.user?.department;
    console.log("🟡 Logged-in department:", department);

    if (!department) {
      return res.status(400).json({ message: "User department not found" });
    }

    // ✅ Corrected query using match inside populate
    const slots = await FacultyFreeSlot.find().populate({
      path: "facultyId",
      match: { department }, // filters before population
      select: "name email department",
    });

    // Filter out entries with no matching faculty (different department)
    const faculties = slots
      .filter((entry) => entry.facultyId)
      .map((entry) => ({
        id: entry.facultyId._id,
        name: entry.facultyId.name,
        email: entry.facultyId.email,
        department: entry.facultyId.department,
      }));

    console.log("🟢 Found faculties:", faculties.length);
    res.json(faculties);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch faculties", error: error.message });
  }
});

export default router;

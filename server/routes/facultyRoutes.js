import express from "express";
import mongoose from "mongoose";
import {
  createFacultySlot,
    tySlot,
  updateFacultySlot,
  getConfirmedBookings,
  approveBooking,
  getCommonSlots,
} from "../controllers/facultyController.js";
import FacultyFreeSlot from "../models/FacultyFreeSlot.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                         FACULTY DROPDOWN (YOUR FEATURE)                    */
/* -------------------------------------------------------------------------- */
// ✅ Moved to top so it's not mistaken as :facultyId
router.get("/faculty", protect, async (req, res) => {
  try {
    const department = req.user?.department || req.query?.department;
    console.log("🟡 Logged-in department:", department);

    if (!department) {
      return res.status(400).json({ message: "User department not found" });
    }

    // Fetch all FacultyFreeSlot docs and populate faculty details filtered by department
    const slots = await FacultyFreeSlot.find().populate({
      path: "facultyId",
      match: { department },
      select: "name email department",
    });

    // Extract only valid faculty objects
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
    console.error("❌ Error in /faculty:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch faculties", error: error.message });
  }
});

/* -------------------------------------------------------------------------- */
/*                     FACULTY BOOKING & COMMON SLOT APIs                     */
/* -------------------------------------------------------------------------- */

router.get("/confirmed", getConfirmedBookings);
router.post("/approve", approveBooking);
router.post("/common-slots", protect, getCommonSlots);

/* -------------------------------------------------------------------------- */
/*                          FACULTY SLOT MANAGEMENT                           */
/* -------------------------------------------------------------------------- */

router.post("/:facultyId", createFacultySlot);
router.put("/:facultyId", updateFacultySlot);
router.get(
  "/:facultyId",
  async (req, res, next) => {
    try {
      const { facultyId } = req.params;

      // ✅ Validate ObjectId before hitting DB
      if (!mongoose.Types.ObjectId.isValid(facultyId)) {
        return res.status(400).json({ message: "Invalid faculty ID format" });
      }

      // Pass control to controller
      next();
    } catch (err) {
      console.error("❌ Validation error:", err);
      res.status(500).json({ message: "Internal validation error" });
    }
  },
  getFacultySlot
);

export default router;

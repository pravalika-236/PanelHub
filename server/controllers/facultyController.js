import Faculty from "../models/Faculty.js";
import FacultyFreeSlot from "../models/FacultyFreeSlot.js";
import { createDefaultFacultyFreeSlots } from "../utils/supportFunctions.js";

/* -------------------------------------------------------------------------- */
/*                              SLOT MANAGEMENT                               */
/* -------------------------------------------------------------------------- */

// Create a new faculty slot document with default free slots
export async function createFacultySlot(req, res) {
  try {
    const { facultyId } = req.params;

    await persistCalender(facultyId); // ✅ keep spelling same as used in userControllers.js

    res.status(201).json({ message: "Faculty slot created successfully" });
  } catch (err) {
    console.error("❌ createFacultySlot:", err);
    res.status(500).json({ message: `Internal Server Error: ${err.message}` });
  }
}

// ✅ Used by userControllers.js to initialize faculty calendar
export async function persistCalender(facultyId) {
  try {
    const freeSlot = createDefaultFacultyFreeSlots(facultyId);

    const newRecord = new FacultyFreeSlot({
      facultyId,
      freeSlot,
      updatedAt: Date.now(),
    });

    await newRecord.save();
    console.log(`🟢 Default calendar created for faculty: ${facultyId}`);
  } catch (err) {
    console.error("❌ persistCalender error:", err);
  }
}

// Update an existing slot document
export async function updateFacultySlot(req, res) {
  try {
    const { facultyId } = req.params;
    const { freeSlot } = req.body;

    const updated = await FacultyFreeSlot.findOneAndUpdate(
      { facultyId },
      { freeSlot, updatedAt: Date.now() },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Faculty not found" });

    res.status(200).json({ message: "Faculty slot updated", data: updated });
  } catch (err) {
    console.error("❌ updateFacultySlot:", err);
    res.status(500).json({ error: err.message });
  }
}

// Fetch slot info for a specific faculty
export async function getFacultySlot(req, res) {
  try {
    const { facultyId } = req.params;
    const slot = await FacultyFreeSlot.findOne({ facultyId });

    if (!slot) return res.status(404).json({ message: "No record found" });
    res.json(slot);
  } catch (err) {
    console.error("❌ getFacultySlot:", err);
    res.status(500).json({ error: err.message });
  }
}

/* -------------------------------------------------------------------------- */
/*                            FACULTY DROPDOWN LIST                           */
/* -------------------------------------------------------------------------- */

export async function getAllFaculties(req, res) {
  try {
    const department = (req.user && req.user.department) || req.query.department;
    if (!department) {
      return res.status(400).json({ message: "Department is required" });
    }

    // ✅ Fetch faculty records filtered by department
    const faculties = await Faculty.find({ department }).select("name email department");

    res.json({ faculties });
  } catch (err) {
    console.error("❌ getAllFaculties:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/* -------------------------------------------------------------------------- */
/*                           BOOKING & COMMON SLOTS                           */
/* -------------------------------------------------------------------------- */

// These retain upstream placeholders — replace later when logic is merged
export async function getConfirmedBookings(req, res) {
  try {
    // 🔸 Upstream logic placeholder
  } catch (error) {
    console.error("❌ getConfirmedBookings:", error);
    res.status(500).json({ message: "Error fetching confirmed bookings" });
  }
}

export async function approveBooking(req, res) {
  try {
    // 🔸 Upstream logic placeholder
  } catch (error) {
    console.error("❌ approveBooking:", error);
    res.status(500).json({ message: "Error approving booking" });
  }
}

export async function getCommonSlots(req, res) {
  try {
    // 🔸 Upstream logic placeholder
  } catch (error) {
    console.error("❌ getCommonSlots:", error);
    res.status(500).json({ message: "Error fetching common slots" });
  }
}

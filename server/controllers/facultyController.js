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

export const getCommonSlots = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user missing" });
    }

    const userBatch = req.user.courseCategory; // UG, PG, PhD
    console.log("🧩 userBatch:", userBatch);

    if (!userBatch) {
      return res.status(400).json({ message: "User courseCategory (batch) not found" });
    }

    const { facultyIds } = req.body;
    if (!facultyIds || !facultyIds.length) {
      return res.status(400).json({ message: "Faculty IDs are required" });
    }

    const facultySlots = await FacultyFreeSlot.find({
      facultyId: { $in: facultyIds },
    }).lean();

    if (!facultySlots.length) {
      return res.status(404).json({ message: "No faculty slots found" });
    }

    // 🧩 Normalize all freeSlot data
    const allDays = facultySlots.map((record) => {
      if (!record.freeSlot) return {};
      try {
        return record.freeSlot instanceof Map
          ? Object.fromEntries(record.freeSlot)
          : typeof record.freeSlot.toJSON === "function"
          ? record.freeSlot.toJSON()
          : JSON.parse(JSON.stringify(record.freeSlot));
      } catch {
        return {};
      }
    });

    console.log("🧩 allDays:", JSON.stringify(allDays, null, 2));

    const allDayKeys = [...new Set(allDays.flatMap((d) => Object.keys(d || {})))];
    const commonSlots = [];

    for (const day of allDayKeys) {
      const firstFaculty = allDays[0][day] || {};
      const timeBlocks = Object.keys(firstFaculty);
      const blocks = [];

      for (const block of timeBlocks) {
        // ✅ Each faculty's slot for this day/block must include the userBatch in its array
        const isCommon = allDays.every(
          (faculty) =>
            faculty[day] &&
            Array.isArray(faculty[day][block]) &&
            faculty[day][block].includes(userBatch)
        );

        if (isCommon) blocks.push(block);
      }

      commonSlots.push({ day, blocks });
    }

    res.json({
      message: "Common slots found successfully",
      batch: userBatch,
      totalDays: commonSlots.length,
      commonSlots,
    });
  } catch (error) {
    console.error("❌ getCommonSlots error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
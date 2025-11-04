import Faculty from "../models/Faculty.js";
import FacultyFreeSlot from "../models/FacultyFreeSlot.js";
import { createDefaultFacultyFreeSlots } from "../utils/supportFunctions.js";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

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
    const department =
      (req.user && req.user.department) || req.query.department;
    if (!department) {
      return res.status(400).json({ message: "Department is required" });
    }

    // ✅ Fetch faculty records filtered by department
    const faculties = await Faculty.find({ department }).select(
      "name email department"
    );

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

// 🧩 VERSION 3.2 — fixed for { facultyIds, date, batch }
export const getCommonSlots = asyncHandler(async (req, res) => {
  try {
    // ✅ 1. Verify authentication
    const tokenUser = req.user;
    if (!tokenUser) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // ✅ 2. Extract correct fields from frontend
    const { facultyIds, date, batch } = req.body;
    if (!facultyIds || facultyIds.length === 0 || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ 3. Fetch user (optional, just for validation)
    const user = await User.findById(tokenUser.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const finalBatch = batch || user.courseCategory || "UG";

    // ✅ 4. Load FacultyFreeSlot documents
    const freeSlotsDocs = await FacultyFreeSlot.find({
      facultyId: { $in: facultyIds },
    });

    console.log("🧩 Found docs count:", freeSlotsDocs.length);

    // ✅ 5. Extract free blocks per faculty for that date (array-based freeSlot structure)
    const facultyBlocks = freeSlotsDocs.map((doc) => {
      // Defensive parse: freeSlot might be Map or plain object
      const freeSlotData =
        doc.freeSlot instanceof Map
          ? Object.fromEntries(doc.freeSlot)
          : doc.freeSlot;

      // Grab the date’s object (ex: { "09-10": ["UG", "PG"], ... })
      const dayData = freeSlotData?.[date];

      if (!dayData || typeof dayData !== "object") {
        console.log("⚠️ No slot data for date in", doc.facultyId.toString());
        return [];
      }

      // For this faculty, find all blocks where the batch is included
      const blocks = Object.entries(dayData)
        .filter(([_, arr]) => Array.isArray(arr) && arr.includes(finalBatch))
        .map(([block]) => block);

      console.log("📘 Faculty:", doc.facultyId.toString(), "=>", blocks);
      return blocks;
    });

    console.log("🧩 facultyBlocks:", facultyBlocks);

    // ✅ 6. Find intersection
    const commonBlocks =
      facultyBlocks.length > 0
        ? facultyBlocks.reduce((a, b) => a.filter((x) => b.includes(x)))
        : [];

    console.log("✅ Common Blocks Found:", commonBlocks);

    // ✅ 7. Respond
    return res.json({
      version: "3.2",
      message: "Common slots found successfully",
      date,
      batch: finalBatch,
      totalFaculties: facultyIds.length,
      totalCommonBlocks: commonBlocks.length,
      commonSlots: [
        {
          day: date,
          blocks: commonBlocks,
        },
      ],
    });
  } catch (error) {
    console.error("❌ Error in getCommonSlots (v3.2):", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

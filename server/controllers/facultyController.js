import FacultyFreeSlot from "../models/FacultyFreeSlot.js";
import { createDefaultFacultyFreeSlots } from "../utils/supportFunctions.js";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Booking from "../models/Booking.js";


// Create a new faculty slot document with default free slots
export async function createFacultySlot(req, res) {
  try {
    const { facultyId } = req.params;

    await persistCalender(facultyId);

    res.status(201).json({ message: "Faculty slot created successfully" });
  } catch (err) {
    console.error("createFacultySlot:", err);
    res.status(500).json({ message: `Internal Server Error: ${err.message}` });
  }
}


// Used by userControllers.js to initialize faculty calendar
export async function persistCalender(facultyId) {
  try {
    const freeSlot = createDefaultFacultyFreeSlots(facultyId);

    const newRecord = new FacultyFreeSlot({
      facultyId,
      freeSlot,
      updatedAt: Date.now(),
    });

    await newRecord.save();
    console.log(`Default calendar created for faculty: ${facultyId}`);
  } catch (err) {
    console.error("persistCalender error:", err);
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
    console.error("updateFacultySlot:", err);
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
    console.error("getFacultySlot:", err);
    res.status(500).json({ error: err.message });
  }
}


export async function getAllFaculties(req, res) {
  try {
    const department =
      (req.user && req.user.department) || req.query.department;
    if (!department) {
      return res.status(400).json({ message: "Department is required" });
    }

    // ✅ Fetch from User collection — only users with role: "Faculty"
    const faculties = await User.find({
      department,
      role: "Faculty",
    }).select("name email department");

    res.json({ faculties });
  } catch (err) {
    console.error("getAllFaculties:", err);
    res.status(500).json({ message: "Server error" });
  }
}


// These retain upstream placeholders — replace later when logic is merged
export async function getConfirmedBookings(req, res) {
  try {
    // 🔸 Upstream logic placeholder
  } catch (error) {
    console.error("getConfirmedBookings:", error);
    res.status(500).json({ message: "Error fetching confirmed bookings" });
  }
}

export async function getUnapproveBooking(req, res) {
  try {
    const { facultyId, date, time, courseCategory } = req.body;
    const bookings = await Booking.find({
      date: date,
      time: time,
      courseCategory: courseCategory,
      "faculties.id": facultyId
    });
    res.json(bookings);
  } catch (error) {
    console.error("unapproveBooking:", error);
    res.status(500).json({ message: "Error getting unapproved booking" });
  }
}

export async function approveBooking(req, res) {
  try {
    const { bookingId, facultyId } = req.body;
    await Booking.updateOne(
      {
        _id: bookingId,
        "faculties.id": facultyId
      },
      {
        $set: { "faculties.$.approved": true }
      }
    );

    res.status(200).json({message: "Approved"})
  } catch (error) {
    console.error("unapproveBooking:", error);
    res.status(500).json({ message: "Error getting unapproved booking" });
  }
}

export const getCommonSlots = asyncHandler(async (req, res) => {
  try {
    // Authentication
    const tokenUser = req.user;
    if (!tokenUser) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Input validation
    const { facultyIds, date, batch } = req.body;
    if (!facultyIds?.length || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(tokenUser.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const finalBatch = batch || user.courseCategory || "UG";

    // Normalize date format (YYYY-MM-DD → DD-MM-YYYY)
    const normalizeDate = (input) => {
      const d = new Date(input);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };
    const normalizedDate = normalizeDate(date);

    // Fetch slot documents
    const freeSlotsDocs = await FacultyFreeSlot.find({
      facultyId: { $in: facultyIds },
    }).populate({
      path: "facultyId",
      model: "User",
      match: { role: "Faculty" },
      select: "name email department",
    });

    if (!freeSlotsDocs.length) {
      return res.status(404).json({ message: "No faculty slots found" });
    }

    // Extract common available blocks
    const commonBlocks = (() => {
      const sample = freeSlotsDocs[0]?.freeSlot?.[normalizedDate];
      if (!sample) return [];

      const allBlocks = Object.keys(sample);

      return allBlocks.filter((block) =>
        freeSlotsDocs.every((doc) => {
          const slot = doc.freeSlot?.[normalizedDate]?.[block];
          return slot && slot[finalBatch] === true && slot.bookStatus === false;
        })
      );
    })();

    // Response
    return res.json({
      version: "3.3",
      message: "Common slots found successfully",
      date: normalizedDate,
      batch: finalBatch,
      totalFaculties: facultyIds.length,
      totalCommonBlocks: commonBlocks.length,
      commonSlots: [{ day: normalizedDate, blocks: commonBlocks }],
    });
  } catch (error) {
    console.error("Error in getCommonSlots (v3.3):", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
import FacultyFreeSlot from "../models/FacultyFreeSlot.js";
import { createDefaultFacultyFreeSlots, formatDate, generateDaySlots } from "../utils/supportFunctions.js";
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

    res.status(200).json({ message: "Approved" })
  } catch (error) {
    console.error("unapproveBooking:", error);
    res.status(500).json({ message: "Error getting unapproved booking" });
  }
}

function findCommonSlots(facultyList, date, courseCategory) {

  const firstFaculty = facultyList[0];
  const baseSlots = firstFaculty.freeSlot[date];


  const commonSlots = Object.keys(baseSlots).filter((time) =>
    facultyList.every(
      (faculty) => {
        return faculty.freeSlot[date][time]?.[courseCategory] === true
      }
    )
  );

  return commonSlots;
}

export async function getCommonSlots(req, res) {
  try {
    const { facultyIds, date, courseCategory } = req.body;

    const facultyList = await FacultyFreeSlot.find(
      { facultyId: { $in: facultyIds } },
      { [`freeSlot.${date}`]: 1, facultyId: 1, _id: 0 }
    );

    const commonsSlots = findCommonSlots(facultyList, date, courseCategory)

    return res.json({
      message: "Common slots found successfully",
      date: date,
      courseCategory: courseCategory,
      commonSlots: commonsSlots,
      facultyIds: facultyIds
    });
  } catch (error) {
    console.error("Error in getCommonSlots (v3.3):", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export async function cleanupFacultySlot(req, res) {
  try {
    const { facultyId } = req.params;

    const record = await FacultyFreeSlot.findOne({ facultyId });
    if (!record) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    record.freeSlot = cleanupFacultySlotScheduler(facultyId);
    record.updatedAt = Date.now();
    await record.save();

    res.status(200).json({
      message: "Faculty calendar cleaned and updated for next 7 days",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export async function cleanupFacultySlotScheduler(facultyId) {

  const record = await FacultyFreeSlot.findOne({ facultyId });

  const today = new Date();
  const formattedToday = formatDate(today);

  // Filter out past dates
  const updatedFreeSlot = {};
  const allDates = Object.keys(record.freeSlot || {});

  const futureDates = allDates.filter(d => {
    const [day, month, year] = d.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj >= new Date(today.setHours(0, 0, 0, 0));
  });

  // Keep future dates only
  futureDates.forEach(date => {
    updatedFreeSlot[date] = record.freeSlot[date];
  });

  // Add new days until total = 7
  const needed = 7 - futureDates.length;
  if (needed > 0) {
    let lastDate = new Date();
    if (futureDates.length > 0) {
      const lastFuture = futureDates[futureDates.length - 1];
      const [d, m, y] = lastFuture.split("-").map(Number);
      lastDate = new Date(y, m - 1, d);
    }

    for (let i = 1; i <= needed; i++) {
      const newDate = new Date(lastDate);
      newDate.setDate(lastDate.getDate() + i);
      Object.assign(updatedFreeSlot, generateDaySlots(newDate));
    }
  }

  record.freeSlot = updatedFreeSlot;
  record.updatedAt = Date.now();
  await record.save();

  return record;
}

export async function getFacultyGroupByDepartment(req, res) {
  try {
    const { department } = req.params;

    const faculties = await User.find({
      role: "Faculty",
      department: department
    });

    res.json(faculties);
  } catch (error) {
    console.error("Error in /faculty:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch faculties", error: error.message });
  }
}
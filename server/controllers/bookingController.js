import Booking from "../models/Booking.js";
import Department from "../models/Department.js";
import Course from "../models/Course.js";

export const searchSlots = async (req, res) => {
  try {
    const userId = req.user._id;
    const activeBooking = await Booking.findOne({
      scholarIds: userId,
      status: { $in: ["pending", "booked"] },
    });

    const { faculties, date } = req.body;
    const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"];
    const availableSlots = timeSlots.map((time, idx) => ({
      id: idx + 1,
      time,
      available: true,
    }));

    res.json({
      slots: availableSlots,
      hasActiveBooking: !!activeBooking,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const bookSlot = async (req, res) => {
  try {
    const { scholarId, facultyIds, date, time, department, courseCategory } = req.body;

    const existingBooking = await Booking.findOne({
      scholarIds: scholarId,
      status: { $in: ["pending", "booked"] },
    });
    if (existingBooking) {
      return res.status(400).json({
        message:
          "You already have an active booking. Please manage your existing booking first.",
      });
    }

    if (!department) {
      return res
        .status(400)
        .json({ message: `Department '${department}' not found` });
    }

    const facultyApprovals = facultyIds.map((id) => {
      return {
        facultyId: id,
        approveStatus: false
      }
    })

    const booking = new Booking({
      scholarId: scholarId,
      facultyApprovals: facultyApprovals,
      status: "pending",
      date: date,
      time: time,
      duration: 1,
      department: department,
      courseCategory: courseCategory,
      createdBy: scholarId,
      createdAt: new Date(),
      updatedBy: scholarId,
      updatedAt: new Date(),
    });

    const saved = await booking.save();
    res
      .status(201)
      .json({ message: "Booking created successfully", booking: saved });
  } catch (err) {
    console.error("Booking creation failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const getScholarBooking = async (req, res) => {
  try {
    const bookings = await Booking.find({ scholarId: req.params.scholarId});
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const cancelBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.bookingId);
    res.json({ success: true, message: "Booking cancelled successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

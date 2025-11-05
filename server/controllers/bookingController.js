import Booking from "../models/Booking.js";
import Department from "../models/Department.js";
import Course from "../models/Course.js";

/* -------------------------------------------------------------------------- */
/*                               SEARCH SLOTS                                 */
/* -------------------------------------------------------------------------- */
export const searchSlots = async (req, res) => {
  try {
    const { faculties, date } = req.body;
    const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"];
    const availableSlots = timeSlots.map((time, idx) => ({
      id: idx + 1,
      time,
      available: true,
    }));

    res.json({ slots: availableSlots, hasActiveBooking: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const bookSlot = async (req, res) => {
  try {
    const { scholarIds, facultyApprovals, date, startTime, duration, status } = req.body;
    const user = req.user;

    // 🧩 STEP 1: Find Department & Course ObjectIds from string names
    const departmentDoc = await Department.findOne({ name: user.department });
    const courseDoc = user.courseCategory
      ? await Course.findOne({ name: user.courseCategory })
      : null;

    if (!departmentDoc)
      return res.status(400).json({ message: "Invalid department reference" });

    // 🧩 STEP 2: Construct booking with proper refs
    const booking = new Booking({
      scholarIds,
      facultyApprovals,
      status: status || "pending",
      date,
      startTime,
      duration,
      department: departmentDoc._id,
      courseCategory: courseDoc ? courseDoc._id : null,
      createdBy: user._id,
      createdAt: new Date(),
      updatedBy: user._id,
      updatedAt: new Date(),
    });

    // 🧩 STEP 3: Save booking
    const saved = await booking.save();
    return res.status(201).json({
      message: "Booking created successfully",
      booking: saved,
    });
  } catch (err) {
    console.error("❌ Booking creation failed:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


/* -------------------------------------------------------------------------- */
/*                             USER BOOKINGS                                  */
/* -------------------------------------------------------------------------- */
export const getUserBookings = async (req, res) => {
  try {
    // adapt query: bookings created by a specific user
    const bookings = await Booking.find({ createdBy: req.params.userId });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                              CANCEL BOOKING                                */
/* -------------------------------------------------------------------------- */
export const cancelBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.bookingId);
    res.json({ success: true, message: "Booking cancelled successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


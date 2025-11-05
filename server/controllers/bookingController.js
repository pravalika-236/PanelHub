import Booking from "../models/Booking.js";

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

/* -------------------------------------------------------------------------- */
/*                               BOOK SLOT                                    */
/* -------------------------------------------------------------------------- */
export const bookSlot = async (req, res) => {
  try {
    // ✅ Extract relevant fields
    const {
      scholarIds,
      facultyIds,
      date,
      startTime,
      duration,
      department,
      courseCategory,
      createdBy,
    } = req.body;

    // ✅ Basic validation
    if (!scholarIds || !facultyIds || !date || !startTime) {
      return res
        .status(400)
        .json({ message: "Missing required fields for booking" });
    }

    // ✅ Initialize faculty approvals dynamically
    const facultyApprovals = {};
    facultyIds.forEach((fid) => {
      facultyApprovals[fid] = false;
    });

    // ✅ Construct booking doc according to your schema
    const newBooking = new Booking({
      scholarIds,
      facultyIds,
      facultyApprovals,
      status: "pending",
      date,
      startTime,
      duration: duration || 1,
      department,
      courseCategory,
      createdBy,
      createdAt: new Date(),
      updatedBy: createdBy,
      updatedAt: new Date(),
    });

    await newBooking.save();

    return res.status(201).json({
      success: true,
      message: "Slot booked successfully!",
      booking: newBooking,
    });
// inside bookSlot controller catch block
} catch (err) {
  console.error("❌ Booking save error:", err);

  // If Mongoose validation error, include details
  if (err.name === "ValidationError") {
    const errors = {};
    for (const key in err.errors) {
      errors[key] = err.errors[key].message;
    }
    return res.status(400).json({
      message: "Failed to book slot",
      error: err.message,
      validationErrors: errors,
    });
  }

  res.status(500).json({ message: err.message });
}
};

/* -------------------------------------------------------------------------- */
/*                             USER BOOKINGS                                  */
/* -------------------------------------------------------------------------- */
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId });
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
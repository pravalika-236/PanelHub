import Booking from "../models/Booking.js";

// @desc Search available slots
export const searchSlots = async (req, res) => {
  try {
    const { faculties, date } = req.body;
    // Simplified dummy search logic — later can query faculty availability
    const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'];
    const availableSlots = timeSlots.map((time, idx) => ({
      id: idx + 1,
      time,
      available: true
    }));

    res.json({ slots: availableSlots, hasActiveBooking: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Book slot
export const bookSlot = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.json({
      success: true,
      message: "Slot booked successfully!",
      booking
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.bookingId);
    res.json({ success: true, message: "Booking cancelled successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

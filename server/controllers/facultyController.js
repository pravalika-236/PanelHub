import Booking from "../models/Booking.js";
import FacultyFreeSlot from '../models/FacultyFreeSlot.js';


export const getConfirmedBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "Confirmed" });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const approveBooking = async (req, res) => {
  try {
    const { bookingId, facultyId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const faculty = booking.faculties.find(f => f.id === facultyId);
    if (faculty) faculty.approved = true;

    const allApproved = booking.faculties.every(f => f.approved);
    if (allApproved) booking.status = "Confirmed";

    await booking.save();
    res.json({ success: true, message: "Booking approved successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCommonSlots = async (req, res) => {
  try {
    const { facultyIds, date } = req.body;

    if (!facultyIds || facultyIds.length === 0 || !date) {
      return res.status(400).json({ message: 'Faculty IDs and date are required' });
    }

    // Fetch all free slots of the given faculties
    const slots = await FacultyFreeSlot.find({ facultyId: { $in: facultyIds } });

    if (!slots.length) {
      return res.status(404).json({ message: 'No free slots found for the given faculties' });
    }

    // Extract available times for each faculty for that date
    const allSlotArrays = slots.map(f =>
      Object.keys(f.freeSlot[date] || {}).filter(time => f.freeSlot[date][time])
    );

    // Find intersection (common slots)
    const commonSlots = allSlotArrays.reduce((a, b) => a.filter(t => b.includes(t)));

    res.json({ commonSlots });
  } catch (error) {
    console.error('Error fetching common slots:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find(); // example Mongoose model
    res.json(faculties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

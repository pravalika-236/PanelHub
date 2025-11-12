import Booking from "../models/Booking.js";
import FacultyFreeSlot from "../models/FacultyFreeSlot.js";

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

    const facultiesFreeSlots = await FacultyFreeSlot.find(
      { facultyId: { $in: facultyIds } }
    )
    facultiesFreeSlots.forEach(async (facultyFreeSlot) => {
      const facultyId = facultyFreeSlot.facultyId;
      await FacultyFreeSlot.updateOne(
        { facultyId },
        {
          $set: {
            [`freeSlot.${date}.${time}.bookStatus`]: true
          }
        }
      );
    })

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
    const bookings = await Booking.find({ scholarId: req.params.scholarId });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const cancelScholarBooking = async (req, res) => {
  try {
    const { id, date, time, facultyIds } = req.body;

    facultyIds.forEach(async (facultyId) => {
      await FacultyFreeSlot.updateOne(
        { facultyId },
        { $set: { [`freeSlot.${date}.${time}.bookStatus`]: false } }
      );
    })
    await Booking.findByIdAndDelete(id);
    res.json({ success: true, message: "Booking cancelled successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const cancelFacultyBooking = async (req, res) => {
  try {
    const { id, date, time, facultyIds, cancelFacultyId } = req.body;
    facultyIds.forEach(async (facultyId) => {
      if (cancelFacultyId !== facultyId) {
        await FacultyFreeSlot.updateOne(
          { facultyId },
          { $set: { [`freeSlot.${date}.${time}.bookStatus`]: false } }
        );
      } else {
        await FacultyFreeSlot.updateOne(
          { facultyId },
          {
            $set: {
              [`freeSlot.${date}.${time}.UG`]: false,
              [`freeSlot.${date}.${time}.PG`]: false,
              [`freeSlot.${date}.${time}.PHD`]: false,
              [`freeSlot.${date}.${time}.bookStatus`]: false
            }
          }
        );
      }
    })
    await Booking.findByIdAndDelete(id);
    res.json({ success: true, message: "Booking cancelled successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const approveFacultyBooking = async (req, res) => {
  try {
    const { id, facultyId } = req.body;
    const booking = await Booking.findOneAndUpdate(
      { _id: id, "facultyApprovals.facultyId": facultyId },
      { $set: { "facultyApprovals.$.approveStatus": true } },
      { new: true }
    );

    const allApproved = booking.facultyApprovals.every(
      (f) => f.approveStatus === true
    );

    if (allApproved) {
      booking.status = "booked";
      await booking.save();
    }

    res.json({ success: true, message: "Approved successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFacultyBookingUnapproved = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const bookings = await Booking.find({
      facultyApprovals: {
        $elemMatch: {
          facultyId: facultyId,
          approveStatus: false,
        },
      },
      status: "pending",
    });
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getFacultyBookingApprovedPending = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const bookings = await Booking.find({
      facultyApprovals: {
        $elemMatch: {
          facultyId: facultyId,
          approveStatus: true,
        },
      },
      status: "pending",
    });
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getFacultyBookingBooked = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const bookings = await Booking.find({
      "facultyApprovals.facultyId": facultyId,
      status: "booked",
    });
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

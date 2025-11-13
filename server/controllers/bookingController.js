import Booking from "../models/Booking.js";
import FacultyFreeSlot from "../models/FacultyFreeSlot.js";

export const getScholarActiveBooking = async (req, res) => {
  try {
    const { scholarId } = req.params
    const existingBooking = await Booking.findOne({
      scholarId: scholarId,
      status: { $in: ["pending", "booked"] },
    });
    if (existingBooking) {
      return res.status(200).json(true);
    }
    return res.status(200).json(false);
  } catch (err) {
    console.error("getScholarActiveBooking:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export const bookSlot = async (req, res) => {
  try {
    const { scholarId, facultyIds, date, time, department, courseCategory, scholarName, scholarEmail } = req.body;
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
      scholarName: scholarName,
      scholarEmail: scholarEmail,
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
    const { id, date, time, courseCategory } = req.body;
    const filter = {
      facultyApprovals: {
        $elemMatch: {
          facultyId: id,
          approveStatus: false,
        },
      },
      status: "pending",
    };
    if (date && date.trim() !== "") {
      filter.date = date;
    }
    if (time && time.trim() !== "") {
      filter.time = time;
    }
    if (courseCategory && courseCategory.trim() !== "") {
      filter.courseCategory = courseCategory;
    }
    const bookings = await Booking.find(filter);
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getFacultyBookingApprovedPending = async (req, res) => {
  try {
    const { id, date, time, courseCategory } = req.body;
    const filter = {
      facultyApprovals: {
        $elemMatch: {
          facultyId: id,
          approveStatus: true,
        },
      },
      status: "pending",
    };
    if (date && date.trim() !== "") {
      filter.date = date;
    }
    if (time && time.trim() !== "") {
      filter.time = time;
    }
    if (courseCategory && courseCategory.trim() !== "") {
      filter.courseCategory = courseCategory;
    }
    const bookings = await Booking.find(filter);
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getFacultyBookingBooked = async (req, res) => {
  try {
    const { id, date, time, courseCategory } = req.body;
    const filter = {
      "facultyApprovals.facultyId": id,
      status: "booked",
    };
    if (date && date.trim() !== "") {
      filter.date = date;
    }
    if (time && time.trim() !== "") {
      filter.time = time;
    }
    if (courseCategory && courseCategory.trim() !== "") {
      filter.courseCategory = courseCategory;
    }
    const bookings = await Booking.find(filter);
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
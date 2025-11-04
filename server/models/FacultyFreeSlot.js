const mongoose = require("mongoose");
require("./Faculty"); // ✅ ensures Faculty model is registered

// ===== Slot schema for each time block =====
const slotSchema = new mongoose.Schema(
  {
    UG: { type: Boolean, default: false },
    PG: { type: Boolean, default: false },
    PHD: { type: Boolean, default: false },
    bookStatus: { type: Boolean, default: false },
  },
  { _id: false }
);

// ===== Schema for each day's schedule =====
const daySchema = new mongoose.Schema(
  {
    "08-09": slotSchema,
    "09-10": slotSchema,
    "10-11": slotSchema,
    "11-12": slotSchema,
    "12-13": slotSchema,
    "13-14": slotSchema,
    "14-15": slotSchema,
    "15-16": slotSchema,
    "16-17": slotSchema,
    "17-18": slotSchema,
    "18-19": slotSchema,
    "19-20": slotSchema,
  },
  { _id: false }
);

// ===== Main Faculty Free Slot Schema =====
const facultyFreeSlotSchema = new mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    freeSlot: {
      type: Map,
      of: daySchema,
      required: true,
      default: {},
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "facultyfreeslots" }
);

// ===== Model Export =====
const FacultyFreeSlot = mongoose.model("FacultyFreeSlot", facultyFreeSlotSchema);
module.exports = FacultyFreeSlot;

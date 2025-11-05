const mongoose = require("mongoose");
require("./User");

const slotSchema = new mongoose.Schema({
  UG: { type: Boolean, default: false },
  PG: { type: Boolean, default: false },
  PHD: { type: Boolean, default: false },
  bookStatus: { type: Boolean, default: false }
}, { _id: false });

const daySchema = new mongoose.Schema({
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
}, { _id: false });

// ===== Main Faculty Free Slot Schema =====
const facultyFreeSlotSchema = new mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: async function (id) {
          const user = await mongoose.model("User").findById(id);
          return user && user.role === "Faculty";
        },
        message: "facultyId must belong to a user with role 'Faculty'",
      },
    },
    freeSlot: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "facultyfreeslots" } // keep this name fixed
);

// ===== Model Export =====
const FacultyFreeSlot = mongoose.model(
  "FacultyFreeSlot",
  facultyFreeSlotSchema,
  "facultyfreeslots"
);

module.exports = FacultyFreeSlot;
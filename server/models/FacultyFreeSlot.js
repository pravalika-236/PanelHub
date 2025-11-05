import { Schema, model } from "mongoose";

const slotSchema = new Schema({
  UG: { type: Boolean, default: false },
  PG: { type: Boolean, default: false },
  PHD: { type: Boolean, default: false },
  bookStatus: { type: Boolean, default: false }
}, { _id: false });

const daySchema = new Schema({
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

const facultyFreeSlotSchema = new Schema({
  facultyId: {
    type: Schema.Types.ObjectId,
    ref: "Faculty",
    required: true,
  },
  freeSlot: {
    type: Map,
    of: daySchema,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("FacultyFreeSlot", facultyFreeSlotSchema);

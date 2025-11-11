import { Schema, model } from "mongoose";

const bookingSchema = new Schema(
  {
    scholarId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    facultyApprovals: [
      {
        facultyId: { type: Schema.Types.ObjectId, ref: "User" },
        approveStatus: { type: Boolean, default: false }
      },
    ],

    status: {
      type: String,
      enum: ["pending", "booked", "cancelled"],
      default: "pending",
    },

    date: { type: String, required: true },
    time: { type: String, required: true }, // e.g. "10:00"
    duration: { type: Number, default: 1 }, // always 1 hour

    department: { type: String, required: true },
    courseCategory: { type: String, required: true },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: false } // not using built-in timestamps since we manage manually
);

export default model("Booking", bookingSchema);

import { Schema, model } from "mongoose";

const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    scholarIds: [
      { type: Schema.Types.ObjectId, ref: "User", required: true }
    ],

    facultyApprovals: {
      Faculty1: {
        facultyId: { type: Schema.Types.ObjectId, ref: "User" },
        approveStatus: { type: Boolean, default: false },
      },  
      Faculty2: {
        facultyId: { type: Schema.Types.ObjectId, ref: "User" },
        approveStatus: { type: Boolean, default: false },
      },
      Faculty3: {
        facultyId: { type: Schema.Types.ObjectId, ref: "User" },
        approveStatus: { type: Boolean, default: false },
      },
    },

    status: {
      type: String,
      enum: ["pending", "booked", "cancelled"],
      default: "pending",
    },

    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // e.g. "10:00"
    duration: { type: Number, default: 1 }, // always 1 hour

    department: { type: Schema.Types.ObjectId, ref: "Department", required: true },
    courseCategory: { type: Schema.Types.ObjectId, ref: "CourseCategory", required: true },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: false } // not using built-in timestamps since we manage manually
);

export default mongoose.model("Booking", bookingSchema);

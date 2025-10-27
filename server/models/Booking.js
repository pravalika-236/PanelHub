import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  faculties: [
    {
      id: Number,
      name: String,
      email: String,
      approved: { type: Boolean, default: false }
    }
  ],
  department: String,
  courseCategory: String,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Booking", bookingSchema);

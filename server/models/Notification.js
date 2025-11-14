import mongoose from "mongoose";

const { Schema } = mongoose;

const notificationSchema = new Schema({
  recipient: {
    scholarIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    facultyIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  event: { type: String, required: true }, // e.g. "BookingCreated", "BookingCancelled", "SlotUpdated"
  slotId: { type: Schema.Types.ObjectId, ref: "Booking" }, // PICKLE: reference to Booking collection
  createdAt: { type: Date, default: Date.now },
  sentStatus: { type: Boolean, default: false },
});

export default mongoose.model("Notification", notificationSchema);
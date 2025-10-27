import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  name: String,
  email: String,
  department: String,
  availableSlots: [
    {
      date: String,
      time: String,
      available: Boolean
    }
  ]
});

export default mongoose.model("Faculty", facultySchema);

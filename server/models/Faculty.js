const mongoose = require("mongoose");

const FacultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true }, // e.g. "CSE", "ECE"
  role: { type: String, default: "Faculty" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Faculty", FacultySchema);

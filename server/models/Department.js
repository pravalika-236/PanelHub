const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["CSE", "EEE", "ECE", "ME", "CE"], // only these values are allowed
  },
});

module.exports = mongoose.model("Department", departmentSchema);

import { Schema, model } from "mongoose";

const departmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    enum: ["CSE", "EEE", "ECE", "ME", "CE"],
  },
});

export default model("Department", departmentSchema);

const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true,
            enum: ["UG", "PG", "PHD"]
        }
    }
);

module.exports = mongoose.model("Course", courseSchema);
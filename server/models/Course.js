import { Schema, model } from "mongoose";

const courseSchema = new Schema(
    {
        name: { 
            type: String, 
            required: true,
            enum: ["UG", "PG", "PHD"]
        }
    }
);

export default model("Course", courseSchema);
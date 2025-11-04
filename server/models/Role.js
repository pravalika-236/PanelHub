import { Schema, model } from "mongoose";

const roleSchema = new Schema(
    {
        name: { 
            type: String, 
            required: true,
            enum: ["Scholar", "Faculty"]
        }
    }
);

export default model("Role", roleSchema);
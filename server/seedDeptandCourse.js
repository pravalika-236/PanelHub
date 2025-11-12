import mongoose from "mongoose";
import Department from "./models/Department.js";
import Course from "./models/Course.js";
import { config } from "dotenv";
import connectDB from "./config/db.js";

config();
await connectDB();

const departments = ["CSE", "EEE", "ECE", "ME", "CE"];
const courses = ["UG", "PG", "PHD"];

await Department.deleteMany({});
await Course.deleteMany({});

await Department.insertMany(departments.map((name) => ({ name })));
await Course.insertMany(courses.map((name) => ({ name })));

console.log("✅ Seeded Departments and Courses!");
process.exit();

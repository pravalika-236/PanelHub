const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const FacultyFreeSlot = require("./models/FacultyFreeSlot");
const Faculty = require("./models/Faculty");

dotenv.config();

const seedFacultySlots = async () => {
  try {
    await connectDB();

    // Clear old data
    await FacultyFreeSlot.deleteMany();
    await Faculty.deleteMany();

    // Create sample faculty documents
    const facultySamples = await Faculty.insertMany([
      { name: "Dr. Smith", email: "smith@nitc.ac.in", department: "CSE" },
      { name: "Dr. Johnson", email: "johnson@nitc.ac.in", department: "CSE" },
      { name: "Dr. Brown", email: "brown@nitc.ac.in", department: "ECE" },
      { name: "Dr. Davis", email: "davis@nitc.ac.in", department: "ME" },
      { name: "Dr. Miller", email: "miller@nitc.ac.in", department: "EEE" },
      { name: "Dr. Taylor", email: "taylor@nitc.ac.in", department: "CSE" },
      { name: "Dr. Anderson", email: "anderson@nitc.ac.in", department: "ECE" },
      { name: "Dr. White", email: "white@nitc.ac.in", department: "ME" },
      { name: "Dr. Green", email: "green@nitc.ac.in", department: "CE" },
      { name: "Dr. Patel", email: "patel@nitc.ac.in", department: "EEE" },
    ]);

    // Prepare free slots for 3 days
    const today = new Date();
    const freeSlotData = {};
    for (let i = 0; i < 3; i++) {
      const dateKey = new Date(today.getTime() + i * 86400000)
        .toISOString()
        .split("T")[0];
      freeSlotData[dateKey] = {
        "09-10": ["UG", "PG"],
        "10-11": ["UG"],
        "11-12": ["PhD", "PG"],
      };
    }

    // Create faculty free slots
    const slotDocs = facultySamples.map((faculty) => ({
      facultyId: faculty._id,
      freeSlot: freeSlotData,
    }));

    await FacultyFreeSlot.insertMany(slotDocs);

    console.log("✅ Faculty and free slots seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedFacultySlots();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FacultyFreeSlot from './models/FacultyFreeSlot.js';
import Faculty from './models/Faculty.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error(err));

const seedSlots = async () => {
  try {
    // Step 1: Find existing faculty
    const faculties = await Faculty.find();

    if (faculties.length < 2) {
      console.log('❌ Need at least 2 faculty documents to test common slots.');
      console.log('Please insert them into your Faculty collection first.');
      process.exit(0);
    }

    // Step 2: Define fake free slots for testing
    const date = '2025-10-28';
    const slotData = [
      { "10-11": true, "11-12": true, "12-1": false },
      { "10-11": true, "11-12": false, "12-1": true }
    ];

    // Step 3: Insert free slots for 2 faculties
    await FacultyFreeSlot.deleteMany(); // Clear old data

    const slot1 = new FacultyFreeSlot({
      facultyId: faculties[0]._id,
      freeSlot: { [date]: slotData[0] }
    });

    const slot2 = new FacultyFreeSlot({
      facultyId: faculties[1]._id,
      freeSlot: { [date]: slotData[1] }
    });

    await slot1.save();
    await slot2.save();

    console.log('✅ Seed data added successfully!');
    console.log('Faculty IDs used:', faculties[0]._id.toString(), faculties[1]._id.toString());
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedSlots();

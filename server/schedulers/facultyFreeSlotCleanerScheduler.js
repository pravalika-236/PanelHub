import { cleanupFacultySlotScheduler } from "../controllers/facultyController";
import User from "../models/User";
import cron from "node-cron"

cron.schedule('15 0 * * *', () => {
  console.log('Running scheduled task at 12:15 AM');
  slotCleaner();
}, {
  timezone: "Asia/Kolkata"
});

async function slotCleaner() {
    const facultyIds = (await User.find({ role: "Faculty" }, { _id: 1 }).lean()).map(u => u._id);
    facultyIds.forEach((id) => cleanupFacultySlotScheduler(id))
}
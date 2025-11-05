import FacultyFreeSlot from "../models/FacultyFreeSlot.js";
import { createDefaultFacultyFreeSlots } from "../utils/supportFunctions.js";

export async function createFacultySlot(req, res) {
  try {
    const { facultyId } = req.params;

    persistCalender(facultyId);

    res
      .status(201)
      .json({ message: "Faculty slot created successfully" });
  } catch (err) {
    res.status(500).json({ message: `Internal Server Error: ${err}` })
  }
}

export async function persistCalender(facultyId) {
  const freeSlot = createDefaultFacultyFreeSlots(facultyId);

  const newRecord = new FacultyFreeSlot({
    facultyId,
    freeSlot,
    updatedAt: Date.now()
  });

  await newRecord.save();
}

export async function updateFacultySlot(req, res) {
  try {
    const { facultyId } = req.params;
    const { freeSlot } = req.body;

    const updated = await FacultyFreeSlot.findOneAndUpdate(
      { facultyId },
      { freeSlot, updatedAt: Date.now() }
    );

    res.status(200).json({ message: "Faculty slot updated", data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getFacultySlot(req, res) {
  try {
    const { facultyId } = req.params;
    const slot = await FacultyFreeSlot.findOne({ facultyId });

    if (!slot) return res.status(404).json({ message: "No record found" });
    res.json(slot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

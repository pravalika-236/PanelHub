
import express from "express";
import {
  createFacultySlot,
  getFacultySlot, updateFacultySlot,
  getCommonSlots,
  cleanupFacultySlot,
  getFacultyGroupByDepartment,
} from "../controllers/facultyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/faculties/:department", getFacultyGroupByDepartment);

router.post("/common-slots", getCommonSlots);

router.post("/:facultyId", createFacultySlot);

router.put("/:facultyId", updateFacultySlot);

router.get("/:facultyId", getFacultySlot);

router.put("/cleanup/:facultyId", cleanupFacultySlot);

export default router;

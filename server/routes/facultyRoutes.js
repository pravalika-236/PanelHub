import express from "express";
import mongoose from "mongoose";
import {
  createFacultySlot,
  getFacultySlot, updateFacultySlot,
  getConfirmedBookings,
  getCommonSlots,
  getUnapproveBooking,
  approveBooking,
  cleanupFacultySlot,
  getFacultyGroupByDepartment,
} from "../controllers/facultyController.js";
import FacultyFreeSlot from "../models/FacultyFreeSlot.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/faculties/:department", getFacultyGroupByDepartment);

router.get("/confirmed", getConfirmedBookings);
router.get("/unapproved", getUnapproveBooking);
router.post("/approve", approveBooking);
router.post("/common-slots", getCommonSlots);

router.post("/:facultyId", createFacultySlot);
router.put("/:facultyId", updateFacultySlot);
router.get("/:facultyId", getFacultySlot);

router.put("/cleanup/:facultyId", cleanupFacultySlot);

export default router;

import { Router } from "express";
const facultyRouter = Router();
import { createFacultySlot, getFacultySlot, updateFacultySlot } from "../controllers/facultyControllers.js";

facultyRouter.post("/:facultyId", createFacultySlot);
facultyRouter.put("/:facultyId", updateFacultySlot);
facultyRouter.get("/:facultyId", getFacultySlot);

export default facultyRouter;


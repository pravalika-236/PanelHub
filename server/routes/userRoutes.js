
import { Router } from "express";
const userRouter = Router();
import { registerScholar, registerFaculty, loginUser, getUserProfile, verifyToken, logoutUser } from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";

userRouter.post("/register/scholar", registerScholar);

userRouter.post("/register/faculty", registerFaculty);

userRouter.post("/login", loginUser);

userRouter.get("/:id", protect, getUserProfile);

userRouter.post("/verify-token", verifyToken);

userRouter.post("/logout", logoutUser);

export default userRouter;

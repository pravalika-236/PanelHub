const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

router.post("/register/scholar", userController.registerScholar);
router.post("/register/faculty", userController.registerFaculty);
router.post("/login", userController.loginUser);

router.get("/:id", protect, userController.getUserProfile);

router.post("/verify-token", userController.verifyToken);

router.post("/logout", userController.logoutUser);

module.exports = router;

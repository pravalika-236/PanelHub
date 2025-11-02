const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "15min" });
};

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department, courseCategory } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    if (!email.endsWith("@nitc.ac.in"))
      return res.status(400).json({ message: "Use a valid NITC email ID" });

    const newUser = await User.create({
      name, email, password, role, department, courseCategory
    });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(newUser._id, newUser.role),
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        courseCategory: newUser.courseCategory ? newUser.courseCategory : null
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Scholar register
exports.registerScholar = async (req, res) => {
  req.body.role = "Scholar";
  exports.registerUser(req, res);
};

// Faculty register
exports.registerFaculty = async (req, res) => {
  req.body.role = "Faculty";
  exports.registerUser(req, res);
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    res.json({
      message: "Login successful",
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Token
exports.verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ isValid: false, error: "Token missing" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ isValid: true, role: decoded.role, userId: decoded.id });
  } catch {
    res.status(401).json({ isValid: false, error: "Invalid or expired token" });
  }
};

// Logout
exports.logoutUser = async (req, res) => {
  res.json({ message: "Logout successful (handled in client)" });
};

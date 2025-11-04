const Faculty = require("../models/Faculty");

// GET /api/faculty/list
// If request has authenticated user (req.user), use req.user.department,
// otherwise allow department via query param: ?department=CSE
exports.getFacultiesByDepartment = async (req, res) => {
  try {
    const department = (req.user && req.user.department) || req.query.department;
    if (!department) {
      return res.status(400).json({ message: "Department is required" });
    }

    const faculties = await Faculty.find({ department }).select("name email department");
    res.json({ faculties });
  } catch (err) {
    console.error("getFacultiesByDepartment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

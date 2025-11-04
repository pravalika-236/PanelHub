import pkg from "jsonwebtoken";
import User from "../models/User.js";

const { verify } = pkg;

export async function protect(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      return res.status(401).json({ message: `Not authorized, invalid token ${error}` });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token" });
}

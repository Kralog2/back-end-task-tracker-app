import jwt from "jsonwebtoken";
import { getUserById } from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET;

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    {return res.status(401).json({ error: "No given token." });}

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    const user = await getUserById(payload.id);
    if (!user) {return res.status(401).json({ error: "User does not exists." });}

    req.user = { _id: user._id, role: user.role, username: user.username };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

export function authorizeRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authorized." });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ error: "Access denied." });
    }
    next();
  };
}

import { ObjectId } from "mongodb";
import {
  deleteUserById,
  getUserById,
  listUsers,
  updateUserRole,
} from "../models/userModel.js";

export async function getAllUsers(req, res) {
  try {
    const users = await listUsers();
    res.json(users);
  } catch {
    res.status(500).json({ error: "Error fetching users." });
  }
}

export async function getUser(req, res) {
  try {
    const id = req.user && ObjectId.isValid(req.user._id) ? req.user._id : null;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    if (req.user.role !== "admin" && id !== user._id.toString()) {
      return res.status(403).json({ error: "Access denied." });
    }

    res.json({
      id: user._id,
      username: user.username,
      role: user.role,
      passwordHash: undefined,
    });
  } catch {
    res.status(500).json({ error: "Error fetching user." });
  }
}

export async function editUserRole(req, res) {
  const roles = ["user", "admin"];
  try {
    const { role } = req.body;
    if (!role || !roles.includes(role)) {
      return res.status(400).json({ error: "Rol required." });
    }
    const updatedUser = await updateUserRole(req.params.id, role);
    res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      passwordHash: undefined,
    });
  } catch {
    res.status(500).json({ error: "Error updating rol." });
  }
}

export async function deleteUser(req, res) {
  try {
    const id =
      req.params.id && ObjectId.isValid(req.params.id) ? req.params.id : null;
    await deleteUserById(id);
    res.json({ message: "User deleted." });
  } catch {
    res.status(500).json({ error: "Error deleting user." });
  }
}

import { ObjectId } from "mongodb";
import {
  deleteUserById,
  getUserById,
  listUsers,
  updateUserRole,
} from "../models/userModel.js";

export async function getAllUsers(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied." });
    }
    const users = await listUsers();
    const safeusers = users.map((u) => ({
      id: u._id,
      username: u.username,
      role: u.role,
      createdAt: u.createdAt,
    }));
    res.json(safeusers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users." });
  }
}

export async function getUser(req, res) {
  try {
    const id = req.user && ObjectId.isValid(req.user._id) ? req.user._id : null;
    if (!id) {
      return res.status(400).json({ error: "Invalid user ID." });
    }
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const requesterId = String(req.user._id);
    const targetId = String(user._id);
    if (req.user.role !== "admin" && requesterId !== targetId) {
      return res.status(403).json({ error: "Access denied." });
    }

    const {passwordHash: _, ...usersafe} = user;
    res.json(usersafe);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user." });
  }
}

export async function editUserRole(req, res) {
  const roles = ["user", "admin"];
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied." });
    }
    const { id } = req.params;
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }
    const { role } = req.body;
    if (!role || !roles.includes(role)) {
      return res.status(400).json({ error: "Rol required." });
    }
    const updatedUser = await updateUserRole(id, role);
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }
    const {passwordHash: _, ...usersafe} = updatedUser;
    res.json(usersafe);
  } catch (error) {
    res.status(500).json({ error: "Error updating rol." });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }
    const requesterId = String(req.user._id);
    if (req.user.role !== "admin" && requesterId !== id) {
      return res.status(403).json({ error: "Access denied." });
    }
    const deleted = await deleteUserById(id);
    if (!deleted) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json({ message: "User deleted." });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user." });
  }
}

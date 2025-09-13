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
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    if (req.user.role !== "admin" && req.user._id !== user._id.toString()) {
      return res.status(403).json({ error: "Access denied." });
    }

    res.json({ id: user._id, username: user.username, role: user.role });
  } catch {
    res.status(500).json({ error: "Error fetching user." });
  }
}

export async function editUserRole(req, res) {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ error: "Rol requerido" });
    }
    const updatedUser = await updateUserRole(req.params.id, role);
    res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch {
    res.status(500).json({ error: "Error updating rol." });
  }
}

export async function deleteUser(req, res) {
  try {
    await deleteUserById(req.params.id);
    res.json({ message: "User deleted." });
  } catch {
    res.status(500).json({ error: "Error deleting user." });
  }
}

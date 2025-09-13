import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserById, getUserByName } from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const SALT_ROUNDS = 10;

export async function register(req, res) {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Require username and password." });
  }

  try {
    const existingUser = await getUserByName(username);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = {
      username,
      passwordHash,
      role: role || "user",
      createdAt: new Date(),
    };

    const user = await createUser(newUser);
    res.status(201).json({
      message: "User registered.",
      user: { ...user, passwordHash: undefined },
    });
  } catch {
    res.status(500).json({ error: "Server error." });
  }
}

export async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Require username and password." });
  }

  try {
    const user = await getUserByName(username);
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch {
    res.status(500).json({ error: "Server error." });
  }
}

export async function me(req, res) {
  try {
    const user = await getUserById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json(user);
  } catch {
    res.status(500).json({ error: "Server error." });
  }
}

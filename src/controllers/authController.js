import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserById, getUserByName } from "../models/userModel.js";
import { isValidData } from "../utils/utils.js";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const SALT_ROUNDS = 15;

export async function register(req, res) {
  try {
    const data = isValidData(req.body);
    if (!data.valid) {
      return res
        .status(400)
        .json({ error: data.errors || "Invalid input data." });
    }

    const existingUser = await getUserByName(data.user.username);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    const passwordHash = await bcrypt.hash(data.user.password, SALT_ROUNDS);
    const newUser = {
      username: data.user.username,
      passwordHash: passwordHash,
      role: data.user.role || "user",
      createdAt: new Date(),
    };
    const user = await createUser(newUser);
    res.status(201).json({
      message: "User registered.",
      user: { ...user, passwordHash: undefined },
    });
  } catch {
    res.status(500).json({
      error: "There was an error processing your request. Try again.",
    });
  }
}

export async function login(req, res) {
  try {
    const data = isValidData(req.body);
    if (!data.valid) {
      return res
        .status(400)
        .json({ error: data.errors || "Invalid input data." });
    }

    const user = await getUserByName(data.user.username);
    const match = await bcrypt.compare(data.user.password, user?.passwordHash);
    if (!user || !match) {
      return res.status(400).json({ error: "Invalid credentials." });
    }
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        passwordHash: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error,
      error: "There was an error processing your request. Try again.",
    });
  }
}

export async function me(req, res) {
  try {
    const id = req.user && ObjectId.isValid(req.user._id) ? req.user._id : null;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json({ ...user, passwordHash: undefined });
  } catch {
    res.status(500).json({
      error: "There was an error processing your request. Try again.",
    });
  }
}

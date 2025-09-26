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
      passwordHash,
      role: data.user.role || "user",
      createdAt: new Date(),
    };
    const user = await createUser(newUser);
    const {passwordHash: _, ...usersafe} = user;
    res.status(201).json({
      message: "User registered",
      user: usersafe,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error has occurred.",
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
      return res.status(400).json({ error: "User or password is incorrect." });
    }
    const payload = { id: user._id.toString(), role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const {passwordHash: _, ...usersafe} = user;
    res.json({
      message: "Login successful",
      token,
      user: usersafe,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
      error: "Error has occurred.",
    });
  }
}

export async function me(req, res) {
  try {
    const id = req.user && ObjectId.isValid(req.user._id) ? req.user._id : null;
    if (!id) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const {passwordHash: _, ...usersafe} = user;
    res.json({ user: usersafe });
  } catch (error) {
    res.status(500).json({
      error: "Error has occurred.",
    });
  }
}

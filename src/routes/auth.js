import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { register, login, me } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, me);

export default router;

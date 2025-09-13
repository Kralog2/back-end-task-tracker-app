import express from "express";
import { authenticate, authorizeRole } from "../middlewares/authMiddleware.js";
import {
  getAllUsers,
  getUser,
  editUserRole,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.use(authenticate);

router.get("/", authorizeRole("admin"), getAllUsers);

router.get("/:id", getUser);

router.put("/:id/role", authorizeRole("admin"), editUserRole);

router.delete("/:id", authorizeRole("admin"), deleteUser);

export default router;

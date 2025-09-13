import express from "express";
import {
  listTasks,
  getTask,
  createNewTask,
  updateExistingTask,
  deleteExistingTask
} from "../controllers/taskController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", listTasks);
router.get("/:id", getTask);
router.post("/", createNewTask);
router.put("/:id", updateExistingTask);
router.delete("/:id", deleteExistingTask);

export default router;

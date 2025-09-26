import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../models/taskModel.js";
import { ObjectId } from "mongodb";

export async function createNewTask(req, res) {
  try {
    const { title, description, status, assignedTo, dueDate } = req.body;
    const newTask = {
      title: title?.trim() || "Untitled Task",
      description: description?.trim() || "",
      status: status || "todo",
      assignedTo: assignedTo || "",
      createdBy: req.user._id,
      createdAt: new Date(),
      dueDate: dueDate ? new Date(dueDate) : null,
    };

    const task = await createTask(newTask);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Error creating new task." });
  }
}

export async function listTasks(req, res) {
  try {
    const tasks = await getTasks();
    res.json(tasks);
  } catch {
    res.status(500).json({ error: "Error getting tasks." });
  }
}

export async function getTask(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid task ID." });
    }
    const task = await getTaskById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Error getting task." });
  }
}

export async function updateExistingTask(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid task ID." });
    }

    const task = await getTaskById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    const requesterId = req.user._id;
    const ownerId = task.createdBy;
    if (req.user.role !== "admin" && ownerId !== requesterId) {
      return res.status(403).json({ error: "Not authorized." });
    }

    const updatedFields = { ...req.body };
    const updatedTask = await updateTask(id, updatedFields);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Error updating task." });
  }
}

export async function deleteExistingTask(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid task ID." });
    }
    const task = await getTaskById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    const requesterId = req.user._id;
    const ownerId = task.createdBy;
    if (req.user.role !== "admin" && ownerId !== requesterId) {
      return res.status(403).json({ error: "Not authorized." });
    }

    await deleteTask(id);
    res.json({ message: "Task deleted." });
  } catch {
    res.status(500).json({ error: "Error deleting task." });
  }
}

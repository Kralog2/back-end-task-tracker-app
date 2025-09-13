import { getDB } from "../../config/db.js";
import { ObjectId } from "mongodb";

const COLLECTION = "tasks";

export async function createTask(task) {
  const db = getDB();
  const result = await db.collection(COLLECTION).insertOne(task);
  return { ...task, _id: result.insertedId };
}

export async function getTasks() {
  const db = getDB();
  return await db.collection(COLLECTION).find({}).toArray();
}

export async function getTaskById(id) {
  const db = getDB();
  return await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
}

export async function updateTask(id, updatedFields) {
  const db = getDB();
  await db
    .collection(COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: updatedFields });
  return getTaskById(id);
}

export async function deleteTask(id) {
  const db = getDB();
  return await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}

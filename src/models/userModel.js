import { getDB } from "../../config/db.js";
import { ObjectId } from "mongodb";

const COLLECTION = "users";

export async function createUser(user) {
  const db = getDB();
  const result = await db.collection(COLLECTION).insertOne(user);
  return { ...user, _id: result.insertedId };
}

export async function listUsers() {
  const db = getDB();
  return await db
    .collection(COLLECTION)
    .find({}, { projection: { passwordHash: 0 } })
    .toArray();
}

export async function getUserById(id) {
  const db = getDB();
  return await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
}

export async function getUserByName(name) {
  const db = getDB();
  return await db
    .collection(COLLECTION)
    .findOne({ username: name });
}

export async function updateUserRole(id, role) {
  const db = getDB();
  await db
    .collection(COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: { role } });
  return getUserById(id);
}

export async function deleteUserById(id) {
  const db = getDB();
  return await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}

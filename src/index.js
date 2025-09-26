import express from "express";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import taskRoutes from "./routes/tasks.js";
import { setupSecurity } from "./middlewares/security.js";

dotenv.config();

const app = express();
app.use(express.json());
setupSecurity(app);

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
  });
});

export default app;
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import taskRoutes from "./routes/tasks.js";
import notificationRoutes from "./routes/notifications.js";
import { auth } from "./middleware/auth.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" } });
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));
    socket.userId = jwt.verify(token, process.env.JWT_SECRET).id;
    next();
  } catch { next(new Error("Invalid token")); }
});
io.on("connection", socket => { socket.join(`user:${socket.userId}`); socket.on("join-project", projectId => socket.join(`project:${projectId}`)); });
app.get("/api/health", (_, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/projects", auth, projectRoutes);
app.use("/api/tasks", auth, taskRoutes);
app.use("/api/notifications", auth, notificationRoutes);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});
const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/flowboard")
  .then(() => server.listen(port, () => console.log(`FlowBoard API listening on ${port}`)))
  .catch(err => { console.error("MongoDB connection failed:", err.message); process.exit(1); });

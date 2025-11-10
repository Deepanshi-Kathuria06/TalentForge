// server.js - Remove the users.js import
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Routes
import jobRoutes from "./routes/jobRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import openrouterRoutes from "./routes/openrouterRoutes.js";
import feedRoutes from "./routes/feed.js"; // 
import userRoutes from './routes/user.js'; 
import searchRoutes from './routes/searchRoutes.js';
import codingRoutes from './routes/codingRoutes.js'

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// ✅ CORS Setup
app.use(cors({
  origin: [
    "http://localhost:5179", 
    "http://localhost:5178",
    "http://localhost:5173", 
    "http://localhost:3000",
    "http://127.0.0.1:5178",
  "https://talent-forge.vercel.app" 


  ],
  credentials: true
}));

// ✅ Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/jobportal")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/openrouter", openrouterRoutes);
app.use("/api/feed", feedRoutes); 
app.use("/api/users", userRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/coding", codingRoutes);

// ✅ Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// ✅ Test Routes
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!", timestamp: new Date().toISOString() });
});

app.get("/api/feed/test", (req, res) => {
  res.json({ message: "Feed routes are working!", timestamp: new Date().toISOString() });
});

app.get("/api/bytez/test", (req, res) => {
  res.json({ message: "Bytez routes are working!", route: "/api/bytez/generate should be available" });
});

// ✅ Root Route
app.get("/", (req, res) => {
  res.json({
    message: "TalentForge Backend Server",
    version: "1.0.0",
    endpoints: {
      health: "GET /api/health",
      test: "GET /api/test",
      feed_test: "GET /api/feed/test",
      bytez_test: "GET /api/bytez/test",
      jobs: "GET /api/jobs",
      login: "POST /api/auth/login",
      bytez_generate: "POST /api/bytez/generate",
      feed_posts: "GET /api/feed/posts",
      create_post: "POST /api/feed/posts"
    }
  });
});

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`✅ Feed routes available at http://localhost:${PORT}/api/feed`);
});
// server.js
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import jobRoutes from "./routes/jobRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import 'dotenv/config';
import applicationRoutes from "./routes/applicationRoutes.js";

const app = express();

// ✅ SIMPLE CORS setup - No complex configuration
app.use(cors({
  origin: [
    "http://localhost:5178",
    "http://localhost:5173", 
    "http://localhost:3000",
    "http://127.0.0.1:5178"
  ],
  credentials: true
}));

// ✅ Manual CORS headers for preflight - WITHOUT using app.options('*')
app.use((req, res, next) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.status(200).end();
  }
  next();
});

// ✅ Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/jobportal")
.then(() => {
  console.log("✅ MongoDB connected successfully");
})
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
});

// ✅ Routes
app.use("/api/jobs", jobRoutes);
app.use("/api", authRoutes);
app.use("/api/applications", applicationRoutes);
// ✅ Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// ✅ Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "Backend is working!",
    timestamp: new Date().toISOString()
  });
});

// ✅ Root route
app.get("/", (req, res) => {
  res.json({ 
    message: 'TalentForge Backend Server',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      test: 'GET /api/test',
      jobs: 'GET /api/jobs',
      login: 'POST /api/login'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`✅ CORS enabled for frontend development`);
});
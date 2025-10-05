import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();
import 'dotenv/config';


// ✅ CORS
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));

// ✅ Body parser
app.use(bodyParser.json({ limit: "10mb" }));

// ✅ MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));

  

// ✅ Routes
app.use("/api", authRoutes);

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server running" });
});

// ✅ Start
app.listen(5000, () => console.log("🚀 Server on http://localhost:5000"));

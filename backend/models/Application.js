// models/Application.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  portfolio: String,
  coverLetter: {
    type: String,
    required: true
  },
  resume: {
    filename: String,
    originalName: String,
    path: String,
    size: Number
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "accepted", "rejected"],
    default: "pending"
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

const Application = mongoose.model("Application", applicationSchema);
export default Application;
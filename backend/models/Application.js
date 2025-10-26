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
  userName: String,
  userEmail: String,
  phone: String,
  portfolio: String,
  coverLetter: String,
  resume: {
    filename: String,
    originalName: String,
    path: String,
    size: Number
  },
  status: {
    type: String,
    default: "Pending"
  }
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);

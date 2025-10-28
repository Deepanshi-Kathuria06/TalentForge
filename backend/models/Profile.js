// models/Profile.js
import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  duration: String,
  description: String
});

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  link: String
});

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: String,
  bio: String,
  profilePhoto: String,
  experience: [experienceSchema],
  projects: [projectSchema],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Profile", profileSchema);

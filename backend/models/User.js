// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Basic auth fields
  userType: String,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: String,
  
  // Original fields
  university: String,
  major: String,
  graduationYear: String,
  company: String,
  industry: String,
  companySize: String,
  website: String,
  
  // LinkedIn-style Profile Fields
  title: { type: String, default: "" },
  location: { type: String, default: "" },
  bio: { type: String, default: "" },
  skills: { type: [String], default: [] },
  experience: { 
    type: [{
      title: String,
      company: String,
      duration: String,
      description: String
    }], 
    default: [] 
  },
  projects: { 
    type: [{
      name: String,
      description: String,
      technologies: String
    }], 
    default: [] 
  },
  education: { 
    type: [{
      school: String,
      degree: String,
      field: String,
      year: String
    }], 
    default: [] 
  },
  avatar: { type: String, default: "" },
  banner: { type: String, default: "" },
  connections: { type: Number, default: 0 },
  
  joinedDate: { type: Date, default: Date.now },
}, {
  timestamps: true
});

export default mongoose.model("User", userSchema);
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userType: String,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: String,
  university: String,
  major: String,
  graduationYear: String,
  company: String,
  industry: String,
  companySize: String,
  website: String,
  joinedDate: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);

import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  email: String,
  title: String,
  about: String,
  skills: [String],
  experience: [
    {
      company: String,
      role: String,
      duration: String,
    },
  ],
  education: [
    {
      institution: String,
      degree: String,
      year: String,
    },
  ],
  location: String,
  profilePhoto: String,
});

export default mongoose.model("Profile", profileSchema);

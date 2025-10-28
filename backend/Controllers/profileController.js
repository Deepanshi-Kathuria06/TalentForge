import Profile from "../models/Profile.js";
import User from "../models/User.js";

// Get or create current user's profile
export const createOrGetProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.params.id }).populate("user", "name email");

    if (!profile) {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      profile = new Profile({
        user: user._id,
        role: user.role,
        bio: "Welcome to my profile!",
      });
      await profile.save();
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get profile by ID
export const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id }).populate("user", "name email");
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.params.id },
      { $set: req.body },
      { new: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Search profiles by name
export const searchProfiles = async (req, res) => {
  try {
    const { q } = req.query;
    const users = await User.find({ name: new RegExp(q, "i") }).limit(10);
    const profiles = await Profile.find({ user: { $in: users.map(u => u._id) } }).populate("user", "name profilePhoto");
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

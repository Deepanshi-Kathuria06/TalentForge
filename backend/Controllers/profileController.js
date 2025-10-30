import User from "../models/User.js"; // or your actual user/profile model

// ✅ Get Profile by ID
export const getProfileById = async (req, res) => {
  try {
    const userId = req.params.id;
    const profile = await User.findById(userId);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    const profile = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Create or Get Profile
export const createOrGetProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let profile = await User.findById(userId);

    if (!profile) {
      profile = await User.create({ _id: userId, ...req.body });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Search Profiles
export const searchProfiles = async (req, res) => {
  try {
    const query = req.query.q;
    const profiles = await User.find({
      name: { $regex: query, $options: "i" },
    });
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

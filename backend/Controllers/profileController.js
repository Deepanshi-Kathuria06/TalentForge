import Profile from "../models/Profile.js";

// Create or Update Profile
export const createOrUpdateProfile = async (req, res) => {
  try {
    const { userId, name, bio, experience, projects, profilePhoto } = req.body;
    let profile = await Profile.findOne({ userId });

    if (profile) {
      profile.name = name;
      profile.bio = bio;
      profile.profilePhoto = profilePhoto;
      profile.experience = experience;
      profile.projects = projects;
      await profile.save();
      return res.json({ message: "Profile updated successfully", profile });
    }

    const newProfile = await Profile.create({
      userId,
      name,
      bio,
      profilePhoto,
      experience,
      projects
    });
    res.status(201).json({ message: "Profile created", profile: newProfile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get own profile
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get another user’s profile
export const getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id).populate("userId");
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search by name
export const searchProfiles = async (req, res) => {
  try {
    const name = req.params.name;
    const profiles = await Profile.find({
      name: { $regex: name, $options: "i" }
    });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Follow / Unfollow
export const followUser = async (req, res) => {
  const { followerId, followingId } = req.body;
  try {
    await Profile.findOneAndUpdate(
      { userId: followingId },
      { $addToSet: { followers: followerId } }
    );
    await Profile.findOneAndUpdate(
      { userId: followerId },
      { $addToSet: { following: followingId } }
    );
    res.json({ message: "Followed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const unfollowUser = async (req, res) => {
  const { followerId, followingId } = req.body;
  try {
    await Profile.findOneAndUpdate(
      { userId: followingId },
      { $pull: { followers: followerId } }
    );
    await Profile.findOneAndUpdate(
      { userId: followerId },
      { $pull: { following: followingId } }
    );
    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

import express from "express";
import {
  createOrUpdateProfile,
  getMyProfile,
  getProfileByUserId,
  searchProfiles,
  followUser,
  unfollowUser
} from "../Controllers/profileController";

const router = express.Router();

router.post("/create", createOrUpdateProfile); // Create or update
router.get("/me/:userId", getMyProfile);       // Get current user’s profile
router.get("/:id", getProfileByUserId);        // View other’s profile
router.get("/search/:name", searchProfiles);   // Search by name
router.post("/follow", followUser);            // Follow someone
router.post("/unfollow", unfollowUser);        // Unfollow

export default router;

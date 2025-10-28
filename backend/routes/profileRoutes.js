import express from "express"; 
import {
  getProfileById,
  updateProfile,
  createOrGetProfile,
  searchProfiles,
} from "../Controllers/profileController.js";


const router = express.Router();

router.get("/me/:id", createOrGetProfile);   // Get or create my profile
router.get("/:id", getProfileById);          // Get profile by user ID
router.put("/update/:id", updateProfile);    // Update profile
router.get("/search", searchProfiles);       // Search by name

export default router;

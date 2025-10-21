import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { sendToN8N } from "../automation/WlmMssg.js";

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const userData = req.body;

    // ✅ Check required fields
    if (!userData.name || !userData.email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // ✅ Prevent duplicate users
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // ✅ Hash password
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    // ✅ Save to DB
    const newUser = new User(userData);
    await newUser.save();

    console.log("✅ User saved:", newUser);

    // ✅ Send to n8n webhook
    await sendToN8N(newUser);

    // ✅ RETURN COMPLETE USER DATA (FIXED)
    const userResponse = {
      _id: newUser._id,
      id: newUser._id, // Include both _id and id for compatibility
      name: newUser.name,
      email: newUser.email,
      userType: newUser.userType,
      // Include user-type specific fields
      ...(newUser.userType === 'student' && {
        university: newUser.university,
        major: newUser.major,
        graduationYear: newUser.graduationYear
      }),
      ...(newUser.userType === 'company' && {
        industry: newUser.industry,
        companySize: newUser.companySize,
        website: newUser.website
      }),
      joinedDate: newUser.joinedDate
    };

    res.status(201).json({
      message: "Signup successful",
      user: userResponse, // ✅ Now returns complete user data
      success: true // ✅ Add success flag for consistency
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ error: "Signup failed: " + err.message });
  }
});

// ✅ Login Route - FIXED
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Login attempt for:", email);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(404).json({ error: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Invalid password for:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("✅ Login successful for:", user.name);

    // ✅ RETURN COMPLETE USER DATA (FIXED)
    const userResponse = {
      _id: user._id,
      id: user._id, // Include both _id and id for compatibility
      name: user.name,
      email: user.email,
      userType: user.userType,
      // Include user-type specific fields
      ...(user.userType === 'student' && {
        university: user.university,
        major: user.major,
        graduationYear: user.graduationYear
      }),
      ...(user.userType === 'company' && {
        industry: user.industry,
        companySize: user.companySize,
        website: user.website
      }),
      joinedDate: user.joinedDate
    };

    res.status(200).json({
      message: "Login successful",
      user: userResponse, // ✅ Now returns complete user data
      success: true // ✅ Add success flag for consistency
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Login failed: " + err.message });
  }
});

export default router;
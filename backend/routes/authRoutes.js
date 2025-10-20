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

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        userType: newUser.userType,
      },
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ error: "Signup failed: " + err.message });
  }
});
// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Return user info (never send password)
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Login failed: " + err.message });
  }
});


export default router;

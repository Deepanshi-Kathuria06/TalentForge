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

export default router;

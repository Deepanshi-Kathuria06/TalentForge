import express from "express";
import Application from "../models/Application.js";
import Job from "../models/Job.js";

const router = express.Router();

// ✅ POST - Create a new application
router.post("/", async (req, res) => {
  try {
    const {
      jobId,
      userId,
      userName,
      userEmail,
      phone,
      portfolio,
      coverLetter,
      resume,
      status
    } = req.body;

    if (!jobId || !userId) {
      return res.status(400).json({ message: "Job ID and User ID are required" });
    }

    // Optional: prevent duplicate applications
    const existing = await Application.findOne({ job: jobId, user: userId });
    if (existing) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    const newApp = new Application({
      job: jobId,
      user: userId,
      userName,
      userEmail,
      phone,
      portfolio,
      coverLetter,
      resume,
      status: status || "pending",
      appliedAt: new Date()
    });

    await newApp.save();
    res.status(201).json({ message: "Application submitted successfully", application: newApp });
  } catch (error) {
    console.error("❌ Error saving application:", error);
    res.status(500).json({ message: "Error saving application", error: error.message });
  }
});

// ✅ GET - Fetch all applications for a specific company
router.get("/company/:companyId", async (req, res) => {
  try {
    const { companyId } = req.params;

    const jobs = await Job.find({ company: companyId }).select("_id title");
    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("user", "name email resumeUrl")
      .populate("job", "title location");

    res.status(200).json({ applications });
  } catch (error) {
    console.error("❌ Error fetching company applications:", error);
    res.status(500).json({ message: "Error fetching company applications" });
  }
});

export default router;

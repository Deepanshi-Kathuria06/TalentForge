// routes/applicationRoutes.js
import express from "express";
import Application from "../models/Application.js";
import Job from "../models/Job.js";

const router = express.Router();

// ✅ Test route
router.get("/test", (req, res) => {
  res.json({ message: "Applications router is working!" });
});

// ✅ Apply for a job
router.post("/", async (req, res) => {
  try {
    console.log("📥 Received application request:", req.body);
    
    const { jobId, userId, userName, userEmail, phone, portfolio, coverLetter, resume } = req.body;

    // Create application
    const application = new Application({
      job: jobId,
      user: userId,
      userName,
      userEmail,
      phone,
      portfolio,
      coverLetter,
      resume: resume || {
        filename: "resume.pdf",
        originalName: "resume.pdf",
        path: "/uploads/resume.pdf",
        size: 1024
      }
    });

    const savedApplication = await application.save();
    
    // Update job application count
    await Job.findByIdAndUpdate(jobId, { 
      $inc: { applicationCount: 1 } 
    });

    console.log("✅ Application created successfully:", savedApplication._id);

    res.json({
      success: true,
      message: "Application submitted successfully!",
      application: savedApplication
    });

  } catch (error) {
    console.error("❌ Application error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to submit application"
    });
  }
});

export default router;
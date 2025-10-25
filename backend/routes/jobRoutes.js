// routes/jobRoutes.js
import express from "express";
import Job from "../models/Job.js";

const router = express.Router();

// ✅ Get all jobs (for user dashboard)
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// ✅ Get company's jobs
router.get("/company/:companyId", async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.params.companyId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Get company jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch company jobs' });
  }
});

// ✅ Create new job
router.post("/", async (req, res) => {
  try {
    const jobData = req.body;
    const job = new Job(jobData);
    const savedJob = await job.save();
    
    res.json({
      success: true,
      message: 'Job posted successfully',
      job: savedJob
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

export default router;
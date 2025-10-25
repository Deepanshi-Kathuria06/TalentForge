// backend/Controllers/jobController.js - SIMPLE VERSION
import Job from '../models/Job.js';

// ✅ Create a new job
export const createJob = async (req, res) => {
  try {
    const jobData = req.body;
    jobData.company = req.user._id; // Set company from authenticated user
    
    const job = new Job(jobData);
    const savedJob = await job.save();
    
    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      job: savedJob
    });
  } catch (error) {
    console.error('Job creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create job'
    });
  }
};

// ✅ Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('company', 'companyName');
    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// ✅ Get company's jobs
export const getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user._id }).populate('company', 'companyName');
    res.json(jobs);
  } catch (error) {
    console.error('Get company jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch company jobs' });
  }
};
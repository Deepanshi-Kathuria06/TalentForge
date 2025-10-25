// backend/Controllers/applicationController.js
import Application from '../models/Application.js';
import Job from '../models/Job.js';

// ✅ Apply for a job
export const applyJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const userId = req.user._id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      user: userId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        error: 'You have already applied for this job'
      });
    }

    // Create application
    const application = new Application({
      job: jobId,
      user: userId,
      coverLetter: coverLetter || '',
      status: 'pending',
      appliedAt: new Date()
    });

    const savedApplication = await application.save();

    // Populate job and user details
    await savedApplication.populate('job', 'title company');
    await savedApplication.populate('user', 'name email');

    // Increment application count on job
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationCount: 1 }
    });

    console.log('✅ Application submitted successfully');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application: savedApplication
    });

  } catch (error) {
    console.error('❌ Apply job error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to apply for job: ' + error.message
    });
  }
};

// ✅ Get user's applications
export const getUserApplications = async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await Application.find({ user: userId })
      .populate('job', 'title company location type salaryRange')
      .populate('user', 'name email')
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications: applications
    });

  } catch (error) {
    console.error('❌ Get user applications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch applications: ' + error.message
    });
  }
};

// ✅ Get company's applications (applications for company's jobs)
export const getCompanyApplications = async (req, res) => {
  try {
    const companyId = req.user._id;

    // First, get all jobs posted by this company
    const companyJobs = await Job.find({ company: companyId });
    const jobIds = companyJobs.map(job => job._id);

    // Then, get applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title company location type')
      .populate('user', 'name email avatar')
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications: applications
    });

  } catch (error) {
    console.error('❌ Get company applications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch company applications: ' + error.message
    });
  }
};

// ✅ Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: pending, accepted, or rejected'
      });
    }

    // Find application
    const application = await Application.findById(id)
      .populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    // Check if user owns the job (company authorization)
    if (application.job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this application'
      });
    }

    // Update application status
    application.status = status;
    application.updatedAt = new Date();
    
    const updatedApplication = await application.save();

    // Populate user details for response
    await updatedApplication.populate('user', 'name email');

    console.log(`✅ Application status updated to: ${status}`);

    res.json({
      success: true,
      message: `Application ${status} successfully`,
      application: updatedApplication
    });

  } catch (error) {
    console.error('❌ Update application status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update application status: ' + error.message
    });
  }
};

// ✅ Get application by ID
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job', 'title company location type salaryRange description requirements')
      .populate('user', 'name email avatar');

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    res.json({
      success: true,
      application: application
    });

  } catch (error) {
    console.error('❌ Get application by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch application: ' + error.message
    });
  }
};
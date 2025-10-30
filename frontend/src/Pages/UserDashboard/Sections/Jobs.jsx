// components/JobForm.js
import React, { useState } from "react";
import API from '../../../utils/api';

const JobForm = ({ onSuccess, user }) => {
  const [jobData, setJobData] = useState({
    title: "",
    location: "",
    type: "Full-time",
    salaryRange: "",
    description: "",
    requirements: "",
    category: "Engineering",
    skills: "",
    duration: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🚀 Starting job submission...");
      console.log("User data:", user);
      
      if (!user || !user._id) {
        alert("User not found. Please log in again.");
        setLoading(false);
        return;
      }

      const jobWithCompany = {
        ...jobData,
        company: user._id,
        companyName: user.name || user.companyName || "Your Company"
      };

      console.log("📦 Job data to send:", jobWithCompany);
      console.log("🔍 Testing endpoint: POST http://localhost:5000/api/jobs");
      
      const response = await API.post('/jobs', jobWithCompany);
      
      console.log("✅ Backend response received:", response.data);
      
      if (response.data.success) {
        alert("🎉 Job posted successfully! Saved to MongoDB database.");
        onSuccess(response.data.job);
        
        setJobData({
          title: "", location: "", type: "Full-time", salaryRange: "",
          description: "", requirements: "", category: "Engineering",
          duration: "", skills: ""
        });
      } else {
        alert("❌ " + (response.data.error || "Failed to post job"));
      }
    } catch (error) {
      console.error("💥 Job posting error:", error);
      
      if (error.response) {
        console.error("📡 Server responded with error:");
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
        
        if (error.response.status === 404) {
          alert("❌ Backend endpoint not found. Check if server is running on http://localhost:5000");
        } else if (error.response.status === 500) {
          alert("❌ Server error: " + (error.response.data?.error || "Internal server error"));
        } else {
          alert("❌ Error: " + (error.response.data?.error || "Unknown server error"));
        }
      } else if (error.request) {
        console.error("🌐 No response received:", error.request);
        alert("❌ Cannot connect to server. Make sure backend is running on http://localhost:5000");
      } else {
        console.error("⚡ Request setup error:", error.message);
        alert("❌ Unexpected error: " + error.message);
      }
      
      console.log("📝 Creating local job as fallback");
      const mockJob = {
        _id: Date.now().toString(),
        ...jobData,
        company: user._id,
        companyName: user.name || user.companyName || "Your Company",
        createdAt: new Date().toISOString(),
        applicationCount: 0
      };
      
      try {
        const existingJobs = JSON.parse(localStorage.getItem('demoJobs') || '[]');
        existingJobs.unshift(mockJob);
        localStorage.setItem('demoJobs', JSON.stringify(existingJobs));
        console.log("💾 Job saved to localStorage for UserDashboard");
      } catch (storageError) {
        console.error("Failed to save to localStorage:", storageError);
      }
      
      onSuccess(mockJob);
      alert("📋 Job saved locally (Backend not available). Students will see this job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="job-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>Post a New Job</h3>
        <p>Fill in the details below to create a new job posting</p>
      </div>

      <div className="form-section">
        <h4>Basic Information</h4>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="required">Job Title</label>
          <input 
            type="text" 
            name="title" 
            placeholder="e.g., Frontend Developer" 
            value={jobData.title} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label className="required">Location</label>
          <input 
            type="text" 
            name="location" 
            placeholder="e.g., Remote, New York" 
            value={jobData.location} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="required">Job Type</label>
          <select name="type" value={jobData.type} onChange={handleChange} disabled={loading}>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={jobData.category} onChange={handleChange} disabled={loading}>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Business">Business</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="form-section">
        <h4>Compensation & Details</h4>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Salary Range</label>
          <input 
            type="text" 
            name="salaryRange" 
            placeholder="e.g., $50,000 - $70,000" 
            value={jobData.salaryRange} 
            onChange={handleChange} 
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label>Duration (for internships)</label>
          <input 
            type="text" 
            name="duration" 
            placeholder="e.g., 3 months, 6 months" 
            value={jobData.duration} 
            onChange={handleChange} 
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Required Skills</label>
        <input 
          type="text" 
          name="skills" 
          placeholder="e.g., React, JavaScript, Node.js" 
          value={jobData.skills} 
          onChange={handleChange} 
          disabled={loading}
        />
      </div>

      <div className="form-section">
        <h4>Job Description</h4>
      </div>

      <div className="form-group">
        <label className="required">Job Description</label>
        <textarea 
          name="description" 
          placeholder="Describe the role, responsibilities, and what you're looking for..." 
          value={jobData.description} 
          onChange={handleChange} 
          rows="5"
          required
          disabled={loading}
        ></textarea>
      </div>

      <div className="form-group">
        <label>Requirements</label>
        <textarea 
          name="requirements" 
          placeholder="List the requirements and qualifications needed..." 
          value={jobData.requirements} 
          onChange={handleChange} 
          rows="4"
          disabled={loading}
        ></textarea>
      </div>

      <button 
        type="submit" 
        className="primary-btn" 
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="loading-spinner"></span>
            Posting Job...
          </>
        ) : (
          'Post Job Opportunity'
        )}
      </button>

      
    </form>
  );
};

export default JobForm;
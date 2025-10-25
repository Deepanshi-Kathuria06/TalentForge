// components/ApplicationModal.jsx
import React, { useState } from "react";
import { useAuth } from '../../Pages/Auth/AuthContext'; // ADD THIS IMPORT
import API from "../../utils/api";
import "./ApplicationModal.css";

const ApplicationModal = ({ job, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    coverLetter: "",
    phone: "",
    portfolio: ""
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // GET USER FROM AUTH CONTEXT

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ VALIDATE USER DATA FIRST
      if (!user || !user._id) {
        alert("Please log in to apply for jobs");
        setLoading(false);
        return;
      }

      // ✅ VALIDATE REQUIRED FIELDS
      if (!formData.coverLetter.trim()) {
        alert("Please write a cover letter");
        setLoading(false);
        return;
      }

      if (!formData.phone.trim()) {
        alert("Please provide your phone number");
        setLoading(false);
        return;
      }

      if (!resumeFile) {
        alert("Please upload your resume");
        setLoading(false);
        return;
      }

      console.log("🚀 Submitting application with user:", user);

      // ✅ USE REAL USER DATA FROM AUTH CONTEXT
      const applicationData = {
        jobId: job._id,
        userId: user._id,
        userName: user.name || user.username || "Applicant",
        userEmail: user.email,
        phone: formData.phone,
        portfolio: formData.portfolio,
        coverLetter: formData.coverLetter,
        resume: {
          filename: resumeFile.name,
          originalName: resumeFile.name,
          path: `/uploads/${resumeFile.name}`, // In real app, you'd upload this to server
          size: resumeFile.size
        }
      };

      console.log("📦 Application data:", applicationData);

      const response = await API.post("/applications", applicationData);
      
      console.log("✅ Application response:", response.data);
      
      if (response.data.success) {
        alert("🎉 Application submitted successfully!");
        onSuccess(response.data.application);
        onClose();
        
        // Reset form
        setFormData({ coverLetter: "", phone: "", portfolio: "" });
        setResumeFile(null);
      } else {
        alert(response.data.error || "Failed to submit application");
      }
    } catch (error) {
      console.error("💥 Application error:", error);
      
      // ✅ BETTER ERROR HANDLING
      if (error.response) {
        console.error("Error response:", error.response.data);
        if (error.response.status === 400) {
          alert(error.response.data.error || "You have already applied for this job");
        } else if (error.response.status === 500) {
          alert("Server error. Please try again later.");
        } else {
          alert(error.response.data?.error || "Failed to submit application");
        }
      } else if (error.request) {
        alert("Cannot connect to server. Please check your internet connection.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="application-modal">
        <div className="modal-header">
          <h2>Apply for {job.title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="application-form">
          {/* ✅ SHOW USER INFO */}
          <div className="user-info-section">
            <h4>Your Information</h4>
            <div className="user-details">
              <p><strong>Name:</strong> {user?.name || "Not provided"}</p>
              <p><strong>Email:</strong> {user?.email || "Not provided"}</p>
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+1 234 567 8900"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Portfolio/Website (Optional)</label>
            <input
              type="url"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              placeholder="https://yourportfolio.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Upload Resume *</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              required
              disabled={loading}
            />
            <small>Accepted formats: PDF, DOC, DOCX (Max: 5MB)</small>
            {resumeFile && (
              <div className="file-preview">
                ✅ Selected: {resumeFile.name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Cover Letter *</label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              required
              rows="6"
              placeholder="Why are you interested in this position? What makes you a good fit?..."
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-cancel"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="btn-apply"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
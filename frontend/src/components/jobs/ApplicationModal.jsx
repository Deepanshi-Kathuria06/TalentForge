import React, { useState, useEffect } from "react";
import { useAuth } from '../../Pages/Auth/AuthContext';
import API from "../../utils/api";
import "./ApplicationModal.css";

// Constants
const APPLICATION_STATUS = {
  PENDING: "pending",
  REVIEWED: "reviewed",
  ACCEPTED: "accepted",
  REJECTED: "rejected"
};

const FILE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  ACCEPTED_EXTENSIONS: ['.pdf', '.doc', '.docx']
};

const APPLICATION_LIMIT = 50; // Maximum applications per user

const ApplicationModal = ({ job, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    coverLetter: "",
    phone: "",
    portfolio: ""
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27 && !loading) onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose, loading]);

  const resetForm = () => {
    setFormData({
      coverLetter: "",
      phone: "",
      portfolio: ""
    });
    setResumeFile(null);
    setErrors({});
    setSuccess(false);
  };

  const validateFile = (file) => {
    if (!file) return "Please select a resume file";

    if (!FILE_CONFIG.ACCEPTED_TYPES.includes(file.type)) {
      return `Please upload a valid file type: ${FILE_CONFIG.ACCEPTED_EXTENSIONS.join(', ')}`;
    }

    if (file.size > FILE_CONFIG.MAX_SIZE) {
      return "File size must be less than 5MB";
    }

    return null;
  };

  const formatPhoneNumber = (value) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length === 0) return '';
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const formatted = formatPhoneNumber(value);
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setResumeFile(null);
      return;
    }

    const fileError = validateFile(file);
    if (fileError) {
      setErrors(prev => ({ ...prev, resume: fileError }));
      setResumeFile(null);
      e.target.value = ''; // Reset file input
      return;
    }

    setResumeFile(file);
    setErrors(prev => ({ ...prev, resume: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = "Cover letter is required";
    } else if (formData.coverLetter.trim().length < 50) {
      newErrors.coverLetter = "Cover letter should be at least 50 characters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (formData.portfolio && !isValidUrl(formData.portfolio)) {
      newErrors.portfolio = "Please enter a valid URL";
    }

    const fileError = validateFile(resumeFile);
    if (fileError) {
      newErrors.resume = fileError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const checkApplicationLimit = () => {
    const existingApplications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    const userApplications = existingApplications.filter(app => 
      app.user._id === user._id
    );
    return userApplications.length < APPLICATION_LIMIT;
  };

  const checkDuplicateApplication = (jobId, userId) => {
    const existingApplications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    return existingApplications.some(app => 
      app.job._id === jobId && app.user._id === userId
    );
  };

  const sendToBackend = async (applicationData) => {
    try {
      const response = await API.post("/applications", applicationData);
      return { success: true, data: response.data };
    } catch (error) {
      console.warn("Backend save failed, using localStorage only:", error);
      return { success: false, error };
    }
  };

  const debugLocalStorage = () => {
    const stored = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    console.log("🔍 DEBUG - Stored applications:", stored);
    console.log("📊 Total applications:", stored.length);
    
    const companyApps = stored.filter(app => 
      app.job?.company === user?._id || app.job?.company?._id === user?._id
    );
    console.log("🏢 Applications for this company:", companyApps);
    
    return stored;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validate job data
      if (!job || !job._id) {
        setErrors({ general: "Job information is missing. Please try again." });
        setLoading(false);
        return;
      }

      // Validate user data
      if (!user || !user._id) {
        setErrors({ general: "Please log in to apply for jobs" });
        setLoading(false);
        return;
      }

      // Check application limit
      if (!checkApplicationLimit()) {
        setErrors({ general: `You've reached the maximum number of applications (${APPLICATION_LIMIT}).` });
        setLoading(false);
        return;
      }

      // Check for duplicate application
      if (checkDuplicateApplication(job._id, user._id)) {
        setErrors({ general: "You have already applied for this job!" });
        setLoading(false);
        return;
      }

      // Validate form data
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      console.log("🚀 Creating application for job:", job._id);

      // Create application object
      const application = {
        _id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        job: {
          _id: job._id,
          title: job.title || "Unknown Job",
          company: job.company,
          companyName: job.companyName || job.company?.companyName || "Unknown Company",
          location: job.location || "Unknown Location",
          salary: job.salary || "Not specified"
        },
        user: {
          _id: user._id,
          name: user.name || user.username || "Applicant",
          email: user.email,
          avatar: user.avatar
        },
        userName: user.name || user.username || "Applicant",
        userEmail: user.email,
        phone: formData.phone,
        portfolio: formData.portfolio,
        coverLetter: formData.coverLetter.trim(),
        resume: {
          filename: `resume_${Date.now()}_${resumeFile.name}`,
          originalName: resumeFile.name,
          path: `/uploads/resume_${Date.now()}_${resumeFile.name}`,
          size: resumeFile.size,
          type: resumeFile.type
        },
        status: APPLICATION_STATUS.PENDING,
        appliedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log("📦 Application data:", application);

      // Save to localStorage
      const existingApplications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
      existingApplications.unshift(application);
      localStorage.setItem('jobApplications', JSON.stringify(existingApplications));
      
      console.log("💾 Saved to localStorage. Total applications:", existingApplications.length);
      debugLocalStorage();

      // Try to send to backend (silent failure)
      const backendData = {
        jobId: job._id,
        userId: user._id,
        userName: application.userName,
        userEmail: user.email,
        phone: formData.phone,
        portfolio: formData.portfolio,
        coverLetter: formData.coverLetter,
        resume: application.resume,
        status: APPLICATION_STATUS.PENDING
      };
      
      const backendResult = await sendToBackend(backendData);
      if (backendResult.success) {
        console.log("✅ Also saved to backend:", backendResult.data);
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess(application);
        onClose();
        resetForm();
      }, 1500);

    } catch (error) {
      console.error("💥 Unexpected error:", error);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  // Don't render if not open or job is null
  if (!isOpen || !job) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="application-modal">
        <div className="modal-header">
          <h2>Apply for {job.title || "this position"}</h2>
          <button 
            className="close-btn" 
            onClick={onClose}
            disabled={loading}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="application-form" noValidate>
          {/* Success Message */}
          {success && (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h3>Application Submitted Successfully!</h3>
              <p>Your application has been received and is under review.</p>
            </div>
          )}

          {/* Error Messages */}
          {errors.general && (
            <div className="error-message general-error">
              <strong>Error:</strong> {errors.general}
            </div>
          )}

          {!success && (
            <>
              {/* User Information Section */}
              <div className="user-info-section">
                <h4>Your Information</h4>
                <div className="user-details">
                  <p><strong>Name:</strong> {user?.name || user?.username || "Not provided"}</p>
                  <p><strong>Email:</strong> {user?.email || "Not provided"}</p>
                  <p><strong>Position:</strong> {job.title || "Unknown Position"}</p>
                  <p><strong>Company:</strong> {job.companyName || job.company?.companyName || "Unknown Company"}</p>
                  {job.location && <p><strong>Location:</strong> {job.location}</p>}
                  {job.salary && <p><strong>Salary:</strong> {job.salary}</p>}
                </div>
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="(123) 456-7890"
                  disabled={loading}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              {/* Portfolio */}
              <div className="form-group">
                <label htmlFor="portfolio">Portfolio/Website (Optional)</label>
                <input
                  id="portfolio"
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  placeholder="https://yourportfolio.com"
                  disabled={loading}
                  className={errors.portfolio ? 'error' : ''}
                />
                {errors.portfolio && <span className="error-text">{errors.portfolio}</span>}
              </div>

              {/* Resume Upload */}
              <div className="form-group">
                <label htmlFor="resume">Upload Resume</label>
                <input
                  id="resume"
                  type="file"
                  accept={FILE_CONFIG.ACCEPTED_EXTENSIONS.join(',')}
                  onChange={handleFileChange}
                  required
                  disabled={loading}
                  className={errors.resume ? 'error' : ''}
                />
                <small>Accepted formats: PDF, DOC, DOCX (Max: 5MB)</small>
                {resumeFile && (
                  <div className="file-preview">
                    Selected: {resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
                {errors.resume && <span className="error-text">{errors.resume}</span>}
              </div>

              {/* Cover Letter */}
              <div className="form-group">
                <label htmlFor="coverLetter">Cover Letter</label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Why are you interested in this position? What makes you a good fit? Please write at least 50 characters..."
                  disabled={loading}
                  className={errors.coverLetter ? 'error' : ''}
                />
                <div className={`character-count ${formData.coverLetter.length < 50 ? 'low' : 'good'}`}>
                  {formData.coverLetter.length} characters
                  {formData.coverLetter.length < 50 && ` (minimum 50 required)`}
                </div>
                {errors.coverLetter && <span className="error-text">{errors.coverLetter}</span>}
              </div>

              {/* Form Actions */}
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
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
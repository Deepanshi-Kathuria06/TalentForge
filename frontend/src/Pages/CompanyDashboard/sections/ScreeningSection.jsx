// components/ScreeningSection.jsx
import React, { useState, useEffect, useContext } from "react";
import API from "../../../utils/api";
import "./ScreeningSection.css";
import { useAuth } from '../../Auth/AuthContext';

const ScreeningSection = () => {
    const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);


  // 🔹 Fetch applications when user (company) is loaded
  useEffect(() => {
    if (user && (user._id || user.id)) {
      fetchApplications();
    }
  }, [user]);

  // ✅ Fetch all applications for logged-in company
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const companyId = user?._id || user?.id; // ✅ fix: defined companyId properly

      if (!companyId) {
        console.error("⚠️ No company ID found");
        setLoading(false);
        return;
      }

      console.log("📡 Fetching applications for company:", companyId);

      const res = await API.get(`/applications/company/${companyId}`);
      console.log("✅ Applications fetched:", res.data);

      // ✅ Ensure correct structure
      const apps = Array.isArray(res.data)
        ? res.data
        : res.data.applications || [];

      setApplications(apps);
    } catch (error) {
      console.error("❌ Failed to fetch applications:", error);
      setApplications([]); // fallback empty
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update application status
  const updateApplicationStatus = async (applicationId, status) => {
    try {
      console.log("📝 Updating status:", applicationId, status);

      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status } : app
        )
      );

      await API.put(`/applications/${applicationId}/status`, { status });
      console.log("✅ Status updated in backend");

      alert(`✅ Application marked as ${status}!`);
    } catch (error) {
      console.error("❌ Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  // ✅ Track actions like "viewed" or "downloaded"
  const trackApplicationAction = async (applicationId, action) => {
    try {
      console.log(`📊 Tracking ${action} for application:`, applicationId);

      const updateData = {
        [`${action}At`]: new Date().toISOString(),
        [`${action}By`]: user?._id,
      };

      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, ...updateData } : app
        )
      );

      await API.put(`/applications/${applicationId}/track`, {
        action,
        companyId: user?._id,
      });

      console.log(`✅ ${action} tracked in backend`);
      if (action === "downloaded") alert("📥 Resume downloaded successfully!");
    } catch (error) {
      console.error(`❌ Error tracking ${action}:`, error);
    }
  };

  // ✅ Simulate resume download
  const downloadResume = (application) => {
    trackApplicationAction(application._id, "downloaded");

    const blob = new Blob([`Resume for ${application.userName}`], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume-${application.userName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="applications-loading">
        <div className="loading-spinner"></div>
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="screening-section">
      <div className="screening-header">
        <h3>Job Applications ({applications.length})</h3>
        <button
          className="refresh-btn"
          onClick={fetchApplications}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="applications-empty">
          <div className="empty-icon">📝</div>
          <h4>No Applications Yet</h4>
          <p>Applications from candidates will appear here</p>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((application) => (
            <div
              key={application._id}
              className="application-item"
              data-status={application.status}
            >
              <div className="application-main">
                <div className="applicant-info">
                  <img
                    src={
                      application.user?.avatar ||
                      "https://randomuser.me/api/portraits/men/32.jpg"
                    }
                    alt={application.userName}
                    className="applicant-avatar"
                  />
                  <div className="applicant-details">
                    <div className="applicant-header">
                      <h4>{application.userName}</h4>
                      <span className={`status-badge ${application.status}`}>
                        {application.status}
                      </span>
                    </div>
                    <p className="applicant-email">{application.userEmail}</p>
                    <p className="job-applied">
                      Applied for: <strong>{application.job?.title}</strong>
                    </p>
                    <p className="application-date">
                      Applied:{" "}
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </p>

                    {/* Status indicators */}
                    <div className="status-indicators">
                      {application.viewedAt && (
                        <span className="status-indicator viewed">
                          ✅ Viewed on{" "}
                          {new Date(
                            application.viewedAt
                          ).toLocaleDateString()}
                        </span>
                      )}
                      {application.downloadedAt && (
                        <span className="status-indicator downloaded">
                          📥 Resume downloaded on{" "}
                          {new Date(
                            application.downloadedAt
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="application-actions">
                  <button
                    className="btn-view"
                    onClick={() => {
                      setSelectedApplication(
                        selectedApplication?._id === application._id
                          ? null
                          : application
                      );
                      trackApplicationAction(application._id, "viewed");
                    }}
                  >
                    {selectedApplication?._id === application._id
                      ? "Hide Details"
                      : "View Details"}
                  </button>

                  <button
                    className="btn-download"
                    onClick={() => downloadResume(application)}
                  >
                    Download Resume
                  </button>

                  <select
                    value={application.status}
                    onChange={(e) =>
                      updateApplicationStatus(application._id, e.target.value)
                    }
                    className="status-select"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="reviewed">👀 Reviewed</option>
                    <option value="accepted">✅ Accepted</option>
                    <option value="rejected">❌ Rejected</option>
                  </select>
                </div>
              </div>

              {/* Application details */}
              {selectedApplication &&
                selectedApplication._id === application._id && (
                  <div className="application-details">
                    <div className="details-header">
                      <h5>Application Details</h5>
                      <button onClick={() => setSelectedApplication(null)}>
                        ×
                      </button>
                    </div>
                    <div className="details-content">
                      <div className="detail-row">
                        <strong>Phone:</strong>{" "}
                        {application.phone || "Not provided"}
                      </div>
                      <div className="detail-row">
                        <strong>Portfolio:</strong>{" "}
                        {application.portfolio ? (
                          <a
                            href={application.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {application.portfolio}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </div>
                      <div className="detail-row">
                        <strong>Cover Letter:</strong>
                      </div>
                      <div className="cover-letter">
                        {application.coverLetter}
                      </div>
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScreeningSection;

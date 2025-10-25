// components/ScreeningSection.jsx
import React, { useState, useEffect } from 'react';
import API from '../../../utils/api';
import './ScreeningSection.css';

const ScreeningSection = ({ user }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      const response = await API.get(`/applications/company/${user._id}`);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await API.put(`/applications/${applicationId}/status`, { status });
      setApplications(prev => prev.map(app => 
        app._id === applicationId ? { ...app, status } : app
      ));
      alert(`Application ${status}`);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const trackAction = async (applicationId, action) => {
    try {
      await API.put(`/applications/${applicationId}/track`, { 
        action,
        companyId: user._id 
      });
      
      // Update local state
      setApplications(prev => prev.map(app => 
        app._id === applicationId ? { 
          ...app, 
          [`${action}At`]: new Date(),
          [`${action}By`]: user._id 
        } : app
      ));
    } catch (error) {
      console.error('Error tracking action:', error);
    }
  };

  if (loading) return <div>Loading applications...</div>;

  return (
    
    <div className="screening-section">
      <div className="screening-header">
        <h4>Total Applications: {applications.length}</h4>
        <div className="status-filters">
          <span className={`status-filter ${!selectedApplication ? 'active' : ''}`}>
            All ({applications.length})
          </span>
          <span className="status-filter">
            Pending ({applications.filter(app => app.status === 'pending').length})
          </span>
          <span className="status-filter">
            Reviewed ({applications.filter(app => app.status === 'reviewed').length})
          </span>
        </div>
      </div>

      <div className="applications-list">
        {applications.map(application => (
          <div key={application._id} className="application-item">
            <div className="application-main">
              <div className="applicant-info">
                <img 
                  src={application.user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} 
                  alt={application.userName}
                  className="applicant-avatar"
                />
                <div>
                  <h5>{application.userName}</h5>
                  <p>{application.userEmail}</p>
                  <p>Applied for: <strong>{application.job?.title}</strong></p>
                  <p className="application-date">
                    Applied: {new Date(application.appliedAt).toLocaleDateString()}
                  </p>
                  
                  {/* Status indicators */}
                  {application.viewedAt && (
                    <p className="status-indicator viewed">
                      ✅ Viewed by company
                    </p>
                  )}
                  {application.downloadedAt && (
                    <p className="status-indicator downloaded">
                      📥 Resume downloaded
                    </p>
                  )}
                </div>
              </div>

              <div className="application-actions">
                <button 
                  className="btn-view"
                  onClick={() => {
                    setSelectedApplication(application);
                    trackAction(application._id, 'viewed');
                  }}
                >
                  View Details
                </button>
                <button 
                  className="btn-download"
                  onClick={() => trackAction(application._id, 'downloaded')}
                >
                  Download Resume
                </button>
                
                <select 
                  value={application.status}
                  onChange={(e) => updateStatus(application._id, e.target.value)}
                  className="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Application details modal */}
            {selectedApplication && selectedApplication._id === application._id && (
              <div className="application-details">
                <div className="details-header">
                  <h5>Application Details</h5>
                  <button onClick={() => setSelectedApplication(null)}>×</button>
                </div>
                <div className="details-content">
                  <p><strong>Phone:</strong> {application.phone}</p>
                  <p><strong>Portfolio:</strong> {application.portfolio}</p>
                  <p><strong>Cover Letter:</strong></p>
                  <div className="cover-letter">{application.coverLetter}</div>
                </div>
              </div>
            )}
          </div>
        ))}
        
      </div>
    </div>
  );
};

export default ScreeningSection;
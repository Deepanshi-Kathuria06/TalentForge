// components/UserApplications.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import './UserApplications.css';

const UserApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchUserApplications();
  }, [user]);

  const fetchUserApplications = () => {
    setLoading(true);
    try {
      // Get applications from localStorage
      const storedApplications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
      
      // Filter applications for current user
      const userApplications = storedApplications.filter(app => 
        app.user?._id === user?._id || app.userId === user?._id
      );
      
      console.log("📋 User applications:", userApplications);
      setApplications(userApplications);
    } catch (error) {
      console.error('Error fetching user applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusMessage = (application) => {
    const status = application.status;
    const viewedAt = application.viewedAt;
    const downloadedAt = application.downloadedAt;
    
    let message = '';
    
    switch(status) {
      case 'pending':
        message = '⏳ Your application is under review';
        break;
      case 'reviewed':
        message = '👀 Your application has been reviewed';
        break;
      case 'accepted':
        message = '🎉 Congratulations! Your application was accepted!';
        break;
      case 'rejected':
        message = '❌ Your application was not selected';
        break;
      default:
        message = '⏳ Application submitted';
    }
    
    if (viewedAt) {
      message += ` • Viewed on ${new Date(viewedAt).toLocaleDateString()}`;
    }
    
    if (downloadedAt) {
      message += ` • Resume downloaded on ${new Date(downloadedAt).toLocaleDateString()}`;
    }
    
    return message;
  };

  if (loading) {
    return <div className="loading">Loading your applications...</div>;
  }

  return (
    <div className="user-applications">
      <div className="applications-header">
        <h2>Your Job Applications ({applications.length})</h2>
        <button onClick={fetchUserApplications} className="refresh-btn">
          Refresh
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="empty-applications">
          <div className="empty-icon">📮</div>
          <h3>No Applications Yet</h3>
          <p>Apply to jobs to track your application status here</p>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((application) => (
            <div key={application._id} className="application-card">
              <div className="application-header">
                <h3>{application.job?.title}</h3>
                <span className={`status-badge ${application.status}`}>
                  {application.status}
                </span>
              </div>
              
              <div className="company-info">
                <strong>Company:</strong> {application.job?.companyName}
              </div>
              
              <div className="application-date">
                Applied: {new Date(application.appliedAt).toLocaleDateString()}
              </div>
              
              <div className="status-message">
                {getStatusMessage(application)}
              </div>
              
              <div className="application-actions">
                <button className="btn-view-job">
                  View Job Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserApplications;
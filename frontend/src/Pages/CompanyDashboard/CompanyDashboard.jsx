import React, { useState } from 'react';
import './Dashboard.css';

const CompanyDashboard = ({ user, onLogout }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarExpanded ? 'expanded' : ''}`}>
        <div className="logo-container">
          <div className="logo">
            <span className="logo-icon"><i className="fas fa-briefcase"></i></span>
            {sidebarExpanded && <span className="logo-text">CareerConnect</span>}
          </div>
          <button className="toggle-btn" onClick={toggleSidebar}>
            <i className={`fas ${sidebarExpanded ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
          </button>
        </div>
        
        <div className="menu-items">
          {[
            { icon: 'fa-chart-pie', text: 'Stats' },
            { icon: 'fa-briefcase', text: 'Jobs' },
            { icon: 'fa-newspaper', text: 'Posts' },
            { icon: 'fa-file-alt', text: 'Apps' },
            { icon: 'fa-robot', text: 'ATS' },
            { icon: 'fa-handshake', text: 'Match' },
            { icon: 'fa-users', text: 'Team' },
            { icon: 'fa-cog', text: 'Settings' }
          ].map((item, index) => (
            <div key={index} className="menu-item">
              <span className="menu-icon"><i className={`fas ${item.icon}`}></i></span>
              {sidebarExpanded && <span className="menu-text">{item.text}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search candidates, skills, or jobs..." />
          </div>
          
          <div className="profile-section">
            <div className="stats">
              <div className="stat-item">
                <span className="stat-value">142</span>
                <span className="stat-label">Applicants</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">24</span>
                <span className="stat-label">Open Jobs</span>
              </div>
            </div>
            
            <div className="profile">
              <img src="https://randomuser.me/api/portraits/men/12.jpg" alt="Profile" className="profile-img" />
              <div className="profile-info">
    <span className="profile-name">{user?.name || 'User'}</span>
                <span className="profile-role">Hiring Manager</span>
              </div>
              <button className="logout-btn" onClick={onLogout}>
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="left-column">
            {/* Highlight Card */}
            <div className="card highlight-card">
              <h3>Recruitment Overview</h3>
              <div className="stats-overview">
                <div className="overview-item">
                  <span className="overview-value">42</span>
                  <span className="overview-label">New Applicants</span>
                </div>
                <div className="overview-item">
                  <span className="overview-value">5,289</span>
                  <span className="overview-label">Profile Views</span>
                </div>
                <div className="overview-item">
                  <span className="overview-value">87%</span>
                  <span className="overview-label">Response Rate</span>
                </div>
              </div>
            </div>

            {/* Statistics Graph */}
            <div className="card">
              <h3>Applications Trends</h3>
              <div className="graph-placeholder">
                <i className="fas fa-chart-line graph-icon"></i>
                <p>Application trends visualization</p>
              </div>
            </div>

            {/* Ongoing Applications */}
            <div className="card">
              <h3>Ongoing Applications</h3>
              <div className="application-cards">
                <div className="application-card">
                  <h4>Senior Frontend Developer</h4>
                  <div className="applicant-stats">
                    <span><strong>24</strong> Applicants</span>
                    <span><strong>82%</strong> Avg. Match</span>
                  </div>
                  <div className="application-actions">
                    <button className="primary-btn">View Applicants</button>
                    <button className="secondary-btn">Edit Job</button>
                  </div>
                </div>
                <div className="application-card">
                  <h4>UX/UI Designer</h4>
                  <div className="applicant-stats">
                    <span><strong>18</strong> Applicants</span>
                    <span><strong>76%</strong> Avg. Match</span>
                  </div>
                  <div className="application-actions">
                    <button className="primary-btn">View Applicants</button>
                    <button className="secondary-btn">Edit Job</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="right-column">
            {/* Recruiter Status */}
            <div className="card">
              <h3>Team Activity</h3>
              <div className="team-activity">
                <div className="activity-item">
                  <img src="https://randomuser.me/api/portraits/women/33.jpg" alt="Team Member" />
                  <div className="activity-info">
                    <h4>Sarah Johnson</h4>
                    <p>Reviewing resumes for Frontend position</p>
                    <span className="activity-time">Active now</span>
                  </div>
                </div>
                <div className="activity-item">
                  <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Team Member" />
                  <div className="activity-info">
                    <h4>Michael Chen</h4>
                    <p>Conducting technical interviews</p>
                    <span className="activity-time">30 min ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <img src="https://randomuser.me/api/portraits/women/67.jpg" alt="Team Member" />
                  <div className="activity-info">
                    <h4>Emily Rodriguez</h4>
                    <p>Posting new job openings</p>
                    <span className="activity-time">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Suggestions */}
            <div className="card">
              <h3>Suggested Candidates</h3>
              <div className="suggestions">
                <div className="suggestion-item">
                  <img src="https://randomuser.me/api/portraits/women/28.jpg" alt="Candidate" />
                  <div className="suggestion-info">
                    <h4>Jessica Williams</h4>
                    <p>Frontend Developer</p>
                    <div className="match-score">92% Match</div>
                  </div>
                  <button className="action-btn"><i className="fas fa-eye"></i></button>
                </div>
                <div className="suggestion-item">
                  <img src="https://randomuser.me/api/portraits/men/42.jpg" alt="Candidate" />
                  <div className="suggestion-info">
                    <h4>David Kim</h4>
                    <p>UX Designer</p>
                    <div className="match-score">88% Match</div>
                  </div>
                  <button className="action-btn"><i className="fas fa-eye"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
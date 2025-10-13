import React, { useState } from 'react';
import './Dashboard.css';

const CompanyDashboard = ({ user, onLogout }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activePage, setActivePage] = useState('posts'); // Changed default to 'posts'
  const [posts, setPosts] = useState([
    {
      id: 1,
      authorName: user?.name || 'TalentForge',
      authorRole: 'Hiring Manager',
      authorAvatar: 'https://randomuser.me/api/portraits/men/12.jpg',
      time: '2h',
      content: "We just opened new roles for Frontend and Backend Engineers. If you're passionate about building at scale, we'd love to hear from you! 🚀",
      image: 'https://images.unsplash.com/photo-1556767576-cfba2b9bc54c?q=80&w=1200&auto=format&fit=crop'
    }
  ]);
  const [composer, setComposer] = useState({ title: '', body: '', imageUrl: '' });

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const menuItems = [
    { icon: 'fa-newspaper', text: 'Posts', page: 'posts' },
    { icon: 'fa-chart-pie', text: 'Overview', page: 'overview' },
    { icon: 'fa-plus-square', text: 'Post Job', page: 'post' },
    { icon: 'fa-file-alt', text: 'Applications', page: 'apps' },
    { icon: 'fa-filter', text: 'Screening', page: 'screen' },
    { icon: 'fa-users', text: 'Team', page: 'team' },
    { icon: 'fa-cog', text: 'Settings', page: 'settings' }
  ];

  const renderContent = () => {
    switch (activePage) {
      case 'posts':
        return (
          <div className="dashboard-content">
            <div className="left-column">
              <div className="card">
                <h3>Create Post</h3>
                <div className="post-composer">
                  <input 
                    type="text" 
                    placeholder="Post title (optional)" 
                    value={composer.title} 
                    onChange={(e) => setComposer({ ...composer, title: e.target.value })}
                  />
                  <textarea 
                    placeholder="Share an update, achievement, or hiring news..." 
                    value={composer.body}
                    onChange={(e) => setComposer({ ...composer, body: e.target.value })}
                  ></textarea>
                  <input 
                    type="url" 
                    placeholder="Image URL (optional)" 
                    value={composer.imageUrl}
                    onChange={(e) => setComposer({ ...composer, imageUrl: e.target.value })}
                  />
                  <div className="composer-actions">
                    <button className="primary-btn" onClick={() => {
                      if (!composer.body.trim() && !composer.title.trim()) return;
                      const newPost = {
                        id: Date.now(),
                        authorName: user?.name || 'TalentForge',
                        authorRole: 'Hiring Manager',
                        authorAvatar: 'https://randomuser.me/api/portraits/men/12.jpg',
                        time: 'Just now',
                        content: composer.title ? composer.title + '\n' + composer.body : composer.body,
                        image: composer.imageUrl || ''
                      };
                      setPosts([newPost, ...posts]);
                      setComposer({ title: '', body: '', imageUrl: '' });
                    }}>Publish</button>
                    <button className="secondary-btn">Save Draft</button>
                  </div>
                </div>
              </div>
              <div className="posts-feed">
                {posts.map(p => (
                  <div key={p.id} className="card post-card">
                    <div className="post-header">
                      <img className="post-avatar" src={p.authorAvatar} alt="avatar" />
                      <div className="post-author-info">
                        <div className="profile-name">{p.authorName}</div>
                        <div className="profile-role">{p.authorRole} • {p.time}</div>
                      </div>
                    </div>
                    <div className="post-content" style={{ whiteSpace: 'pre-wrap' }}>
                      {p.content}
                    </div>
                    {p.image && (
                      <div className="post-image">
                        <img src={p.image} alt="post" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="right-column">
              <div className="card">
                <h3>Post Ideas</h3>
                <div className="feed">
                  <div className="feed-item"><p>Company Culture Highlight</p></div>
                  <div className="feed-item"><p>New Achievement</p></div>
                  <div className="feed-item"><p>Employee Spotlight</p></div>
                  <div className="feed-item"><p>Team Building Activities</p></div>
                  <div className="feed-item"><p>Industry Insights</p></div>
                </div>
              </div>
              <div className="card">
                <h3>Engagement Stats</h3>
                <div className="engagement-stats">
                  <div className="stat-item">
                    <span className="stat-value">1.2K</span>
                    <span className="stat-label">Total Views</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">247</span>
                    <span className="stat-label">Engagements</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'post':
        return (
          <div className="dashboard-content">
            <div className="left-column">
              <div className="card">
                <h3>Create a Job Posting</h3>
                <div className="project-cards">
                  <div className="project-card">
                    <h4>Job Details</h4>
                    <p>Title, location, type, salary range</p>
                    <button className="primary-btn">Start New Job</button>
                  </div>
                  <div className="project-card">
                    <h4>Templates</h4>
                    <p>Use a predefined job description template</p>
                    <button className="secondary-btn">Browse Templates</button>
                  </div>
                </div>
              </div>
              <div className="card">
                <h3>Recent Jobs</h3>
                <div className="application-cards">
                  <div className="application-card">
                    <h4>Senior Frontend Developer</h4>
                    <div className="applicant-stats">
                      <span><strong>24</strong> Applicants</span>
                      <span><strong>82%</strong> Avg. Match</span>
                    </div>
                    <div className="application-actions">
                      <button className="primary-btn">View</button>
                      <button className="secondary-btn">Edit</button>
                    </div>
                  </div>
                  <div className="application-card">
                    <h4>Backend Engineer</h4>
                    <div className="applicant-stats">
                      <span><strong>18</strong> Applicants</span>
                      <span><strong>78%</strong> Avg. Match</span>
                    </div>
                    <div className="application-actions">
                      <button className="primary-btn">View</button>
                      <button className="secondary-btn">Edit</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="right-column">
              <div className="card">
                <h3>Guidelines</h3>
                <div className="feed">
                  <div className="feed-item">
                    <div className="feed-header">
                      <img src="https://randomuser.me/api/portraits/men/22.jpg" alt="Advisor" />
                      <div>
                        <h4>Effective JD Tips</h4>
                        <p>TalentForge Insights</p>
                      </div>
                    </div>
                    <p>Keep requirements concise, focus on outcomes, and highlight growth opportunities.</p>
                  </div>
                  <div className="feed-item">
                    <p>Include salary ranges to attract 30% more qualified candidates.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'apps':
        return (
          <div className="dashboard-content">
            <div className="left-column">
              <div className="card">
                <h3>Applications</h3>
                <div className="application-cards">
                  <div className="application-card">
                    <h4>Frontend Developer</h4>
                    <div className="applicant-stats">
                      <span><strong>12</strong> New</span>
                      <span><strong>38</strong> Total</span>
                    </div>
                    <div className="application-actions">
                      <button className="primary-btn">Review</button>
                      <button className="secondary-btn">Manage</button>
                    </div>
                  </div>
                  <div className="application-card">
                    <h4>UX Designer</h4>
                    <div className="applicant-stats">
                      <span><strong>8</strong> New</span>
                      <span><strong>22</strong> Total</span>
                    </div>
                    <div className="application-actions">
                      <button className="primary-btn">Review</button>
                      <button className="secondary-btn">Manage</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="right-column">
              <div className="card">
                <h3>Filters</h3>
                <div className="feed">
                  <div className="feed-item">
                    <p>Experience: 2+ years • Skills: React, Node • Location: Remote</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'screen':
        return (
          <div className="dashboard-content">
            <div className="left-column">
              <div className="card">
                <h3>Application Screening</h3>
                <div className="project-cards">
                  <div className="project-card">
                    <h4>AI Screening</h4>
                    <p>Auto-score resumes against JD</p>
                    <button className="primary-btn" onClick={() => (window.location.href = '/ATS')}>Open ATS Screening</button>
                  </div>
                  <div className="project-card">
                    <h4>Shortlist</h4>
                    <p>Move candidates to interview</p>
                    <button className="secondary-btn">Open Shortlist</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="right-column">
              <div className="card">
                <h3>Recent Results</h3>
                <div className="suggestions">
                  <div className="suggestion-item">
                    <img src="https://randomuser.me/api/portraits/women/28.jpg" alt="Candidate" />
                    <div className="suggestion-info">
                      <h4>Jessica Williams</h4>
                      <p>Score: 92/100</p>
                      <div className="match-score">Top Match</div>
                    </div>
                    <button className="action-btn"><i className="fas fa-eye"></i></button>
                  </div>
                  <div className="suggestion-item">
                    <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Candidate" />
                    <div className="suggestion-info">
                      <h4>Michael Chen</h4>
                      <p>Score: 88/100</p>
                      <div className="match-score">Strong Match</div>
                    </div>
                    <button className="action-btn"><i className="fas fa-eye"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'team':
        return (
          <div className="dashboard-content">
            <div className="left-column">
              <div className="card">
                <h3>Team Members</h3>
                <div className="team-activity">
                  <div className="activity-item">
                    <img src="https://randomuser.me/api/portraits/women/33.jpg" alt="Member" />
                    <div className="activity-info">
                      <h4>Sarah Johnson</h4>
                      <p>Recruiter</p>
                      <span className="activity-time">Active now</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <img src="https://randomuser.me/api/portraits/men/67.jpg" alt="Member" />
                    <div className="activity-info">
                      <h4>David Wilson</h4>
                      <p>Hiring Manager</p>
                      <span className="activity-time">30 min ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="right-column">
              <div className="card">
                <h3>Invitations</h3>
                <div className="feed">
                  <div className="feed-item">
                    <p>Invite teammates to manage jobs and applications.</p>
                    <button className="primary-btn" style={{ marginTop: '10px' }}>Invite Team Members</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="dashboard-content">
            <div className="left-column">
              <div className="card">
                <h3>Settings</h3>
                <div className="feed">
                  <div className="feed-item"><p>Company profile, billing, integrations</p></div>
                </div>
              </div>
            </div>
            <div className="right-column">
              <div className="card">
                <h3>Security</h3>
                <div className="feed">
                  <div className="feed-item"><p>2FA, SSO, Role permissions</p></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'overview':
      default:
        return (
          <div className="dashboard-content">
            <div className="left-column">
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
              <div className="card">
                <h3>Applications Trends</h3>
                <div className="graph-placeholder">
                  <i className="fas fa-chart-line graph-icon"></i>
                  <p>Application trends visualization</p>
                </div>
              </div>
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
                    <h4>Product Manager</h4>
                    <div className="applicant-stats">
                      <span><strong>16</strong> Applicants</span>
                      <span><strong>75%</strong> Avg. Match</span>
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
                    <img src="https://randomuser.me/api/portraits/men/67.jpg" alt="Team Member" />
                    <div className="activity-info">
                      <h4>David Wilson</h4>
                      <p>Scheduled interviews with 3 candidates</p>
                      <span className="activity-time">1 hour ago</span>
                    </div>
                  </div>
                </div>
              </div>
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
                    <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Candidate" />
                    <div className="suggestion-info">
                      <h4>Michael Chen</h4>
                      <p>Full Stack Developer</p>
                      <div className="match-score">88% Match</div>
                    </div>
                    <button className="action-btn"><i className="fas fa-eye"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${sidebarExpanded ? 'expanded' : ''}`}>
        <div className="logo-container">
          <div className="logo">
            <span className="logo-icon"><i className="fas fa-briefcase"></i></span>
            {sidebarExpanded && <span className="logo-text">TalentForge</span>}
          </div>
          <button className="toggle-btn" onClick={toggleSidebar}>
            <i className={`fas ${sidebarExpanded ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
          </button>
        </div>
        <div className="menu-items">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`menu-item ${activePage === item.page ? 'active' : ''}`}
              onClick={() => setActivePage(item.page)}
              title={!sidebarExpanded ? item.text : ''}
            >
              <span className="menu-icon"><i className={`fas ${item.icon}`}></i></span>
              {sidebarExpanded && <span className="menu-text">{item.text}</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="main-content">
        <div className="top-bar">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search candidates, skills, or jobs..." />
          </div>
          <div className="profile-section">
            <div className="stats">
              <div className="stat-item">
                <span className="stat-value">{posts.length}</span>
                <span className="stat-label">Posts</span>
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
        {renderContent()}
      </div>
    </div>
  );
};

export default CompanyDashboard;
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import "../CompanyDashboard/Dashboard.css";

const CompanyDashboard = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ✅ STRICT USER TYPE VALIDATION
  useEffect(() => {
    console.log("🏢 CompanyDashboard - Current User:", user);
    
    if (user && user.userType !== 'company') {
      console.log('🚫 Access denied: User is not a company');
      navigate('/UDashboard');
      return;
    }
  }, [user, navigate]);

  // ✅ Show loading or access denied if wrong user type
  if (!user) {
    return <div className="loading-container">Loading...</div>;
  }

  if (user.userType !== 'company') {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Access Restricted</h2>
        <p>Company dashboard is only available for company accounts.</p>
        <button onClick={() => navigate('/UDashboard')}>
          Go to Student Dashboard
        </button>
      </div>
    );
  }

  // ✅ HELPER FUNCTION TO GET USER ROLE
  const getUserRole = () => {
    return 'Hiring Manager';
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const [posts, setPosts] = useState([
    {
      id: 1,
      authorName: user?.name || 'TalentForge',
      authorRole: getUserRole(),
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      time: '2h',
      content: "We just opened new roles for Frontend and Backend Engineers. If you're passionate about building at scale, we'd love to hear from you! 🚀",
      image: 'https://images.unsplash.com/photo-1556767576-cfba2b9bc54c?q=80&w=1200&auto=format&fit=crop',
      likes: 24,
      comments: 8,
      shares: 3
    }
  ]);
  const [composer, setComposer] = useState({ title: '', body: '', imageUrl: '' });

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const menuItems = [
    { icon: 'fa-tachometer-alt', text: 'Dashboard', page: 'dashboard' },
    { icon: 'fa-newspaper', text: 'Posts', page: 'posts' },
    { icon: 'fa-chart-pie', text: 'Overview', page: 'overview' },
    { icon: 'fa-plus-square', text: 'Post Job', page: 'post' },
    { icon: 'fa-file-alt', text: 'Applications', page: 'apps' },
    { icon: 'fa-filter', text: 'Screening', page: 'screen' },
    { icon: 'fa-users', text: 'Team', page: 'team' },
    { icon: 'fa-cog', text: 'Settings', page: 'settings' }
  ];

  // Sidebar Component
  const Sidebar = ({ activePage, setActivePage }) => {
    const sidebarRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          setSidebarExpanded(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div ref={sidebarRef} className={`sidebar ${sidebarExpanded ? "expanded" : "collapsed"}`}>
        <button className="sidebar-toggle" onClick={() => setSidebarExpanded(!sidebarExpanded)}>
          <i className={`fas ${sidebarExpanded ? "fa-chevron-left" : "fa-chevron-right"}`}></i>
        </button>

        <div className="logo-container">
          <div className="logo">
            <span className="logo-icon"><i className="fas fa-briefcase"></i></span>
            {sidebarExpanded && <span className="logo-text">TalentForge</span>}
          </div>
        </div>

        <div className="menu-items">
          {menuItems.map((item, index) => (
            <div key={index} className="menu-group">
              <div
                className={`menu-item ${activePage === item.page ? "active" : ""}`}
                onClick={() => setActivePage(item.page)}
                title={!sidebarExpanded ? item.text : ""}
              >
                <span className="menu-icon"><i className={`fas ${item.icon}`}></i></span>
                {sidebarExpanded && <span className="menu-text">{item.text}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activePage) {
      case 'posts':
        return (
          <div className="page-content">
            <div className="page-header">
              <h2>Company Posts</h2>
              <p>Welcome back, {user?.name || 'Company'}! Share updates and engage with potential candidates</p>
            </div>
            
            <div className="content-grid">
              <div className="main-column">
                <div className="card create-post-card">
                  <div className="card-header">
                    <h3>Create Post</h3>
                    <span className="card-badge">New</span>
                  </div>
                  <div className="post-composer">
                    <div className="composer-header">
                      <img 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
                        alt="Profile" 
                        className="composer-avatar" 
                      />
                      <div>
                        <div className="composer-name">{user?.name || 'Your Company'}</div>
                        <div className="composer-role">{getUserRole()}</div>
                      </div>
                    </div>
                    
                    <input 
                      type="text" 
                      placeholder="Post title (optional)" 
                      value={composer.title} 
                      onChange={(e) => setComposer({ ...composer, title: e.target.value })}
                      className="composer-title"
                    />
                    <textarea 
                      placeholder="Share an update, achievement, or hiring news..." 
                      value={composer.body}
                      onChange={(e) => setComposer({ ...composer, body: e.target.value })}
                      className="composer-textarea"
                    ></textarea>
                    
                    {composer.imageUrl && (
                      <div className="image-preview">
                        <img src={composer.imageUrl} alt="Preview" />
                        <button 
                          className="remove-image"
                          onClick={() => setComposer({ ...composer, imageUrl: '' })}
                        >
                          ×
                        </button>
                      </div>
                    )}
                    
                    <div className="composer-actions">
                      <button 
                        className="action-btn image-btn"
                        onClick={() => {
                          const url = prompt('Enter image URL:');
                          if (url) setComposer({ ...composer, imageUrl: url });
                        }}
                      >
                        <i className="fas fa-image"></i> Photo
                      </button>
                      <div className="action-buttons">
                        <button className="secondary-btn">Save Draft</button>
                        <button className="primary-btn" onClick={() => {
                          if (!composer.body.trim() && !composer.title.trim()) return;
                          const newPost = {
                            id: Date.now(),
                            authorName: user?.name || 'TalentForge',
                            authorRole: getUserRole(),
                            authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                            time: 'Just now',
                            content: composer.title ? `**${composer.title}**\n\n${composer.body}` : composer.body,
                            image: composer.imageUrl || '',
                            likes: 0,
                            comments: 0,
                            shares: 0
                          };
                          setPosts([newPost, ...posts]);
                          setComposer({ title: '', body: '', imageUrl: '' });
                        }}>
                          <i className="fas fa-paper-plane"></i> Publish
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="posts-feed">
                  {posts.map(post => (
                    <div key={post.id} className="card post-card">
                      <div className="post-header">
                        <img className="post-avatar" src={post.authorAvatar} alt="avatar" />
                        <div className="post-author-info">
                          <div className="profile-name">{post.authorName}</div>
                          <div className="profile-role">{post.authorRole} • {post.time}</div>
                        </div>
                        <button className="post-menu">
                          <i className="fas fa-ellipsis-h"></i>
                        </button>
                      </div>
                      
                      <div className="post-content">
                        {post.content.split('**').map((part, index) => 
                          index % 2 === 1 ? (
                            <strong key={index}>{part}</strong>
                          ) : (
                            part
                          )
                        )}
                      </div>
                      
                      {post.image && (
                        <div className="post-image">
                          <img src={post.image} alt="post" />
                        </div>
                      )}
                      
                      <div className="post-stats">
                        <span>{post.likes} likes</span>
                        <span>{post.comments} comments</span>
                        <span>{post.shares} shares</span>
                      </div>
                      
                      <div className="post-actions">
                        <button className="post-action-btn">
                          <i className="far fa-heart"></i> Like
                        </button>
                        <button className="post-action-btn">
                          <i className="far fa-comment"></i> Comment
                        </button>
                        <button className="post-action-btn">
                          <i className="far fa-share-square"></i> Share
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sidebar-column">
                <div className="card stats-card">
                  <h3>Engagement Overview</h3>
                  <div className="engagement-stats">
                    <div className="stat-item">
                      <div className="stat-icon">
                        <i className="fas fa-eye"></i>
                      </div>
                      <div className="stat-content">
                        <span className="stat-value">1.2K</span>
                        <span className="stat-label">Post Views</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-icon">
                        <i className="fas fa-heart"></i>
                      </div>
                      <div className="stat-content">
                        <span className="stat-value">247</span>
                        <span className="stat-label">Engagements</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-icon">
                        <i className="fas fa-share"></i>
                      </div>
                      <div className="stat-content">
                        <span className="stat-value">89</span>
                        <span className="stat-label">Shares</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card suggestions-card">
                  <h3>Post Ideas</h3>
                  <div className="suggestions-list">
                    <div className="suggestion-item">
                      <div className="suggestion-icon">
                        <i className="fas fa-users"></i>
                      </div>
                      <div className="suggestion-content">
                        <span className="suggestion-title">Company Culture</span>
                        <span className="suggestion-desc">Showcase your workplace</span>
                      </div>
                    </div>
                    <div className="suggestion-item">
                      <div className="suggestion-icon">
                        <i className="fas fa-trophy"></i>
                      </div>
                      <div className="suggestion-content">
                        <span className="suggestion-title">Achievements</span>
                        <span className="suggestion-desc">Share recent wins</span>
                      </div>
                    </div>
                    <div className="suggestion-item">
                      <div className="suggestion-icon">
                        <i className="fas fa-bullhorn"></i>
                      </div>
                      <div className="suggestion-content">
                        <span className="suggestion-title">Hiring News</span>
                        <span className="suggestion-desc">Announce open roles</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'post':
        return (
          <div className="page-content">
            <div className="page-header">
              <h2>Post a Job</h2>
              <p>Create new job openings and manage existing ones</p>
            </div>
            <div className="content-grid">
              <div className="main-column">
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
              <div className="sidebar-column">
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
          </div>
        );

      case 'apps':
        return (
          <div className="page-content">
            <div className="page-header">
              <h2>Applications</h2>
              <p>Manage and review job applications</p>
            </div>
            <div className="content-grid">
              <div className="main-column">
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
              <div className="sidebar-column">
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
          </div>
        );

      case 'screen':
        return (
          <div className="page-content">
            <div className="page-header">
              <h2>Application Screening</h2>
              <p>Screen and filter candidates efficiently</p>
            </div>
            <div className="content-grid">
              <div className="main-column">
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
              <div className="sidebar-column">
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
          </div>
        );

      case 'team':
        return (
          <div className="page-content">
            <div className="page-header">
              <h2>Team Management</h2>
              <p>Manage your recruitment team</p>
            </div>
            <div className="content-grid">
              <div className="main-column">
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
              <div className="sidebar-column">
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
          </div>
        );

      case 'settings':
        return (
          <div className="page-content">
            <div className="page-header">
              <h2>Settings</h2>
              <p>Manage your company profile and preferences</p>
            </div>
            <div className="content-grid">
              <div className="main-column">
                <div className="card">
                  <h3>Settings</h3>
                  <div className="feed">
                    <div className="feed-item"><p>Company profile, billing, integrations</p></div>
                  </div>
                </div>
              </div>
              <div className="sidebar-column">
                <div className="card">
                  <h3>Security</h3>
                  <div className="feed">
                    <div className="feed-item"><p>2FA, SSO, Role permissions</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'overview':
        return (
          <div className="page-content">
            <div className="page-header">
              <h2>Recruitment Overview</h2>
              <p>Welcome back, {user?.name || 'Company'}! Here's your recruitment summary.</p>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-main">
                  <span className="stat-value">42</span>
                  <span className="stat-label">New Applicants</span>
                </div>
                <div className="stat-change up">
                  <i className="fas fa-arrow-up"></i>+12%
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-main">
                  <span className="stat-value">5,289</span>
                  <span className="stat-label">Profile Views</span>
                </div>
                <div className="stat-change up">
                  <i className="fas fa-arrow-up"></i>+8%
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-main">
                  <span className="stat-value">87%</span>
                  <span className="stat-label">Response Rate</span>
                </div>
                <div className="stat-change up">
                  <i className="fas fa-arrow-up"></i>+5%
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-main">
                  <span className="stat-value">24</span>
                  <span className="stat-label">Active Jobs</span>
                </div>
                <div className="stat-change up">
                  <i className="fas fa-arrow-up"></i>+2
                </div>
              </div>
            </div>
            
            <div className="content-grid">
              <div className="main-column">
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
              <div className="sidebar-column">
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
          </div>
        );

      case 'dashboard':
      default:
        return (
          <div className="page-content">
            <div className="page-header">
              <h2>Company Dashboard</h2>
              <p>Welcome back, {user?.name || 'Company'}! Here's your recruitment overview.</p>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-main">
                  <span className="stat-value">42</span>
                  <span className="stat-label">New Applicants</span>
                </div>
                <div className="stat-change up">
                  <i className="fas fa-arrow-up"></i>+12%
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-main">
                  <span className="stat-value">5,289</span>
                  <span className="stat-label">Profile Views</span>
                </div>
                <div className="stat-change up">
                  <i className="fas fa-arrow-up"></i>+8%
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-main">
                  <span className="stat-value">87%</span>
                  <span className="stat-label">Response Rate</span>
                </div>
                <div className="stat-change up">
                  <i className="fas fa-arrow-up"></i>+5%
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-main">
                  <span className="stat-value">24</span>
                  <span className="stat-label">Active Jobs</span>
                </div>
                <div className="stat-change up">
                  <i className="fas fa-arrow-up"></i>+2
                </div>
              </div>
            </div>
            
            <div className="content-grid">
              <div className="main-column">
                <div className="card highlight-card">
                  <h3>Quick Actions</h3>
                  <div className="quick-actions">
                    <button className="action-button primary" onClick={() => setActivePage('post')}>
                      <i className="fas fa-plus-circle"></i>
                      <span>Post New Job</span>
                    </button>
                    <button className="action-button secondary" onClick={() => setActivePage('apps')}>
                      <i className="fas fa-file-alt"></i>
                      <span>Review Applications</span>
                    </button>
                    <button className="action-button secondary" onClick={() => setActivePage('posts')}>
                      <i className="fas fa-newspaper"></i>
                      <span>Create Post</span>
                    </button>
                  </div>
                </div>

                <div className="card">
                  <h3>Recent Activity</h3>
                  <div className="activity-feed">
                    <div className="activity-item">
                      <div className="activity-icon">
                        <i className="fas fa-user-plus"></i>
                      </div>
                      <div className="activity-content">
                        <p><strong>12 new applications</strong> for Senior Frontend Developer</p>
                        <span className="activity-time">2 hours ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">
                        <i className="fas fa-eye"></i>
                      </div>
                      <div className="activity-content">
                        <p>Your company profile was <strong>viewed 156 times</strong></p>
                        <span className="activity-time">5 hours ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">
                        <i className="fas fa-share"></i>
                      </div>
                      <div className="activity-content">
                        <p>Your post was <strong>shared 8 times</strong></p>
                        <span className="activity-time">1 day ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3>Active Job Postings</h3>
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
                      <h4>Backend Engineer</h4>
                      <div className="applicant-stats">
                        <span><strong>18</strong> Applicants</span>
                        <span><strong>78%</strong> Avg. Match</span>
                      </div>
                      <div className="application-actions">
                        <button className="primary-btn">View Applicants</button>
                        <button className="secondary-btn">Edit Job</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sidebar-column">
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
                  <h3>Upcoming Events</h3>
                  <div className="events-list">
                    <div className="event-item">
                      <div className="event-date">
                        <span className="event-day">15</span>
                        <span className="event-month">NOV</span>
                      </div>
                      <div className="event-details">
                        <h4>Technical Interviews</h4>
                        <p>With Frontend candidates</p>
                        <span className="event-time">10:00 AM</span>
                      </div>
                    </div>
                    <div className="event-item">
                      <div className="event-date">
                        <span className="event-day">16</span>
                        <span className="event-month">NOV</span>
                      </div>
                      <div className="event-details">
                        <h4>Team Sync</h4>
                        <p>Weekly recruitment meeting</p>
                        <span className="event-time">2:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3>Performance Metrics</h3>
                  <div className="metrics-grid">
                    <div className="metric-item">
                      <span className="metric-value">4.2</span>
                      <span className="metric-label">Avg. Response Time (days)</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-value">68%</span>
                      <span className="metric-label">Candidate Satisfaction</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-value">92%</span>
                      <span className="metric-label">Profile Completion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

   return (
    <div className="company-dashboard">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <div className={`main-content ${sidebarExpanded ? "expanded" : ""}`}>
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
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" alt="Profile" className="profile-img" />
              <div className="profile-info">
                <span className="profile-name">{user?.name || 'Company'}</span>
                <span className="profile-role">
                  {getUserRole()}
                </span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>

 <div className="dashboard-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
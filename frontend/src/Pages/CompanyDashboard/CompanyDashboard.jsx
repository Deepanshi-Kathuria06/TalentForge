// components/CompanyDashboard.js
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useFeed } from '../../components/Feed/FeedContext';
import CreatePostModal from '../../components/Feed/CreatePostModal';
import "../CompanyDashboard/Dashboard.css";
import JobForm from './JobForm';
import API from '../../utils/api';
import ScreeningSection from './sections/ScreeningSection';

const CompanyDashboard = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [postedJobs, setPostedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ✅ USE THE FEED CONTEXT
  const { posts: feedPosts, addPost, likePost, addComment, sharePost } = useFeed();

  // ✅ STRICT USER TYPE VALIDATION
  useEffect(() => {
    console.log("🏢 CompanyDashboard - Current User:", user);
    
    if (user && user.userType !== 'company') {
      console.log('🚫 Access denied: User is not a company');
      navigate('/UDashboard');
      return;
    }
  }, [user, navigate]);

  // ✅ Handle new job posting
  const handleJobPosted = (newJob) => {
    console.log("New job posted:", newJob);
    
    const jobToAdd = newJob._id ? newJob : {
      ...newJob,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      applicationCount: 0,
      company: {
        companyName: user?.companyName || user?.name || 'Your Company',
        _id: user?._id || user?.id
      }
    };
    
    setPostedJobs([jobToAdd, ...postedJobs]);
    alert(`Job "${jobToAdd.title}" posted successfully! Students can now see this job in their dashboard.`);
    setActivePage('manage');
  };

  // ✅ Mock applications data for demo
  const fetchApplications = () => {
    const mockApplications = [
      {
        _id: '1',
        job: {
          _id: '1',
          title: 'Frontend Developer'
        },
        user: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
        },
        status: 'pending',
        appliedAt: new Date().toISOString(),
        coverLetter: 'I am excited to apply for the Frontend Developer position at your company...'
      },
      {
        _id: '2',
        job: {
          _id: '1',
          title: 'Frontend Developer'
        },
        user: {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
        },
        status: 'pending',
        appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        coverLetter: 'I have 3 years of React experience and would love to join your innovative team...'
      }
    ];
    setApplications(mockApplications);
  };

  // ✅ Handle application actions
  const handleApplicationAction = async (applicationId, action) => {
    try {
      // Update local state
      setApplications(prev => prev.map(app => 
        app._id === applicationId ? { ...app, status: action } : app
      ));
      
      alert(`Application ${action} successfully!`);
    } catch (error) {
      console.error('Error updating application:', error);
      alert(`Application ${action} (local update)`);
    }
  };

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

  // ✅ ADD POST CREATION HANDLER
  const handleCreatePost = (newPost) => {
    addPost(newPost);
  };

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
                onClick={() => {
                  setActivePage(item.page);
                  if (item.page === 'apps') {
                    fetchApplications();
                  }
                }}
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

  const renderContent = () => {
    switch (activePage) {
      case 'posts':
        return (
          <div className="page-content">
            <div className="page-header">
              <h2>Professional Feed</h2>
              <p>Welcome back, {user?.name || 'Company'}! Connect with students and share updates</p>
            </div>
            
            <div className="content-grid">
              <div className="main-column">
                <div className="card create-post-card">
                  <div className="post-composer">
                    <div className="composer-header">
                      <img 
                        src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"} 
                        alt="Profile" 
                        className="composer-avatar" 
                      />
                      <div>
                        <div className="composer-name">{user?.name || 'Your Company'}</div>
                        <div className="composer-role">{getUserRole()}</div>
                      </div>
                    </div>
                    
                    <button 
                      className="composer-trigger"
                      onClick={() => setIsCreatePostModalOpen(true)}
                    >
                      <span>Share an update, achievement, or hiring news...</span>
                    </button>
                  </div>
                </div>

                <div className="posts-feed">
                  {feedPosts.map(post => (
                    <div key={post.id} className="card post-card">
                      <div className="post-header">
                        <img className="post-avatar" src={post.author.avatar} alt="avatar" />
                        <div className="post-author-info">
                          <div className="profile-name">
                            {post.author.name}
                            {post.author.isVerified && <i className="fas fa-check-circle verified-badge"></i>}
                          </div>
                          <div className="profile-role">{post.author.role} • {post.timestamp}</div>
                        </div>
                        <button className="post-menu">
                          <i className="fas fa-ellipsis-h"></i>
                        </button>
                      </div>
                      
                      <div className="post-content">
                        <p>{post.content}</p>
                      </div>
                      
                      {post.images && post.images.length > 0 && (
                        <div className="post-images">
                          {post.images.map((image, index) => (
                            <img key={index} src={image} alt={`Post content ${index}`} />
                          ))}
                        </div>
                      )}
                      
                      <div className="post-stats">
                        <span>{post.likes} likes</span>
                        <span>{post.comments?.length || 0} comments</span>
                        <span>{post.shares} shares</span>
                      </div>
                      
                      <div className="post-actions">
                        <button 
                          className={`post-action-btn ${post.liked ? 'liked' : ''}`}
                          onClick={() => likePost(post.id)}
                        >
                          <i className={`fas ${post.liked ? 'fa-heart' : 'far fa-heart'}`}></i> Like
                        </button>
                        <button className="post-action-btn">
                          <i className="far fa-comment"></i> Comment
                        </button>
                        <button 
                          className="post-action-btn"
                          onClick={() => sharePost(post.id)}
                        >
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
              </div>
            </div>
          </div>
        );

      case 'post':
        return (
          <div className="page-content">
            <div className="page-header">
              <h2>Post a New Job/Internship</h2>
              <p>Create a new job posting to attract talented candidates</p>
            </div>
            
            <div className="content-grid">
              <div className="main-column">
                <div className="card">
                  <JobForm onSuccess={handleJobPosted} user={user} />
                </div>
              </div>
              <div className="sidebar-column">
                <div className="card">
                  <h3>Posting Tips</h3>
                  <div className="tips-list">
                    <div className="tip-item">
                      <i className="fas fa-lightbulb text-warning"></i>
                      <div className="tip-content">
                        <strong>Be Specific</strong>
                        <p>Clearly describe responsibilities and requirements</p>
                      </div>
                    </div>
                    <div className="tip-item">
                      <i className="fas fa-lightbulb text-warning"></i>
                      <div className="tip-content">
                        <strong>Include Salary</strong>
                        <p>Jobs with salary ranges get 30% more applications</p>
                      </div>
                    </div>
                    <div className="tip-item">
                      <i className="fas fa-lightbulb text-warning"></i>
                      <div className="tip-content">
                        <strong>Add Skills</strong>
                        <p>List required skills to attract qualified candidates</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <h3>Your Posted Jobs</h3>
                  <div className="active-jobs-preview">
                    {postedJobs.slice(0, 3).map(job => (
                      <div key={job._id} className="job-preview-item">
                        <h4>{job.title}</h4>
                        <p><i className="fas fa-users text-muted"></i> {job.applicationCount || 0} applications</p>
                      </div>
                    ))}
                    {postedJobs.length === 0 && (
                      <p className="text-muted">No jobs posted yet</p>
                    )}
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
              <h2>Job Applications</h2>
              <p>Manage and review applications for your posted jobs</p>
            </div>
            <div className="content-grid">
              <div className="main-column">
                <div className="card">
                  <h3>Applications ({applications.length})</h3>
                  {applications.length === 0 ? (
                    <div className="empty-state">
                      <i className="fas fa-file-alt fa-3x text-muted mb-3"></i>
                      <p>No applications received yet.</p>
                      <button 
                        className="primary-btn"
                        onClick={() => setActivePage('post')}
                      >
                        Post Your First Job
                      </button>
                    </div>
                  ) : (
                    <div className="applications-list">
                      {applications.map(application => (
                        <div key={application._id} className="application-card">
                          <div className="application-info">
                            <div className="application-header">
                              <img 
                                src={application.user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"} 
                                alt={application.user?.name} 
                                className="applicant-avatar" 
                              />
                              <div>
                                <h4>{application.job?.title}</h4>
                                <p><strong>Applicant:</strong> {application.user?.name}</p>
                                <p><strong>Email:</strong> {application.user?.email}</p>
                              </div>
                            </div>
                            <p><strong>Applied:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> 
                              <span className={`status-badge status-${application.status}`}>
                                {application.status}
                              </span>
                            </p>
                            {application.coverLetter && (
                              <div className="cover-letter">
                                <strong>Cover Letter:</strong>
                                <p>{application.coverLetter}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="application-actions">
                            {application.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleApplicationAction(application._id, 'accepted')}
                                  className="btn-success"
                                >
                                  <i className="fas fa-check"></i> Accept
                                </button>
                                <button 
                                  onClick={() => handleApplicationAction(application._id, 'rejected')}
                                  className="btn-danger"
                                >
                                  <i className="fas fa-times"></i> Reject
                                </button>
                              </>
                            )}
                            {application.status === 'accepted' && (
                              <button className="btn-success" disabled>
                                <i className="fas fa-check"></i> Accepted
                              </button>
                            )}
                            {application.status === 'rejected' && (
                              <button className="btn-danger" disabled>
                                <i className="fas fa-times"></i> Rejected
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="sidebar-column">
                <div className="card">
                  <h3>Application Stats</h3>
                  <div className="stats-overview">
                    <div className="stat-item">
                      <span className="stat-value">
                        {applications.filter(app => app.status === 'pending').length}
                      </span>
                      <span className="stat-label">Pending</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">
                        {applications.filter(app => app.status === 'accepted').length}
                      </span>
                      <span className="stat-label">Accepted</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">
                        {applications.filter(app => app.status === 'rejected').length}
                      </span>
                      <span className="stat-label">Rejected</span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3>Quick Actions</h3>
                  <div className="quick-actions-vertical">
                    <button 
                      className="action-btn primary"
                      onClick={() => setActivePage('post')}
                    >
                      <i className="fas fa-plus"></i> Post New Job
                    </button>
                    <button 
                      className="action-btn secondary"
                      onClick={fetchApplications}
                    >
                      <i className="fas fa-sync"></i> Refresh Applications
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'manage':
        return (
          <div className="page-content">
            <div className="page-header">
              <h2>Your Posted Jobs</h2>
              <p>View the jobs you've posted</p>
            </div>
            <div className="content-grid">
              <div className="main-column">
                <div className="card">
                  <h3>Your Job Listings ({postedJobs.length})</h3>
                  {postedJobs.length === 0 ? (
                    <div className="empty-state">
                      <i className="fas fa-briefcase fa-3x text-muted mb-3"></i>
                      <p>No jobs posted yet. Start by posting your first job!</p>
                      <button 
                        className="primary-btn"
                        onClick={() => setActivePage('post')}
                      >
                        Post New Job
                      </button>
                    </div>
                  ) : (
                    <div className="jobs-list">
                      {postedJobs.map(job => (
                        <div key={job._id} className="job-card">
                          <div className="job-info">
                            <h4>{job.title}</h4>
                            <div className="job-details">
                              <p><i className="fas fa-map-marker-alt"></i> {job.location}</p>
                              <p><i className="fas fa-briefcase"></i> {job.type}</p>
                              <p><i className="fas fa-dollar-sign"></i> {job.salaryRange || 'Not specified'}</p>
                              <p><i className="fas fa-calendar"></i> Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
                            </div>
                            {job.skills && (
                              <div className="job-skills">
                                <strong>Skills:</strong> {job.skills}
                              </div>
                            )}
                          </div>
                          <div className="job-stats">
                            <span className="applications-count">
                              <i className="fas fa-users"></i> {job.applicationCount || 0} Applications
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

        case 'screen':
  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Screening</h2>
        <p>Review and manage job applications</p>
      </div>
      
      <div className="content-grid">
        <div className="main-column">
          <div className="card">
            <h3>Applications Review</h3>
            <ScreeningSection user={user} />
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
                  <span className="stat-value">{postedJobs.length}</span>
                  <span className="stat-label">Active Jobs</span>
                </div>
                <div className="stat-change up">
                  <i className="fas fa-briefcase"></i>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-main">
                  <span className="stat-value">{applications.length}</span>
                  <span className="stat-label">Total Applications</span>
                </div>
                <div className="stat-change up">
                  <i className="fas fa-file-alt"></i>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-main">
                  <span className="stat-value">
                    {applications.filter(app => app.status === 'pending').length}
                  </span>
                  <span className="stat-label">Pending Reviews</span>
                </div>
                <div className="stat-change up">
                  <i className="fas fa-clock"></i>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-main">
                  <span className="stat-value">
                    {applications.filter(app => app.status === 'accepted').length}
                  </span>
                  <span className="stat-label">Accepted</span>
                </div>
                <div className="stat-change up">
                  <i className="fas fa-check-circle"></i>
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
                    <button className="action-button secondary" onClick={() => {
                      setActivePage('apps');
                      fetchApplications();
                    }}>
                      <i className="fas fa-file-alt"></i>
                      <span>Review Applications</span>
                    </button>
                    <button className="action-button secondary" onClick={() => setActivePage('posts')}>
                      <i className="fas fa-newspaper"></i>
                      <span>Create Post</span>
                    </button>
                    <button className="action-button secondary" onClick={() => setActivePage('manage')}>
                      <i className="fas fa-tasks"></i>
                      <span>Manage Jobs</span>
                    </button>
                  </div>
                </div>

                <div className="card">
                  <h3>Recent Job Postings</h3>
                  <div className="application-cards">
                    {postedJobs.slice(0, 3).map(job => (
                      <div key={job._id} className="application-card">
                        <h4>{job.title}</h4>
                        <div className="applicant-stats">
                          <span><strong>{job.applicationCount || 0}</strong> Applicants</span>
                          <span><strong>{job.location}</strong></span>
                        </div>
                        <div className="application-actions">
                          <button 
                            className="primary-btn"
                            onClick={() => {
                              setActivePage('apps');
                              fetchApplications();
                            }}
                          >
                            View Applicants
                          </button>
                        </div>
                      </div>
                    ))}
                    {postedJobs.length === 0 && (
                      <div className="empty-state">
                        <p>No jobs posted yet</p>
                        <button 
                          className="primary-btn"
                          onClick={() => setActivePage('post')}
                        >
                          Post Your First Job
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="sidebar-column">
                <div className="card">
                  <h3>Recent Activity</h3>
                  <div className="activity-feed">
                    {applications.slice(0, 3).map(application => (
                      <div key={application._id} className="activity-item">
                        <div className="activity-icon">
                          <i className="fas fa-user-plus"></i>
                        </div>
                        <div className="activity-content">
                          <p><strong>{application.user?.name}</strong> applied for {application.job?.title}</p>
                          <span className="activity-time">
                            {new Date(application.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    {applications.length === 0 && (
                      <p className="text-muted">No recent activity</p>
                    )}
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
                <span className="stat-value">{feedPosts.length}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{postedJobs.length}</span>
                <span className="stat-label">Open Jobs</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{applications.length}</span>
                <span className="stat-label">Applications</span>
              </div>
            </div>
            
            <div className="profile">
              <img src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"} alt="Profile" className="profile-img" />
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

      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
};

export default CompanyDashboard;
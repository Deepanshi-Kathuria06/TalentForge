import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useFeed } from '../../components/Feed/FeedContext';
import CreatePostModal from '../../components/Feed/CreatePostModal';
import "../CompanyDashboard/Dashboard.css";
import JobForm from './JobForm';
import API from '../../utils/api';
import ScreeningSection from './sections/ScreeningSection';
import DashboardNavbar from '../../components/DashboardNavbar';
import '../../components/DashboardNavbar.css';
import "../../assets/styles/JobForm.css";

const CompanyDashboard = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activePage, setActivePage] = useState('posts');
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [postedJobs, setPostedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { posts: feedPosts, addPost, likePost, addComment, sharePost } = useFeed();

  useEffect(() => {
    console.log("🏢 CompanyDashboard - Current User:", user);
    
    if (user && user.userType !== 'company') {
      console.log('🚫 Access denied: User is not a company');
      navigate('/UDashboard');
      return;
    }
  }, [user, navigate]);

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

  const handleApplicationAction = async (applicationId, action) => {
    try {
      setApplications(prev => prev.map(app => 
        app._id === applicationId ? { ...app, status: action } : app
      ));
      
      alert(`Application ${action} successfully!`);
    } catch (error) {
      console.error('Error updating application:', error);
      alert(`Application ${action} (local update)`);
    }
  };

  // New function to navigate to ATS page
  const navigateToATS = () => {
    navigate('/ATS');
  };

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

  const getUserRole = () => {
    return 'Hiring Manager';
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleCreatePost = (newPost) => {
    addPost(newPost);
  };

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
          {[
              { icon: 'fa-newspaper', text: 'Feed', page: 'posts' },
            { icon: 'fa-chart-pie', text: 'Overview', page: 'overview' },
            { icon: 'fa-plus-square', text: 'Post Job', page: 'post' },
            { icon: 'fa-filter', text: 'Screening', page: 'screen' },
          ].map((item, index) => (
            <div key={index} className="menu-group">
              <div
                className={`menu-item ${activePage === item.page ? "active" : ""}`}
                onClick={() => {
                  setActivePage(item.page);
                  if (item.page === 'apps') fetchApplications();
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

  const renderContent = () => {
    const renderStatsCards = () => (
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <i className="fas fa-briefcase stat-icon"></i>
            <div className="stat-text">
              <span className="stat-value">{postedJobs.length}</span>
              <span className="stat-label">Active Jobs</span>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <i className="fas fa-file-alt stat-icon"></i>
            <div className="stat-text">
              <span className="stat-value">{applications.length}</span>
              <span className="stat-label">Applications</span>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <i className="fas fa-clock stat-icon"></i>
            <div className="stat-text">
              <span className="stat-value">{applications.filter(app => app.status === 'pending').length}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <i className="fas fa-check-circle stat-icon"></i>
            <div className="stat-text">
              <span className="stat-value">{applications.filter(app => app.status === 'accepted').length}</span>
              <span className="stat-label">Accepted</span>
            </div>
          </div>
        </div>
      </div>
    );

    switch (activePage) {
    case 'posts':
  return (
    <div className="page-content">
      <div className="page-header">
        <h2 className="page-title">Professional Feed</h2>
        <p className="page-subtitle">Connect with students and share updates</p>
      </div>
      
      <div className="content-grid">
        <div className="main-column">
          <div className="card create-post professional-post">
            <div className="post-composer">
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"} 
                alt="Profile" 
                className="composer-avatar" 
              />
              <button 
                className="composer-trigger professional-composer"
                onClick={() => setIsCreatePostModalOpen(true)}
              >
                Share company updates, achievements, or hiring news...
              </button>
            </div>
          </div>

          <div className="posts-feed professional-feed">
            {feedPosts.map(post => (
              <div key={post.id} className="card post-card professional-post-card">
                <div className="post-header professional-header">
                  <img className="post-avatar professional-avatar" src={post.author.avatar} alt="avatar" />
                  <div className="post-author-info professional-author-info">
                    <div className="profile-name professional-name">
                      {post.author.name}
                      {post.author.isVerified && <i className="fas fa-check-circle verified-badge professional-badge"></i>}
                    </div>
                    <div className="profile-role professional-role">{post.author.role} • {post.timestamp}</div>
                  </div>
                  <button className="post-options professional-options">
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                </div>
                
                <div className="post-content professional-content">
                  <p>{post.content}</p>
                </div>
                
                {post.images && post.images.length > 0 && (
                  <div className="post-images professional-images">
                    {post.images.map((image, index) => (
                      <img key={index} src={image} alt={`Post content ${index}`} />
                    ))}
                  </div>
                )}
                
                <div className="post-actions professional-actions">
                  <button className="post-action-btn professional-action-btn">
                    <i className="far fa-heart"></i> <span>{post.likes}</span>
                  </button>
                  <button className="post-action-btn professional-action-btn">
                    <i className="far fa-comment"></i> <span>{post.comments?.length || 0}</span>
                  </button>
                  <button className="post-action-btn professional-action-btn">
                    <i className="far fa-share-square"></i> <span>{post.shares}</span>
                  </button>
                  <button className="post-action-btn professional-action-btn bookmark-btn">
                    <i className="far fa-bookmark"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ATS Checker moved to right sidebar */}
        <div className="sidebar-column">
          <div className="resume-analyzer-shortcut" onClick={navigateToATS}>
            <div className="analyzer-content">
              <div className="analyzer-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="analyzer-text">
                <h3>Resume Analyzer</h3>
                <p>AI-powered resume screening and analysis</p>
              </div>
              <div className="analyzer-arrow">
                <i className="fas fa-arrow-right"></i>
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
              <h2 className="page-title">Post New Job</h2>
              <p className="page-subtitle">Create a new job listing for students</p>
            </div>
            
            <div className="content-grid">
              <div className="main-column">
                <div className="card">
                  <JobForm onSuccess={handleJobPosted} user={user} />
                </div>
              </div>
              <div className="sidebar-column">
                <div className="jobs">
                  <h3 className="card-title">Your Posted Jobs</h3>
                  <div className="jobs-preview">
                    {postedJobs.slice(0, 3).map(job => (
                      <div key={job._id} className="job-preview-item">
                        <h4 className="job-title">{job.title}</h4>
                        <p className="job-applications">
                          <i className="fas fa-users"></i> {job.applicationCount || 0} applications
                        </p>
                      </div>
                    ))}
                    {postedJobs.length === 0 && (
                      <p className="no-jobs">No jobs posted yet</p>
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
              <h2 className="page-title">Job Applications</h2>
              <p className="page-subtitle">Manage and review applications</p>
            </div>
            
            {renderStatsCards()}
            
            <div className="content-grid">
              <div className="main-column">
                <div className="card">
                  <div className="applications-header">
                    <h3 className="card-title">Applications ({applications.length})</h3>
                    <button className="refresh-btn" onClick={fetchApplications}>
                      <i className="fas fa-sync"></i>
                    </button>
                  </div>
                  
                  {applications.length === 0 ? (
                    <div className="empty-state">
                      <i className="fas fa-file-alt empty-icon"></i>
                      <p className="empty-text">No applications received yet.</p>
                      <button className="primary-btn" onClick={() => setActivePage('post')}>
                        Post Your First Job
                      </button>
                    </div>
                  ) : (
                    <div className="applications-list">
                      {applications.map(application => (
                        <div key={application._id} className="application-card">
                          <div className="application-main">
                            <img 
                              src={application.user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"} 
                              alt={application.user?.name} 
                              className="applicant-avatar" 
                            />
                            <div className="application-details">
                              <h4 className="applicant-name">{application.user?.name}</h4>
                              <p className="applicant-email">{application.user?.email}</p>
                              <p className="application-job">{application.job?.title}</p>
                              <span className={`status-badge status-${application.status}`}>
                                {application.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="application-actions">
                            {application.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleApplicationAction(application._id, 'accepted')}
                                  className="action-btn success-btn"
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                                <button 
                                  onClick={() => handleApplicationAction(application._id, 'rejected')}
                                  className="action-btn danger-btn"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </>
                            )}
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
              <h2 className="page-title">Screening</h2>
              <p className="page-subtitle">Review and manage job applications</p>
            </div>
            
            <div className="content-grid">
              <div className="main-column">
                <div className="card">
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
              <h2 className="page-title">Company Dashboard</h2>
              <p className="page-subtitle">Welcome back, {user?.name || 'Company'}! Here's your recruitment overview.</p>
            </div>
            
            {renderStatsCards()}
            
            <div className="content-grid">
              <div className="main-column">
                <div className="card">
                  <h3 className="card-title">Quick Actions</h3>
                  <div className="quick-actions">
                    <button className="quick-action-btn primary-action" onClick={() => setActivePage('post')}>
                      <i className="fas fa-plus-circle"></i>
                      <span>Post New Job</span>
                    </button>
                    <button className="quick-action-btn" onClick={() => { setActivePage('apps'); fetchApplications(); }}>
                      <i className="fas fa-file-alt"></i>
                      <span>Review Applications</span>
                    </button>
                    <button className="quick-action-btn" onClick={() => setActivePage('posts')}>
                      <i className="fas fa-newspaper"></i>
                      <span>Create Post</span>
                    </button>
                    <button className="quick-action-btn" onClick={() => setActivePage('manage')}>
                      <i className="fas fa-tasks"></i>
                      <span>Manage Jobs</span>
                    </button>
                  </div>
                </div>

                <div className="card">
                  <h3 className="card-title">Recent Job Postings</h3>
                  <div className="jobs-list">
                    {postedJobs.slice(0, 3).map(job => (
                      <div key={job._id} className="job-item">
                        <div className="job-info">
                          <h4 className="job-title">{job.title}</h4>
                          <div className="job-meta">
                            <span className="job-location">
                              <i className="fas fa-map-marker-alt"></i> {job.location}
                            </span>
                            <span className="job-applicants">
                              <i className="fas fa-users"></i> {job.applicationCount || 0} Applicants
                            </span>
                          </div>
                        </div>
                        <button 
                          className="view-applicants-btn"
                          onClick={() => { setActivePage('apps'); fetchApplications(); }}
                        >
                          View Applicants
                        </button>
                      </div>
                    ))}
                    {postedJobs.length === 0 && (
                      <div className="empty-state">
                        <p className="empty-text">No jobs posted yet</p>
                        <button className="primary-btn" onClick={() => setActivePage('post')}>
                          Post Your First Job
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="sidebar-column">
                <div className="jobs">
                  <h3 className="card-title">Recent Activity</h3>
                  <div className="activity-feed">
                    {applications.slice(0, 3).map(application => (
                      <div key={application._id} className="activity-item">
                        <div className="activity-icon">
                          <i className="fas fa-user-plus"></i>
                        </div>
                        <div className="activity-content">
                          <p className="activity-text">
                            <strong>{application.user?.name}</strong> applied for {application.job?.title}
                          </p>
                          <span className="activity-time">
                            {new Date(application.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    {applications.length === 0 && (
                      <p className="no-activity">No recent activity</p>
                    )}
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
        <DashboardNavbar
          user={user}
          handleLogout={handleLogout}
          getUserRole={getUserRole}
        />
        
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
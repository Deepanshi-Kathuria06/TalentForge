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
// import "../../assets/styles/jobsforms.css";

const CompanyDashboard = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activePage, setActivePage] = useState('feed');
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [postedJobs, setPostedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { posts: feedPosts, addPost, likePost, addComment, sharePost } = useFeed();

  // Enhanced sample data
  const samplePosts = [
    {
      id: '1',
      author: {
        name: 'J Morgan',
        role: 'Recruiter',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
        isVerified: true
      },
      content: 'Hi we are hiring for multiple frontend developer positions. Looking for React experts with 2+ years experience. #hiring #techjobs',
      timestamp: 'Just now',
      likes: 12,
      comments: 3,
      shares: 1,
      images: []
    },
    {
      id: '2',
      author: {
        name: 'Sarah Chen',
        role: 'HR Manager',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face',
        isVerified: true
      },
      content: 'Excited to announce our new internship program for 2024! Applications open next week. Great opportunity for students to gain real-world experience.',
      timestamp: '2 hours ago',
      likes: 45,
      comments: 8,
      shares: 5,
      images: []
    },
    {
      id: '3',
      author: {
        name: 'TechCorp Inc.',
        role: 'Verified Company',
        avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=60&h=60&fit=crop&crop=face',
        isVerified: true
      },
      content: 'Our annual developer conference is coming up! Join us for workshops, networking, and the latest in tech innovation. Early bird tickets available now.',
      timestamp: '1 day ago',
      likes: 124,
      comments: 23,
      shares: 15,
      images: []
    }
  ];

  const [posts, setPosts] = useState(samplePosts);

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
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face'
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
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face'
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

  const handleCreatePost = (newPost) => {
    const post = {
      id: Date.now().toString(),
      author: {
        name: user?.companyName || user?.name || 'Company',
        role: getUserRole(),
        avatar: user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
        isVerified: true
      },
      content: newPost.content,
      timestamp: 'Just now',
      likes: 0,
      comments: [],
      shares: 0,
      images: newPost.images || []
    };
    setPosts([post, ...posts]);
    setIsCreatePostModalOpen(false);
  };

  const handleLikePost = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
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
            { icon: 'fa-home', text: 'Feed', page: 'feed' },
            { icon: 'fa-chart-bar', text: 'Analytics', page: 'analytics' },
            { icon: 'fa-plus-circle', text: 'Post Job', page: 'post' },
            { icon: 'fa-file-alt', text: 'Applications', page: 'apps' },
            { icon: 'fa-filter', text: 'Screening', page: 'screen' },
            { icon: 'fa-users', text: 'Candidates', page: 'candidates' },
            { icon: 'fa-cog', text: 'Settings', page: 'settings' }
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

  const FeedSection = () => (
    <div className="feed-page">
      <div className="feed-container">
        {/* Left Sidebar - Profile & Stats */}
        <div className="feed-sidebar left-sidebar">
          <div className="profile-card">
            <div className="profile-cover">
              <div className="cover-image"></div>
            </div>
            <div className="profile-info">
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"} 
                alt="Profile" 
                className="profile-avatar" 
              />
              <h3 className="profile-name">{user?.companyName || user?.name}</h3>
              <p className="profile-title">{getUserRole()}</p>
              
              <div className="profile-stats">
                <div className="stat-item">
                  <strong>{postedJobs.length}</strong>
                  <span>Jobs Posted</span>
                </div>
                <div className="stat-item">
                  <strong>{applications.length}</strong>
                  <span>Applications</span>
                </div>
              </div>

              <div className="profile-views">
                <div className="views-header">
                  <span>Profile views</span>
                  <strong>1,234</strong>
                </div>
                <div className="views-trend">
                  <i className="fas fa-chart-line"></i>
                  <span>+12% this week</span>
                </div>
              </div>
            </div>
          </div>

          <div className="recent-activity">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {applications.slice(0, 3).map(app => (
                <div key={app._id} className="activity-item">
                  <i className="fas fa-user-plus"></i>
                  <div className="activity-content">
                    <p><strong>{app.user.name}</strong> applied</p>
                    <span>{app.job.title}</span>
                  </div>
                </div>
              ))}
              {applications.length === 0 && (
                <div className="no-activity">
                  <i className="fas fa-user-plus"></i>
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="feed-main">
          {/* Create Post Card */}
          <div className="create-post-card">
            <div className="post-composer">
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"} 
                alt="Profile" 
                className="composer-avatar" 
              />
              <button 
                className="composer-input"
                onClick={() => setIsCreatePostModalOpen(true)}
              >
                Start a post about hiring, updates, or achievements...
              </button>
            </div>
            <div className="composer-actions">
              <button className="action-btn">
                <i className="fas fa-image" style={{color: '#378FE9'}}></i>
                <span>Media</span>
              </button>
              <button className="action-btn">
                <i className="fas fa-calendar" style={{color: '#C37D16'}}></i>
                <span>Event</span>
              </button>
              <button className="action-btn">
                <i className="fas fa-newspaper" style={{color: '#E06847'}}></i>
                <span>Article</span>
              </button>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="posts-feed">
            {posts.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <img src={post.author.avatar} alt={post.author.name} className="post-avatar" />
                  <div className="post-author">
                    <div className="author-info">
                      <h4 className="author-name">
                        {post.author.name}
                        {post.author.isVerified && <i className="fas fa-check-circle verified"></i>}
                      </h4>
                      <p className="author-role">{post.author.role}</p>
                      <span className="post-time">{post.timestamp}</span>
                    </div>
                  </div>
                  <button className="post-options">
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                </div>

                <div className="post-content">
                  <p>{post.content}</p>
                </div>

                <div className="post-stats">
                  <div className="stats-left">
                    <span className="likes-count">
                      <i className="fas fa-thumbs-up"></i>
                      {post.likes}
                    </span>
                    <span className="comments-count">
                      {post.comments.length} comments
                    </span>
                  </div>
                  <div className="stats-right">
                    <span className="shares-count">{post.shares} shares</span>
                  </div>
                </div>

                <div className="post-actions">
                  <button className="post-action" onClick={() => handleLikePost(post.id)}>
                    <i className="far fa-thumbs-up"></i>
                    <span>Like</span>
                  </button>
                  <button className="post-action">
                    <i className="far fa-comment"></i>
                    <span>Comment</span>
                  </button>
                  <button className="post-action">
                    <i className="far fa-share-square"></i>
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Widgets */}
        <div className="feed-sidebar right-sidebar">
          <div className="news-card">
            <div className="news-header">
              <h3>Recruitment Insights</h3>
              <i className="fas fa-info-circle"></i>
            </div>
            <div className="news-content">
              <div className="insight-item">
                <i className="fas fa-eye"></i>
                <div>
                  <strong>1.2K</strong>
                  <span>Profile Views</span>
                </div>
              </div>
              <div className="insight-item">
                <i className="fas fa-heart"></i>
                <div>
                  <strong>247</strong>
                  <span>Post Engagements</span>
                </div>
              </div>
              <div className="insight-item">
                <i className="fas fa-share"></i>
                <div>
                  <strong>89</strong>
                  <span>Shares</span>
                </div>
              </div>
            </div>
          </div>

          <div className="jobs-card">
            <div className="jobs-header">
              <h3>Your Jobs</h3>
              <button className="see-all-btn" onClick={() => setActivePage('post')}>
                See all
              </button>
            </div>
            <div className="jobs-list">
              {postedJobs.slice(0, 3).map(job => (
                <div key={job._id} className="job-item">
                  <h4 className="job-title">{job.title}</h4>
                  <p className="job-company">{user?.companyName || 'Your Company'}</p>
                  <div className="job-meta">
                    <span className="job-applicants">
                      <i className="fas fa-users"></i>
                      {job.applicationCount || 0} applicants
                    </span>
                  </div>
                </div>
              ))}
              {postedJobs.length === 0 && (
                <div className="empty-jobs">
                  <i className="fas fa-briefcase"></i>
                  <p>No jobs posted yet</p>
                  <button 
                    className="post-job-btn"
                    onClick={() => setActivePage('post')}
                  >
                    Post your first job
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="premium-card">
            <div className="premium-content">
              <h3>Upgrade to Premium</h3>
              <p>Get 5x more profile views and advanced hiring tools</p>
              <button className="premium-btn">
                Try for free
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
      case 'feed':
        return <FeedSection />;

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
            </div>
          </div>
        );

      case 'apps':
        return (
          <div className="page-content">
            <div className="page-header">
              <h2 className="page-title">Applications</h2>
              <p className="page-subtitle">Manage and review job applications</p>
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
                        <div key={`{application._id}`} className="application-card">
                          <div className="application-main">
                            <img 
                              src={application.user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"} 
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
                                  <i className="fas fa-check"></i> Accept
                                </button>
                                <button 
                                  onClick={() => handleApplicationAction(application._id, 'rejected')}
                                  className="action-btn danger-btn"
                                >
                                  <i className="fas fa-times"></i> Reject
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
                    <button className="quick-action-btn" onClick={() => setActivePage('feed')}>
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
                <div className="card">
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

export default CompanyDashboard;//
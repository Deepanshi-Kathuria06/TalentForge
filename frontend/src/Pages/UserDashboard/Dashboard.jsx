import React, { useState } from "react";
import Settings from "../UserDashboard/Sections/Settings";
import "../UserDashboard/UserDashboard.css";

// 🔹 Dashboard component (includes Sidebar + Topbar inside same file)
const Dashboard = ({ onLogout, user }) => {
  const [activePage, setActivePage] = useState("stats");

  // Helper function to get user role display text
  const getUserRole = (user) => {
    if (!user) return 'Job Seeker';
    if (user.userType === 'user') return 'Job Seeker';
    if (user.role) return user.role;
    return 'Job Seeker';
  };

  // Page content renderer
  const renderPageContent = () => {
    switch (activePage) {
      case "stats":
        return (
          <div className="stats-section">
            <h2>Welcome back, {user?.name || 'there'}!</h2>
            <p>Here's your career dashboard overview...</p>
            <div className="user-welcome-card">
              <h3>Your Profile</h3>
              <p><strong>Name:</strong> {user?.name || 'Not set'}</p>
              <p><strong>Role:</strong> {getUserRole(user)}</p>
              <p><strong>Email:</strong> {user?.email || 'Not set'}</p>
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="profile-section">
            <h2>Your Profile</h2>
            <div className="profile-card">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> {getUserRole(user)}</p>
              <p><strong>Member Since:</strong> Recently joined</p>
            </div>
          </div>
        );
      case "resume":
        return (
          <div className="resume-section">
            <h2>Resume Tools</h2>
            <p>Hello {user?.name || 'there'}! Build and optimize your resume here.</p>
          </div>
        );
      case "projects":
        return (
          <div className="projects-section">
            <h2>Your Projects</h2>
            <p>{user?.name || 'You'} have created the following projects...</p>
          </div>
        );
      case "apps":
        return (
          <div className="apps-section">
            <h2>Your Applications</h2>
            <p>Track your job/internship applications, {user?.name || 'there'}...</p>
          </div>
        );
      case "network":
        return (
          <div className="network-section">
            <h2>Your Network</h2>
            <p>Hello {user?.name || 'there'}! Connect with professionals...</p>
          </div>
        );
      case "saved":
        return (
          <div className="saved-section">
            <h2>Your Saved Items</h2>
            <p>{user?.name || 'You'} have saved these jobs and resources.</p>
          </div>
        );
      case "challenges":
        return (
          <div className="challenges-section">
            <h2>Coding Challenges</h2>
            <p>Hello {user?.name || 'there'}! Practice coding questions like LeetCode.</p>
          </div>
        );
      case "learning":
        return (
          <div className="learning-section">
            <h2>Your Learning Path</h2>
            <p>{user?.name || 'You'} are learning these skills...</p>
          </div>
        );
      case "notifications":
        return (
          <div className="notifications-section">
            <h2>Your Notifications</h2>
            <p>Personal updates for {user?.name || 'you'}.</p>
          </div>
        );
      case "settings":
        return <Settings user={user} />;
      default:
        return (
          <div className="stats-section">
            <h2>Welcome, {user?.name || 'there'}!</h2>
            <p>Your personalized dashboard is ready.</p>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>TalentForge</h3>
          <div className="user-mini-info">
            <span className="user-mini-name">{user?.name?.split(' ')[0] || 'User'}</span>
            <span className="user-mini-role">{getUserRole(user)}</span>
          </div>
        </div>
        <ul>
          <li onClick={() => setActivePage("stats")}>📊 Dashboard</li>
          <li onClick={() => setActivePage("profile")}>👤 Profile</li>
          <li onClick={() => setActivePage("resume")}>📄 Resume Tools</li>
          <li onClick={() => setActivePage("projects")}>📂 Projects</li>
          <li onClick={() => setActivePage("apps")}>💼 Applications</li>
          <li onClick={() => setActivePage("network")}>🤝 Network</li>
          <li onClick={() => setActivePage("saved")}>⭐ Saved</li>
          <li onClick={() => setActivePage("challenges")}>🧑‍💻 Challenges</li>
          <li onClick={() => setActivePage("learning")}>📚 Learning</li>
          <li onClick={() => setActivePage("notifications")}>🔔 Notifications</li>
          <li onClick={() => setActivePage("settings")}>⚙️ Settings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Enhanced Topbar */}
        <div className="topbar">
          <div className="search-box">
            <input type="text" placeholder="Search jobs, companies, or skills..." />
          </div>
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">{user?.name || 'Guest User'}</span>
              <span className="user-role">{getUserRole(user)}</span>
            </div>
            <div className="user-avatar">
              {user?.name?.charAt(0) || 'G'}
            </div>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="dashboard-content">
          {renderPageContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
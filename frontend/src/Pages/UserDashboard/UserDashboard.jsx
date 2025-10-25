
import React, { useState } from "react";
import Settings from "../UserDashboard/Sections/Settings";
import './UserDashboard.css';

// 🔹 Dashboard component (includes Sidebar + Topbar inside same file)
const Dashboard = ({ onLogout, user }) => {
  const [activePage, setActivePage] = useState("stats");

  // Page content renderer
  const renderPageContent = () => {
    switch (activePage) {
      case "stats":
        return (
          <div className="stats-section">
            <h2>Dashboard Overview</h2>
            <p>Here you can see your key stats...</p>
          </div>
        );
      case "profile":
        return (
          <div className="profile-section">
            <h2>Profile</h2>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
          </div>
        );
      case "resume":
        return (
          <div className="resume-section">
            <h2>Resume Tools</h2>
            <p>Resume Builder + ATS Checker</p>
          </div>
        );
      case "projects":
        return (
          <div className="projects-section">
            <h2>Projects</h2>
            <p>All your projects listed here...</p>
          </div>
        );
      case "apps":
        return (
          <div className="apps-section">
            <h2>Applications</h2>
            <p>Track your job/internship applications...</p>
          </div>
        );
     
      case "network":
        return (
          <div className="network-section">
            <h2>Network</h2>
            <p>Connections, feed, and messages...</p>
          </div>
        );
      case "saved":
        return (
          <div className="saved-section">
            <h2>Saved</h2>
            <p>Your saved jobs, posts, and resources.</p>
          </div>
        );
      case "challenges":
        return (
          <div className="challenges-section">
            <h2>Coding Challenges</h2>
            <p>Daily practice questions like LeetCode.</p>
          </div>
        );
      case "learning":
        return (
          <div className="learning-section">
            <h2>Learning</h2>
            <p>Courses, interview prep & resources.</p>
          </div>
        );
      case "notifications":
        return (
          <div className="notifications-section">
            <h2>Notifications</h2>
            <p>All updates & alerts here.</p>
          </div>
        );
            case "settings":
        return <Settings />;


      default:
        return <div className="stats-section">Default Dashboard</div>;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
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
        {/* Topbar */}
        <div className="topbar">
          <div className="search-box">
            <input type="text" placeholder="Search..." />
          </div>
          <div className="user-info">
            <span>{user?.name || "Guest"}</span>
            <button onClick={onLogout}>Logout</button>
          </div>
        </div>

        {/* Page Content */}
        <div className="dashboard-content">{renderPageContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;

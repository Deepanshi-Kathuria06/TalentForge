import React, { useState } from "react";
import Settings from "../UserDashboard/Sections/Settings";
import DashboardNavbar from "../UserDashboard/DashboardNavbar";
import './UserDashboard.css';

const Dashboard = ({ onLogout, user }) => {
  const [activePage, setActivePage] = useState("stats");

  // Renders content based on selected sidebar page
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
      case "settings":
        return <Settings />;
      default:
        return <div>Coming Soon...</div>;
    }
  };

  return (
    <div className="dashboard-container">
      {/* ✅ Top Navbar */}
      <DashboardNavbar user={user} onLogout={onLogout} />

      <div className="dashboard-body">
        {/* Sidebar */}
        <div className="sidebar">
          <ul>
            <li onClick={() => setActivePage("stats")}>📊 Dashboard</li>
            <li onClick={() => setActivePage("profile")}>👤 Profile</li>
            <li onClick={() => setActivePage("resume")}>📄 Resume Tools</li>
            <li onClick={() => setActivePage("projects")}>📂 Projects</li>
            <li onClick={() => setActivePage("apps")}>💼 Applications</li>
            <li onClick={() => setActivePage("gamify")}>🏆 Gamify</li>
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
          <div className="dashboard-content">{renderPageContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

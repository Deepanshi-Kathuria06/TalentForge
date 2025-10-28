// src/components/UserDashboard/DashboardNavbar.jsx
import React from "react";
import "./DashboardNavbar.css";

const DashboardNavbar = ({ user, handleLogout, getUserRole }) => {
  return (
    <div className="top-bar">
      {/* 🔍 Search Bar */}
      <div className="search-bar">
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Search jobs, companies, or skills..."
        />
      </div>

      {/* 👤 Profile Section */}
      <div className="profile-section">
        <div className="stats">
          <div className="stat-item">
            <span className="stat-value">24</span>
            <span className="stat-label">Applications</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">156</span>
            <span className="stat-label">Views</span>
          </div>
        </div>

        <div className="profile-info">
          <img
            src={
              user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"
            }
            alt="User Avatar"
            className="profile-avatar"
          />
          <div className="profile-details">
            <h3 className="profile-name">{user?.name || "Student"}</h3>
            <p className="profile-role">{getUserRole()}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;

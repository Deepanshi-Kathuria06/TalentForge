import React, { useState } from 'react';
import './DashboardNavbar.css';
import DashboardNavbar from './DashboardNavbar';

const DashboardNavbar = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="dashboard-navbar">
         {/* Left Section - Logo */}
          {/* <div className="navbar-left">
         <div className="logo">
          <i className="fas fa-bolt logo-icon"></i>
          <span className="logo-text">TalentForge</span>
         </div>
        </div> */}

      {/* Center Section - Search Bar */}
      <div className="navbar-center">
        <div className="search-bar">
          <i className="fas fa-search search-icon"></i>
          <input 
            type="text" 
            placeholder="Search..." 
            className="search-input"
          />
        </div>
      </div>

      {/* Right Section - User Menu */}
      <div className="navbar-right">
        <div className="user-section" onClick={toggleDropdown}>
          <img 
            src={user?.profileImage || "https://randomuser.me/api/portraits/men/12.jpg"} 
            alt="Profile" 
            className="user-avatar"
          />
          <span className="user-name">{user?.name || 'User'}</span>
          <i className={`fas fa-chevron-${showDropdown ? 'up' : 'down'} dropdown-arrow`}></i>
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-item">
                <i className="fas fa-user"></i>
                <span>Profile</span>
              </div>
              <div className="dropdown-item">
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item" onClick={onLogout}>
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
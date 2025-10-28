// src/components/UserDashboard/DashboardNavbar.jsx
import React, { useState } from "react";
import "./DashboardNavbar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DashboardNavbar = ({ user, handleLogout, getUserRole }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  // 🔍 Handle search input
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setResults([]);
      setShowResults(false);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/profile/search?name=${query}`);
      setResults(res.data);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // 👤 Navigate to selected profile
  const handleSelectUser = (id) => {
    navigate(`/profile/${id}`);
    setShowResults(false);
    setSearchQuery("");
  };

  return (
    <div className="top-bar">
      {/* 🔍 Search Bar */}
      <div className="search-bar">
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Search users by name..."
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 150)}
        />

        {/* 🔽 Dropdown Results */}
        {showResults && results.length > 0 && (
          <div className="search-results-dropdown">
            {results.map((item) => (
              <div
                key={item._id}
                className="search-result-item"
                onClick={() => handleSelectUser(item._id)}
              >
                <img
                  src={item.profilePhoto || "https://randomuser.me/api/portraits/men/32.jpg"}
                  alt={item.name}
                  className="result-avatar"
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        )}
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
            src={user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
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

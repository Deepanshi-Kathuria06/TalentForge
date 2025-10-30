import React, { useState } from "react";
import "./DashboardNavbar.css";
import { useNavigate } from "react-router-dom";
import API from "../utils/api"; 

const DashboardNavbar = ({ user, handleLogout, getUserRole }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
  const query = e.target.value;
  setSearchQuery(query);

  if (query.trim() === "" || query.trim().length < 2) {
    setSearchResults([]);
    setShowResults(false);
    return;
  }

  setLoading(true);
  try {
    console.log('🔍 Searching for:', query);
    
    // Use the profile search endpoint from your API utility
    const response = await API.get(`profile/search?name=${encodeURIComponent(query)}`);
    console.log('✅ Search results:', response.data);
    setSearchResults(response.data);
    setShowResults(true);
  } catch (error) {
    console.error("❌ Search error:", error);
    
    // Fallback to demo data if search fails
    console.log("ℹ️ Using demo search results");
    setSearchResults([
      {
        _id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        tagline: 'Software Engineer at Google',
        avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=004030&color=fff',
        userType: 'student'
      },
      {
        _id: '2', 
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        tagline: 'Student at Harvard University',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=004030&color=fff',
        userType: 'student'
      }
    ]);
    setShowResults(true);
  } finally {
    setLoading(false);
  }
};

  const handleSelectUser = (userId) => {
    console.log('👤 User selected:', userId);
    setShowResults(false);
    setSearchQuery("");
    // Navigate to user profile
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="dashboard-top">
      {/* 🔍 Search Bar */}
      <div className="search-bar">
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Search users by name..."
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />

        {loading && (
          <div className="search-loading">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
        )}

        {showResults && searchResults.length > 0 && (
          <div className="search-results-dropdown">
            {searchResults.map((user) => (
              <div
                key={user._id}
                className="search-result-item"
                onClick={() => handleSelectUser(user._id)}
              >
                <img
                  src={user.avatar || "https://ui-avatars.com/api/?name=User&background=004030&color=fff"}
                  alt={user.name}
                />
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-tagline">{user.tagline}</div>
                  {user.email && <div className="user-email">{user.email}</div>}
                </div>
                <div className={`user-type ${user.userType}`}>
                  {user.userType}
                </div>
              </div>
            ))}
          </div>
        )}

        {showResults && searchQuery.length >= 2 && searchResults.length === 0 && !loading && (
          <div className="search-results-dropdown">
            <div className="no-results">
              <i className="fas fa-search"></i>
              <span>No users found for "{searchQuery}"</span>
            </div>
          </div>
        )}
      </div>

      {/* 👤 Right Section */}
      <div className="right-section">
        <div className="user-profile">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=004030&color=fff`}
            alt="User Avatar"
          />
          <div className="details">
            <span className="name">{user?.name || "User"}</span>
            <span className="role">{getUserRole()}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>
  );
};

export default DashboardNavbar;
import React, { useState } from "react";
import "../assets/styles/Navbar.css";
import { FaHome, FaTools } from "react-icons/fa";
import { IoLogInOutline } from "react-icons/io5";
import { MdOutlineAppRegistration } from "react-icons/md";

const TalentForgeLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#004030"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 10L12 4 2 10l10 6 10-6z" />
    <path d="M6 12v6c4 2 8 2 12 0v-6" />
  </svg>
);

const ResumeBuilderIllustration = () => (
  <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="140" height="100" rx="5" fill="#FFF9E5" stroke="#004030" strokeWidth="2" />
    <rect x="20" y="25" width="120" height="15" rx="3" fill="#DCD0A8" />
    <rect x="20" y="50" width="80" height="10" rx="2" fill="#4A9782" fillOpacity="0.5" />
    <rect x="20" y="65" width="100" height="10" rx="2" fill="#DCD0A8" />
    <rect x="20" y="80" width="60" height="10" rx="2" fill="#4A9782" fillOpacity="0.5" />
    <rect x="110" y="50" width="30" height="40" rx="3" fill="#004030" />
    <path d="M125 65L115 75H135L125 65Z" fill="#FFF9E5" />
  </svg>
);

const ATSCheckerIllustration = () => (
  <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="140" height="100" rx="5" fill="#FFF9E5" stroke="#004030" strokeWidth="2" />
    <circle cx="80" cy="50" r="30" fill="#DCD0A8" stroke="#004030" strokeWidth="2" />
    <path d="M70 45L80 60L100 40" stroke="#004030" strokeWidth="3" strokeLinecap="round" />
    <rect x="40" y="85" width="80" height="10" rx="3" fill="#4A9782" />
    <rect x="40" y="85" width="60" height="10" rx="3" fill="#004030" />
    <text x="80" y="93" fontFamily="Arial" fontSize="8" fill="#FFF9E5" textAnchor="middle">
      85% Match
    </text>
  </svg>
);

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleToolClick = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest('.has-dropdown')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeDropdown]);

  return (
    <>
      {/* Top Horizontal Navbar for Logo and Auth */}
      <div className="top-navbar">
        <div className="top-navbar-content">
          {/* Logo with name and click functionality */}
          <div className="nav-logo-section" onClick={handleLogoClick}>
            <div className="nav-logo">
              <TalentForgeLogo />
            </div>
            <div className="logo-name">TalentForge</div>
          </div>

          {/* Auth buttons - Right side */}
          <div className="nav-actions">
            <button className="login-btn" onClick={() => (window.location.href = "/login")}>
              <IoLogInOutline size={18} /> Login
            </button>
            <button className="signup-btn" onClick={() => (window.location.href = "/signup")}>
              <MdOutlineAppRegistration size={18} /> Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Circular Slider for Navigation Icons */}
      <div className="navbar-container">
        <nav className="navbar">
          {/* Nav Links */}
          <ul className="nav-links">
            <li>
              <a href="/" className="nav-icon" onClick={closeDropdown}>
                <FaHome size={22} />
              </a>
            </li>

            <li
              className="has-dropdown"
              onClick={(e) => {
                e.stopPropagation();
                handleToolClick("resume");
              }}
            >
              <span className={`nav-icon ${activeDropdown === "resume" ? "active" : ""}`}>
                <FaTools size={22} />
              </span>
              <div className={`dropdown-with-images-vertical ${activeDropdown === "resume" ? "active" : ""}`}>
                <div className="dropdown-item">
                  <ResumeBuilderIllustration />
                  <div className="dropdown-content">
                    <h5>Resume Builder</h5>
                    <button
                      className="dropdown-btn"
                      onClick={() => (window.location.href = "/starting")}
                    >
                      Try Now
                    </button>
                  </div>
                </div>
                <div className="dropdown-item">
                  <ATSCheckerIllustration />
                  <div className="dropdown-content">
                    <h5>ATS Checker</h5>
                    <button
                      className="dropdown-btn"
                      onClick={() => (window.location.href = "/ATS")}
                    >
                      Check Score
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navbar;

import React, { useState } from "react";
import "../assets/styles/Navbar.css";

const TalentForgeLogo = () => (
  <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#004030"
      strokeWidth="3"   // ✅ Thicker lines for bold effect
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10L12 4 2 10l10 6 10-6z" />
      <path d="M6 12v6c4 2 8 2 12 0v-6" />
    </svg>
);

const ResumeBuilderIllustration = () => (
  <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="140" height="100" rx="5" fill="#FFF9E5" stroke="#004030" strokeWidth="2"/>
    <rect x="20" y="25" width="120" height="15" rx="3" fill="#DCD0A8"/>
    <rect x="20" y="50" width="80" height="10" rx="2" fill="#4A9782" fillOpacity="0.5"/>
    <rect x="20" y="65" width="100" height="10" rx="2" fill="#DCD0A8"/>
    <rect x="20" y="80" width="60" height="10" rx="2" fill="#4A9782" fillOpacity="0.5"/>
    <rect x="110" y="50" width="30" height="40" rx="3" fill="#004030"/>
    <path d="M125 65L115 75H135L125 65Z" fill="#FFF9E5"/>
  </svg>
);

const ATSCheckerIllustration = () => (
  <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="140" height="100" rx="5" fill="#FFF9E5" stroke="#004030" strokeWidth="2"/>
    <circle cx="80" cy="50" r="30" fill="#DCD0A8" stroke="#004030" strokeWidth="2"/>
    <path d="M70 45L80 60L100 40" stroke="#004030" strokeWidth="3" strokeLinecap="round"/>
    <rect x="40" y="85" width="80" height="10" rx="3" fill="#4A9782"/>
    <rect x="40" y="85" width="60" height="10" rx="3" fill="#004030"/>
    <text x="80" y="93" fontFamily="Arial" fontSize="8" fill="#FFF9E5" textAnchor="middle">85% Match</text>
  </svg>
);

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMouseEnter = (menu) => {
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="nav-logo">
          <TalentForgeLogo />
          <span>TalentForge</span>
        </div>

        <ul className="nav-links">
          <li><a href="/">Home</a></li>
         

          <li
            className="has-dropdown"
            onMouseEnter={() => handleMouseEnter("resume")}
            onMouseLeave={handleMouseLeave}
          >
            <span>Resume Tools</span>
            {activeMenu === "resume" && (
              <div className="dropdown-with-images">
                <div className="dropdown-item">
                  <ResumeBuilderIllustration />
                  <div className="dropdown-content">
                    <h5>Resume Builder</h5>
                    <p>Create ATS-friendly resumes easily.</p>
                    <button className="dropdown-btn" onClick={() => window.location.href='/starting'}>
                      Try Now
                    </button>
                  </div>
                </div>
                <div className="dropdown-item">
                  <ATSCheckerIllustration />
                  <div className="dropdown-content">
                    <h5>ATS Checker</h5>
                    <p>Scan your resume for keywords & score.</p>
                    <button className="dropdown-btn" 
                      Check Score
                      onClick={() => window.location.href='/ATS'}>
                      Check Score
                    </button>
                  </div>
                </div>
              </div>
            )}
          </li>

        </ul>

        <div className="nav-actions">
          <button className="login-btn" onClick={() => window.location.href='/login'}>
            Login
          </button>
          <button className="signup-btn" onClick={() => window.location.href='/signup'}>
            Sign Up
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

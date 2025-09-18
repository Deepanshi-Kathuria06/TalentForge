import React, { useState } from "react";
import "../assets/styles/Navbar.css";

// ================== Full Logo (Torch + Wordmark) ==================
const TalentForgeLogo = () => (
 <svg
    width="180"   // increase here
    height="60"   // increase here
    viewBox="0 0 520 140"   // keep proportional to the SVG design
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-labelledby="torch-title"
  >
    <title id="torch-title">TalentForge — torch logo</title>

    {/* Background card */}
    <rect
      x="0"
      y="0"
      width="800"
      height="600"
      rx="10"
      fill="#FFF9E5"
      stroke="#004030"
      strokeWidth="0"
    />

    {/* Torch */}
    <g
      transform="translate(40,24)"
      stroke="#004030"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Cup */}
      <path d="M24,52 h56 l-6,16 H30 z" fill="#DCD0A8" />
      {/* Handle */}
      <path d="M42,68 v28 M62,68 v28" stroke="#004030" />
      {/* Flame */}
      <path
        d="M52,10 c12,10 18,18 18,26 0,10-8,18-18,18 -10,0-18-8-18-18 0-8 6-16 18-26z"
        fill="#4A9782"
        fillOpacity="0.7"
        stroke="none"
      />
    </g>

    {/* Wordmark */}
    <text
      x="160"
      y="88"
      fontFamily="Inter, ui-sans-serif, system-ui"
      fontSize="44"
      fontWeight="700"
      fill="#004030"
    >
      TalentForge
    </text>
  </svg>
);

// ================== Resume Builder Illustration ==================
const ResumeBuilderIllustration = () => (
  <svg
    width="160"
    height="120"
    viewBox="0 0 160 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="10"
      y="10"
      width="140"
      height="100"
      rx="5"
      fill="#FFF9E5"
      stroke="#004030"
      strokeWidth="2"
    />
    <rect x="20" y="25" width="120" height="15" rx="3" fill="#DCD0A8" />
    <rect
      x="20"
      y="50"
      width="80"
      height="10"
      rx="2"
      fill="#4A9782"
      fillOpacity="0.5"
    />
    <rect x="20" y="65" width="100" height="10" rx="2" fill="#DCD0A8" />
    <rect
      x="20"
      y="80"
      width="60"
      height="10"
      rx="2"
      fill="#4A9782"
      fillOpacity="0.5"
    />
    <rect x="110" y="50" width="30" height="40" rx="3" fill="#004030" />
    <path d="M125 65L115 75H135L125 65Z" fill="#FFF9E5" />
  </svg>
);

// ================== ATS Checker Illustration ==================
const ATSCheckerIllustration = () => (
  <svg
    width="160"
    height="120"
    viewBox="0 0 160 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="10"
      y="10"
      width="140"
      height="100"
      rx="5"
      fill="#FFF9E5"
      stroke="#004030"
      strokeWidth="2"
    />
    <circle cx="80" cy="50" r="30" fill="#DCD0A8" stroke="#004030" strokeWidth="2" />
    <path
      d="M70 45L80 60L100 40"
      stroke="#004030"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <rect x="40" y="85" width="80" height="10" rx="3" fill="#4A9782" />
    <rect x="40" y="85" width="60" height="10" rx="3" fill="#004030" />
    <text
      x="80"
      y="93"
      fontFamily="Arial"
      fontSize="8"
      fill="#FFF9E5"
      textAnchor="middle"
    >
      85% Match
    </text>
  </svg>
);

// ================== Navbar ==================
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
        {/* Logo */}
        <div className="nav-logo">
          <TalentForgeLogo />
        </div>

        {/* Links */}
        <ul className="nav-links">
          <li>
            <a href="/">Home</a>
          </li>

          <li
            className="has-dropdown"
            onMouseEnter={() => handleMouseEnter("resume")}
            onMouseLeave={handleMouseLeave}
          >
            <span>Resume Tools</span>
            {activeMenu === "resume" && (
              <div className="dropdown-with-images">
                {/* Resume Builder */}
                <div className="dropdown-item">
                  <ResumeBuilderIllustration />
                  <div className="dropdown-content">
                    <h5>Resume Builder</h5>
                    <p>Create ATS-friendly resumes easily.</p>
                    <button
                      className="dropdown-btn"
                      onClick={() => (window.location.href = "/starting")}
                    >
                      Try Now
                    </button>
                  </div>
                </div>

                {/* ATS Checker */}
                <div className="dropdown-item">
                  <ATSCheckerIllustration />
                  <div className="dropdown-content">
                    <h5>ATS Checker</h5>
                    <p>Scan your resume for keywords & score.</p>
                    <button
                      className="dropdown-btn"
                      onClick={() => (window.location.href = "/ATS")}
                    >
                      Check Score
                    </button>
                  </div>
                </div>
              </div>
            )}
          </li>
        </ul>

        {/* Actions */}
        <div className="nav-actions">
          <button
            className="login-btn"
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </button>
          <button
            className="signup-btn"
            onClick={() => (window.location.href = "/signup")}
          >
            Sign Up
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

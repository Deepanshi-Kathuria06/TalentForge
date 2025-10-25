import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ChallengeStart.css';


const ChallengesStart = ({ onStart, onWelcome }) => {
  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleGetStarted = () => {
    // If props are passed (for testing or modal flow), call them
    if (onStart) {
      onStart();
      return;
    }
    if (onWelcome) {
      onWelcome();
      return;
    }

    // ✅ Default behavior: redirect to /challenges
    navigate('/challenges');
  };

  return (
    <div className="challenges-start">
      <div className="start-container">
        {/* Header Section */}
        <div className="start-header">
          <div className="header-content1">
            <h1>Welcome to Coding Challenges</h1>
            <p>Level up your skills with curated problems designed to push your boundaries</p>
          </div>
          <div className="battery-indicator">
            <span className="battery-icon">⚡</span>
            <span>Ready to Code</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="start-main">
          <div className="challenge-illustration">
            <CodeIcon />
          </div>
          
          <div className="start-content">
            <div className="welcome-text">
              <h2>Master Coding Through Practice</h2>
              <p>
                Solve real-world coding problems, track your progress, and compete with peers. 
                Start your journey to becoming a better developer today.
              </p>
            </div>

            <div className="quick-stats">
              <div className="stat-item">
                <div className="stat-number">150+</div>
                <div className="stat-label">Challenges</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24</div>
                <div className="stat-label">Categories</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">156</div>
                <div className="stat-label">Active Users</div>
              </div>
            </div>

            {/* ✅ Redirects to /challenges */}
            <button className="start-button" onClick={handleGetStarted}>
              Start Coding Challenges
              <ArrowIcon />
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="start-footer">
          <p>Join thousands of developers improving their skills daily</p>
        </div>
      </div>
    </div>
  );
};

// SVG Icon Components
const CodeIcon = () => (
  <svg viewBox="0 0 400 300" className="code-svg">
    <defs>
      <linearGradient id="codeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#004030" />
        <stop offset="100%" stopColor="#4A9782" />
      </linearGradient>
    </defs>
    <rect x="50" y="50" width="300" height="200" rx="12" fill="url(#codeGradient)" fillOpacity="0.1" stroke="#004030" strokeWidth="2"/>
    <rect x="70" y="80" width="180" height="8" rx="4" fill="#004030" fillOpacity="0.8"/>
    <rect x="70" y="100" width="140" height="8" rx="4" fill="#4A9782" fillOpacity="0.7"/>
    <rect x="70" y="120" width="160" height="8" rx="4" fill="#004030" fillOpacity="0.6"/>
    <rect x="70" y="140" width="120" height="8" rx="4" fill="#4A9782" fillOpacity="0.5"/>
    <rect x="70" y="160" width="200" height="8" rx="4" fill="#004030" fillOpacity="0.4"/>
    <text x="280" y="100" fill="#004030" fontSize="20" fontFamily="monospace">{'{'}</text>
    <text x="300" y="140" fill="#004030" fontSize="20" fontFamily="monospace">{'}'}</text>
    <circle cx="290" cy="180" r="6" fill="#DCD0A8"/>
    <circle cx="310" cy="180" r="6" fill="#4A9782"/>
    <circle cx="330" cy="180" r="6" fill="#004030"/>
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" className="arrow-icon">
    <path fill="currentColor" d="M5 13H16.17L11.29 17.88L12.71 19.29L19.71 12.29L12.71 5.29L11.29 6.71L16.17 11.71L5 11.71V13Z"/>
  </svg>
);

export default ChallengesStart;

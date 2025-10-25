import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Challenges/ChallengesWelcome.css';

const ChallengesWelcome = () => {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    solved: 12,
    total: 100,
    streak: 3,
    focusAreas: ['Data Structures', 'Algorithms', 'System Design'],
    lastChallenge: 'Two Sum'
  });

  const [dailyChallenge, setDailyChallenge] = useState({
    title: "Reverse String",
    difficulty: "Easy",
    points: 15,
    description: "Reverse a string in-place with O(1) extra memory"
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartNewChallenge = () => {
    navigate('/challenges/list');
  };

  const handleViewAllChallenges = () => {
    navigate('/challenges/list');
  };

  const handleContinueLastChallenge = () => {
    // Navigate to the last challenge user was working on
    navigate('/challenges/solve/1');
  };

  const handleStartDailyChallenge = () => {
    navigate('/challenges/daily');
  };

  const handleLeaderboard = () => {
    navigate('/leaderboard');
  };

  if (isLoading) {
    return (
      <div className="challenges-welcome loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="challenges-welcome">
      {/* Header Section */}
      <div className="welcome-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome to Coding Challenges 👋</h1>
            <p>Level up your skills with curated problems designed to push your boundaries</p>
          </div>
          <div className="hero-graphic">
            <CodingIllustration />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <TrophyIcon />
            <h3>Your Progress</h3>
          </div>
          <div className="stat-main">
            <div className="stat-value">{userStats.solved}<span>/{userStats.total}</span></div>
            <div className="stat-label">Challenges Solved</div>
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{width: `${(userStats.solved/userStats.total)*100}%`}}
                ></div>
              </div>
              <span className="progress-percent">
                {Math.round((userStats.solved/userStats.total)*100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <FireIcon />
            <h3>Current Streak</h3>
          </div>
          <div className="stat-main">
            <div className="stat-value">{userStats.streak}<span> days</span></div>
            <div className="stat-label">in a row</div>
            <div className="streak-calendar">
              {[...Array(7)].map((_, i) => (
                <div 
                  key={i} 
                  className={`streak-day ${i < userStats.streak ? 'active' : i === userStats.streak ? 'today' : ''}`}
                  title={i === userStats.streak ? 'Today' : `Day ${i+1}`}
                >
                  {i < userStats.streak ? '🔥' : i === userStats.streak ? '🎯' : '○'}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <BrainIcon />
            <h3>Skill Focus</h3>
          </div>
          <div className="stat-main">
            <div className="skill-tags">
              {userStats.focusAreas.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                  {index < userStats.focusAreas.length - 1 && ' • '}
                </span>
              ))}
            </div>
            <div className="skill-progress">
              <div className="skill-metric">
                <span className="metric-label">Data Structures</span>
                <div className="metric-bar">
                  <div className="metric-fill" style={{width: '75%'}}></div>
                </div>
              </div>
              <div className="skill-metric">
                <span className="metric-label">Algorithms</span>
                <div className="metric-bar">
                  <div className="metric-fill" style={{width: '60%'}}></div>
                </div>
              </div>
              <div className="skill-metric">
                <span className="metric-label">System Design</span>
                <div className="metric-bar">
                  <div className="metric-fill" style={{width: '40%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Challenge Highlight */}
      <div className="daily-highlight">
        <div className="daily-header">
          <CalendarIcon />
          <div className="daily-title">
            <h3>Daily Challenge</h3>
            <p>New challenge every 24 hours</p>
          </div>
          <span className="daily-badge">+{dailyChallenge.points} pts</span>
        </div>
        <div className="daily-content">
          <div className="challenge-info">
            <h4>{dailyChallenge.title}</h4>
            <p>{dailyChallenge.description}</p>
            <div className="challenge-meta">
              <span className={`difficulty ${dailyChallenge.difficulty.toLowerCase()}`}>
                {dailyChallenge.difficulty}
              </span>
              <span className="time-estimate">15 min avg</span>
            </div>
          </div>
          <button className="daily-action-btn" onClick={handleStartDailyChallenge}>
            <PlayIcon />
            Start Daily Challenge
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <button className="action-card primary" onClick={handleStartNewChallenge}>
            <div className="action-icon">
              <PlusIcon />
            </div>
            <div className="action-content">
              <h4>Start New Challenge</h4>
              <p>Browse and start a new coding challenge</p>
            </div>
            <ArrowIcon />
          </button>

          <button className="action-card secondary" onClick={handleViewAllChallenges}>
            <div className="action-icon">
              <ListIcon />
            </div>
            <div className="action-content">
              <h4>View All Challenges</h4>
              <p>Explore complete challenge library</p>
            </div>
            <ArrowIcon />
          </button>

          <button className="action-card tertiary" onClick={handleContinueLastChallenge}>
            <div className="action-icon">
              <ResumeIcon />
            </div>
            <div className="action-content">
              <h4>Continue Last Challenge</h4>
              <p>Resume: {userStats.lastChallenge}</p>
            </div>
            <ArrowIcon />
          </button>

          <button className="action-card outline" onClick={handleLeaderboard}>
            <div className="action-icon">
              <TrophyIcon />
            </div>
            <div className="action-content">
              <h4>View Leaderboard</h4>
              <p>See how you rank among peers</p>
            </div>
            <ArrowIcon />
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon solved">✓</div>
            <div className="activity-details">
              <p>Solved <strong>"Two Sum"</strong></p>
              <span className="activity-time">2 hours ago</span>
            </div>
            <span className="activity-points">+10 pts</span>
          </div>
          <div className="activity-item">
            <div className="activity-icon attempted">!</div>
            <div className="activity-details">
              <p>Attempted <strong>"Binary Tree Traversal"</strong></p>
              <span className="activity-time">Yesterday</span>
            </div>
            <span className="activity-points">+5 pts</span>
          </div>
          <div className="activity-item">
            <div className="activity-icon streak">🔥</div>
            <div className="activity-details">
              <p>3-day streak maintained</p>
              <span className="activity-time">2 days ago</span>
            </div>
            <span className="activity-points">+25 pts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// SVG Icon Components
const CodingIllustration = () => (
  <svg viewBox="0 0 400 300" className="coding-illustration">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#004030" />
        <stop offset="100%" stopColor="#4A9782" />
      </linearGradient>
    </defs>
    <rect x="50" y="50" width="300" height="200" rx="15" fill="url(#grad1)" opacity="0.1" stroke="#004030" strokeWidth="2"/>
    <rect x="80" y="80" width="240" height="40" rx="8" fill="#004030" opacity="0.8"/>
    <rect x="80" y="140" width="180" height="20" rx="4" fill="#4A9782" opacity="0.6"/>
    <rect x="80" y="180" width="120" height="20" rx="4" fill="#DCD0A8" opacity="0.8"/>
    <circle cx="300" cy="190" r="8" fill="#10B981"/>
    <circle cx="320" cy="190" r="8" fill="#F59E0B"/>
    <circle cx="340" cy="190" r="8" fill="#EF4444"/>
  </svg>
);

const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" className="icon">
    <path fill="#004030" d="M12 2C13.1 2 14 2.9 14 4V5H18C19.1 5 20 5.9 20 7V9C20 11.2 18.2 13 16 13H15.9C15.5 15.3 13.5 17 11 17C8.5 17 6.5 15.3 6.1 13H6C3.8 13 2 11.2 2 9V7C2 5.9 2.9 5 4 5H8V4C8 2.9 8.9 2 10 2H12ZM4 9H6V11H4V9ZM18 9H20V11H18V9Z"/>
  </svg>
);

const FireIcon = () => (
  <svg viewBox="0 0 24 24" className="icon">
    <path fill="#EF4444" d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2Z"/>
  </svg>
);

const BrainIcon = () => (
  <svg viewBox="0 0 24 24" className="icon">
    <path fill="#8B5CF6" d="M12 3C13.1 3 14 3.9 14 5C14 5.1 14 5.19 14 5.29C15.19 5.94 16 7.17 16 8.5C16 9.88 15.12 11 14 11H10C8.88 11 8 9.88 8 8.5C8 7.17 8.81 5.94 10 5.29C10 5.19 10 5.1 10 5C10 3.9 10.9 3 12 3ZM15 12H9C6.24 12 4 14.24 4 17V20H20V17C20 14.24 17.76 12 15 12Z"/>
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" className="icon">
    <path fill="#004030" d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19Z"/>
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" className="btn-icon">
    <path fill="currentColor" d="M8 5V19L19 12L8 5Z"/>
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" className="action-icon-svg">
    <path fill="currentColor" d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
  </svg>
);

const ListIcon = () => (
  <svg viewBox="0 0 24 24" className="action-icon-svg">
    <path fill="currentColor" d="M3 13H11V11H3V13ZM3 17H11V15H3V17ZM3 9H11V7H3V9ZM13 13H21V11H13V13ZM13 17H21V15H13V17ZM13 7V9H21V7H13Z"/>
  </svg>
);

const ResumeIcon = () => (
  <svg viewBox="0 0 24 24" className="action-icon-svg">
    <path fill="currentColor" d="M10 9V15L14 12L10 9ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"/>
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" className="arrow-icon">
    <path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
  </svg>
);

export default ChallengesWelcome;
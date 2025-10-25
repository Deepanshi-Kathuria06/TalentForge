import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CodingApiService from '../services/codingApiService';
import './Challenges.css';

const ChallengesPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalSolved: 47,
    streak: 12,
    rank: 'Top 8%',
    points: 1250,
    coins: 145
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      // Fetch from multiple platforms
      const [leetcodeProblems, codechefProblems] = await Promise.all([
        CodingApiService.fetchLeetCodeProblems(100),
        CodingApiService.fetchCodeChefProblems()
      ]);

      const allProblems = [...leetcodeProblems, ...codechefProblems];
      setChallenges(allProblems);
    } catch (error) {
      console.error('Error loading challenges:', error);
      // Use fallback data
      const fallbackProblems = await CodingApiService.fetchLeetCodeProblems(50);
      setChallenges(fallbackProblems);
    } finally {
      setLoading(false);
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    const difficultyMatch = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;
    const platformMatch = selectedPlatform === 'all' || challenge.platform === selectedPlatform;
    const tabMatch = activeTab === 'all' || 
                    (activeTab === 'solved' && challenge.solved) ||
                    (activeTab === 'premium' && challenge.premium);
    return difficultyMatch && platformMatch && tabMatch;
  });

  const handleSolveClick = async (challenge) => {
    try {
      // Fetch full problem details
      const problemDetails = await CodingApiService.fetchLeetCodeProblem(
        challenge.title.toLowerCase().replace(/ /g, '-')
      );
      navigate(`/solve/${challenge.id}`, { state: { problem: problemDetails } });
    } catch (error) {
      console.error('Error fetching problem details:', error);
      navigate(`/solve/${challenge.id}`, { state: { problem: challenge } });
    }
  };

  const DifficultyBadge = ({ difficulty }) => (
    <span className={`difficulty-badge ${difficulty}`}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  );

  const PlatformBadge = ({ platform }) => (
    <span className={`platform-badge ${platform}`}>
      {platform.charAt(0).toUpperCase() + platform.slice(1)}
    </span>
  );

  const AcceptanceBar = ({ acceptance }) => (
    <div className="acceptance-bar">
      <div className="acceptance-fill" style={{width: acceptance}}></div>
      <span className="acceptance-text">{acceptance}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="challenges-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="challenges-page">
      <div className="challenges-header">
        <div className="header-content">
          <h1>Problems</h1>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-label">Solved</span>
              <span className="stat-value">{userStats.totalSolved}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Streak</span>
              <span className="stat-value">{userStats.streak}🔥</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Coins</span>
              <span className="stat-value">{userStats.coins}🪙</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Rank</span>
              <span className="stat-value">{userStats.rank}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="challenges-layout">
        {/* Left Sidebar */}
        <div className="left-sidebar">
          <div className="daily-challenge-card">
            <div className="daily-header">
              <h3>Daily Challenge</h3>
              <span className="coins-reward">+1🪙</span>
            </div>
            <div className="daily-content">
              <h4>Maximum Subarray</h4>
              <p>Find the contiguous subarray with the largest sum</p>
              <DifficultyBadge difficulty="easy" />
              <button className="daily-solve-btn">
                Solve Challenge
              </button>
            </div>
          </div>

          {/* Platform Filter */}
          <div className="platform-filter-card">
            <h3>Platform</h3>
            <div className="platform-filters">
              {['all', 'leetcode', 'codechef', 'hackerrank'].map(platform => (
                <button
                  key={platform}
                  className={`platform-filter ${selectedPlatform === platform ? 'active' : ''}`}
                  onClick={() => setSelectedPlatform(platform)}
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="calendar-card">
            <h3>March 2024</h3>
            <div className="calendar-grid">
              {/* Calendar content remains same */}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="challenges-main">
          <div className="filters-bar">
            <div className="filter-tabs">
              {[
                {key: 'all', label: 'All'},
                {key: 'solved', label: 'Solved'},
                {key: 'premium', label: 'Premium'}
              ].map(tab => (
                <button
                  key={tab.key}
                  className={`filter-tab ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="difficulty-filters">
              {['all', 'easy', 'medium', 'hard'].map(difficulty => (
                <button
                  key={difficulty}
                  className={`difficulty-filter ${selectedDifficulty === difficulty ? 'active' : ''} ${difficulty}`}
                  onClick={() => setSelectedDifficulty(difficulty)}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </button>
              ))}
            </div>

            <div className="search-sort">
              <input 
                type="text" 
                placeholder="Search problems..."
                className="search-input"
              />
              <select className="sort-select">
                <option>Sort by</option>
                <option>Acceptance</option>
                <option>Difficulty</option>
                <option>Frequency</option>
              </select>
            </div>
          </div>

          <div className="problems-table">
            <div className="table-header">
              <div className="col-status">Status</div>
              <div className="col-title">Title</div>
              <div className="col-platform">Platform</div>
              <div className="col-acceptance">Acceptance</div>
              <div className="col-difficulty">Difficulty</div>
              <div className="col-frequency">Frequency</div>
              <div className="col-action">Action</div>
            </div>
            
            <div className="table-body">
              {filteredChallenges.map(challenge => (
                <div key={challenge.id} className="table-row">
                  <div className="col-status">
                    {challenge.solved && <span className="solved-icon">✓</span>}
                    {challenge.premium && <span className="premium-icon">⭐</span>}
                  </div>
                  <div className="col-title">
                    <span className="problem-title">{challenge.title}</span>
                    <div className="problem-tags">
                      {challenge.tags.map(tag => (
                        <span key={tag} className="problem-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="col-platform">
                    <PlatformBadge platform={challenge.platform} />
                  </div>
                  <div className="col-acceptance">
                    <AcceptanceBar acceptance={challenge.acceptance} />
                  </div>
                  <div className="col-difficulty">
                    <DifficultyBadge difficulty={challenge.difficulty} />
                  </div>
                  <div className="col-frequency">
                    <span className={`frequency ${challenge.frequency.toLowerCase()}`}>
                      {challenge.frequency}
                    </span>
                  </div>
                  <div className="col-action">
                    <button 
                      className={`solve-btn ${challenge.solved ? 'solved' : ''}`}
                      onClick={() => handleSolveClick(challenge)}
                    >
                      {challenge.solved ? 'Solved' : 'Solve'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar remains same */}
      </div>
    </div>
  );
};

export default ChallengesPage;
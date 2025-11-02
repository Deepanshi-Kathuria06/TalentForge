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
      // Use local fallback problems instead of API calls to avoid CORS
      const allProblems = CodingApiService.getAllFallbackProblems();
      setChallenges(allProblems);
    } catch (error) {
      console.error('Error loading challenges:', error);
      // Ultimate fallback with safe data structure
      const fallbackProblems = [
        {
          id: 'leetcode-1',
          title: 'Two Sum',
          difficulty: 'easy',
          tags: ['Array', 'Hash Table'],
          platform: 'leetcode',
          acceptance: '52.3%',
          premium: false,
          solved: false,
          frequency: 'High',
          points: 10,
          description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.'
        },
        {
          id: 'leetcode-2',
          title: 'Add Two Numbers',
          difficulty: 'medium',
          tags: ['Linked List', 'Math', 'Recursion'],
          platform: 'leetcode',
          acceptance: '38.6%',
          premium: false,
          solved: false,
          frequency: 'High',
          points: 15,
          description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.'
        },
        {
          id: 'codechef-START01',
          title: 'Number Mirror',
          difficulty: 'easy',
          tags: ['Beginner', 'Input/Output'],
          platform: 'codechef',
          acceptance: '85.2%',
          premium: false,
          solved: false,
          frequency: 'High',
          points: 10,
          description: 'Write a program that accepts a number and outputs the same number.'
        }
      ];
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
      // Use the new method to get detailed problem data
      const problemDetails = CodingApiService.getProblemDetails(challenge.id);
      navigate(`/solve/${challenge.id}`, { state: { problem: problemDetails } });
    } catch (error) {
      console.error('Error fetching problem details:', error);
      navigate(`/solve/${challenge.id}`, { state: { problem: challenge } });
    }
  };

  const DifficultyBadge = ({ difficulty }) => (
    <span className={`difficulty-badge ${difficulty}`}>
      {difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : 'Unknown'}
    </span>
  );

  const PlatformBadge = ({ platform }) => (
    <span className={`platform-badge ${platform}`}>
      {platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Unknown'}
    </span>
  );

  const AcceptanceBar = ({ acceptance }) => (
    <div className="acceptance-bar">
      <div className="acceptance-fill" style={{width: acceptance || '0%'}}></div>
      <span className="acceptance-text">{acceptance || 'N/A'}</span>
    </div>
  );

  // Safe tag rendering function
  const renderTags = (tags) => {
    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return <span className="no-tags">No tags</span>;
    }
    
    return tags.map((tag, index) => (
      <span key={index} className="problem-tag">{tag}</span>
    ));
  };

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
              <h4>Two Sum</h4>
              <p>Find two numbers that add up to target</p>
              <DifficultyBadge difficulty="easy" />
              <button 
                className="daily-solve-btn"
                onClick={() => navigate('/solve/leetcode-1')}
              >
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
              <div className="calendar-header">
                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
              </div>
              <div className="calendar-days">
                {Array.from({ length: 31 }, (_, i) => (
                  <div key={i} className={`calendar-day ${i === 19 ? 'active' : ''}`}>
                    {i + 1}
                  </div>
                ))}
              </div>
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
              {filteredChallenges.length === 0 ? (
                <div className="no-problems">
                  <p>No problems found matching your filters.</p>
                </div>
              ) : (
                filteredChallenges.map(challenge => (
                  <div key={challenge.id} className="table-row">
                    <div className="col-status">
                      {challenge.solved && <span className="solved-icon">✓</span>}
                      {challenge.premium && <span className="premium-icon">⭐</span>}
                    </div>
                    <div className="col-title">
                      <span className="problem-title">{challenge.title || 'Untitled Problem'}</span>
                      <div className="problem-tags">
                        {renderTags(challenge.tags)}
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
                      <span className={`frequency ${(challenge.frequency || 'Medium').toLowerCase()}`}>
                        {challenge.frequency || 'Medium'}
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
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="right-sidebar">
          <div className="study-plan-card">
            <h3>Study Plan</h3>
            <p>Algorithm Fundamentals</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: '65%'}}></div>
            </div>
            <span>65% Complete</span>
          </div>

          <div className="progress-card">
            <h3>Progress</h3>
            <div className="progress-item">
              <span>Easy</span>
              <div className="progress-bar">
                <div className="progress-fill easy" style={{width: '75%'}}></div>
              </div>
              <span>15/20</span>
            </div>
            <div className="progress-item">
              <span>Medium</span>
              <div className="progress-bar">
                <div className="progress-fill medium" style={{width: '45%'}}></div>
              </div>
              <span>9/20</span>
            </div>
            <div className="progress-item">
              <span>Hard</span>
              <div className="progress-bar">
                <div className="progress-fill hard" style={{width: '20%'}}></div>
              </div>
              <span>2/10</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;
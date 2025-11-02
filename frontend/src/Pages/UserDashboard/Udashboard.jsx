// components/UDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useFeed } from '../../components/Feed/FeedContext';
import CreatePostModal from '../../components/Feed/CreatePostModal';
import API from '../../utils/api';
import './UserDashboard.css';
import Settings from "../UserDashboard/Sections/Settings";
import Projects from "../UserDashboard/Sections/Projects";
import Jobs from '../UserDashboard/Sections/Jobs';
import ApplicationModal from '../../components/jobs/ApplicationModal';
import Resume from '../ResumeBuilder/Starting';
import Challenge from './Sections/Challenges/ChallengeWelcome';
import ChallengesStart from './Sections/Challenges/ChallengeStart';
import Profile from './Sections/Profile/Profile';
import DashboardNavbar from '../../components/DashboardNavbar'
import { FaMapMarkerAlt, FaBriefcase, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';



const UDashboard = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [activeGame, setActiveGame] = useState(null);
  const [codingChallengeExpanded, setCodingChallengeExpanded] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [gameScore, setGameScore] = useState(0);
  const [activePage, setActivePage] = useState('dashboard');
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [allJobs, setAllJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  
  const { posts: feedPosts, addPost, likePost, addComment, sharePost } = useFeed();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ✅ Fetch all jobs when component mounts or when jobs page is active
  useEffect(() => {
    if (activePage === 'jobs') {
      fetchAllJobs();
    }
  }, [activePage]);

  // ✅ Fetch all jobs from backend
  const fetchAllJobs = async () => {
    setJobsLoading(true);
    try {
      console.log('🔍 Fetching jobs from backend...');
      
      const response = await API.get('/jobs');
      
      console.log('✅ Jobs response from backend:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setAllJobs(response.data);
        console.log(`✅ Loaded ${response.data.length} jobs from backend database`);
      } else {
        throw new Error('Invalid response format from backend');
      }
    } catch (error) {
      console.error('❌ Error fetching from backend:', error);
      console.error('Error details:', error.response?.data);
      
      // Fallback to localStorage
      try {
        const demoJobs = JSON.parse(localStorage.getItem('demoJobs') || '[]');
        console.log(`📝 Loaded ${demoJobs.length} jobs from localStorage`);
        setAllJobs(demoJobs);
      } catch (storageError) {
        console.error('Error reading localStorage:', storageError);
        setAllJobs([]);
      }
    } finally {
      setJobsLoading(false);
    }
  };

  const handleCreatePost = (newPost) => {
    addPost(newPost);
  };

  // ✅ STRICT USER TYPE VALIDATION
  useEffect(() => {
    console.log("🏠 CandidateDashboard - Current User:", user);
    console.log("📛 User Name in Dashboard:", user?.name);
    console.log("🎯 User Type:", user?.userType);
    
    if (user && user.userType !== 'student') {
      console.log('🚫 Access denied: User is not a student');
      navigate('/CompanyDashboard');
      return;
    }
  }, [user, navigate]);

  // ✅ Show loading or access denied if wrong user type
  if (!user) {
    return <div className="loading-container">Loading...</div>;
  }

  if (user.userType !== 'student') {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Access Restricted</h2>
        <p>Student dashboard is only available for student accounts.</p>
        <button onClick={() => navigate('/CompanyDashboard')}>
          Go to Company Dashboard
        </button>
      </div>
    );
  }

  // ✅ HELPER FUNCTION TO GET USER ROLE
  const getUserRole = () => {
    return 'Student';
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const toggleChat = () => {
    setChatExpanded(!chatExpanded);
  };

  const generateRandomQuestion = () => {
    const questions = [
      {
        id: 1,
        title: "Reverse a String",
        description: "Write a function that reverses a string.",
        difficulty: "Easy",
        template: "function reverseString(str) {\n  // Your code here\n}"
      }
    ];
    setCurrentQuestion(questions[0]);
    setUserCode(questions[0].template);
  };

  const toggleCodingChallenge = () => {
    setCodingChallengeExpanded(!codingChallengeExpanded);
    if (!codingChallengeExpanded && !currentQuestion) {
      generateRandomQuestion();
    }
  };

  // Mini Games
  const games = [
    {
      id: 'memory',
      name: 'Memory Game',
      icon: 'fa-brain',
      description: 'Test your memory skills'
    },
    {
      id: 'typing',
      name: 'Typing Speed',
      icon: 'fa-keyboard',
      description: 'Improve your typing speed'
    },
    {
      id: 'quiz',
      name: 'Tech Quiz',
      icon: 'fa-question-circle',
      description: 'Test your tech knowledge'
    },
    {
      id: 'puzzle',
      name: 'Logic Puzzle',
      icon: 'fa-puzzle-piece',
      description: 'Solve logical challenges'
    }
  ];

  const gamificationData = {
    level: 7,
    points: 1250,
    nextLevel: 1500,
    achievements: [
      { name: 'Profile Completer', earned: true },
      { name: 'First Application', earned: true },
      { name: 'Skill Master', earned: false },
      { name: 'Network Builder', earned: true },
      { name: 'Code Warrior', earned: false },
      { name: 'Game Master', earned: false }
    ],
    dailyStreak: 5,
    gamesPlayed: 12,
    problemsSolved: 8
  };

  const messages = [
    { id: 1, name: 'Sarah Johnson', role: 'UX Designer', message: 'Hey! I saw your portfolio, it looks great!', time: '10:30 AM', unread: false },
    { id: 2, name: 'Tech Recruiters Inc.', role: 'Recruitment Team', message: 'Your application has been shortlisted!', time: 'Yesterday', unread: true },
    { id: 3, name: 'Michael Chen', role: 'Senior Developer', message: 'Thanks for connecting! Let\'s collab...', time: '2 days ago', unread: false }
  ];

  // ✅ Apply for job function
  const handleApply = (job) => {
  console.log("Applying for job:", job);
  if (!job || !job._id) {
    console.error("Invalid job data:", job);
    alert("Invalid job information. Please try again.");
    return;
  }
  setSelectedJob(job);
  setIsApplicationModalOpen(true);
};

  const MemoryGame = () => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);

    useEffect(() => {
      const symbols = ['🎯', '🚀', '💻', '⭐', '🎮', '🏆'];
      const gameCards = [...symbols, ...symbols]
        .sort(() => Math.random() - 0.5)
        .map((symbol, index) => ({ id: index, symbol }));
      setCards(gameCards);
    }, []);

    const handleCardClick = (id) => {
      if (flipped.length === 2) return;
      if (flipped.includes(id) || matched.includes(id)) return;

      const newFlipped = [...flipped, id];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        setMoves(moves + 1);
        const [first, second] = newFlipped;
        if (cards[first].symbol === cards[second].symbol) {
          setMatched([...matched, first, second]);
          setFlipped([]);
        } else {
          setTimeout(() => setFlipped([]), 1000);
        }
      }
    };

    return (
      <div className="memory-game">
        <div className="game-stats">
          <span>Moves: {moves}</span>
          <span>Matched: {matched.length / 2}/6</span>
        </div>
        <div className="memory-grid">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`memory-card ${
                flipped.includes(card.id) || matched.includes(card.id) ? 'flipped' : ''
              }`}
              onClick={() => handleCardClick(card.id)}
            >
              {flipped.includes(card.id) || matched.includes(card.id) ? card.symbol : '?'}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const TypingGame = () => {
    const [currentText] = useState("The quick brown fox jumps over the lazy dog");
    const [userInput, setUserInput] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [wpm, setWpm] = useState(0);

    useEffect(() => {
      if (userInput.length === 1 && !startTime) {
        setStartTime(new Date());
      }

      if (userInput.length > 0 && startTime) {
        const timeElapsed = (new Date() - startTime) / 1000 / 60;
        const wordsTyped = userInput.length / 5;
        setWpm(Math.round(wordsTyped / timeElapsed));
      }
    }, [userInput, startTime]);

    return (
      <div className="typing-game">
        <div className="typing-stats">
          <span>WPM: {wpm}</span>
          <span>Progress: {Math.round((userInput.length / currentText.length) * 100)}%</span>
        </div>
        <div className="typing-text">
          {currentText.split('').map((char, index) => (
            <span
              key={index}
              className={
                index < userInput.length
                  ? userInput[index] === char
                    ? 'correct'
                    : 'incorrect'
                  : 'pending'
              }
            >
              {char}
            </span>
          ))}
        </div>
        <textarea
          className="typing-input"
          value={userInput}
          onChange={(e) => setUserInput(e.value)}
          placeholder="Start typing here..."
        />
      </div>
    );
  };

  const TechQuiz = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const quizQuestions = [
      {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "None of the above"],
        correct: 0
      },
      {
        question: "Which of the following is a JavaScript framework?",
        options: ["Python", "React", "HTML", "CSS"],
        correct: 1
      },
      {
        question: "What does CSS stand for?",
        options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
        correct: 1
      }
    ];

    const handleAnswerClick = (answerIndex) => {
      setSelectedAnswer(answerIndex);
      if (answerIndex === quizQuestions[currentQuestionIndex].correct) {
        setScore(score + 1);
      }
      
      setTimeout(() => {
        if (currentQuestionIndex + 1 < quizQuestions.length) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
        } else {
          setShowResult(true);
        }
      }, 1000);
    };

    const resetQuiz = () => {
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setShowResult(false);
    };

    if (showResult) {
      return (
        <div className="quiz-result">
          <h4>Quiz Complete!</h4>
          <p>Your Score: {score}/{quizQuestions.length}</p>
          <button onClick={resetQuiz} className="quiz-restart-btn">Play Again</button>
        </div>
      );
    }

    return (
      <div className="tech-quiz">
        <div className="quiz-progress">
          Question {currentQuestionIndex + 1} of {quizQuestions.length}
        </div>
        <h4>{quizQuestions[currentQuestionIndex].question}</h4>
        <div className="quiz-options">
          {quizQuestions[currentQuestionIndex].options.map((option, index) => (
            <button
              key={index}
              className={`quiz-option ${
                selectedAnswer === index
                  ? index === quizQuestions[currentQuestionIndex].correct
                    ? 'correct'
                    : 'incorrect'
                  : ''
              }`}
              onClick={() => handleAnswerClick(index)}
              disabled={selectedAnswer !== null}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderGame = () => {
    switch (activeGame) {
      case 'memory':
        return <MemoryGame />;
      case 'typing':
        return <TypingGame />;
      case 'quiz':
        return <TechQuiz />;
      default:
        return null;
    }
  };

  // Sidebar Component
  const Sidebar = ({ activePage, setActivePage }) => {
    const sidebarRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          setSidebarExpanded(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div
        ref={sidebarRef}
        className={`sidebar ${sidebarExpanded ? "expanded" : "collapsed"}`}
      >
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
        >
          <i className={`fas ${sidebarExpanded ? "fa-chevron-left" : "fa-chevron-right"}`}></i>
        </button>

        <div className="logo-container">
          <div className="logo">
            <span className="logo-icon"><i className="fas fa-briefcase"></i></span>
            {sidebarExpanded && <span className="logo-text">TalentForge</span>}
          </div>
        </div>

        <div className="menu-items">
          {[
            { icon: "fa-tachometer-alt", text: "Dashboard", page: "dashboard" },
            { icon: "fa-user", text: "Profile", page: "profile" },
            { icon: "fa-file-alt", text: "Resume Tools", page: "resume" },
            { icon: "fa-briefcase", text: "Jobs & Internships", page: "jobs" },
            { icon: "fa-laptop-code", text: "Challenges", page: "challenges" },
            { icon: "fa-book", text: "Projects", page: "projects" },
          ].map((item, index) => (
            <div key={index} className="menu-group">
              <div
                className={`menu-item ${activePage === item.page ? "active" : ""}`}
                onClick={() => {
            if (item.page === "resume") {
  window.location.href = "http://localhost:5178/starting";
} else if (item.page === "profile") {
  window.location.href = "/Profile"; // or your actual profile route
} else {
  setActivePage(item.page);
}


                }}
                title={!sidebarExpanded ? item.text : ""}
              >
                <span className="menu-icon"><i className={`fas ${item.icon}`}></i></span>
                {sidebarExpanded && <span className="menu-text">{item.text}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Jobs Component for the jobs page
  const JobsSection = () => {
    return (
      <div className="page-content">
        <div className="page-header">
          <h2>Job Opportunities</h2>
          <p>Find your dream job from various companies</p>
          <button 
            className="refresh-btn"
            onClick={fetchAllJobs}
            disabled={jobsLoading}
          >
            {jobsLoading ? 'Refreshing...' : 'Refresh Jobs'}
          </button>
        </div>

        <div className="jobs-container">
          <h2>Available Jobs ({allJobs.length})</h2>
          
          {allJobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💼</div>
              <h3>No jobs available</h3>
              <p>Check back later for new job postings</p>
              <button onClick={fetchAllJobs} className="primary-btn">
                Refresh Jobs
              </button>
            </div>
          ) : (
            <div className="jobs-grid">
              {allJobs.map(job => (
                <div key={job._id} className="job-card">
                  <div className="job-header">
                    <h3 className="job-title">{job.title}</h3>
                    <span className="company-name">{job.companyName}</span>
                  </div>
                  
                  <div className="job-details">
<div className="details-row">
  <div className="detail-item">
    <span className="icon"><FaMapMarkerAlt /></span>
    <span>{job.location}</span>
  </div>
  <div className="detail-item">
    <span className="icon"><FaBriefcase /></span>
    <span>{job.type}</span>
  </div>
  {job.salaryRange && (
    <div className="detail-item">
      <span className="icon"><FaDollarSign /></span>
      <span>{job.salaryRange}</span>
    </div>
  )}
</div>
                  </div>
                  <div className="job-description">
                    <p>{job.description}</p>
                  </div>

                  {job.skills && (
                    <div className="job-skills">
                      <strong>Skills: </strong>
                      {job.skills}
                    </div>
                  )}

                  <div className="job-footer">
                    <span className="post-date">
                      Posted: {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <button 
  className="apply-btn"
  onClick={() => handleApply(job)}
>
  Apply Now
</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
/*
        {/* Debug Info */}
      
      </div>
    );
  };
  // Debug Info
// 
  // Render different pages based on activePage state
  const renderPageContent = () => {
    switch (activePage) {
      case 'stats':
        return (
          <div className="page-content">
            <div className="page-header">
              <h2>Statistics</h2>
              <p>View your profile statistics and performance metrics</p>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <i className="fas fa-eye"></i>
                <h4>Profile Views</h4>
                <div className="number">156</div>
              </div>
              <div className="stat-card">
                <i className="fas fa-briefcase"></i>
                <h4>Applications</h4>
                <div className="number">24</div>
              </div>
              <div className="stat-card">
                <i className="fas fa-user-check"></i>
                <h4>Connections</h4>
                <div className="number">89</div>
              </div>
              <div className="stat-card">
                <i className="fas fa-star"></i>
                <h4>Skill Endorsements</h4>
                <div className="number">142</div>
              </div>
            </div>
          </div>
        );
      
         
      case 'projects':
        return (
          <div className="page-content">
            <Projects />
          </div>
        );
      case 'jobs':
        return <JobsSection />;

      case 'Resume':
        return <starting />;
      case "settings":
        return <Settings />;

      case "challenges":
        return <ChallengesStart/>;
      
      case "Profile":
        return <Profile />;

      case 'dashboard':
      default:
        return (
          <>

    <div className="center-column">
              <div className="posts-feed">
                <div className="feed-header">
                  <h3>Professional Feed</h3>
                  <button 
                    className="post-button"
                    onClick={() => setIsCreatePostModalOpen(true)}
                  >
                    <i className="fas fa-plus"></i> Share Update
                  </button>
                </div>
                
                <div className="posts-container">
  {feedPosts.map(post => (
    <div key={post._id || post.id} className="post-card">
      <div className="post-header">
        <img 
          src={post.author?.avatar || 'https://ui-avatars.com/api/?name=User&background=004030&color=fff'} 
          alt={post.author?.name} 
          className="author-avatar" 
        />
        <div className="author-info">
          {/* ✅ Name Display */}
          <div className="author-name">
            {post.author?.name || 'Unknown User'}
            {post.author?.isVerified && <i className="fas fa-check-circle verified-badge"></i>}
          </div>

                      
                      <div className="author-role">
            {post.author?.userType === 'student' 
              ? `Student at ${post.author?.university || 'University'}`
              : `Recruiter at ${post.author?.company || 'Company'}`
            }
          </div>
          
          {/* ✅ Time Display */}
          <div className="post-timestamp">
            {post.timestamp || 
             (post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Just now')}
          </div>
        </div>
        <button className="post-menu">
          <i className="fas fa-ellipsis-h"></i>
        </button>
      </div>
       <div className="post-content">
        <p>{post.content}</p>
        {post.images && post.images.length > 0 && (
          <div className="post-images-grid">
            {post.images.map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`Post image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

<div className="post-actions">
        <button 
          className={`action-button like-btn ${post.liked ? 'liked' : ''}`}
          onClick={() => likePost(post._id || post.id)}
        >
          <i className="fas fa-thumbs-up"></i>
          <span>{post.likes?.length || 0}</span>
        </button>
        <button className="action-button comment-btn">
          <i className="fas fa-comment"></i>
          <span>{post.comments?.length || 0}</span>
        </button>
        <button 
          className="action-button share-btn"
          onClick={() => sharePost(post._id || post.id)}
        >
          <i className="fas fa-share"></i>
          <span>{post.shares || 0}</span>
        </button>
      </div>

{post.comments && post.comments.length > 0 && (
        <div className="comments-section">
          {post.comments.map(comment => (
            <div key={comment._id || comment.id} className="comment">
              <img 
                src={comment.author?.avatar || 'https://ui-avatars.com/api/?name=User&background=004030&color=fff'} 
                alt={comment.author?.name} 
                className="comment-avatar" 
              />
              <div className="comment-content">
                <div className="comment-author">{comment.author?.name || 'User'}</div>
                <div className="comment-text">{comment.text}</div>
                <div className="comment-timestamp">
                  {comment.timestamp || 
                   (comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'Just now')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ))}
</div>

              </div>
            </div>
                      
            <div className="right-column">
              <div className="card gamification-card">
                <h3>Career Journey <i className="fas fa-gamepad"></i></h3>
                <div className="gamification-content">
                  <div className="level-display">
                    <div className="level-badge">Level {gamificationData.level}</div>
                    <div className="points-display">
                      <span className="points">{gamificationData.points}</span>
                      <span className="points-label">Career Points</span>
                    </div>
                  </div>
                  
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{width: `${(gamificationData.points / gamificationData.nextLevel) * 100}%`}}
                      ></div>
                    </div>
                    <div className="progress-labels">
                      <span>Level {gamificationData.level}</span>
                      <span>{gamificationData.nextLevel - gamificationData.points} to next level</span>
                    </div>
                  </div>

                  <div className="game-stats">
                    <div className="stat">
                      <i className="fas fa-gamepad"></i>
                      <span>{gamificationData.gamesPlayed} games played</span>
                    </div>
                    <div className="stat">
                      <i className="fas fa-code"></i>
                      <span>{gamificationData.problemsSolved} problems solved</span>
                    </div>
                  </div>

                  <div className="mini-games">
                    <h4>Quick Games</h4>
                    <div className="games-grid">
                      {games.map((game) => (
                        <div 
                          key={game.id} 
                          className={`game-card ${activeGame === game.id ? 'active' : ''}`}
                          onClick={() => setActiveGame(activeGame === game.id ? null : game.id)}
                        >
                          <i className={`fas ${game.icon}`}></i>
                          <span>{game.name}</span>
                        </div>
                      ))}
                    </div>
                    
                    {activeGame && (
                      <div className="game-container">
                        <div className="game-header">
                          <h5>{games.find(g => g.id === activeGame)?.name}</h5>
                          <button onClick={() => setActiveGame(null)} className="close-game">
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                        {renderGame()}
                      </div>
                    )}
                  </div>
                  
                  <div className="achievements">
                    <h4>Achievements</h4>
                    <div className="achievement-list">
                      {gamificationData.achievements.map((achievement, index) => (
                        <div key={index} className="achievement-item">
                          <span className={`achievement-icon ${achievement.earned ? 'earned' : 'locked'}`}>
                            <i className={`fas ${achievement.earned ? 'fa-trophy' : 'fa-lock'}`}></i>
                          </span>
                          <span className="achievement-name">{achievement.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="daily-streak">
                    <i className="fas fa-fire"></i>
                    <span>{gamificationData.dailyStreak} day streak</span>
                    <small>Keep logging in to earn more points!</small>
                  </div>
                  
                  <div className="gamification-quote">
                    <p>"Level up your career, one challenge at a time! 🚀"</p>
                  </div>
                </div>
              </div>

              
                
                
              </div>
            </>
          );
        }
      };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="candidate-dashboard">
     
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
     
      <div className={`main-content ${sidebarExpanded ? "expanded" : ""}`}>
        <DashboardNavbar
      user={user}
      handleLogout={handleLogout}
      getUserRole={getUserRole}
    />

        <div className="dashboard-content">
          {renderPageContent()}
        </div>
        
       
      </div>
      <CreatePostModal
      isOpen={isCreatePostModalOpen}
      onClose={() => setIsCreatePostModalOpen(false)}
      onSubmit={handleCreatePost}
    />

   <ApplicationModal
  job={selectedJob}
  isOpen={isApplicationModalOpen}
  onClose={() => {
    setIsApplicationModalOpen(false);
    setSelectedJob(null); // ✅ Clear the job when closing
  }}
  onSuccess={(application) => {
    console.log("Application submitted successfully:", application);
    alert("Application submitted successfully!");
    // You can refresh the jobs list or show a success message
  }}
/>
    </div>

    
  );
};

export default UDashboard;
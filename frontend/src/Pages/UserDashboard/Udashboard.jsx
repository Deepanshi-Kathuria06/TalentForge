
import React, { useState, useEffect, useRef } from 'react';
import './UserDashboard.css';
import Settings from "../UserDashboard/Sections/Settings";
import Projects from "../UserDashboard/Sections/Projects";

const CandidateDashboard = ({ user, onLogout }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [activeGame, setActiveGame] = useState(null);
  const [codingChallengeExpanded, setCodingChallengeExpanded] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [gameScore, setGameScore] = useState(0);
  const [activePage, setActivePage] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const toggleChat = () => {
    setChatExpanded(!chatExpanded);
  };

  const generateRandomQuestion = () => {
    // Placeholder for generating random questions
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

  // LinkedIn-style posts
  const posts = [
    {
      id: 1,
      author: {
        name: 'Sarah Johnson',
        role: 'Senior UX Designer at Google',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        isVerified: true
      },
      content: '🚀 Just launched my new design system at Google! It took 6 months of research, testing, and iterations. The key learnings: 1) Always involve developers early 2) Test with real users, not assumptions 3) Documentation is as important as the design itself. What has been your experience building design systems?',
      timestamp: '2 hours ago',
      likes: 127,
      comments: 24,
      shares: 8,
      image: null
    },
    {
      id: 2,
      author: {
        name: 'Alex Chen',
        role: 'Full Stack Developer | React Enthusiast',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        isVerified: false
      },
      content: '💡 Quick tip for React developers: Use React.memo() wisely! It can prevent unnecessary re-renders but don\'t overuse it. Profile your app first to identify actual performance bottlenecks. Remember: premature optimization is the root of all evil. #ReactJS #WebDev #Performance',
      timestamp: '4 hours ago',
      likes: 89,
      comments: 16,
      shares: 12,
      image: null
    },
    {
      id: 3,
      author: {
        name: 'TechCorp Inc.',
        role: 'Leading Technology Solutions',
        avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
        isVerified: true
      },
      content: '🎯 We\'re hiring! Looking for passionate developers to join our team:\n\n• Senior Frontend Developer (React/Vue)\n• Backend Engineer (Node.js/Python)\n• DevOps Engineer (AWS/Docker)\n\nRemote-friendly positions with competitive salary and great benefits. Apply now or share with your network! #Hiring #TechJobs #RemoteWork',
      timestamp: '1 day ago',
      likes: 203,
      comments: 45,
      shares: 67,
      image: null
    },
    {
      id: 4,
      author: {
        name: 'Maria Rodriguez',
        role: 'Product Manager | AI Enthusiast',
        avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
        isVerified: false
      },
      content: '🤖 AI is transforming product management in ways I couldn\'t have imagined 5 years ago. From user research insights to automated A/B testing analysis, we\'re able to make data-driven decisions faster than ever. But remember - AI is a tool to enhance human creativity, not replace it. What AI tools are you using in your work?',
      timestamp: '1 day ago',
      likes: 156,
      comments: 31,
      shares: 23,
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop'
    }
  ];

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
        const timeElapsed = (new Date() - startTime) / 1000 / 60; // minutes
        const wordsTyped = userInput.length / 5; // average word length
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
          onChange={(e) => setUserInput(e.target.value)}
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

    // Close sidebar if clicked outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          sidebarRef.current &&
          !sidebarRef.current.contains(event.target)
        ) {
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

        {/* Toggle Button */}
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
        >
          <i className={`fas ${sidebarExpanded ? "fa-chevron-left" : "fa-chevron-right"}`}></i>
        </button>

        {/* Logo */}
        <div className="logo-container">
          <div className="logo">
            <span className="logo-icon"><i className="fas fa-briefcase"></i></span>
            {sidebarExpanded && <span className="logo-text">TalentForge</span>}
          </div>
        </div>

        {/* Menu Items */}
        <div className="menu-items">
          {[
            { icon: "fa-tachometer-alt", text: "Dashboard", page: "dashboard" },
            { icon: "fa-user", text: "Profile", page: "profile" },
            { icon: "fa-file-alt", text: "Resume Tools", page: "resume" },
            { icon: "fa-briefcase", text: "Jobs & Internships", page: "jobs" },
            { icon: "fa-building", text: "Companies", page: "companies" },
            { icon: "fa-users", text: "Networking", page: "network" },
            { icon: "fa-laptop-code", text: "Challenges", page: "challenges" },
            { icon: "fa-trophy", text: "Gamification", page: "gamification" },
            { icon: "fa-book", text: "Projects", page: "projects" },
            { icon: "fa-bell", text: "Notifications", page: "notifications" },
            { icon: "fa-cog", text: "Settings", page: "settings" },
          ].map((item, index) => (
            <div key={index} className="menu-group">
              {/* Parent Menu Item */}
              <div
                className={`menu-item ${activePage === item.page ? "active" : ""}`}
                onClick={() => setActivePage(item.page)}
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
      case 'resume':
        return (
          <div className="page-content">
            <div className="page-header">
              <h2>Resume Builder</h2>
              <p>Create and manage your professional resume</p>
            </div>
            <div className="card">
              <h3>Your Resume</h3>
              <div className="resume-preview">
                <div className="resume-header">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="resume-profile-img" />
                  <div>
                    <h2>John Doe</h2>
                    <p>Software Developer</p>
                  </div>
                </div>
                <div className="resume-section">
                  <h4>Experience</h4>
                  <div className="resume-item">
                    <h5>Senior Developer at TechCorp</h5>
                    <p>Jan 2020 - Present</p>
                    <p>Developed and maintained web applications using React and Node.js</p>
                  </div>
                  <div className="resume-item">
                    <h5>Junior Developer at StartupCo</h5>
                    <p>Jun 2018 - Dec 2019</p>
                    <p>Assisted in building responsive web interfaces and backend APIs</p>
                  </div>
                </div>
              </div>
              <button className="primary-btn">Edit Resume</button>
              <button className="secondary-btn">Download PDF</button>
            </div>
          </div>
        );
      case 'projects':
        return (
          <div className="page-content">
            <Projects />
          </div>
        );
      case 'apps':
        return (
          <div className="page-content">
            <div className="page-header">
              <h2>Job Applications</h2>
              <p>Track your job applications and interviews</p>
            </div>
            <div className="applications-list">
              <div className="application-item">
                <div className="app-company">
                  <img src="https://logo.clearbit.com/google.com" alt="Google" className="company-logo" />
                  <div>
                    <h4>Senior Frontend Developer</h4>
                    <p>Google · Mountain View, CA</p>
                  </div>
                </div>
                <div className="app-status">
                  <span className="status in-review">In Review</span>
                  <p>Applied 3 days ago</p>
                </div>
              </div>
              <div className="application-item">
                <div className="app-company">
                  <img src="https://logo.clearbit.com/microsoft.com" alt="Microsoft" className="company-logo" />
                  <div>
                    <h4>Full Stack Engineer</h4>
                    <p>Microsoft · Redmond, WA</p>
                  </div>
                </div>
                <div className="app-status">
                  <span className="status interview">Interview Scheduled</span>
                  <p>Applied 1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "settings":
        return <Settings />;
      case 'dashboard':
      default:
        return (
          <>
            <div className="left-column">
              {/* Highlight Card */}
              <div className="card highlight-card">
                <h3>Profile Strength</h3>
                <div className="progress-bar">
                  <div className="progress" style={{width: '75%'}}></div>
                </div>
                <div className="badges">
                  <span className="badge"><i className="fas fa-award"></i> Top 10%</span>
                  <span className="badge"><i className="fas fa-star"></i> Skill Verified</span>
                  <span className="badge"><i className="fas fa-check-circle"></i> Profile Complete</span>
                </div>
              </div>

              {/* Statistics Graph */}
              <div className="card">
                <h3>Applications / Views</h3>
                <div className="graph-placeholder">
                  <i className="fas fa-chart-bar graph-icon"></i>
                  <p>Application metrics visualization</p>
                </div>
              </div>

              {/* Ongoing Projects */}
              <div className="card">
                <h3>Ongoing Projects</h3>
                <div className="project-cards">
                  <div className="project-card">
                    <h4>Portfolio Website</h4>
                    <p>React, Node.js, MongoDB</p>
                    <div className="project-status in-progress">In Progress</div>
                    <button className="project-btn">View Live</button>
                  </div>
                  <div className="project-card">
                    <h4>E-commerce App</h4>
                    <p>Vue.js, Express, PostgreSQL</p>
                    <div className="project-status completed">Completed</div>
                    <button className="project-btn">View Live</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Column - LinkedIn-style Posts */}
            <div className="center-column">
              <div className="posts-feed">
                <div className="feed-header">
                  <h3>Professional Feed</h3>
                  <button className="post-button">
                    <i className="fas fa-plus"></i> Share Update
                  </button>
                </div>
                
                <div className="posts-container">
                  {posts.map(post => (
                    <div key={post.id} className="post-card">
                      <div className="post-header">
                        <img src={post.author.avatar} alt={post.author.name} className="author-avatar" />
                        <div className="author-info">
                          <div className="author-name">
                            {post.author.name}
                            {post.author.isVerified && <i className="fas fa-check-circle verified-badge"></i>}
                          </div>
                          <div className="author-role">{post.author.role}</div>
                          <div className="post-timestamp">{post.timestamp}</div>
                        </div>
                        <button className="post-menu">
                          <i className="fas fa-ellipsis-h"></i>
                        </button>
                      </div>
                      
                      <div className="post-content">
                        <p>{post.content}</p>
                        {post.image && (
                          <div className="post-image">
                            <img src={post.image} alt="Post content" />
                          </div>
                        )}
                      </div>
                      
                      <div className="post-actions">
                        <button className="action-button like-btn">
                          <i className="fas fa-thumbs-up"></i>
                          <span>{post.likes}</span>
                        </button>
                        <button className="action-button comment-btn">
                          <i className="fas fa-comment"></i>
                          <span>{post.comments}</span>
                        </button>
                        <button className="action-button share-btn">
                          <i className="fas fa-share"></i>
                          <span>{post.shares}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="right-column">
              {/* Enhanced Gamification Section */}
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

                  {/* Game Stats */}
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

                  {/* Mini Games */}
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

              {/* Chat Section */}
              <div className={`card chat-card ${chatExpanded ? 'expanded' : ''}`}>
                <div className="chat-header">
                  <h3>Messages</h3>
                  <button className="chat-toggle" onClick={toggleChat}>
                    <i className={`fas ${chatExpanded ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
                  </button>
                </div>
                
                {chatExpanded ? (
                  <div className="chat-expanded-view">
                    <div className="chat-search">
                      <i className="fas fa-search"></i>
                      <input type="text" placeholder="Search messages..." />
                    </div>
                    
                    <div className="chat-list">
                      {messages.map(message => (
                        <div 
                          key={message.id} 
                          className={`chat-item ${message.unread ? 'unread' : ''}`}
                          onClick={() => setActiveChat(message.id)}
                        >
                          <img 
                            src={`https://randomuser.me/api/portraits/${message.name === 'Sneha' ? 'women' : 'men'}/${message.id * 10}.jpg`} 
                            alt={message.name} 
                            className="chat-avatar"
                          />
                          <div className="chat-info">
                            <div className="chat-name">{message.name}</div>
                            <div className="chat-role">{message.role}</div>
                            <div className="chat-preview">{message.message}</div>
                          </div>
                          <div className="chat-meta">
                            <span className="chat-time">{message.time}</span>
                            {message.unread && <span className="unread-indicator"></span>}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="chat-footer">
                      <button className="new-message-btn">
                        <i className="fas fa-plus"></i> New Message
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="chat-collapsed-view">
                    <div className="chat-previews">
                      {messages.slice(0, 2).map(message => (
                        <div key={message.id} className="chat-preview-item">
                          <img 
                            src={`https://randomuser.me/api/portraits/${message.name === 'Deepanshi' ? 'women' : 'men'}/${message.id * 10}.jpg`} 
                            alt={message.name} 
                            className="chat-preview-avatar"
                          />
                          <div className="chat-preview-content">
                            <span className="chat-preview-name">{message.name.split(' ')[0]}</span>
                            <div className="chat-preview-text">{message.message.substring(0, 20)}...</div>
                            </div>
                            {message.unread && <span className="preview-unread-indicator"></span>}
                          </div>
                        ))}
                      </div>
                      <div className="chat-collapsed-footer">
                        <span>{messages.filter(m => m.unread).length} unread</span>
                        <button className="view-all-btn" onClick={toggleChat}>View all</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          );
        }
      };

  return (
    <div className="candidate-dashboard">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      {/* Main Content */}
      <div className={`main-content ${sidebarExpanded ? "expanded" : ""}`}>
        {/* Top Bar */}
        <div className="top-bar">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search jobs, companies, or skills..." />
          </div>
          
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
            
            <div className="profile">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="profile-img" />
              <div className="profile-info">
               <span className="profile-name">{user?.name || 'User'}</span>
                <span className="profile-role">Software Developer</span>
              </div>
              <button className="logout-btn" onClick={onLogout}>
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {renderPageContent()}
        </div>
      </div>
    </div>
  );
};



    
      
       

export default CandidateDashboard;
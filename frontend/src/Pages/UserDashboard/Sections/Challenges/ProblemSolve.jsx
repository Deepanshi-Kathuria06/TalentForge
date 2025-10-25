import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import CodeEditor from './CodeEditor';
import ProblemDescription from './ProblemDescription';
import Terminal from './Terminal';
import CodingApiService from '../services/codingApiService';
import './ProblemSolve.css';

const ProblemSolve = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProblem();
  }, [problemId, location.state]);

  const loadProblem = async () => {
    setLoading(true);
    try {
      let problemData;
      
      // Check if problem data was passed via navigation state
      if (location.state?.problem) {
        problemData = location.state.problem;
      } else {
        // Extract platform and title from problemId
        const [platform, ...titleParts] = problemId.split('-');
        const titleSlug = titleParts.join('-').toLowerCase();
        
        if (platform === 'leetcode') {
          problemData = await CodingApiService.fetchLeetCodeProblem(titleSlug);
        } else {
          // For other platforms, use generic fetch
          problemData = await CodingApiService.getFallbackProblem(titleSlug);
        }
      }
      
      setProblem(problemData);
      setCode(problemData.starterCode?.javascript || '// Write your code here');
    } catch (error) {
      console.error('Error loading problem:', error);
      // Set fallback problem
      setProblem({
        id: problemId,
        title: 'Problem Not Found',
        difficulty: 'medium',
        description: 'Unable to load problem details. Please try again later.',
        starterCode: { javascript: '// Problem not available' },
        testCases: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsRunning(true);
    
    // Simulate submission
    setTimeout(() => {
      const allPassed = testResults.every(result => result.status === 'passed');
      
      if (allPassed) {
        alert('🎉 Congratulations! Your solution was accepted!');
        // Update user stats and mark problem as solved
      } else {
        alert('❌ Some test cases failed. Please try again.');
      }
      
      setIsRunning(false);
    }, 1500);
  };

  if (!problem) {
    return <div className="loading">Loading problem...</div>;
  }

  return (
    <div className="problem-solve-page">
      <div className="problem-header">
        <button className="back-btn" onClick={() => navigate('/challenges')}>
          ← Back to Problems
        </button>
        <div className="problem-title-section">
          <h1>{problem.title}</h1>
          <span className={`difficulty-badge ${problem.difficulty}`}>
            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
          </span>
        </div>
      </div>

      <div className="problem-layout">
        {/* Problem Description Panel */}
        <div className="problem-description-panel">
          <div className="description-tabs">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab-btn ${activeTab === 'solutions' ? 'active' : ''}`}
              onClick={() => setActiveTab('solutions')}
            >
              Solutions
            </button>
            <button 
              className={`tab-btn ${activeTab === 'discussions' ? 'active' : ''}`}
              onClick={() => setActiveTab('discussions')}
            >
              Discussions
            </button>
          </div>
          
          <div className="description-content">
            {activeTab === 'description' && (
              <ProblemDescription description={problem.description} />
            )}
            {activeTab === 'solutions' && (
              <div className="solutions-content">
                <h3>Solutions</h3>
                <p>Premium feature - Upgrade to view solutions</p>
              </div>
            )}
            {activeTab === 'discussions' && (
              <div className="discussions-content">
                <h3>Discussions</h3>
                <p>Join the community discussion</p>
              </div>
            )}
          </div>
        </div>

        {/* Code Editor Panel */}
        <div className="code-editor-panel">
          <div className="editor-header">
            <select className="language-select">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
            <div className="editor-actions">
              <button 
                className="run-btn"
                onClick={handleRunCode}
                disabled={isRunning}
              >
                {isRunning ? 'Running...' : 'Run'}
              </button>
              <button 
                className="submit-btn"
                onClick={handleSubmit}
                disabled={isRunning}
              >
                {isRunning ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>

          <CodeEditor code={code} onChange={setCode} />

          {/* Terminal/Test Results */}
          <Terminal 
            testResults={testResults}
            isRunning={isRunning}
          />
        </div>
      </div>
    </div>
  );
};

export default ProblemSolve;
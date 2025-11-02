import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodingApiService from '../services/codingApiService';
import './SolveChallenge.css';

const SolveChallenge = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    loadProblem();
  }, [id]);

  const loadProblem = () => {
    const problemDetails = CodingApiService.getProblemDetails(id);
    setProblem(problemDetails);
    setCode(problemDetails.starterCode[language] || '// Write your solution here');
  };

  const handleRunCode = async () => {
    if (!problem || !code.trim()) return;

    setIsRunning(true);
    setOutput('🔄 Running tests...\n');
    setTestResults([]);

    try {
      const executionResult = CodingApiService.executeCode(id, code, language);
      
      setProblem(executionResult.problem);
      setTestResults(executionResult.results);
      
      if (executionResult.allPassed) {
        setOutput(`✅ All tests passed! (${executionResult.passedCount}/${executionResult.totalCount})\n\n🎉 Congratulations! Your solution is correct.`);
      } else {
        setOutput(`❌ Some tests failed. (${executionResult.passedCount}/${executionResult.totalCount} passed)\n\nCheck the test results tab for details.`);
      }
    } catch (error) {
      setOutput(`💥 Error: ${error.message}\n\nPlease check your code for syntax errors.`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    if (testResults.length > 0 && testResults.every(test => test.passed)) {
      setOutput('✅ Submission Accepted! 🎉\n\nYour solution has been submitted successfully.');
      // In a real app, you would save the submission to backend
    } else {
      setOutput('⚠️ Please pass all test cases before submitting.');
    }
  };

  const handleResetCode = () => {
    setCode(problem.starterCode[language] || '// Write your solution here');
    setOutput('');
    setTestResults([]);
  };

  if (!problem) {
    return (
      <div className="solve-challenge-container">
        <div className="loading">Loading problem...</div>
      </div>
    );
  }

  return (
    <div className="solve-challenge-container">
      {/* Header */}
      <div className="solve-header">
        <button onClick={() => navigate('/challenges')} className="back-btn">
          ← Back to Challenges
        </button>
        <div className="problem-title-section">
          <h1>{problem.title}</h1>
          <span className={`difficulty-badge ${problem.difficulty}`}>
            {problem.difficulty}
          </span>
          <span className="platform-badge">
            {problem.platform}
          </span>
        </div>
        <div className="header-actions">
          <button onClick={handleResetCode} className="reset-btn">
            Reset Code
          </button>
        </div>
      </div>

      <div className="solve-layout">
        {/* Left Panel - Problem Description */}
        <div className="problem-panel">
          <div className="panel-tabs">
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
              className={`tab-btn ${activeTab === 'testcases' ? 'active' : ''}`}
              onClick={() => setActiveTab('testcases')}
            >
              Test Cases ({testResults.length})
            </button>
          </div>

          <div className="panel-content">
            {activeTab === 'description' && (
              <div className="problem-description">
                <div 
                  dangerouslySetInnerHTML={{ __html: problem.detailedDescription.replace(/\n/g, '<br/>') }}
                />
              </div>
            )}

            {activeTab === 'solutions' && problem.solution && (
              <div className="solutions-section">
                <h3>Solution</h3>
                <pre className="solution-code">
                  {problem.solution[language]}
                </pre>
              </div>
            )}

            {activeTab === 'testcases' && (
              <div className="test-results">
                <h3>Test Results</h3>
                {testResults.length === 0 ? (
                  <p>No test results yet. Run your code to see test results.</p>
                ) : (
                  testResults.map((result, index) => (
                    <div key={index} className={`test-result ${result.passed ? 'passed' : 'failed'}`}>
                      <div className="test-header">
                        <span className="test-status">
                          {result.passed ? '✅' : '❌'} Test Case {index + 1}
                        </span>
                        <span className="test-desc">{result.description}</span>
                      </div>
                      {!result.passed && (
                        <div className="test-details">
                          <div>Input: {JSON.stringify(result.input)}</div>
                          <div>Expected: {JSON.stringify(result.expected)}</div>
                          <div>Actual: {JSON.stringify(result.actual)}</div>
                          {result.error && <div>Error: {result.error}</div>}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="editor-panel">
          <div className="editor-header">
            <select 
              value={language} 
              onChange={(e) => {
                setLanguage(e.target.value);
                setCode(problem.starterCode[e.target.value] || '// Write your solution here');
              }}
              className="language-select"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
            
            <div className="editor-actions">
              <button 
                onClick={handleRunCode} 
                disabled={isRunning}
                className={`run-btn ${isRunning ? 'loading' : ''}`}
              >
                {isRunning ? 'Running...' : 'Run Code'}
              </button>
              <button 
                onClick={handleSubmit}
                className="submit-btn"
              >
                Submit
              </button>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="code-editor"
            placeholder="Write your code here..."
            spellCheck="false"
            rows={20}
          />

          <div className="output-panel">
            <h3>Output</h3>
            <pre className="output-content">{output || 'Run your code to see output here...'}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolveChallenge;
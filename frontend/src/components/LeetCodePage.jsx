// LeetCodePage.js
import React, { useState } from 'react';
import '../components/LeetCodePage.css';8

const LeetCodePage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [testResults, setTestResults] = useState(null);

  // Sample questions
  const questions = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      example: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
      starterCode: "function twoSum(nums, target) {\n    // Your code here\n}"
    },
    // Add more questions
  ];

  const runCode = () => {
    // Code execution logic
    setTestResults({ passed: 3, total: 5 });
  };

  const submitCode = () => {
    // Code submission logic
    alert('Code submitted successfully!');
  };

  return (
    <div className="leetcode-page">
      <div className="question-panel">
        <h2>{currentQuestion?.title || 'Select a question'}</h2>
        {currentQuestion && (
          <>
            <div className={`difficulty ${currentQuestion.difficulty.toLowerCase()}`}>
              {currentQuestion.difficulty}
            </div>
            <div className="question-description">
              <p>{currentQuestion.description}</p>
              <pre>{currentQuestion.example}</pre>
            </div>
          </>
        )}
      </div>
      
      <div className="editor-panel">
        <div className="editor-header">
          <select onChange={(e) => setCurrentQuestion(questions.find(q => q.id === parseInt(e.target.value)))}>
            <option value="">Select a question</option>
            {questions.map(q => (
              <option key={q.id} value={q.id}>{q.title}</option>
            ))}
          </select>
          <div className="editor-actions">
            <button onClick={runCode}>Run</button>
            <button onClick={submitCode}>Submit</button>
          </div>
        </div>
        
        <textarea
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          placeholder="Write your solution here..."
          className="code-editor"
        />
        
        {testResults && (
          <div className="test-results">
            <h4>Test Results: {testResults.passed}/{testResults.total} passed</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeetCodePage;
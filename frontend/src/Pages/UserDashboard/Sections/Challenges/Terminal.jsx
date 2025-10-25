import React from 'react';
import './Terminal.css';

const Terminal = ({ testResults, isRunning }) => {
  return (
    <div className="terminal">
      <div className="terminal-header">
        <span>Test Results</span>
      </div>
      <div className="terminal-content">
        {isRunning ? (
          <div className="running-indicator">
            <div className="spinner"></div>
            Running your code...
          </div>
        ) : testResults.length === 0 ? (
          <div className="no-tests">
            Click "Run" to test your code
          </div>
        ) : (
          <div className="test-results">
            {testResults.map((result, index) => (
              <div key={index} className={`test-case ${result.status}`}>
                <div className="test-case-header">
                  <span className="test-case-number">Test Case {result.testCase}</span>
                  <span className={`test-status ${result.status}`}>
                    {result.status === 'passed' ? '✓ Passed' : '✗ Failed'}
                  </span>
                </div>
                <div className="test-details">
                  <div className="test-input">
                    <strong>Input:</strong> {JSON.stringify(result.input)}
                  </div>
                  <div className="test-expected">
                    <strong>Expected:</strong> {JSON.stringify(result.expected)}
                  </div>
                  <div className="test-output">
                    <strong>Output:</strong> {JSON.stringify(result.output)}
                  </div>
                  {result.executionTime && (
                    <div className="execution-time">
                      <strong>Time:</strong> {result.executionTime}ms
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
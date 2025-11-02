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

  const [problem, setProblem] = useState(null); // full problem object
  const [code, setCode] = useState(''); // editor content
  const [activeTab, setActiveTab] = useState('description');
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Helper: decide whether a problem object is "full" (has description / starterCode)
  const isFullProblem = (p) => {
    if (!p) return false;
    return !!(p.description || (p.starterCode && Object.keys(p.starterCode).length) || (p.testCases && p.testCases.length));
  };

  // Normalize testcases so we always have { input, expected, output? }
  const normalizeTestCases = (raw) => {
    if (!raw || !Array.isArray(raw)) return [];
    return raw.map((t, i) => {
      // common shapes: { input, output } or { input, expectedOutput } or [in,out]
      if (typeof t === 'string') {
        // if simple strings, place into input
        return { id: i + 1, input: t, expected: 'N/A' };
      }
      if (Array.isArray(t)) {
        return { id: i + 1, input: t[0], expected: t[1] };
      }
      return {
        id: t.id ?? i + 1,
        input: t.input ?? t.args ?? t.in ?? t[0] ?? 'N/A',
        expected: t.output ?? t.expectedOutput ?? t.expected ?? t.out ?? t[1] ?? 'N/A',
      };
    });
  };

  const loadProblem = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // 1) If location.state.problem exists and is full, use it
      const stateProblem = location.state?.problem;
      const stateSlug = location.state?.slug;

      // Derive slug from URL if needed: /solve/leetcode-two-sum or problems with leetcode-<slug>
      const deriveSlugFromId = (id) => {
        if (!id) return null;
        const parts = id.split('-');
        // if id starts with 'leetcode' then rest is slug-like; otherwise return id
        if (parts[0] === 'leetcode') return parts.slice(1).join('-');
        return id;
      };

      let finalProblem = null;
      let slug = null;

      if (stateProblem && isFullProblem(stateProblem)) {
        finalProblem = stateProblem;
        // try to pick slug from object if present
        slug = stateProblem.titleSlug || deriveSlugFromId(stateProblem.id) || stateSlug;
      } else {
        // Determine slug either from state.slug or from url param
        slug = stateSlug || deriveSlugFromId(problemId);

        // If stateProblem exists but is only lightweight (no description), still fetch full
        if (stateProblem && stateProblem.title) {
          // prefer fetching full data if description missing
          if (!isFullProblem(stateProblem) && slug) {
            finalProblem = await CodingApiService.fetchLeetCodeProblem(slug);
          } else {
            finalProblem = stateProblem;
          }
        } else if (slug) {
          // fetch from API
          // If the url's prefix indicates platform, handle accordingly:
          const platformPrefix = problemId?.split('-')[0] ?? 'leetcode';
          if (platformPrefix === 'leetcode') {
            finalProblem = await CodingApiService.fetchLeetCodeProblem(slug);
          } else {
            // For non-leetcode, use fallback
            finalProblem = CodingApiService.getFallbackProblem(slug);
          }
        } else {
          // Last fallback: try treating problemId as slug
          finalProblem = CodingApiService.getFallbackProblem(problemId || 'unknown-problem');
        }
      }

      // Ensure normalized fields
      finalProblem.testCases = normalizeTestCases(finalProblem.testCases || finalProblem.examples || []);
      finalProblem.starterCode = finalProblem.starterCode || { javascript: '// No starter code' };

      setProblem(finalProblem);

      // Set code only when we have starterCode (avoid overriding editor mid-typing)
      setCode((prev) => {
        // if prev is empty (first load) set starter, otherwise keep existing (user may be editing)
        if (!prev || prev.trim() === '' || prev === '// Write your code here') {
          return finalProblem.starterCode.javascript || '// Write your code here';
        }
        return prev;
      });
    } catch (err) {
      console.error('Error loading problem:', err);
      setErrorMsg('Unable to load problem details. Try again later.');
      setProblem({
        id: problemId,
        title: 'Problem Not Found',
        difficulty: 'medium',
        description: '<p>Problem description not available.</p>',
        starterCode: { javascript: '// Problem not available' },
        testCases: [],
      });
      setCode('// Problem not available');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemId, location.state?.problem, location.state?.slug]);

  // Handle run — uses normalized test cases
  const handleRunCode = async () => {
    if (!problem) return;
    setIsRunning(true);
    setTestResults([]);

    try {
      const tcs = problem.testCases && problem.testCases.length ? problem.testCases : [{ id: 1, input: 'Example Input', expected: 'Expected Output' }];

      // Simulate execution results (replace with real judge API call later)
      const simulated = tcs.map((test) => ({
        id: test.id,
        input: test.input,
        expected: test.expected,
        output: test.expected, // simulated as passing
        status: 'passed',
      }));

      // fake delay
      setTimeout(() => {
        setTestResults(simulated);
        setIsRunning(false);
      }, 900);
    } catch (err) {
      console.error('Error running code:', err);
      setTestResults([{ id: 1, input: '-', expected: '-', output: 'Error occurred', status: 'failed' }]);
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsRunning(true);
    setTimeout(() => {
      const allPassed = testResults.length > 0 && testResults.every((r) => r.status === 'passed');
      if (allPassed) {
        alert('🎉 Congratulations! Your solution was accepted!');
      } else {
        alert('❌ Some test cases failed. Please try again.');
      }
      setIsRunning(false);
    }, 800);
  };

  if (loading) {
    return <div className="loading">Loading problem...</div>;
  }

  if (errorMsg) {
    return (
      <div className="error">
        <p>{errorMsg}</p>
        <button onClick={() => loadProblem()}>Retry</button>
        <button onClick={() => navigate('/challenges')}>Back to Challenges</button>
      </div>
    );
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
            {problem.difficulty && (problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1))}
          </span>
        </div>
      </div>

      <div className="problem-layout">
        {/* Left: Problem Description */}
        <div className="problem-description-panel">
          <div className="description-tabs">
            <button className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Description</button>
            <button className={`tab-btn ${activeTab === 'solutions' ? 'active' : ''}`} onClick={() => setActiveTab('solutions')}>Solutions</button>
            <button className={`tab-btn ${activeTab === 'discussions' ? 'active' : ''}`} onClick={() => setActiveTab('discussions')}>Discussions</button>
          </div>

          <div className="description-content">
            {activeTab === 'description' && <ProblemDescription description={problem.description} />}
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

        {/* Right: Code Editor */}
        <div className="code-editor-panel">
          <div className="editor-header">
            <select className="language-select" defaultValue="javascript">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>

            <div className="editor-actions">
              <button className="run-btn" onClick={handleRunCode} disabled={isRunning}>{isRunning ? 'Running...' : 'Run'}</button>
              <button className="submit-btn" onClick={handleSubmit} disabled={isRunning}>{isRunning ? 'Submitting...' : 'Submit'}</button>
            </div>
          </div>

          {/* CodeEditor should call onChange with new code */}
          <CodeEditor code={code} onChange={setCode} />

          {/* Terminal expects array of results */}
          <Terminal testResults={testResults} isRunning={isRunning} />
        </div>
      </div>
    </div>
  );
};

export default ProblemSolve;

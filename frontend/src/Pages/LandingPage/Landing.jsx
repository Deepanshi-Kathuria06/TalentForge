import React, { useState, useEffect } from 'react';
import './Landing.css';
import { Footer } from '../../components/Footer';
import Navbar from '../../components/Navbar';
import projectImage from '../../assets/images/ZeroWaste.png'; 


export const Landing = () => {
  const [activeResumeTab, setActiveResumeTab] = useState('editor');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');

  const projects = [
    {
      title: "ZeroWaste Bites",
      description: "A sustainable food delivery platform connecting eco-conscious consumers with local zero-waste restaurants and meal providers.",
      tech: "React, Node.js, MongoDB",
      views: 876,
      stars: 245,
      demoUrl: "https://zerowaste-bites.vercel.app"
    }
  ];

  // Animation for resume editor
  useEffect(() => {
    if (activeResumeTab === 'editor') {
      const timer = setTimeout(() => {
        setName('Alex Johnson');
        setTitle('Senior UX Designer');
        setSummary('Creative problem solver with 6+ years of experience designing intuitive user experiences for Fortune 500 companies. Specialized in accessibility and sustainable design practices.');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [activeResumeTab]);

  return (
    <div className="landing-container-1">
      <Navbar />
        {/* New Hero Section with Globe Animation */}
       {/* New Hero Section with Globe Animation */}
<section className="globe-hero-section">
  <div className="globe-container">
    <div className="globe1">
      <div className="globe-surface"></div>
      <div className="globe-inner-glow"></div>
      
      
    </div>
  </div>
  
  <div className="globe-hero-content">
    <h1>
      <span className="hero-title-line">Connecting Talent</span>
      <span className="hero-title-line">Across the Globe</span>
    </h1>
    <p className="hero-subtitle">
      This platform bridges the gap between <span className="highlight-text">top talent</span> and <span className="highlight-text">dream opportunities</span> in real-time, with the scale to power career transformations worldwide.
    </p>
    <div className="cta-buttons1">
      <button className="primary-btn">Join the Network</button>
      <button className="secondary-btn">See How It Works</button>
    </div>
  </div>
</section>

   {/* Elevate Your Journey - Circular Design */}
<section className="journey-section">
  <div className="section-container">
    <h2 className="title">Elevate Your Career Journey</h2>
    <p className="section-subtitle">Powerful tools designed to help you stand out in today's competitive market</p>
    
    <div className="circular-features">
      <div className="central-circle">
        <div className="center-content">
          <h3>Your Career</h3>
          <p>Success Starts Here</p>
        </div>
      </div>
      
      {[
        { 
          icon: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 7L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 12L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 17L13 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ), 
          title: 'ATS Optimizer', 
          desc: 'Get past automated screening systems' 
        },
        { 
          icon: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 8H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ), 
          title: 'Resume Builder', 
          desc: 'Create tailored resumes with AI' 
        },
        { 
          icon: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="9" cy="9" r="1" fill="currentColor"/>
              <circle cx="15" cy="9" r="1" fill="currentColor"/>
              <path d="M8 15H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 15V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ), 
          title: 'Career Assistant', 
          desc: '24/7 AI chatbot guidance' 
        },
        { 
          icon: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <rect x="6" y="6" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 17H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ), 
          title: 'Project Viewer', 
          desc: 'Showcase work to recruiters' 
        },
        { 
          icon: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="15" cy="9" r="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M15 16C15 13.7909 13.2091 12 11 12C8.79086 12 7 13.7909 7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ), 
          title: 'Communities', 
          desc: 'Connect with professionals' 
        },
        { 
          icon: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M7 17L7 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 17L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M17 17L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M7 12L17 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ), 
          title: 'Analytics', 
          desc: 'Track job search performance' 
        }
      ].map((feature, index) => (
        <div 
          key={index} 
          className={`feature-circle feature-${index + 1}`}
        >
          <div className="feature-content">
            <div className="feature-icon">{feature.icon}</div>
            <h4>{feature.title}</h4>
            <p>{feature.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>  
      {/* Interactive Resume Viewer */}
      <section className="resume-viewer-section">
        <div className="section-container2">
          <h2 className="section-title2">Smart Resume Experience</h2>
          <p className="section-subtitle">Create, optimize, and preview your resume all in one place</p>
          
          <div className="resume-viewer-container">
            <div className="resume-tabs">
              <button 
                className={`resume-tab ${activeResumeTab === 'editor' ? 'active' : ''}`}
                onClick={() => setActiveResumeTab('editor')}
              >
                Editor
              </button>
              <button 
                className={`resume-tab ${activeResumeTab === 'preview' ? 'active' : ''}`}
                onClick={() => setActiveResumeTab('preview')}
              >
                Preview
              </button>
              <button 
                className={`resume-tab ${activeResumeTab === 'analysis' ? 'active' : ''}`}
                onClick={() => setActiveResumeTab('analysis')}
              >
                Analysis
              </button>
            </div>
            
            <div className="resume-viewer">
              {activeResumeTab === 'editor' && (
                <div className="resume-editor">
                  <div className="editor-header">
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      className="resume-input" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="Professional Title" 
                      className="resume-input"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="editor-section">
                    <h4>Professional Summary</h4>
                    <textarea 
                      className="resume-textarea" 
                      placeholder="Describe your professional background..."
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              )}
              
              {activeResumeTab === 'preview' && (
                <div className="resume-preview">
                  <div className="preview-header">
                    <h3>{name || 'Your Name'}</h3>
                    <p>{title || 'Professional Title'}</p>
                  </div>
                  <div className="preview-section">
                    <h4>Professional Summary</h4>
                    <p>{summary || 'Your professional summary will appear here'}</p>
                  </div>
                </div>
              )}
              
              {activeResumeTab === 'analysis' && (
                <div className="resume-analysis">
                  <div className="analysis-score">
                    <div className="score-circle">
                      <div className="score-value">87</div>
                      <div className="score-label">ATS Score</div>
                    </div>
                    <div className="score-description">
                      <p>Your resume scores well but could be improved in these areas:</p>
                      <ul>
                        <li>✅ Strong keyword matching (95%)</li>
                        <li>⚠️ Could add more metrics (3/5)</li>
                        <li>⚠️ Skills section needs more industry terms</li>
                      </ul>
                    </div>
                  </div>
                  <div className="keyword-analysis">
                    <h4>Keyword Optimization</h4>
                    <div className="keyword-tags">
                      <span className="keyword-match">React</span>
                      <span className="keyword-match">Node.js</span>
                      <span className="keyword-missing">AWS</span>
                      <span className="keyword-match">JavaScript</span>
                      <span className="keyword-missing">TypeScript</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Project Viewer */}
      <section className="project-viewer-section">
        <div className="section-container">
          <h2 className="title">Showcase Your Work</h2>
          <p className="section-subtitle1">Present your projects interactively to potential employers</p>
          
          <div className="project-viewer-container">
            <div className="project-display">
              <div className="project-info">
                <h3>{projects[0].title}</h3>
                <p>{projects[0].description}</p>
                <div className="project-meta">
                  <span>Tech: {projects[0].tech}</span>
                  <span>👁️ {projects[0].views} views</span>
                  <span>⭐ {projects[0].stars} stars</span>
                </div>
                <a 
                  href={projects[0].demoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-demo-btn"
                >
                  View Live Demo
                </a>
              </div>
              
              <div className="project-preview">
                <img 
                  src={projectImage} 
                  alt={projects[0].title} 
                  className="project-image1"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="project-image-fallback">
                  <span>ZeroWaste Bites Preview</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Network Visualization */}
      <section className="network-visualization">
        <div className="section-container">
          <div className="network-content">
            <div className="network-description">
              <h2 className="title">A Network That Works For You</h2>
              <p className="section-subtitle">Our platform dynamically connects you with the right people, opportunities, and resources based on your career goals and activity.</p>
              <button className="primary-btn">See How It Works</button>
            </div>
            <div className="network-graphic">
              <div className="network-center">
                <div className="network-core"></div>
                <div className="network-core-glow"></div>
              </div>
              {[
                { text: 'Mentors', position: 'top: 0%; left: 50%' },
                { text: 'Job Openings', position: 'top: 15%; left: 80%' },
                { text: 'Skill Builders', position: 'top: 50%; left: 90%' },
                { text: 'Industry Events', position: 'top: 85%; left: 80%' },
                { text: 'Career Paths', position: 'top: 100%; left: 50%' },
                { text: 'Learning Resources', position: 'top: 85%; left: 20%' },
                { text: 'Peer Network', position: 'top: 50%; left: 10%' },
                { text: 'Company Insights', position: 'top: 15%; left: 20%' }
              ].map((node, i) => (
                <div key={i} className="network-node" style={{ [node.position.split(':')[0]]: node.position.split(':')[1] }}>
                  <div className="node-line"></div>
                  <div className="node-content">
                    {node.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
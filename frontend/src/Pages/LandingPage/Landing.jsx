import React, { useState, useEffect } from 'react';
import './Landing.css';
import { Footer } from '../../components/Footer';
import Navbar from '../../components/Navbar';
import projectImage from '../../assets/images/ZeroWaste.png'; // Add your project preview image path


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
    <div className="landing-container">
      <Navbar />
        {/* New Hero Section with Globe Animation */}
       {/* New Hero Section with Globe Animation */}
<section className="globe-hero-section">
  <div className="globe-container">
    <div className="globe">
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
    <div className="cta-buttons">
      <button className="primary-btn">Join the Network</button>
      <button className="secondary-btn">See How It Works</button>
    </div>
  </div>
</section>

      {/* Elevate Your Journey - Circular Design */}
      <section className="journey-section">
        <div className="section-container">
          <h2 className="section-title">Elevate Your Career Journey</h2>
          <p className="section-subtitle">Powerful tools designed to help you stand out in today's competitive market</p>
          
          <div className="circular-features">
            <div className="central-circle">
              <div className="center-content">
                <h3>Your Career</h3>
                <p>Success Starts Here</p>
              </div>
            </div>
            
            {[
              { icon: '🔍', title: 'ATS Optimizer', desc: 'Get past automated screening systems' },
              { icon: '📝', title: 'Resume Builder', desc: 'Create tailored resumes with AI' },
              { icon: '🤖', title: 'Career Assistant', desc: '24/7 AI chatbot guidance' },
              { icon: '💻', title: 'Project Viewer', desc: 'Showcase work to recruiters' },
              { icon: '👥', title: 'Communities', desc: 'Connect with professionals' },
              { icon: '📊', title: 'Analytics', desc: 'Track job search performance' }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`feature-circle feature-${index + 1}`}
                style={{ 
                  transform: `rotate(${index * 60}deg) translate(200px) rotate(-${index * 60}deg)`
                }}
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
          <h2 className="section-title">Showcase Your Work</h2>
          <p className="section-subtitle">Present your projects interactively to potential employers</p>
          
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
                  className="project-image"
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
              <h2 className="section-title">A Network That Works For You</h2>
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
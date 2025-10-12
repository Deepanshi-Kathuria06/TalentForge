import React from "react";
import "../assets/styles/Footer.css";

export const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-main">
        {/* Logo Section */}
        <div className="footer-logo-section">
          <div className="logo-animation-container">
            <div className="animated-logo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="logo-svg"
              >
                <path d="M22 10L12 4 2 10l10 6 10-6z" />
                <path d="M6 12v6c4 2 8 2 12 0v-6" />
              </svg>
            </div>
            
            <div className="company-name-container">
              <h1 className="company-name">
                <span className="letter">T</span>
                <span className="letter">A</span>
                <span className="letter">L</span>
                <span className="letter">E</span>
                <span className="letter">N</span>
                <span className="letter">T</span>
                <span className="letter">F</span>
                <span className="letter">O</span>
                <span className="letter">R</span>
                <span className="letter">G</span>
                <span className="letter">E</span>
              </h1>
              <div className="logo-subtitle">Forging Careers, Building Futures</div>
            </div>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="footer-links-grid">
          {/* Platform Links */}
          <div className="footer-column">
            <h3 className="footer-title">Platform</h3>
            <ul className="footer-links">
              <li><a href="/projects" className="footer-link">Project Showcase</a></li>
              <li><a href="/networking" className="footer-link">Networking</a></li>
              <li><a href="/gamification" className="footer-link">Gamification</a></li>
              <li><a href="/analytics" className="footer-link">Career Analytics</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="footer-column">
            <h3 className="footer-title">Resources</h3>
            <ul className="footer-links">
              <li><a href="/resume-builder" className="footer-link">Resume Builder</a></li>
              <li><a href="/ats-checker" className="footer-link">ATS Checker</a></li>
              <li><a href="/career-guide" className="footer-link">Career Guide</a></li>
              <li><a href="/job-search" className="footer-link">Job Search Tips</a></li>
              <li><a href="/interview-prep" className="footer-link">Interview Prep</a></li>
              <li><a href="/skill-assessment" className="footer-link">Skill Assessment</a></li>
              <li><a href="/industry-insights" className="footer-link">Industry Insights</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="footer-column">
            <h3 className="footer-title">Company</h3>
            <ul className="footer-links">
              <li><a href="/about" className="footer-link">About Us</a></li>
              <li><a href="/team" className="footer-link">Our Team</a></li>
              <li><a href="/careers" className="footer-link">Careers</a></li>
              <li><a href="/networking" className="footer-link">Networking</a></li>
              <li><a href="/hackathons" className="footer-link">Hackathons</a></li>
              <li><a href="/press" className="footer-link">Press</a></li>
              <li><a href="/partners" className="footer-link">Partners</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="footer-column">
            <h3 className="footer-title">Support</h3>
            <ul className="footer-links">
              <li><a href="/contact" className="footer-link">Contact Us</a></li>
              <li><a href="/feedback" className="footer-link">Feedback</a></li>
              <li><a href="/bug-report" className="footer-link">Report Bug</a></li>
              <li><a href="/feature-request" className="footer-link">Feature Request</a></li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="footer-contact">
          <h3 className="footer-title">Get Started</h3>
          <p className="contact-description">Ready to elevate your career? Join thousands of professionals who are already building their future with TalentForge.</p>
          <div className="contact-buttons">
            <a href="/enquiry" className="primary-contact-btn">
              Enquiry
            </a>
            <a href="/demo" className="secondary-contact-btn">
              Watch Demo
            </a>
          </div>
          
          {/* Social Links */}
          <div className="social-links">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="#" className="social-link" aria-label="LinkedIn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="GitHub">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h3>Stay Updated</h3>
            <p>Get the latest career tips, job opportunities, and platform updates delivered to your inbox.</p>
          </div>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email address" className="newsletter-input" />
            <button className="newsletter-btn">Subscribe</button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="footer-bottom-left">
            <p>© {new Date().getFullYear()} TalentForge. All rights reserved.</p>
            <div className="footer-legal-links">
              <a href="/privacy" className="legal-link">Privacy Policy</a>
              <a href="/terms" className="legal-link">Terms of Service</a>
              <a href="/cookies" className="legal-link">Cookie Policy</a>
            </div>
          </div>
          <div className="footer-bottom-right">
            <div className="footer-stats">
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Success Stories</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">95%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
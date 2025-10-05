import React from "react";
import "../assets/styles/Footer.css";

export const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-main">
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

        <div className="footer-contact">
          <h3>CONTACT US</h3>
          <p>Have any queries or feedback? Reach out to us!</p>
          <a href="/enquiry" className="enquiry-button">
            Enquiry
          </a>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} TalentForge. All rights reserved.</p>
      </div>
    </footer>
  );
};
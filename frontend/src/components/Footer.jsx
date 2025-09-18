import React from "react";
import "../assets/styles/Footer.css";

// TalentForge Logo with Wordmark (big version for footer)
const TalentForgeFooterLogo = () => (
  <svg
    width="240"
    height="80"
    viewBox="0 0 520 140"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-labelledby="torch-title"
  >
    <title id="torch-title">TalentForge — Torch Logo</title>

    {/* Background card */}
    <rect
      x="0"
      y="0"
      width="520"
      height="140"
      rx="10"
      fill="#FFF9E5"
      stroke="#004030"
      strokeWidth="3"
    />

    {/* Torch */}
    <g
      transform="translate(40,24)"
      stroke="#004030"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Cup */}
      <path d="M24,52 h56 l-6,16 H30 z" fill="#DCD0A8" />
      {/* Handle */}
      <path d="M42,68 v28 M62,68 v28" />
      {/* Flame */}
      <path
        d="M52,10 c12,10 18,18 18,26 0,10-8,18-18,18 -10,0-18-8-18-18 0-8 6-16 18-26z"
        fill="#4A9782"
        fillOpacity="0.7"
        stroke="none"
      />
    </g>

    {/* Wordmark */}
    <text
      x="160"
      y="88"
      fontFamily="Inter, ui-sans-serif, system-ui"
      fontSize="44"
      fontWeight="700"
      fill="#004030"
    >
      TalentForge
    </text>
  </svg>
);

export const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-main">
        <div className="footer-logo">
          <TalentForgeFooterLogo />
        </div>

        <div className="footer-links">
          <div className="link-column">
            <h3>ATS CHECKER</h3>
            <ul>
              <li><a href="/ats-checker">How it works</a></li>
              <li><a href="/ats-checker/test">Test your resume</a></li>
              <li><a href="/ats-checker/tips">Tips</a></li>
            </ul>
          </div>

          <div className="link-column">
            <h3>COMMUNITY</h3>
            <ul>
              <li><a href="/community">Join</a></li>
              <li><a href="/community/forum">Forum</a></li>
              <li><a href="/community/events">Events</a></li>
            </ul>
          </div>

          <div className="link-column">
            <h3>RESUME BUILDER</h3>
            <ul>
              <li><a href="/resume-builder">Create</a></li>
              <li><a href="/resume-builder/templates">Templates</a></li>
              <li><a href="/resume-builder/examples">Examples</a></li>
            </ul>
          </div>

          <div className="link-column">
            <h3>CHATBOT</h3>
            <ul>
              <li><a href="/chatbot">Ask questions</a></li>
              <li><a href="/chatbot/career">Career advice</a></li>
              <li><a href="/chatbot/interview">Interview prep</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} TalentForge. All rights reserved.</p>
        <div className="legal-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/cookies">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

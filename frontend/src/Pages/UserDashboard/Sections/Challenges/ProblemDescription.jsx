import React from 'react';
import './ProblemDescription.css';

const ProblemDescription = ({ description }) => {
  // Simple markdown-like parsing
  const parseDescription = (text) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith('## ')) {
        return <h2 key={index}>{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index}>{line.replace('### ', '')}</h3>;
      }
      // Bold text
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index}>
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </p>
        );
      }
      // Code blocks
      if (line.trim().startsWith('```')) {
        return null; // Skip code block markers
      }
      if (line.includes('`')) {
        const parts = line.split('`');
        return (
          <p key={index}>
            {parts.map((part, i) => 
              i % 2 === 1 ? <code key={i}>{part}</code> : part
            )}
          </p>
        );
      }
      // Regular paragraphs
      if (line.trim()) {
        return <p key={index}>{line}</p>;
      }
      // Empty lines
      return <br key={index} />;
    });
  };

  return (
    <div className="problem-description">
      {parseDescription(description)}
    </div>
  );
};

export default ProblemDescription;
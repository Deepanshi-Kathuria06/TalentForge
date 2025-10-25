import React from 'react';
import './CodeEditor.css';

const CodeEditor = ({ code, onChange }) => {
  return (
    <div className="code-editor">
      <div className="editor-container">
        <textarea
          className="code-input"
          value={code}
          onChange={(e) => onChange(e.target.value)}
          spellCheck="false"
          placeholder="Write your code here..."
        />
      </div>
    </div>
  );
};

export default CodeEditor;
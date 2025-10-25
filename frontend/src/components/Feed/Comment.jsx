import React, { useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import './CommentSection.css';

const CommentSection = ({ post, onAddComment }) => {
  const [commentText, setCommentText] = useState('');
  const { user } = useAuth();

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    onAddComment(post.id, commentText, user);
    setCommentText('');
  };

  return (
    <div className="comment-section">
      {/* Comment Input */}
      <form onSubmit={handleSubmitComment} className="comment-form">
        <div className="comment-input-container">
          <img 
            src={user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} 
            alt="Your avatar" 
            className="comment-avatar" 
          />
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="comment-input"
          />
          <button 
            type="submit" 
            className="comment-submit-btn"
            disabled={!commentText.trim()}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </form>

      {/* Comments List */}
      {post.comments && post.comments.length > 0 && (
        <div className="comments-list">
          {post.comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <img 
                src={comment.author.avatar} 
                alt={comment.author.name} 
                className="comment-avatar" 
              />
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-author">{comment.author.name}</span>
                  <span className="comment-role">{comment.author.role}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
                <span className="comment-timestamp">{comment.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
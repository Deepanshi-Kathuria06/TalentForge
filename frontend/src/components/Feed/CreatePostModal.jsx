import React, { useState, useRef } from 'react';
import { useAuth } from '../../Pages/Auth/AuthContext'; // ADD THIS IMPORT
import './CreatePostModal.css';

const CreatePostModal = ({ isOpen, onClose, onSubmit }) => {
  const [postText, setPostText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);
  
  // ADD THIS: Get current user from auth context
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setSelectedImages(prev => [...prev, ...imageUrls]);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!postText.trim() && selectedImages.length === 0) return;

    const newPost = {
      author: {
        name: user?.name || 'User', // USE ACTUAL USER NAME
        role: user?.userType === 'student' ? 'Student' : 'Recruiter', // DYNAMIC ROLE
        avatar: user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg', // USER AVATAR
        isVerified: false
      },
      content: postText,
      images: selectedImages
    };

    onSubmit(newPost);
    setPostText('');
    setSelectedImages([]);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="create-post-modal">
        <div className="modal-header">
          <h3>Create Post</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-body">
          <div className="post-author">
            <img 
              src={user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} // USER AVATAR
              alt="Author" 
              className="author-avatar"
            />
            <div>
              <div className="author-name">{user?.name || 'User'}</div> {/* USER NAME */}
              <div className="author-role">
                {user?.userType === 'student' ? 'Student' : 'Recruiter'} {/* DYNAMIC ROLE */}
              </div>
            </div>
          </div>
          
          <textarea
            className="post-textarea"
            placeholder="What's on your mind?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            rows="4"
          />
          
          {selectedImages.length > 0 && (
            <div className="selected-images">
              {selectedImages.map((image, index) => (
                <div key={index} className="image-preview">
                  <img src={image} alt={`Preview ${index}`} />
                  <button 
                    className="remove-image-btn"
                    onClick={() => removeImage(index)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <div className="post-options">
            <button 
              className="option-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <i className="fas fa-image"></i> Photo
            </button>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />
          </div>
          
          <button 
            className="post-submit-btn"
            onClick={handleSubmit}
            disabled={!postText.trim() && selectedImages.length === 0}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
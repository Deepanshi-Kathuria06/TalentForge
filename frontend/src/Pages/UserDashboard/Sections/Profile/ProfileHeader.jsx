import React, { useState } from 'react';
import EditProfileModal from './EditProfileModal';
// import { profileAPI } from '../../../services/api';
import './ProfileHeader.css';

const ProfileHeader = ({ profile, isOwnProfile, onProfileUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('profilePhoto', file);

      const response = await profileAPI.uploadProfilePhoto(formData);
      onProfileUpdate(response.data);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error uploading photo');
    } finally {
      setUploading(false);
    }
  };

  const handleFollow = () => {
    // Follow functionality to be implemented
    console.log('Follow user:', profile.user._id);
  };

  return (
    <>
      <div className="profile-header">
        <div className="cover-photo">
          {/* Cover photo area - can be added later */}
        </div>
        
        <div className="profile-info">
          <div className="photo-section">
            <div className="profile-photo-container">
              <img 
                src={profile.profilePhoto || '/default-avatar.png'} 
                alt="Profile" 
                className="profile-photo"
              />
              {isOwnProfile && (
                <label className="photo-upload-label">
                  {uploading ? 'Uploading...' : 'Change Photo'}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="profile-details">
            <h1 className="profile-name">
              {profile.role === 'user' 
                ? profile.user?.name 
                : profile.companyName || profile.user?.name
              }
            </h1>
            <p className="profile-headline">{profile.headline}</p>
            <p className="profile-location">{profile.location}</p>
            
            <div className="profile-stats">
              <span className="stat">
                <strong>{profile.followersCount}</strong> Followers
              </span>
              <span className="stat">
                <strong>{profile.followingCount}</strong> Following
              </span>
            </div>

            <div className="profile-actions">
              {isOwnProfile ? (
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowEditModal(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <button 
                  className="btn btn-primary"
                  onClick={handleFollow}
                >
                  Follow
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onUpdate={onProfileUpdate}
        />
      )}
    </>
  );
};

export default ProfileHeader;
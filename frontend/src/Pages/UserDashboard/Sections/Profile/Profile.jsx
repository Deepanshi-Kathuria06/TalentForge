import React, { useState, useRef, useEffect } from "react";
import API from "../../../../utils/api";
import { useAuth } from "../../../Auth/AuthContext";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editedProfile, setEditedProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const bannerInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const { user: currentUser } = useAuth();

  const getDefaultAvatar = (user) => {
    const name = user?.name || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=004030&color=fff`;
  };

  useEffect(() => {
    if (currentUser?._id) {
      loadProfile();
      loadUserPosts();
    }
  }, [currentUser]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/profile/me/${currentUser._id}`);
      
      if (response.data) {
        setProfile(response.data);
        setEditedProfile(response.data);
      } else {
        const emptyProfile = {
          name: currentUser?.name || "",
          firstName: currentUser?.name?.split(' ')[0] || "",
          lastName: currentUser?.name?.split(' ')[1] || "",
          additionalName: "",
          email: currentUser?.email || "",
          userType: currentUser?.userType || "",
          title: "",
          location: "",
          bio: "",
          skills: [],
          experience: [],
          education: [],
          certifications: [],
          projects: [],
          avatar: getDefaultAvatar(currentUser),
          banner: "",
          connections: 0,
          followers: 0,
        };
        setProfile(emptyProfile);
        setEditedProfile(emptyProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      const emptyProfile = {
        name: currentUser?.name || "",
        firstName: currentUser?.name?.split(' ')[0] || "",
        lastName: currentUser?.name?.split(' ')[1] || "",
        additionalName: "",
        title: "",
        location: "",
        bio: "",
        skills: [],
        experience: [],
        education: [],
        certifications: [],
        projects: [],
        avatar: getDefaultAvatar(currentUser),
        banner: "",
        connections: 0,
        followers: 0,
      };
      setProfile(emptyProfile);
      setEditedProfile(emptyProfile);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPosts = async () => {
    try {
      const response = await API.get(`/feed/posts?userId=${currentUser._id}`);
      setUserPosts(response.data || []);
    } catch (error) {
      console.error('Error loading user posts:', error);
      setUserPosts([]);
    }
  };

  const saveProfile = async (sectionData) => {
    try {
      setSaving(true);
      
      // Update the editedProfile with the section data
      const updatedProfile = {
        ...editedProfile,
        ...sectionData
      };

      // Ensure name is constructed properly
      if (sectionData.firstName || sectionData.lastName) {
        updatedProfile.name = `${updatedProfile.firstName || ''} ${updatedProfile.lastName || ''}`.trim();
      }

      console.log('Saving profile data:', updatedProfile);

      // Update local state immediately for better UX
      setProfile(updatedProfile);
      setEditedProfile(updatedProfile);

      // Save to API
      await API.put(`/profile/update/${currentUser._id}`, updatedProfile);
      
      console.log('Profile saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      // Revert changes if API fails
      setProfile(profile);
      setEditedProfile(profile);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
      setActiveSection(null);
    }
  };

  const handleSectionEdit = (section) => {
    setEditedProfile(JSON.parse(JSON.stringify(profile)));
    setActiveSection(section);
  };

  const handleSaveSection = () => {
    // Save the entire editedProfile
    saveProfile(editedProfile);
  };

  const handleCancelEdit = () => {
    setEditedProfile(JSON.parse(JSON.stringify(profile)));
    setActiveSection(null);
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({ 
      ...prev, 
      [field]: value 
    }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setEditedProfile(prev => {
      const updatedArray = [...(prev[arrayName] || [])];
      if (field === null) {
        updatedArray[index] = value;
      } else {
        updatedArray[index] = { ...updatedArray[index], [field]: value };
      }
      return { ...prev, [arrayName]: updatedArray };
    });
  };

  const handleAddItem = (arrayName, template) => {
    setEditedProfile(prev => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] || []), template]
    }));
  };

  const handleRemoveItem = (arrayName, index) => {
    setEditedProfile(prev => ({
      ...prev,
      [arrayName]: (prev[arrayName] || []).filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          setSaving(true);
          const imageDataUrl = e.target.result;
          
          // Update local state immediately
          const updatedProfile = {
            ...profile,
            [field]: imageDataUrl
          };
          setProfile(updatedProfile);
          setEditedProfile(updatedProfile);

          // Save to API
          await API.put(`/profile/update/${currentUser._id}`, updatedProfile);
          console.log('Profile image updated successfully');
        } catch (error) {
          console.error('Error saving profile image:', error);
          alert('Failed to upload image. Please try again.');
        } finally {
          setSaving(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="loading">Loading your profile...</div>;
  if (!profile) return <div className="loading">No profile data found.</div>;

  return (
    <div className="linkedin-profile">
      {/* Edit Form Popups */}
      {activeSection && (
        <div className="modal-overlay">
          <div className="modal-content">
            {activeSection === 'intro' && (
              <div className="edit-form">
                <div className="form-header">
                  <h2>Edit intro</h2>
                  
                </div>
                
                <div className="form-section">
                  <h3>Basic info</h3>
                  
                  {/* Profile Photo Upload Section */}
                  <div className="form-group">
                    <label>Profile Photo</label>
                    <div className="profile-photo-upload-section">
                      <div className="current-photo-preview">
                        <img 
                          src={editedProfile.avatar || getDefaultAvatar(currentUser)} 
                          alt="Current profile" 
                          className="photo-preview"
                        />
                      </div>
                      <div className="upload-actions">
                        <button 
                          type="button"
                          className="btn-upload"
                          onClick={() => avatarInputRef.current?.click()}
                        >
                          <i className="fas fa-camera"></i>
                          {editedProfile.avatar && editedProfile.avatar.includes('ui-avatars') ? 'Add Photo' : 'Change Photo'}
                        </button>
                        <p className="upload-note">Recommended: Square JPG, PNG, or GIF, at least 400x400 pixels</p>
                      </div>
                      <input
                        type="file"
                        ref={avatarInputRef}
                        onChange={(e) => handleImageUpload(e, 'avatar')}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>First name*</label>
                    <input
                      type="text"
                      value={editedProfile.firstName || ""}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      maxLength="50"
                      className="form-input"
                      placeholder="Enter your first name"
                    />
                    <span className="char-count">{(editedProfile.firstName || '').length}/50</span>
                  </div>
                  
                  <div className="form-group">
                    <label>Last name*</label>
                    <input
                      type="text"
                      value={editedProfile.lastName || ""}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      maxLength="50"
                      className="form-input"
                      placeholder="Enter your last name"
                    />
                    <span className="char-count">{(editedProfile.lastName || '').length}/50</span>
                  </div>
                  
                  <div className="form-group">
                    <label>Additional name</label>
                    <input
                      type="text"
                      value={editedProfile.additionalName || ""}
                      onChange={(e) => handleInputChange('additionalName', e.target.value)}
                      className="form-input"
                      placeholder="Enter additional name (optional)"
                    />
                  </div>

                  <div className="form-group">
                    <label>Headline</label>
                    <input
                      type="text"
                      value={editedProfile.title || ""}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="form-input"
                      placeholder="Ex: Software Engineer | Full Stack Developer"
                    />
                  </div>

                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={editedProfile.location || ""}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="form-input"
                      placeholder="Ex: Delhi, India"
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button className="btn-save" onClick={handleSaveSection} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button className="btn-cancel" onClick={handleCancelEdit}>Cancel</button>
                </div>
              </div>
            )}

            {activeSection === 'about' && (
              <div className="edit-form">
                <div className="form-header">
                  <h2>Edit about</h2>
                </div>
                
                <div className="form-section">
                  <div className="form-group">
                    <label>About</label>
                    <textarea
                      value={editedProfile.bio || ""}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="form-textarea-large"
                      rows="8"
                      placeholder="Tell us about yourself, your background, experience, and what you're passionate about..."
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button className="btn-save" onClick={handleSaveSection} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button className="btn-cancel" onClick={handleCancelEdit}>Cancel</button>
                </div>
              </div>
            )}

            {activeSection === 'experience' && (
              <div className="edit-form">
                <div className="form-header">
                  <h2>Edit experience</h2>
                </div>
                
                <div className="form-section">
                  {(editedProfile.experience || []).map((exp, index) => (
                    <div key={index} className="edit-item">
                      <div className="form-group">
                        <label>Job Title</label>
                        <input
                          type="text"
                          value={exp.title || ""}
                          onChange={(e) => handleArrayChange('experience', index, 'title', e.target.value)}
                          className="form-input"
                          placeholder="Ex: Software Engineer"
                        />
                      </div>
                      <div className="form-group">
                        <label>Company</label>
                        <input
                          type="text"
                          value={exp.company || ""}
                          onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                          className="form-input"
                          placeholder="Ex: Google"
                        />
                      </div>
                      <div className="form-group">
                        <label>Employment Type</label>
                        <select
                          value={exp.type || ""}
                          onChange={(e) => handleArrayChange('experience', index, 'type', e.target.value)}
                          className="form-input"
                        >
                          <option value="">Select type</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Internship">Internship</option>
                          <option value="Contract">Contract</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Location</label>
                        <input
                          type="text"
                          value={exp.location || ""}
                          onChange={(e) => handleArrayChange('experience', index, 'location', e.target.value)}
                          className="form-input"
                          placeholder="Ex: San Francisco, CA"
                        />
                      </div>
                      <div className="form-group">
                        <label>Duration</label>
                        <input
                          type="text"
                          value={exp.duration || ""}
                          onChange={(e) => handleArrayChange('experience', index, 'duration', e.target.value)}
                          className="form-input"
                          placeholder="Ex: Jan 2023 - Present · 1 yr 2 mos"
                        />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          value={exp.description || ""}
                          onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                          className="form-textarea"
                          rows="4"
                          placeholder="Describe your responsibilities and achievements..."
                        />
                      </div>
                      <button 
                        onClick={() => handleRemoveItem('experience', index)}
                        className="btn-remove"
                      >
                        Remove Experience
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    className="btn-add"
                    onClick={() => handleAddItem('experience', {
                      title: '',
                      company: '',
                      type: '',
                      location: '',
                      duration: '',
                      description: ''
                    })}
                  >
                    + Add Experience
                  </button>
                </div>
                
                <div className="form-actions">
                  <button className="btn-save" onClick={handleSaveSection} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button className="btn-cancel" onClick={handleCancelEdit}>Cancel</button>
                </div>
              </div>
            )}

            {activeSection === 'education' && (
              <div className="edit-form">
                <div className="form-header">
                  <h2>Edit education</h2>
                </div>
                
                <div className="form-section">
                  {(editedProfile.education || []).map((edu, index) => (
                    <div key={index} className="edit-item">
                      <div className="form-group">
                        <label>School</label>
                        <input
                          type="text"
                          value={edu.institution || ""}
                          onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                          className="form-input"
                          placeholder="Ex: University of Technology"
                        />
                      </div>
                      <div className="form-group">
                        <label>Degree</label>
                        <input
                          type="text"
                          value={edu.degree || ""}
                          onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                          className="form-input"
                          placeholder="Ex: Bachelor of Computer Science"
                        />
                      </div>
                      <div className="form-group">
                        <label>Duration</label>
                        <input
                          type="text"
                          value={edu.duration || ""}
                          onChange={(e) => handleArrayChange('education', index, 'duration', e.target.value)}
                          className="form-input"
                          placeholder="Ex: 2020 - 2024"
                        />
                      </div>
                      <div className="form-group">
                        <label>Activities</label>
                        <textarea
                          value={edu.activities || ""}
                          onChange={(e) => handleArrayChange('education', index, 'activities', e.target.value)}
                          className="form-textarea"
                          rows="3"
                          placeholder="Ex: Student Council, Football Team, Coding Club"
                        />
                      </div>
                      <button 
                        onClick={() => handleRemoveItem('education', index)}
                        className="btn-remove"
                      >
                        Remove Education
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    className="btn-add"
                    onClick={() => handleAddItem('education', {
                      institution: '',
                      degree: '',
                      duration: '',
                      activities: ''
                    })}
                  >
                    + Add Education
                  </button>
                </div>
                
                <div className="form-actions">
                  <button className="btn-save" onClick={handleSaveSection} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button className="btn-cancel" onClick={handleCancelEdit}>Cancel</button>
                </div>
              </div>
            )}

            {activeSection === 'skills' && (
              <div className="edit-form">
                <div className="form-header">
                  <h2>Edit skills</h2>
                </div>
                
                <div className="form-section">
                  <div className="skills-edit">
                    {(editedProfile.skills || []).map((skill, index) => (
                      <div key={index} className="skill-edit-item">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => handleArrayChange('skills', index, null, e.target.value)}
                          className="form-input"
                          placeholder="Enter skill name"
                        />
                        <button 
                          onClick={() => handleRemoveItem('skills', index)}
                          className="btn-remove-small"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    
                    <button 
                      className="btn-add"
                      onClick={() => handleAddItem('skills', '')}
                    >
                      + Add Skill
                    </button>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button className="btn-save" onClick={handleSaveSection} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button className="btn-cancel" onClick={handleCancelEdit}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header/Banner Section */}
      <div className="profile-banner-section">
        <div className="banner-container">
          {profile.banner ? (
            <img src={profile.banner} alt="Banner" className="banner-image" />
          ) : (
            <div className="default-banner"></div>
          )}
          
          <button 
            className="banner-upload-btn"
            onClick={() => bannerInputRef.current?.click()}
          >
            <i className="fas fa-camera"></i>
          </button>
          
          <input
            type="file"
            ref={bannerInputRef}
            onChange={(e) => handleImageUpload(e, 'banner')}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
        
        {/* Profile Info Card */}
        <div className="profile-card">
          <div className="profile-photo-section">
            <div className="profile-photo-container">
              <img
                src={profile.avatar}
                alt="Profile"
                className="profile-photo"
              />
              <button 
                className="avatar-upload-btn"
                onClick={() => avatarInputRef.current?.click()}
              >
                <i className="fas fa-camera"></i>
              </button>
              <input
                type="file"
                ref={avatarInputRef}
                onChange={(e) => handleImageUpload(e, 'avatar')}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
          </div>
          
          <div className="profile-info-main">
            <div className="name-title-section">
              <h1>{profile.name || "Your Name"}</h1>
              <p className="professional-title">{profile.title || "Add your professional headline"}</p>
              <p className="location-info">
                {profile.location || "Add location"} • <a href="#" className="contact-link">Contact info</a>
              </p>
              <p className="connections-info">{profile.connections || "0"} connections</p>
            </div>
            
            <div className="action-buttons">
              <button className="btn-primary">Open to</button>
              <button 
                className="btn-outline" 
                onClick={() => handleSectionEdit('intro')}
              >
                Add profile section
              </button>
              <button className="btn-outline">More</button>
            </div>
          </div>
          
          <div className="message-buttons">
            <button className="btn-message">Message</button>
            <button className="btn-connect">Connect</button>
            <button className="btn-more">⋮</button>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="profile-content">
        {/* Left Column */}
        <div className="left-column">
          {/* About Section */}
          <div className="content-card">
            <div className="card-header">
              <h2>About</h2>
              <button 
                className="edit-icon"
                onClick={() => handleSectionEdit('about')}
              >
                <i className="fas fa-pencil-alt"></i>
              </button>
            </div>
            
            <div className="about-content">
              <p>{profile.bio || "Add information about yourself, your background, and your experience."}</p>
            </div>
          </div>

          {/* Experience Section */}
          <div className="content-card">
            <div className="card-header">
              <h2>Experience</h2>
              <button 
                className="edit-icon"
                onClick={() => handleSectionEdit('experience')}
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
            
            {(profile.experience || []).length > 0 ? (
              profile.experience.map((exp, index) => (
                <div key={index} className="experience-item">
                  <div className="company-logo">
                    <i className="fas fa-briefcase"></i>
                  </div>
                  <div className="experience-details">
                    <h3>{exp.title || "Untitled Position"}</h3>
                    <p className="company-name">{exp.company || "No company specified"}</p>
                    <p className="experience-duration">{exp.duration || "No duration specified"}</p>
                    <p className="experience-location">{exp.location || "No location specified"}</p>
                    <p className="experience-description">{exp.description || "No description provided"}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-content">No experience added yet.</p>
            )}
          </div>

          {/* Education Section */}
          <div className="content-card">
            <div className="card-header">
              <h2>Education</h2>
              <button 
                className="edit-icon"
                onClick={() => handleSectionEdit('education')}
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
            
            {(profile.education || []).length > 0 ? (
              profile.education.map((edu, index) => (
                <div key={index} className="education-item-detailed">
                  <div className="education-logo">
                    <i className="fas fa-university"></i>
                  </div>
                  <div className="education-details">
                    <h3>{edu.institution || "No institution specified"}</h3>
                    <p className="degree">{edu.degree || "No degree specified"}</p>
                    <p className="education-duration">{edu.duration || "No duration specified"}</p>
                    {edu.activities && (
                      <p className="activities">Activities and societies: {edu.activities}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-content">No education added yet.</p>
            )}
          </div>

          {/* Skills Section */}
          <div className="content-card">
            <div className="card-header">
              <h2>Skills</h2>
              <button 
                className="edit-icon"
                onClick={() => handleSectionEdit('skills')}
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
            
            {(profile.skills || []).length > 0 ? (
              <div className="skills-list">
                {profile.skills.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <span className="skill-name">{skill}</span>
                    <div className="endorsements">
                      <span>No endorsements yet</span>
                      <button className="endorse-btn">Endorse</button>
                    </div>
                  </div>
                ))}
                <button className="show-all-btn">Show all →</button>
              </div>
            ) : (
              <p className="no-content">No skills added yet.</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <button 
            className="edit-profile-main-btn"
            onClick={() => handleSectionEdit('intro')}
          >
            <i className="fas fa-pencil-alt"></i>
            Edit profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
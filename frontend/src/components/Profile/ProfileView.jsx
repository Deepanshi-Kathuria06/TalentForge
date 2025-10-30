// src/components/Profile/ProfileView.jsx
import React from "react";
import "./ProfileView.css";

const ProfileView = ({ profile, onEdit }) => {
  return (
    <div className="profile-view">
      <div className="profile-header">
        <img
          src={profile.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
          alt="User"
          className="profile-photo"
        />
        <div>
          <h2>{profile.name || "Your Name"}</h2>
          <p>{profile.role || "Your Role"}</p>
        </div>
        <button className="edit-btn" onClick={onEdit}>
          Edit Profile
        </button>
      </div>

      <div className="profile-section">
        <h3>About</h3>
        <p>{profile.bio || "Add something about yourself..."}</p>
      </div>

      <div className="profile-section">
        <h3>Skills</h3>
        <ul>
          {profile.skills?.length
            ? profile.skills.map((skill, i) => <li key={i}>{skill}</li>)
            : <p>No skills added yet.</p>}
        </ul>
      </div>

      <div className="profile-section">
        <h3>Experience</h3>
        {profile.experience?.length
          ? profile.experience.map((exp, i) => (
              <div key={i} className="exp-item">
                <strong>{exp.title}</strong> — {exp.company} ({exp.years})
              </div>
            ))
          : <p>No experience added yet.</p>}
      </div>

      <div className="profile-section">
        <h3>Projects</h3>
        {profile.projects?.length
          ? profile.projects.map((proj, i) => (
              <div key={i} className="proj-item">
                <strong>{proj.name}</strong>: {proj.description}
              </div>
            ))
          : <p>No projects added yet.</p>}
      </div>
    </div>
  );
};

export default ProfileView;

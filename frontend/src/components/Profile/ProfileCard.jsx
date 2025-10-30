import React from "react";
import "./ProfileView.css";

const ProfileCard = ({ profile }) => {
  return (
    <div className="profile-card">
      <div className="profile-photo">
        <img
          src={profile.profilePhoto || "https://via.placeholder.com/150"}
          alt="Profile"
        />
      </div>
      <h2>{profile.name}</h2>
      <p className="role">{profile.role || "User"}</p>

      <div className="contact-info">
        <p><strong>Email:</strong> {profile.email}</p>
        {profile.contactNumber && <p><strong>Phone:</strong> {profile.contactNumber}</p>}
        {profile.location && <p><strong>Location:</strong> {profile.location}</p>}
      </div>
    </div>
  );
};

export default ProfileCard;

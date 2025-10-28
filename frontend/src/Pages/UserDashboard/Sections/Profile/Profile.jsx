import React, { useEffect, useState } from "react";
import { profileAPI } from "../../../../utils/api";

const Profile = ({ userId }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileAPI.getProfile(userId);
        setProfile(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [userId]);

  return (
    <div className="profile-container">
      {profile ? (
        <div>
          <img src={profile.profilePhoto || "/default.png"} alt="Profile" width="100" />
          <h2>{profile.user.name}</h2>
          <p>{profile.headline}</p>
          <p>{profile.bio}</p>
          <p><b>Skills:</b> {profile.skills.join(", ")}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;

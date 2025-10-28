import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { profileAPI } from "../../utils/api";

const ProfileView = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await profileAPI.getProfileById(id);
      setProfile(res.data);
    };
    fetchProfile();
  }, [id]);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <img src={profile.profilePhoto || "/default.png"} alt="Profile" className="profile-img" />
      <h2>{profile.user.name}</h2>
      <p>{profile.bio}</p>
      <h4>Experience</h4>
      {profile.experience?.map((exp, i) => (
        <p key={i}>{exp.title} at {exp.company}</p>
      ))}
    </div>
  );
};

export default ProfileView;

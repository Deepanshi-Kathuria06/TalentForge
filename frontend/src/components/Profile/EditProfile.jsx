// src/components/Profile/EditProfile.jsx
import React, { useState } from "react";
import "./EditProfile.css";

const EditProfile = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState(profile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="edit-profile">
      <h2>Edit Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Profile Photo</label>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          {formData.avatar && <img src={formData.avatar} alt="preview" className="preview-img" />}
        </div>

        <div className="form-group">
          <label>Name</label>
          <input name="name" value={formData.name || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>About</label>
          <textarea name="bio" value={formData.bio || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Skills (comma separated)</label>
          <input
            name="skills"
            value={formData.skills?.join(", ") || ""}
            onChange={(e) =>
              setFormData({ ...formData, skills: e.target.value.split(",").map((s) => s.trim()) })
            }
          />
        </div>

        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;

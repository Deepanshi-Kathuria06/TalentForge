import React, { useState } from "react";
import "./EditProfileModal.css";

const EditProfileModal = ({ profile, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    headline: profile.headline || "",
    bio: profile.bio || "",
    location: profile.location || "",
    website: profile.website || "",
    skills: profile.skills ? profile.skills.join(", ") : "",
    companyName: profile.companyName || "",
    about: profile.about || "",
    foundedYear: profile.foundedYear || "",
    industry: profile.industry || "",
    companySize: profile.companySize || "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills
            ? formData.skills.split(",").map((s) => s.trim())
            : [],
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update");

      onUpdate(data);
      alert("Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-modal-overlay">
      <div className="edit-profile-modal">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          {/* Common fields */}
          <label>Headline</label>
          <input
            type="text"
            name="headline"
            value={formData.headline}
            onChange={handleChange}
          />

          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
          />

          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />

          <label>Website</label>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
          />

          {/* Conditional fields based on role */}
          {profile.role === "user" ? (
            <>
              <label>Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />

              <label>About</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows="3"
              />

              <label>Founded Year</label>
              <input
                type="number"
                name="foundedYear"
                value={formData.foundedYear}
                onChange={handleChange}
              />

              <label>Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
              />

              <label>Company Size</label>
              <input
                type="text"
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
              />
            </>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;

import React, { useState } from "react";
import '../../../assets/styles/UDashboard/setting.css';

const Settings = () => {
  const [activeSection, setActiveSection] = useState("account");
  const [darkMode, setDarkMode] = useState(false);
  const [autoplayVideos, setAutoplayVideos] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [profilePhotoVisibility, setProfilePhotoVisibility] = useState("all");

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return (
          <div className="settings-content">
            <h2>Account preferences</h2>
            <div className="settings-item">
              <h3>Change password</h3>
              <p>Update your password regularly to keep your account secure</p>
              <button className="settings-button">Change password</button>
            </div>
          </div>
        );
      case "security":
        return (
          <div className="settings-content">
            <h2>Sign in & security</h2>
            <div className="settings-item">
              <h3>Two-step verification</h3>
              <p>Add an extra layer of security to your account</p>
              <button className="settings-button">Set up</button>
            </div>
          </div>
        );
      case "visibility":
        return (
          <div className="settings-content">
            <h2>Visibility</h2>
            <div className="settings-item">
              <h3>Profile viewing options</h3>
              <p>Choose how your profile appears when you view others</p>
              <button className="settings-button">Change</button>
            </div>
          </div>
        );
      case "privacy":
        return (
          <div className="settings-content">
            <h2>Data privacy</h2>
            <div className="settings-item">
              <h3>How we use your data</h3>
              <p>Manage how your data is used for personalization</p>
              <button className="settings-button">Manage</button>
            </div>
          </div>
        );
      case "advertising":
        return (
          <div className="settings-content">
            <h2>Advertising data</h2>
            <div className="settings-item">
              <h3>Ad preferences</h3>
              <p>Control how ads are personalized for you</p>
              <button className="settings-button">Manage preferences</button>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="settings-content">
            <h2>Notifications</h2>
            <div className="settings-item">
              <h3>Email notifications</h3>
              <p>Choose which emails you want to receive</p>
              <button className="settings-button">Manage</button>
            </div>
            <div className="settings-item">
              <h3>Push notifications</h3>
              <p>Control notifications sent to your device</p>
              <button className="settings-button">Manage</button>
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="settings-content">
            <h2>Profile information</h2>
            <div className="settings-item">
              <h3>Name, location, and industry →</h3>
              <p>Edit your basic profile information</p>
            </div>
            <div className="settings-item">
              <h3>Personal demographic information →</h3>
              <p>Share optional demographic information</p>
            </div>
            <div className="settings-item">
              <h3>Verifications →</h3>
              <p>Verify your identity and skills</p>
            </div>
          </div>
        );
      case "display":
        return (
          <div className="settings-content">
            <h2>Display</h2>
            <div className="settings-item toggle-item">
              <div>
                <h3>Dark mode</h3>
                <p>Switch between light and dark themes</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        );
      case "general":
        return (
          <div className="settings-content">
            <h2>General preferences</h2>
            <div className="settings-item">
              <h3>Language →</h3>
              <p>English (United States)</p>
            </div>
            <div className="settings-item">
              <h3>Content language →</h3>
              <p>English, Spanish, French</p>
            </div>
            <div className="settings-item toggle-item">
              <div>
                <h3>Autoplay videos</h3>
                <p>Videos play automatically when they appear on screen</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={autoplayVideos}
                  onChange={() => setAutoplayVideos(!autoplayVideos)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="settings-item toggle-item">
              <div>
                <h3>Sound effects</h3>
                <p>Play sounds for certain actions</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={soundEffects}
                  onChange={() => setSoundEffects(!soundEffects)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="settings-item">
              <h3>Showing profile photos</h3>
              <p>All LinkedIn members</p>
              <button className="settings-button">Change</button>
            </div>
          </div>
        );
      default:
        return <div className="settings-content">Select a settings category</div>;
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <h2>Settings</h2>
        <ul>
          <li
            className={activeSection === "account" ? "active" : ""}
            onClick={() => setActiveSection("account")}
          >
            Account preferences
          </li>
          <li
            className={activeSection === "security" ? "active" : ""}
            onClick={() => setActiveSection("security")}
          >
            Sign in & security
          </li>
          <li
            className={activeSection === "visibility" ? "active" : ""}
            onClick={() => setActiveSection("visibility")}
          >
            Visibility
          </li>
          <li
            className={activeSection === "privacy" ? "active" : ""}
            onClick={() => setActiveSection("privacy")}
          >
            Data privacy
          </li>
          <li
            className={activeSection === "advertising" ? "active" : ""}
            onClick={() => setActiveSection("advertising")}
          >
            Advertising data
          </li>
          <li
            className={activeSection === "notifications" ? "active" : ""}
            onClick={() => setActiveSection("notifications")}
          >
            Notifications
          </li>
          <li className="sidebar-divider"></li>
          <li
            className={activeSection === "profile" ? "active" : ""}
            onClick={() => setActiveSection("profile")}
          >
            Profile information
          </li>
          <li
            className={activeSection === "display" ? "active" : ""}
            onClick={() => setActiveSection("display")}
          >
            Display
          </li>
          <li
            className={activeSection === "general" ? "active" : ""}
            onClick={() => setActiveSection("general")}
          >
            General preferences
          </li>
        </ul>
      </div>
      <div className="settings-main">{renderContent()}</div>
    </div>
  );
};

export default Settings;
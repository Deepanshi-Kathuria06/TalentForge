import React from 'react';
import AboutTab from '../Profile/tabs/AboutTab';
import ExperienceTab from '../Profile/tabs/ExperienceTab';
// import ProjectsTab from './tabs/ProjectsTab';
// import PostsTab from './tabs/PostsTab';
import './ProfileTabs.css';

const ProfileTabs = ({ profile, activeTab, onTabChange, isOwnProfile }) => {
  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'posts', label: 'Posts' },
  ];

  // Add role-specific tabs
  if (profile.role === 'user') {
    tabs.push({ id: 'experience', label: 'Experience' });
    tabs.push({ id: 'projects', label: 'Projects' });
  } else {
    tabs.push({ id: 'internships', label: 'Internships' });
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return <AboutTab profile={profile} isOwnProfile={isOwnProfile} />;
      case 'experience':
        return <ExperienceTab profile={profile} isOwnProfile={isOwnProfile} />;
      case 'projects':
        return <ProjectsTab profile={profile} isOwnProfile={isOwnProfile} />;
      case 'posts':
        return <PostsTab profile={profile} />;
      case 'internships':
        return <div className="tab-content">Internships will be shown here</div>;
      default:
        return <AboutTab profile={profile} isOwnProfile={isOwnProfile} />;
    }
  };

  return (
    <div className="profile-tabs">
      <div className="tabs-header">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="tab-content-wrapper">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProfileTabs;
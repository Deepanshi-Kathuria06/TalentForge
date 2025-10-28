import React from 'react';

const ExperienceTab = ({ profile, isOwnProfile }) => {
  const formatDate = (date) => {
    if (!date) return 'Present';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="experience-tab">
      <div className="section-header">
        <h3>Work Experience</h3>
        {isOwnProfile && (
          <button className="btn btn-outline">Add Experience</button>
        )}
      </div>

      {profile.experience?.length > 0 ? (
        <div className="experience-list">
          {profile.experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="experience-header">
                <h4>{exp.title}</h4>
                <span className="date">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <p className="company">{exp.company}</p>
              {exp.description && (
                <p className="description">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No experience added yet</p>
      )}
    </div>
  );
};

export default ExperienceTab;
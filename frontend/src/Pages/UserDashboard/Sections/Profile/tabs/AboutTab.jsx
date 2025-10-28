import React from 'react';

const AboutTab = ({ profile, isOwnProfile }) => {
  return (
    <div className="about-tab">
      <div className="about-section">
        <h3>Bio</h3>
        <p>{profile.bio || 'No bio provided'}</p>
      </div>

      {profile.role === 'user' ? (
        <>
          <div className="skills-section">
            <h3>Skills</h3>
            <div className="skills-list">
              {profile.skills?.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              )) || <p>No skills added</p>}
            </div>
          </div>

          <div className="social-links">
            <h3>Social Links</h3>
            <div className="links-list">
              {profile.socialLinks?.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
              {profile.socialLinks?.linkedin && (
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
              {profile.socialLinks?.portfolio && (
                <a href={profile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer">
                  Portfolio
                </a>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="company-details">
          <div className="detail-item">
            <strong>Industry:</strong> {profile.industry || 'Not specified'}
          </div>
          <div className="detail-item">
            <strong>Company Size:</strong> {profile.companySize || 'Not specified'}
          </div>
          <div className="detail-item">
            <strong>Website:</strong> 
            {profile.website ? (
              <a href={profile.website} target="_blank" rel="noopener noreferrer">
                {profile.website}
              </a>
            ) : 'Not specified'}
          </div>
          {profile.foundedYear && (
            <div className="detail-item">
              <strong>Founded:</strong> {profile.foundedYear}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AboutTab;
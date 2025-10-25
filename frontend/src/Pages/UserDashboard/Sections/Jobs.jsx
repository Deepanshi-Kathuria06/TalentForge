// components/UserDashboard/Sections/Jobs.jsx
import React, { useState, useEffect } from 'react';


const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    location: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/jobs");
      const jobsData = await response.json();
      
      // Filter for full-time and part-time jobs (non-internships)
      const regularJobs = jobsData.filter(job => 
        job.type !== 'Internship' && job.type !== 'Contract'
      );
      
      setJobs(regularJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      // Add your apply logic here
      alert(`Applied to job successfully!`);
    } catch (error) {
      console.error('Error applying to job:', error);
      alert('Failed to apply to job');
    }
  };

  const filteredJobs = jobs.filter(job => {
    return (
      (filters.type === '' || job.type === filters.type) &&
      (filters.category === '' || job.category === filters.category) &&
      (filters.location === '' || job.location.toLowerCase().includes(filters.location.toLowerCase()))
    );
  });

  if (loading) {
    return <div className="loading">Loading jobs...</div>;
  }

  return (
    <div className="jobs-section">
      <div className="section-header">
        <h2>Job Opportunities</h2>
        <p>Find your perfect full-time or part-time position</p>
      </div>

      {/* Filters */}
      <div className="filters">
        <select 
          value={filters.type} 
          onChange={(e) => setFilters({...filters, type: e.target.value})}
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Remote">Remote</option>
        </select>

        <select 
          value={filters.category} 
          onChange={(e) => setFilters({...filters, category: e.target.value})}
        >
          <option value="">All Categories</option>
          <option value="Engineering">Engineering</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
          <option value="Business">Business</option>
        </select>

        <input
          type="text"
          placeholder="Filter by location..."
          value={filters.location}
          onChange={(e) => setFilters({...filters, location: e.target.value})}
        />
      </div>

      {/* Jobs Grid */}
      <div className="jobs-grid">
        {filteredJobs.length === 0 ? (
          <div className="no-jobs">
            <p>No jobs found matching your criteria.</p>
          </div>
        ) : (
          filteredJobs.map(job => (
            <div key={job._id} className="job-card">
              <div className="job-header">
                <h3>{job.title}</h3>
                <span className="company">{job.companyName}</span>
              </div>
              
              <div className="job-details">
                <p><i className="fas fa-map-marker-alt"></i> {job.location}</p>
                <p><i className="fas fa-briefcase"></i> {job.type}</p>
                <p><i className="fas fa-dollar-sign"></i> {job.salaryRange || 'Salary not specified'}</p>
                {job.category && <p><i className="fas fa-tag"></i> {job.category}</p>}
                
                <div className="job-description">
                  {job.description.substring(0, 150)}...
                </div>
                
                {job.skills && (
                  <div className="job-skills">
                    <strong>Skills:</strong> {job.skills}
                  </div>
                )}
              </div>
              
              <div className="job-actions">
                <button 
                  className="apply-btn"
                  onClick={() => handleApply(job._id)}
                >
                  Apply Now
                </button>
                <button className="save-btn">
                  <i className="far fa-bookmark"></i> Save
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Jobs;
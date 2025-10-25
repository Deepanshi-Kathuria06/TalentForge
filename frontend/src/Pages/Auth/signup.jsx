import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../Pages/Auth/signup.css";
import { useAuth } from '../Auth/AuthContext';

const SignupPage = () => {
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    university: '',
    major: '',
    graduationYear: '',
    industry: '',
    companySize: '',
    website: ''
  });
  
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

// Updated Signup.jsx - handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const userData = {
    userType,
    name: formData.name, // Make sure this is included
    email: formData.email,
    password: formData.password,
    ...(userType === 'student' ? {
      university: formData.university,
      major: formData.major,
      graduationYear: formData.graduationYear
    } : {
      industry: formData.industry,
      companySize: formData.companySize,
      website: formData.website
    }),
    joinedDate: new Date().toISOString()
  };

  console.log("📤 Sending signup data:", userData);

  try {
    const res = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const result = await res.json();
    console.log("🔐 Signup API Response:", result);

    if (result.user) {
      console.log("✅ User data from signup:", result.user);
      
      // Ensure all required fields are present
      const completeUser = {
        ...result.user,
        name: result.user.name || formData.name, // Fallback to form data
        userType: result.user.userType || userType
      };
      
      console.log("✅ Complete user data for context:", completeUser);
      
      // Save session
      login(completeUser);

      // Redirect with small delay
      setTimeout(() => {
        if (userType === "student") navigate("/UDashboard");
        else navigate("/CompanyDashboard");
      }, 100);

    } else {
      console.error("❌ Signup failed:", result.error);
      alert(result.error || "Signup failed - please try again");
    }
  } catch (err) {
    console.error("❌ Signup network error:", err);
    alert("Signup failed - please check your connection");
  }
};
  // Custom SVG Icons
  const StudentIcon = () => (
    <svg className="signup-tab-icon" viewBox="0 0 24 24">
      <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
      <path d="M12 15c1.93 0 3.5-1.57 3.5-3.5S13.93 8 12 8 8.5 9.57 8.5 11.5 10.07 15 12 15z" opacity="0.3"/>
    </svg>
  );

  const CompanyIcon = () => (
    <svg className="signup-tab-icon" viewBox="0 0 24 24">
      <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
    </svg>
  );

  return (
    <div className="signup-page-container">
      <div className="signup-page-background">
        <div className="signup-page-pattern"></div>
        <div className="signup-page-decoration">
          <div className="decor-leaf decor-leaf-1"></div>
          <div className="decor-leaf decor-leaf-2"></div>
        </div>
      </div>

      <div className="signup-page-card">
        <div className="signup-page-header">
          <div className="signup-logo-container">
            <svg className="signup-logo-icon" viewBox="0 0 24 24">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
            </svg>
            <h1>Join <span className="signup-page-logo">TalentForge</span></h1>
          </div>
          <p className="signup-page-subtitle">Grow your professional journey sustainably</p>
        </div>

        <div className="signup-page-tabs">
          <div className="signup-page-tab-group">
            <button 
              className={`signup-page-tab ${userType === 'student' ? 'signup-page-tab-active' : ''}`}
              onClick={() => setUserType('student')}
            >
              <StudentIcon />
              <span>Student</span>
              {userType === 'student' && <div className="tab-indicator"></div>}
            </button>

            <button 
              className={`signup-page-tab ${userType === 'company' ? 'signup-page-tab-active' : ''}`}
              onClick={() => setUserType('company')}
            >
              <CompanyIcon />
              <span>Company</span>
              {userType === 'company' && <div className="tab-indicator"></div>}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="signup-page-form">
          <div className="signup-page-form-grid">
            <div className="signup-page-form-group">
              <label htmlFor="signup-name">
                {userType === 'student' ? 'Full Name' : 'Contact Person'}
              </label>
              <div className="input-container">
                <input 
                  type="text" 
                  id="signup-name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                  placeholder={userType === 'company' ? "HR/Recruiter name" : "Your full name"}
                  className="signup-input"
                />
              </div>
            </div>

            <div className="signup-page-form-group">
              <label htmlFor="signup-email">Email</label>
              <div className="input-container">
                <input 
                  type="email" 
                  id="signup-email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                  placeholder="your@email.com"
                  className="signup-input"
                />
              </div>
            </div>

            <div className="signup-page-form-group">
              <label htmlFor="signup-password">Password</label>
              <div className="input-container">
                <input 
                  type="password" 
                  id="signup-password" 
                  name="password" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                  minLength="8"
                  placeholder="At least 8 characters"
                  className="signup-input"
                />
              </div>
            </div>

            {userType === 'student' && (
              <>
                <div className="signup-page-form-group">
                  <label htmlFor="signup-university">University</label>
                  <div className="input-container">
                    <input 
                      type="text" 
                      id="signup-university" 
                      name="university" 
                      value={formData.university}
                      onChange={handleChange}
                      required 
                      placeholder="Your university"
                      className="signup-input"
                    />
                  </div>
                </div>

                <div className="signup-page-form-group">
                  <label htmlFor="signup-major">Major</label>
                  <div className="input-container">
                    <input 
                      type="text" 
                      id="signup-major" 
                      name="major" 
                      value={formData.major}
                      onChange={handleChange}
                      required 
                      placeholder="Your field of study"
                      className="signup-input"
                    />
                  </div>
                </div>

                <div className="signup-page-form-group">
                  <label htmlFor="signup-graduationYear">Graduation Year</label>
                  <div className="input-container">
                    <select 
                      id="signup-graduationYear" 
                      name="graduationYear" 
                      value={formData.graduationYear}
                      onChange={handleChange}
                      required
                      className="signup-input"
                    >
                      <option value="">Select Year</option>
                      {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {userType === 'company' && (
              <>
                <div className="signup-page-form-group">
                  <label htmlFor="signup-industry">Industry</label>
                  <div className="input-container">
                    <input 
                      type="text" 
                      id="signup-industry" 
                      name="industry" 
                      value={formData.industry}
                      onChange={handleChange}
                      required 
                      placeholder="e.g. Technology, Finance"
                      className="signup-input"
                    />
                  </div>
                </div>

                <div className="signup-page-form-group">
                  <label htmlFor="signup-companySize">Company Size</label>
                  <div className="input-container">
                    <select 
                      id="signup-companySize" 
                      name="companySize" 
                      value={formData.companySize}
                      onChange={handleChange}
                      required
                      className="signup-input"
                    >
                      <option value="">Select Size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                </div>

                <div className="signup-page-form-group">
                  <label htmlFor="signup-website">Website</label>
                  <div className="input-container">
                    <input 
                      type="url" 
                      id="signup-website" 
                      name="website" 
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://yourcompany.com"
                      className="signup-input"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <button type="submit" className="signup-page-submit-button">
            Create {userType === 'student' ? 'Student' : 'Company'} Account
            <svg className="signup-page-button-icon" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

          <div className="signup-page-login-prompt">
            Already have an account? <a href="/Login" className="signup-page-login-link"
            onClick={() => console.log('Redirect to login')}>
            Log in</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../../Pages/Auth/login.css";

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // If you have an AuthContext, use it like this:
  // const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Simple login function if you don't have context
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    // You can also set user in state or context here
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      }),
    });

    const result = await res.json();
    console.log("Login response:", result); // Check this log

    if (res.ok && result.user) {
      // ✅ Make sure we have the user object with name
      if (!result.user.name) {
        console.error('User name missing in response:', result);
      }
      
      // ✅ Pass the complete user object to login function
      login(result.user);
      
      // Redirect based on userType
      if (result.user.userType === "student") {
        navigate("/UDashboard");
      } else if (result.user.userType === "company") {
        navigate("/CompanyDashboard");
      } else {
        navigate("/");
      }
    } else {
      alert(result.error || "Invalid login credentials");
    }

  } catch (err) {
    console.error("❌ Login error:", err);
    alert("Login failed - check console for details");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-page-container">
      <div className="login-page-background">
        <div className="login-page-pattern"></div>
        <div className="login-page-decoration">
          <div className="decor-leaf decor-leaf-1"></div>
          <div className="decor-leaf decor-leaf-2"></div>
        </div>
      </div>

      <div className="login-page-card">
        <div className="login-page-header">
          <div className="login-logo-container">
            <svg className="login-logo-icon" viewBox="0 0 24 24">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
            </svg>
            <h1>Welcome Back <span className="login-page-logo">
                <br></br>
                Talent Forge</span></h1>
          </div>
          <p className="login-page-subtitle">Sign in to continue your professional journey</p>
        </div>

        <form onSubmit={handleSubmit} className="login-page-form">
          <div className="login-page-form-group">
            <label htmlFor="login-email">Email</label>
            <div className="input-container">
              <input
                type="email"
                id="login-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className="login-input"
                disabled={loading}
              />
            </div>
          </div>

          <div className="login-page-form-group">
            <label htmlFor="login-password">Password</label>
            <div className="input-container">
              <input
                type="password"
                id="login-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="login-input"
                disabled={loading}
              />
            </div>
          </div>

          <div className="login-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember-me"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="remember-me-checkbox"
                disabled={loading}
              />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="login-page-submit-button"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
            <svg className="login-page-button-icon" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

          <div className="login-page-signup-prompt">
            Don't have an account? <Link to="/signup" className="login-page-signup-link">
              Sign up
            </Link>
          </div>

          <div className="login-divider">
            <span className="divider-line"></span>
            <span className="divider-text">or continue with</span>
            <span className="divider-line"></span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
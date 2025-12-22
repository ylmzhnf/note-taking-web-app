import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "../../styles/auth.css";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register, google } = useContext(AuthContext);
  const navigate = useNavigate();

  const googleSuccess = async (response) => {
    try {
      await google(response.credential);
      navigate("/");
    } catch (error) {
      setError("Google login failed. Please try again.");
    }
  };

  const googleFailure = () => {
    setError("Google login was interrupted or failed. Please try again.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (formData.password.length < 8) {
      return setError("Password must be at least 8 characters.");
    }
    try {
      await register(formData.username, formData.email, formData.password);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "An error occurred during registration.";
      setError(
        typeof msg === "string" ? msg : "An error occurred during registration."
      );
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/assets/images/logo.svg" alt="Notes Logo" />
        </div>

        <div className="auth-header">
          <h1>Create Your Account</h1>
          <p>Sign up to start organizing your notes and boost your productivity.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {err && <div className="error-message">{err}</div>}
          {success && <div className="success-message" style={{ color: 'green', fontSize: '0.875rem' }}>{success}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="email@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  src={`/assets/images/icon-${showPassword ? 'hide' : 'show'}-password.svg`}
                  alt="toggle password visibility"
                />
              </button>
            </div>
            <div className="helper-text">
              <img src="/assets/images/icon-info.svg" alt="info" />
              <span>At least 8 characters</span>
            </div>
          </div>

          <button type="submit" className="auth-btn">Sign Up</button>
        </form>

        <div className="auth-divider">Or sign up with:</div>

        <div className="google-auth-container">
          <GoogleLogin
            onSuccess={googleSuccess}
            onError={googleFailure}
            useOneTap
            width="100%"
          />
        </div>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

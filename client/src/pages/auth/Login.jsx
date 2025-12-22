import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import "../../styles/auth.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [err, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, google } = useContext(AuthContext);
  const navigate = useNavigate();

  const googleSuccess = async (response) => {
    try {
      await google(response.credential);
      navigate("/");
    } catch (error) {
      setError("Google login failed. Please try again.");
    }
  }

  const googleFailure = () => {
    setError("Google login was interrupted or failed. Please try again.")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (error) {
      setError("Login failed. Please check your credentials.")
    }
  }

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
          <h1>Welcome to Note</h1>
          <p>Please log in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {err && <div className="error-message">{err}</div>}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="email@example.com"
              onChange={handleChange}
              value={formData.email}
              required
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <Link to="/password-forgot" className="forgot-link">Forgot</Link>
            </div>
            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                onChange={handleChange}
                value={formData.password}
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
          </div>

          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>

        <div className="auth-divider">Or log in with:</div>

        <div className="google-auth-container">
          <GoogleLogin
            onSuccess={googleSuccess}
            onError={googleFailure}
            useOneTap
            width="100%"
          />
        </div>

        <p className="auth-footer">
          No account yet? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

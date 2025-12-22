import React, { useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/auth.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState("");
  const [err, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { passwordReset, loading } = useContext(AuthContext);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) {
    return (
      <div className="auth-page-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h2 style={{ color: '#DC2626' }}>Error</h2>
            <p>Password reset link is invalid or expired.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (formData.newPassword.length < 8) {
      return setError("Password must be at least 8 characters.");
    }
    if (formData.newPassword !== formData.confirmPassword) {
      return setError("New passwords do not match.");
    }
    try {
      const response = await passwordReset(email, token, formData.newPassword);
      setSuccess(
        response.message ||
        "Password has been successfully reset! Redirecting to login..."
      );
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      console.error("Password reset error:", error);
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to reset password. Please ensure the link is correct and try again.";

      setError(
        typeof msg === "string"
          ? msg
          : "An unexpected error occurred. Please try again."
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
          <h1>Reset Your Password</h1>
          <p>Choose a new password to secure your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {err && <div className="error-message">{err}</div>}
          {success && <div className="success-message" style={{ color: 'green', fontSize: '0.875rem' }}>{success}</div>}

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="input-container">
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                name="newPassword"
                value={formData.newPassword}
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="input-container">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                onChange={handleChange}
                name="confirmPassword"
                value={formData.confirmPassword}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <img
                  src={`/assets/images/icon-${showConfirmPassword ? 'hide' : 'show'}-password.svg`}
                  alt="toggle password visibility"
                />
              </button>
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;

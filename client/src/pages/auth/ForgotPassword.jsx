import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "../../styles/auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [err, setError] = useState("");

  const { passwordForgot, loading } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await passwordForgot(email);
      setMessage(
        response.message ||
        "A password reset link has been sent to your email address. Please check your inbox."
      );
    } catch (error) {
      console.error("Password reset error:", error);
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to send reset link. Please check the email address.";

      setError(
        typeof msg === "string"
          ? msg
          : "An unexpected error occurred during password reset."
      );
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/assets/images/logo.svg" alt="Notes Logo" />
        </div>

        <div className="auth-header">
          <h1>Forgotten your password?</h1>
          <p>Enter your email below, and we'll send you a link to reset it.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {err && <div className="error-message">{err}</div>}
          {message && <div className="success-message" style={{ color: 'green', fontSize: '0.875rem' }}>{message}</div>}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="email@example.com"
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;

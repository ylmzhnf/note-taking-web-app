import React, { useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState("");
  const [err, setError] = useState("");

  const { passwordReset, loading } = useContext(AuthContext);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) {
    return (
      <div className="auth-container">
        <h2>Error</h2>
        <p>Error: "Password reset link is invalid or expired."</p>
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
    <div className="auth-container">
      <div className="auth-header">
        <h1>Reset Your Password</h1>
        <p>Choose a new password to secure your account.</p>
      </div>
      <form onSubmit={handleSubmit}>
        {err && <p style={{ color: "red" }}>{err}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <label htmlFor="newPassword">New Password:</label>
        <input
          id="newPassword"
          type="password"
          onChange={handleChange}
          name="newPassword"
          value={formData.newPassword}
          required
        />
        <p>At least 8 characters</p>

        <label htmlFor="confirmPassword">Confirm New Password:</label>
        <input
          id="confirmPassword"
          type="password"
          onChange={handleChange}
          name="confirmPassword"
          value={formData.confirmPassword}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;

import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { Link } from "react-router-dom";

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
    <div className="auth-container">
      <div>
        <h1>Forgotten your password?</h1>
        <p>Enter your email below, and we'll send you a link to reset it.</p>
      </div>
      <form onSubmit={handleSubmit}>
        {err && <p style={{ color: "red" }}>{err}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
        <label htmlFor="email">Email Address:</label>
        <input
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
          placeholder="email@example.com"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        <Link to="/login">Back to Login</Link>
      </form>
    </div>
  );
}

export default ForgotPassword;

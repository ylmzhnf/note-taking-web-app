import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (formData.password.length < 8) {
      return setError("Password must be at least 8 characters.");
    }
    try {
      await register(formData.username, formData.email, formData.password);
      setSuccess("Registration successful! You can now login.");
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
    <div className="auth-container">
      <div className="auth-header">
        <h1>Create Your Account</h1>
        <p>
          Sign up to start organizing your notes and boost your productivity.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        {err && <p style={{ color: "red" }}>{err}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <label htmlFor="email">Email Address:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="email@example.com"
        />
        <label htmlFor="password">Create Your Account</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <p>At least 8 characters</p>
        <button type="submit">Sign Up</button>
      </form>

      <form onSubmit={handleSubmit}>
        <p>Or log in with:</p>
        <button type="submit">Google</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;

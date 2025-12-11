import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';


function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [err, setError] = useState("");

  const { login , google} = useContext(AuthContext);
  const navigate = useNavigate();

  const googleSuccess=async (response)=> {
    // response.credential, Google tarafından verilen kimlik token'ıdır (id_token)
    try {
      await google(response.credential);
      navigate("/");
    } catch (error) {
      setError("Google login failed. Please try again.");
    }
  }

  const googleFailure= () => {
    setError("Google login was interruted or failed. Please try again.")
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
    <>
      <div className="auth-container">
        <div className="auth-header">
          <h1>Welcome to Note</h1>
          <p>Please log in to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <p>{err}</p>
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="email@example.com"
            onChange={handleChange}
            value={formData.email}
            required
          />

          <label htmlFor="password">Password:</label>
          <span>
            <Link to="/password-forgot">Forgot</Link>
          </span>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            value={formData.password}
            required
          />

          <button type="submit" className="auth-button">
            Login
          </button>
        </form>
        <div className="google-auth-container" onSubmit={handleSubmit}>
          <p>Or log in with:</p>
          <GoogleLogin
            onSuccess={googleSuccess}
            onError={googleFailure}
            useOneTap
          />
        </div>

        <p>
          No account yet? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </>
  );
}

export default Login;

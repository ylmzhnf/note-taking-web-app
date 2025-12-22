import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function ThemeApplier({ children }) {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      document.documentElement.setAttribute('data-theme', user.appTheme || 'light');
      document.documentElement.setAttribute('data-font', user.appFont || 'sans-serif');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.setAttribute('data-font', 'sans-serif');
    }
  }, [user]);

  return children;
}

import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <ToastProvider>
          <ThemeApplier>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/password-forgot" element={<ForgotPassword />} />
                <Route path="/password-reset" element={<ResetPassword />} />

                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </Router>
          </ThemeApplier>
        </ToastProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

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

function OAuthProvider({ children }) {
  if (!googleClientId) return children;
  return <GoogleOAuthProvider clientId={googleClientId}>{children}</GoogleOAuthProvider>;
}

function ThemeApplier({ children }) {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const selectedTheme = user?.appTheme || 'light';
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      const theme = selectedTheme === 'system'
        ? (mediaQuery.matches ? 'dark' : 'light')
        : selectedTheme;
      document.documentElement.setAttribute('data-theme', theme);
    };

    applyTheme();
    document.documentElement.setAttribute('data-font', user?.appFont || 'sans-serif');
    mediaQuery.addEventListener('change', applyTheme);
    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [user]);

  return children;
}

import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <OAuthProvider>
      <AuthProvider>
        <ToastProvider>
          <ThemeApplier>
            <Router>
              <Routes>
                <Route path="/login" element={<Login googleEnabled={Boolean(googleClientId)} />} />
                <Route path="/register" element={<Register googleEnabled={Boolean(googleClientId)} />} />
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
    </OAuthProvider>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./component/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./component/pages/Dashboard";
import Login from "./component/pages/Login";
import Register from "./component/pages/Register";
import ForgotPassword from "./component/pages/ForgotPassword";
import ResetPassword from "./component/pages/ResetPassword";
import { GoogleOAuthProvider } from '@react-oauth/google';


const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
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
      </AuthProvider>
    </GoogleOAuthProvider>  
  );
}

export default App;

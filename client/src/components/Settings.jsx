import React, { useState, useContext, useEffect } from "react";
import apiClient from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/components/settings.css";
import { useToast } from "../context/ToastContext";

const Settings = () => {
  const { user, logout, refreshUser } = useContext(AuthContext);
  const { addToast } = useToast();

  // Desktop: default to "theme", Mobile: default to "main" (list view)
  const isDesktop = window.innerWidth > 768; // Initial check
  const [subview, setSubview] = useState(isDesktop ? "theme" : "main");
  const [activeItem, setActiveItem] = useState("theme"); // Tracks active selection sidebar

  const [message, setMessage] = useState({ type: "", text: "" });

  // Preferences State
  const [theme, setTheme] = useState(user?.appTheme || "light");
  const [font, setFont] = useState(user?.appFont || "sans-serif");

  // Update logic to handle resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && subview === "main") {
        setSubview("theme");
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [subview]);

  useEffect(() => {
    if (user?.appTheme) setTheme(user.appTheme);
    if (user?.appFont) setFont(user.appFont);
  }, [user]);

  // Password State
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPass, setShowPass] = useState({ old: false, next: false, confirm: false });

  const handleApplyTheme = async (type, value) => {
    try {
      await apiClient.patch("/settings/theme", {
        appTheme: type === "theme" ? value : theme,
        appFont: type === "font" ? value : font
      });
      await refreshUser();
      addToast("Settings updated successfully!");
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update preferences." });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return setMessage({ type: "error", text: "Passwords do not match!" });
    }
    try {
      await apiClient.patch("/settings/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      addToast("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update." });
    }
  };

  const handleNavClick = (view) => {
    setSubview(view);
    setActiveItem(view);
  };

  const MobileBreadcrumb = () => (
    <button className="settings-breadcrumb" onClick={() => setSubview("main")}>
      <img src="/assets/images/icon-arrow-left.svg" alt="back" />
      <span>Settings</span>
    </button>
  );

  // Content Components
  const ThemeSettings = () => (
    <>
      <div className="mobile-only">{<MobileBreadcrumb />}</div>
      <h1 className="sub-view-title">Color Theme</h1>
      <p className="sub-view-desc">Choose your color theme:</p>

      <div className="selection-cards">
        {[
          { id: "light", label: "Light Mode", desc: "Pick a clean and classic light theme", icon: "icon-sun.svg" },
          { id: "dark", label: "Dark Mode", desc: "Select a sleek and modern dark theme", icon: "icon-moon.svg" },
          { id: "system", label: "System", desc: "Adapts to your device's theme", icon: "icon-system-theme.svg" }
        ].map(item => (
          <div key={item.id} className={`selection-card ${theme === item.id ? 'active' : ''}`} onClick={() => setTheme(item.id)}>
            <div className="card-left">
              <div className="card-icon-circle">
                <img src={`/assets/images/${item.icon}`} alt={item.id} />
              </div>
              <div className="card-info">
                <span className="card-label">{item.label}</span>
                <span className="card-desc">{item.desc}</span>
              </div>
            </div>
            <div className={`radio-dot ${theme === item.id ? 'selected' : ''}`}></div>
          </div>
        ))}
      </div>
      <button className="apply-btn" onClick={() => handleApplyTheme("theme", theme)}>Apply Changes</button>
    </>
  );

  const FontSettings = () => (
    <>
      <div className="mobile-only">{<MobileBreadcrumb />}</div>
      <h1 className="sub-view-title">Font Theme</h1>
      <p className="sub-view-desc">Choose your font theme:</p>

      <div className="selection-cards">
        {[
          { id: "sans-serif", label: "Sans-serif", desc: "Clean and modern, easy to read." },
          { id: "serif", label: "Serif", desc: "Classic and elegant for a timeless feel." },
          { id: "monospace", label: "Monospace", desc: "Code-like, great for a technical vibe." }
        ].map(item => (
          <div key={item.id} className={`selection-card ${font === item.id ? 'active' : ''}`} onClick={() => setFont(item.id)}>
            <div className="card-left">
              <div className="card-icon-circle">
                <span className="font-aa">Aa</span>
              </div>
              <div className="card-info">
                <span className="card-label">{item.label}</span>
                <span className="card-desc">{item.desc}</span>
              </div>
            </div>
            <div className={`radio-dot ${font === item.id ? 'selected' : ''}`}></div>
          </div>
        ))}
      </div>
      <button className="apply-btn" onClick={() => handleApplyTheme("font", font)}>Apply Changes</button>
    </>
  );

  const PasswordSettings = () => (
    <>
      <div className="mobile-only">{<MobileBreadcrumb />}</div>
      <h1 className="sub-view-title">Change Password</h1>
      <form className="password-form" onSubmit={handlePasswordSubmit}>
        <div className="form-group">
          <label>Old Password</label>
          <div className="input-with-icon">
            <input
              type={showPass.old ? "text" : "password"}
              value={passwords.currentPassword}
              onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
              required
            />
            <button type="button" onClick={() => setShowPass({ ...showPass, old: !showPass.old })}>
              <img src={`/assets/images/icon-${showPass.old ? 'hide' : 'show'}-password.svg`} alt="eye" />
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>New Password</label>
          <div className="input-with-icon">
            <input
              type={showPass.next ? "text" : "password"}
              value={passwords.newPassword}
              onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
              required
            />
            <button type="button" onClick={() => setShowPass({ ...showPass, next: !showPass.next })}>
              <img src={`/assets/images/icon-${showPass.next ? 'hide' : 'show'}-password.svg`} alt="eye" />
            </button>
          </div>
          <div className="field-hint">
            <img src="/assets/images/icon-info.svg" alt="info" />
            <span>At least 8 characters</span>
          </div>
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <div className="input-with-icon">
            <input
              type={showPass.confirm ? "text" : "password"}
              value={passwords.confirmPassword}
              onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              required
            />
            <button type="button" onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}>
              <img src={`/assets/images/icon-${showPass.confirm ? 'hide' : 'show'}-password.svg`} alt="eye" />
            </button>
          </div>
        </div>

        {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}
        <button type="submit" className="save-password-btn">Save Password</button>
      </form>
    </>
  );

  return (
    <div className="settings-page-wrapper">
      {/* SIDEBAR: Visible on Desktop always, Mobile only when in 'main' view */}
      <div className={`settings-sidebar ${subview !== "main" ? "hidden-mobile" : ""}`}>
        <h1 className="settings-header-title">Settings</h1>
        <div className="settings-nav-list">
          <button
            className={`settings-nav-item ${activeItem === "theme" ? "active" : ""}`}
            onClick={() => handleNavClick("theme")}
          >
            <div className="item-left">
              <img src="/assets/images/icon-sun.svg" alt="theme" />
              <span>Color Theme</span>
            </div>
            {activeItem === "theme" && <img src="/assets/images/icon-chevron-right.svg" alt="active" className="active-chevron" />}
            {/* Mobile only arrow */}
            <img src="/assets/images/icon-chevron-right.svg" alt="arrow" className="mobile-arrow" />
          </button>

          <button
            className={`settings-nav-item ${activeItem === "font" ? "active" : ""}`}
            onClick={() => handleNavClick("font")}
          >
            <div className="item-left">
              <img src="/assets/images/icon-font.svg" alt="font" />
              <span>Font Theme</span>
            </div>
            {activeItem === "font" && <img src="/assets/images/icon-chevron-right.svg" alt="active" className="active-chevron" />}
            <img src="/assets/images/icon-chevron-right.svg" alt="arrow" className="mobile-arrow" />
          </button>

          <button
            className={`settings-nav-item ${activeItem === "password" ? "active" : ""}`}
            onClick={() => handleNavClick("password")}
          >
            <div className="item-left">
              <img src="/assets/images/icon-lock.svg" alt="password" />
              <span>Change Password</span>
            </div>
            {activeItem === "password" && <img src="/assets/images/icon-chevron-right.svg" alt="active" className="active-chevron" />}
            <img src="/assets/images/icon-chevron-right.svg" alt="arrow" className="mobile-arrow" />
          </button>

          <div className="settings-divider"></div>

          <button className="settings-nav-item logout" onClick={logout}>
            <div className="item-left">
              <img src="/assets/images/icon-logout.svg" alt="logout" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>

      {/* CONTENT PANEL: Visible on Desktop always (shows activeItem), Mobile only if subview != 'main' */}
      <div className={`settings-content-panel ${subview === "main" ? "hidden-mobile" : ""}`}>
        {subview === "theme" && <ThemeSettings />}
        {subview === "font" && <FontSettings />}
        {subview === "password" && <PasswordSettings />}
      </div>
    </div>
  );
};

export default Settings;

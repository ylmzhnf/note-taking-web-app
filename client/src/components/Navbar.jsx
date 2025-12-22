import React from "react";
import "../styles/components/navbar.css";

function Navbar({ setView, activeView, tags = [] }) {
  const mainNavItems = [
    { id: "all", label: "All Notes", icon: "icon-home.svg" },
    { id: "archived", label: "Archived Notes", icon: "icon-archive.svg" },
  ];

  const bottomNavItems = [
    { id: "all", label: "Home", icon: "icon-home.svg" },
    { id: "search", label: "Search", icon: "icon-search.svg" },
    { id: "archived", label: "Archived", icon: "icon-archive.svg" },
    { id: "tags", label: "Tags", icon: "icon-tag.svg" },
    { id: "settings", label: "Settings", icon: "icon-settings.svg" },
  ];

  return (
    <div className="navbar-container">
      <div className="navbar-logo">
        <img src="/assets/images/logo.svg" alt="Notes Logo" />
      </div>

      {/* Desktop Main Nav */}
      <nav className="main-nav-desktop">
        {mainNavItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item-desktop ${activeView === item.id ? "active" : ""}`}
            onClick={() => setView(item.id)}
          >
            <div className="nav-item-left">
              <img src={`/assets/images/${item.icon}`} alt={`${item.label} icon`} />
              <span className="nav-label">{item.label}</span>
            </div>
            {activeView === item.id && (
              <img src="/assets/images/icon-chevron-right.svg" alt="chevron" className="active-chevron" />
            )}
          </button>
        ))}
      </nav>

      {/* Mobile/Tablet Bottom Nav - Icon-only as per Image 1, 2, 3, 4 */}
      <nav className="mobile-bottom-nav">
        {bottomNavItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item-mobile ${activeView === item.id ? "active" : ""}`}
            onClick={() => setView(item.id)}
          >
            <img src={`/assets/images/${item.icon}`} alt={`${item.label} icon`} />
            <span className="mobile-only-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="tags-section">
        <h3 className="tags-title">Tags</h3>
        <div className="tags-list">
          {tags.map((tag) => (
            <button
              key={tag.id || tag}
              className={`nav-item-desktop ${activeView === `tag-${tag.name || tag}` ? "active" : ""}`}
              onClick={() => setView(`tag-${tag.name || tag}`)}
            >
              <div className="nav-item-left">
                <img src="/assets/images/icon-tag.svg" alt="tag icon" />
                <span className="nav-label">{tag.name || tag}</span>
              </div>
              {activeView === `tag-${tag.name || tag}` && (
                <img src="/assets/images/icon-chevron-right.svg" alt="chevron" className="active-chevron" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
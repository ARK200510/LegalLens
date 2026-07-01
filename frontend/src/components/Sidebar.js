import React from "react";

/* ── Icons ── */
function UploadIcon() {
  return (
    <svg className="nav-btn-icon" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}

function ResultsIcon() {
  return (
    <svg className="nav-btn-icon" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18M9 21V9"/>
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg className="nav-btn-icon" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function BotIcon() {
  return (
    <svg className="nav-btn-icon" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2"/>
      <circle cx="12" cy="5" r="2"/>
      <path d="M12 7v4M8 15h.01M16 15h.01"/>
    </svg>
  );
}

/* 🔥 UPDATED NAV ITEMS (Assistant ENABLED) */
const NAV_ITEMS = [
  { id: "upload",    label: "Upload",    icon: <UploadIcon /> },
  { id: "results",   label: "Results",   icon: <ResultsIcon /> },
  { id: "history",   label: "History",   icon: <HistoryIcon /> },
  { id: "assistant", label: "Assistant", icon: <BotIcon />, badge: "AI ✦" }
];

function Sidebar({ active, setActive }) {

  // 🔥 GET USER FROM LOCALSTORAGE
  const user = localStorage.getItem("user");

  // 🔥 INITIAL LETTER
  const initials = user ? user[0].toUpperCase() : "U";

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-title">
          Legal<span>Lens</span>
        </div>
        <div className="sidebar-logo-sub">Document Intelligence</div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={[
              "nav-btn",
              active === item.id ? "active" : ""
            ].join(" ")}
            onClick={() => setActive(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>

            {item.badge && (
              <span className="nav-btn-badge">{item.badge}</span>
            )}
          </button>
        ))}
      </nav>

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div>
            <div className="sidebar-user-name">
              {user || "User"}
            </div>
            <div className="sidebar-user-role">Verified User</div>
          </div>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;
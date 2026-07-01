import React from "react";

function LogOutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

function Header({ onLogout }) {
  return (
    <header className="header">
      <div className="header-left">
        <div>
          <h1>Legal Document Analyzer</h1>
          <p>AI-powered legal classification, summarization &amp; translation</p>
        </div>
      </div>
      <button className="logout-btn" onClick={onLogout}>
        <LogOutIcon />
        Sign Out
      </button>
    </header>
  );
}

export default Header;
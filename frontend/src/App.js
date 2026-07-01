import React, { useState } from "react";
import "./App.css";

import Auth           from "./Auth";
import Sidebar        from "./components/Sidebar";
import Header         from "./components/Header";
import UploadSection  from "./components/UploadSection";
import Results        from "./components/Results";
import HistorySection from "./components/HistorySection";
import FloatingChat   from "./components/FloatingChat";

function App() {

  const [token, setToken]     = useState(localStorage.getItem("token"));
  const [result, setResult]   = useState(null);
  const [history, setHistory] = useState([]);
  const [activePage, setActivePage] = useState("upload");

  // 🔒 Not logged in
  if (!token) return <Auth setToken={setToken} />;

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setResult(null);
    setHistory([]);
    setActivePage("upload");
  };

  // 📄 After upload
  const handleResult = (data) => {
    setResult(data);
    setActivePage("results");
  };

  // 🧭 Page switch
  const renderPage = () => {
    switch (activePage) {
      case "upload":
        return <UploadSection token={token} onResult={handleResult} />;

      case "results":
        return <Results result={result} />;

      case "history":
        return (
          <HistorySection
            token={token}
            history={history}
            setHistory={setHistory}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="layout">

      {/* Sidebar */}
      <Sidebar
        active={activePage}
        setActive={setActivePage}
        userEmail={null}
      />

      {/* Main */}
      <div className="main">
        <Header onLogout={handleLogout} />
        {renderPage()}
      </div>

      {/* 🤖 Floating AI Assistant (GLOBAL) */}
      <FloatingChat token={token} />

    </div>
  );
}

export default App;
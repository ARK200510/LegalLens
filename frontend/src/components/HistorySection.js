import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
// import Results from "./Results";

/* ── Icons ── */
function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}

function HistoryHeadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

const BAR_COLORS = ["#c9a96e", "#7c6a8e", "#d4756b", "#5b8ed4", "#6bab8d", "#b09060", "#8eb0c9"];

/* build chart data from history array */
function buildChartData(history) {
  const counts = {};
  (history || []).forEach((item) => {
    const cat = item.category || "Unknown";
    counts[cat] = (counts[cat] || 0) + 1;
  });
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
}

/* Custom tooltip for recharts */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <strong>{payload[0].payload.name}</strong>
      <span>{payload[0].value} document{payload[0].value !== 1 ? "s" : ""}</span>
    </div>
  );
}

function HistorySection({ token, history, setHistory }) {
  const [openId, setOpenId]     = useState(null);
  const [loading, setLoading]   = useState(false);

  /* ── EXACT same fetchHistory logic from your App.js ── */
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/history/", {
        method: "GET",
        headers: { token: token },
      });
      const data = await res.json();
      setHistory(data.history || []);
    } catch (err) {
      alert("Error fetching history");
    } finally {
      setLoading(false);
    }
  };

  /* toggle eye details */
  const toggleOpen = (id) => setOpenId(openId === id ? null : id);

  const chartData = buildChartData(history);

  return (
    <div className="page-content">

      {/* Header row */}
      <div className="history-header">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div className="history-title">Document History</div>
            <div className="history-subtitle">
              {history.length} document{history.length !== 1 ? "s" : ""} analyzed
            </div>
          </div>
          <button
            className="btn-analyze"
            style={{ marginTop: 4 }}
            onClick={fetchHistory}
            disabled={loading}
          >
            {loading ? "Loading…" : "↻ Refresh"}
          </button>
        </div>
      </div>

      {/* ── Analytics chart ── */}
      {chartData.length > 0 && (
        <div className="chart-card">
          <div className="card-head">
            <span className="card-title">Category Distribution</span>
            <div className="card-icon-wrap icon-gold">
              <BarChartIcon />
            </div>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={34} barCategoryGap="30%">
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#7a7a8e", fontFamily: "DM Sans" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#7a7a8e", fontFamily: "DM Sans" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={28}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,.03)" }} />
                <Bar dataKey="count" radius={[7, 7, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── History list ── */}
      {history.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-wrap">
            <HistoryHeadIcon />
          </div>
          <h3>No Documents Yet</h3>
          <p>
            Your analyzed documents will appear here.<br />
            Upload a PDF to get started.
          </p>
        </div>
      ) : (
        history.map((item, index) => {
          const isOpen = openId === index;
          /* build a result-compatible object for Results component */
          const resultObj = {
            title:      item.filename,
            prediction:
  item.prediction ||
  (item.category?.toLowerCase().includes("civil") ||
   item.category?.toLowerCase().includes("criminal") ||
   item.category?.toLowerCase().includes("divorce") ||
   item.category?.toLowerCase().includes("consumer")
    ? "Legal"
    : "Non-Legal"),
            category:   item.category,
            english:    item.summary,
            hindi:      item.hindi   || item.summary,
            marathi:    item.marathi || item.summary,
            entities:   item.entities || null,
          };

          return (
            <div
              key={index}
              className="history-card"
              onClick={() => toggleOpen(index)}
            >
              <div className="history-row">
                {/* File icon */}
                <div className="history-file-icon">
                  <FileIcon />
                </div>

                {/* Info */}
                <div className="history-info">
                  <div className="history-filename">{item.filename}</div>
                  <div className="history-meta">
                    <span
                      className={`badge ${
                        resultObj.prediction === "Legal"
                          ? "badge-legal"
                          : "badge-nonlegal"
                      }`}
                      style={{ fontSize: ".72rem", padding: "3px 10px" }}
                    >
                      {resultObj.prediction}
                    </span>
                    <span
                      className="badge badge-category"
                      style={{ fontSize: ".72rem", padding: "3px 10px" }}
                    >
                      {item.category}
                    </span>
                    <span className="history-date">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString()
                        : "—"}
                    </span>
                  </div>
                </div>

                {/* Eye button */}
                <button
                  className="eye-btn"
                  onClick={(e) => { e.stopPropagation(); toggleOpen(index); }}
                  title={isOpen ? "Hide details" : "View details"}
                >
                  {isOpen ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              {/* Expanded detail — reuses Results cards */}
              {isOpen && (
                <div
                  className="history-expanded"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Summary */}
                  {item.summary && (
                    <div className="card" style={{ marginBottom: 14 }}>
                      <div className="card-head">
                        <span className="card-title">Summary</span>
                      </div>
                      <p className="summary-text">{item.summary}</p>
                    </div>
                  )}

                  {/* Entities */}
                  {item.entities && (
                    <div className="card" style={{ marginBottom: 14 }}>
                      <div className="card-head">
                        <span className="card-title">Named Entities</span>
                      </div>
                      {item.entities.acts?.length > 0 && (
                        <div className="entity-group">
                          <div className="entity-group-label">Acts</div>
                          <div className="entity-grid">
                            {item.entities.acts.map((v, i) => (
                              <span key={i} className="entity-chip">{v}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {item.entities.courts?.length > 0 && (
                        <div className="entity-group">
                          <div className="entity-group-label">Courts</div>
                          <div className="entity-grid">
                            {item.entities.courts.map((v, i) => (
                              <span key={i} className="entity-chip">{v}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {item.entities.persons?.length > 0 && (
                        <div className="entity-group">
                          <div className="entity-group-label">Persons</div>
                          <div className="entity-grid">
                            {item.entities.persons.map((v, i) => (
                              <span key={i} className="entity-chip">{v}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {item.entities.dates?.length > 0 && (
                        <div className="entity-group">
                          <div className="entity-group-label">Dates</div>
                          <div className="entity-grid">
                            {item.entities.dates.map((v, i) => (
                              <span key={i} className="entity-chip">{v}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default HistorySection;
import React, { useState } from "react";

/* ── Icons ── */
const Ico = {
  Scale: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12l3 6h10l3-6"/>
      <line x1="12" y1="3" x2="12" y2="19"/>
      <circle cx="12" cy="3" r="1.5"/>
    </svg>
  ),
  Tag: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  Sparkle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.88 5.12L19 10l-5.12 1.88L12 17l-1.88-5.12L5 10l5.12-1.88L12 3z"/>
    </svg>
  ),
  Globe: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  Person: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
};

/* ── cleanText: remove ** from AI output (your original logic) ── */
const cleanText = (text) => {
  if (!text) return "";
  return text.replace(/\*\*/g, "");
};

/* ── Entity group renderer ── */
function EntityGroup({ label, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="entity-group">
      <div className="entity-group-label">{label}</div>
      <div className="entity-grid">
        {items.map((item, i) => (
          <span key={i} className="entity-chip">{item}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Main Results component ── */
function Results({ result }) {
  const [language, setLanguage] = useState("english");

  if (!result) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <div className="empty-icon-wrap">
            <Ico.Scale />
          </div>
          <h3>No Results Yet</h3>
          <p>Upload a PDF document to view<br />the analysis results here.</p>
        </div>
      </div>
    );
  }

  const isLegal   = result.prediction === "Legal" || result.prediction === "legal";
  const languages = ["english", "hindi", "marathi"];

  return (
    <div className="page-content">

      {/* Page header */}
      <div className="results-header">
        <div>
          <div className="results-title">Analysis Results</div>
          {result.title && (
            <div className="results-filename">{result.title}</div>
          )}
        </div>
        <span className={`badge ${isLegal ? "badge-legal" : "badge-nonlegal"}`}>
          {result.prediction}
        </span>
      </div>

      {/* Grid layout */}
      <div className="results-grid">

        {/* ── Type Card ── */}
        <div className="card">
          <div className="card-head">
            <span className="card-title">Document Type</span>
            <div className={`card-icon-wrap ${isLegal ? "icon-green" : "icon-gold"}`}>
              <Ico.Scale />
            </div>
          </div>
          <div className="type-display">
            <div
              className="type-emoji"
              style={{ background: isLegal ? "var(--success-bg)" : "var(--warn-bg)" }}
            >
              {isLegal ? "⚖️" : "📄"}
            </div>
            <div>
              <div className="type-label">{result.prediction}</div>
              <div className="type-conf">
                AI Classification &middot; NLP Model
              </div>
            </div>
          </div>
        </div>

        {/* ── Category Card ── */}
        <div className="card">
          <div className="card-head">
            <span className="card-title">Category</span>
            <div className="card-icon-wrap icon-purple">
              <Ico.Tag />
            </div>
          </div>
          <div
            className="category-badge-large badge-category"
            style={{ display: "inline-flex" }}
          >
            {result.category}
          </div>
          <p className="category-desc">
            {isLegal
              ? `Classified under ${result.category} law based on document structure and legal terminology analysis.`
              : `Non-legal document identified as ${result.category} from content patterns and formatting.`}
          </p>
        </div>

        {/* ── Summary Card (full width) ── */}
        <div className="card full">
          <div className="card-head">
            <span className="card-title">Document Summary</span>
            <div className="card-icon-wrap icon-blue">
              <Ico.Sparkle />
            </div>
          </div>
          <p className="summary-text">
            {/* Your original cleanText function */}
            {cleanText(result.english) || "No summary available."}
          </p>
        </div>

        {/* ── Entities Card (full width, if present) ── */}
        {result.entities && (
          <div className="card full">
            <div className="card-head">
              <span className="card-title">Named Entities</span>
              <div className="card-icon-wrap icon-gold">
                <Ico.Person />
              </div>
            </div>
            <EntityGroup label="Acts & Sections"  items={result.entities.acts}    />
            <EntityGroup label="Courts"            items={result.entities.courts}  />
            <EntityGroup label="Persons"           items={result.entities.persons} />
            <EntityGroup label="Dates"             items={result.entities.dates}   />
            {/* fallback: if no known sub-keys, just show raw */}
            {!result.entities.acts &&
             !result.entities.courts &&
             !result.entities.persons &&
             !result.entities.dates && (
              <div className="entity-grid">
                {Object.entries(result.entities).map(([k, v]) =>
                  Array.isArray(v)
                    ? v.map((val, i) => (
                        <span key={`${k}-${i}`} className="entity-chip">{val}</span>
                      ))
                    : null
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Translations Card (full width) ── */}
        <div className="card full lang">
          <div className="card-head">
            <span className="card-title">Multilingual Translation</span>
            <div className="card-icon-wrap icon-purple">
              <Ico.Globe />
            </div>
          </div>

          {/* Language tab buttons — your original 3 languages */}
          <div className="lang-tabs-row">
            {languages.map((lang) => (
              <button
                key={lang}
                className={`lang-tab-btn${language === lang ? " active" : ""}`}
                onClick={() => setLanguage(lang)}
              >
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </button>
            ))}
          </div>

          {/* Translation text — your original result[language] logic */}
          <div className="translation-box">
            {cleanText(result[language]) || "Translation not available."}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Results;
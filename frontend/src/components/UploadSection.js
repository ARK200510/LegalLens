import React, { useState, useRef } from "react";

/* ── Icons ── */
function UploadCloudIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16"/>
      <line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.88 5.12L19 10l-5.12 1.88L12 17l-1.88-5.12L5 10l5.12-1.88L12 3z"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

/* ── Processing steps ── */
const STEPS = [
  { id: "extract",   label: "Extracting Text" },
  { id: "classify",  label: "Classifying" },
  { id: "ner",       label: "NER Analysis" },
  { id: "summarize", label: "Summarizing" },
  { id: "translate", label: "Translating" },
];

function UploadSection({ token, onResult }) {
  const [file, setFile]           = useState(null);
  const [drag, setDrag]           = useState(false);
  const [loading, setLoading]     = useState(false);
  const [stepIdx, setStepIdx]     = useState(-1);
  const inputRef                  = useRef();

  /* pick file helper */
  const pickFile = (f) => {
    if (f && f.type === "application/pdf") setFile(f);
    else if (f) alert("Please select a PDF file.");
  };

  /* drag handlers */
  const onDragOver  = (e) => { e.preventDefault(); setDrag(true);  };
  const onDragLeave = ()  => setDrag(false);
  const onDrop      = (e) => {
    e.preventDefault();
    setDrag(false);
    pickFile(e.dataTransfer.files[0]);
  };

  /* ── EXACT same upload logic as your original App.js ── */
  const handleUpload = async () => {
    if (!file) { alert("Please select a file first"); return; }

    setLoading(true);
    setStepIdx(0);

    /* animate steps while real request runs */
    let i = 0;
    const iv = setInterval(() => {
      i++;
      if (i < STEPS.length) setStepIdx(i);
    }, 800);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        headers: { token: token },
        body: formData,
      });

      const data = await res.json();

      clearInterval(iv);
      setStepIdx(STEPS.length); /* mark all done */

      setTimeout(() => {
        setLoading(false);
        setStepIdx(-1);
        onResult(data);           /* ← pass result up to App */
      }, 500);

    } catch (error) {
      clearInterval(iv);
      setLoading(false);
      setStepIdx(-1);
      console.error("Error:", error);
      alert("Error uploading file");
    }
  };

  const progress = stepIdx >= 0
    ? Math.round(((stepIdx + 1) / STEPS.length) * 100)
    : 0;

  return (
    <div className="page-content">
      <div className="upload-wrapper">

        {/* Hero text */}
        <div className="section-hero">
          <h2>Analyze Your Document</h2>
          <p>
            Upload a PDF and get instant AI-powered legal classification,
            detailed summary, entity extraction, and multilingual translation.
          </p>
        </div>

        {/* Drop zone */}
        <div
          className={`upload-box${drag ? " drag-over" : ""}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !file && !loading && inputRef.current.click()}
        >
          {/* hidden real input — your onChange logic untouched */}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => pickFile(e.target.files[0])}
          />

          <div className="upload-icon-wrap">
            <UploadCloudIcon />
          </div>

          <h3>{drag ? "Drop it right here!" : "Drag & drop your PDF"}</h3>
          <p>
            or{" "}
            <span
              onClick={(e) => {
                e.stopPropagation();
                if (!loading) inputRef.current.click();
              }}
            >
              browse your files
            </span>{" "}
            to upload
          </p>

          {/* File preview */}
          {file && (
            <div
              className="file-preview"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="file-preview-icon"><FileIcon /></div>
              <div className="file-preview-info">
                <div className="file-preview-name">{file.name}</div>
                <div className="file-preview-size">
                  {(file.size / 1024).toFixed(1)} KB &middot; PDF Document
                </div>
              </div>
              <button
                className="file-remove-btn"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
              >
                <XIcon />
              </button>
            </div>
          )}

          {!file && (
            <button
              className="btn-choose"
              onClick={(e) => { e.stopPropagation(); inputRef.current.click(); }}
            >
              <FileIcon style={{ width: 15, height: 15 }} /> Choose PDF File
            </button>
          )}
        </div>

        {/* Analyze button */}
        {file && !loading && (
          <div style={{ textAlign: "center" }}>
            <button className="btn-analyze" onClick={handleUpload}>
              <SparkleIcon /> Analyze Document
            </button>
          </div>
        )}

        {/* Progress */}
        {loading && (
          <div className="progress-wrap">
            <div className="progress-header">
              <span>Processing your document…</span>
              <span>{Math.min(progress, 100)}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="progress-steps">
              {STEPS.map((s, i) => (
                <div
                  key={s.id}
                  className={[
                    "step-pill",
                    i < stepIdx ? "done" : "",
                    i === stepIdx ? "active" : "",
                  ].join(" ")}
                >
                  <div className="step-dot" />
                  {i < stepIdx && <CheckIcon />}
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default UploadSection;
import React, { useState, useRef, useEffect } from "react";

/* ══════════════════════════════════════
   ICONS
══════════════════════════════════════ */
function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}

function BotIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2"/>
      <circle cx="12" cy="5" r="2"/>
      <path d="M12 7v4M8 15h.01M16 15h.01"/>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.88 5.12L19 10l-5.12 1.88L12 17l-1.88-5.12L5 10l5.12-1.88L12 3z"/>
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14H6L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4h6v2"/>
    </svg>
  );
}

/* ══════════════════════════════════════
   TYPING DOTS ANIMATION
══════════════════════════════════════ */
function TypingDots() {
  return (
    <div className="chat-typing-dots">
      <span /><span /><span />
    </div>
  );
}

/* ══════════════════════════════════════
   SUGGESTED QUESTIONS
══════════════════════════════════════ */
const SUGGESTIONS = [
  "What type of legal document is this?",
  "Who are the parties involved?",
  "What are the key dates mentioned?",
  "Summarize this document in simple terms",
  "What acts or sections are referenced?",
  "What are the main obligations?",
];

/* ══════════════════════════════════════
   FORMAT bot message — bold **text**
══════════════════════════════════════ */
function FormattedMessage({ text }) {
  /* convert **word** → <strong>word</strong> */
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**")
          ? <strong key={i}>{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </span>
  );
}

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
function ChatSection({ token, latestDoc }) {
  const [messages, setMessages]   = useState([
    {
      role: "bot",
      text: "Hello! I'm your Legal AI Assistant 👋\n\nI can answer questions about your uploaded document — parties involved, key dates, legal acts, obligations, and more.\n\nAsk me anything!",
      time: new Date(),
    },
  ]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const bottomRef                 = useRef(null);
  const inputRef                  = useRef(null);

  /* auto-scroll to bottom on new message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ── EXACT same API call structure as your /chat/ endpoint ── */
  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    const userMsg = { role: "user", text: userText, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,                         /* your original token header */
        },
        body: JSON.stringify({ message: userText }),  /* your ChatRequest model */
      });

      const data = await res.json();

      const botMsg = {
        role: "bot",
        text: data.response || data.error || "Sorry, something went wrong.",
        time: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Connection error. Please make sure the backend is running.",
          time: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: "bot",
      text: "Chat cleared! Ask me anything about your document.",
      time: new Date(),
    }]);
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="chat-layout">

      {/* ── LEFT: Chat area ── */}
      <div className="chat-main">

        {/* Chat header */}
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="chat-bot-avatar">
              <BotIcon />
            </div>
            <div>
              <div className="chat-bot-name">Legal AI Assistant</div>
              <div className="chat-bot-status">
                <span className="status-dot" />
                Powered by LLaMA 3.1
              </div>
            </div>
          </div>
          <button className="chat-clear-btn" onClick={clearChat} title="Clear chat">
            <ClearIcon /> Clear
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-msg-row ${msg.role === "user" ? "user-row" : "bot-row"}`}
            >
              {/* Bot avatar */}
              {msg.role === "bot" && (
                <div className="chat-avatar bot-avatar">
                  <BotIcon />
                </div>
              )}

              <div className={`chat-bubble ${msg.role === "user" ? "user-bubble" : "bot-bubble"} ${msg.isError ? "error-bubble" : ""}`}>
                {msg.role === "bot"
                  ? <FormattedMessage text={msg.text} />
                  : msg.text}
                <div className="chat-time">{formatTime(msg.time)}</div>
              </div>

              {/* User avatar */}
              {msg.role === "user" && (
                <div className="chat-avatar user-avatar">
                  <UserIcon />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="chat-msg-row bot-row">
              <div className="chat-avatar bot-avatar">
                <BotIcon />
              </div>
              <div className="chat-bubble bot-bubble typing-bubble">
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggestions — show only on fresh chat */}
        {messages.length <= 1 && !loading && (
          <div className="chat-suggestions">
            <div className="suggestions-label">
              <SparkIcon /> Try asking:
            </div>
            <div className="suggestions-grid">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className="suggestion-chip"
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input bar */}
        <div className="chat-input-bar">
          <div className="chat-input-wrap">
            <textarea
              ref={inputRef}
              className="chat-input"
              rows={1}
              placeholder="Ask about your legal document… (Enter to send)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              disabled={loading}
            />
            <button
              className={`chat-send-btn ${input.trim() && !loading ? "active" : ""}`}
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              <SendIcon />
            </button>
          </div>
          <div className="chat-input-hint">
            Press <kbd>Enter</kbd> to send &middot; <kbd>Shift+Enter</kbd> for new line
          </div>
        </div>
      </div>

      {/* ── RIGHT: Context panel ── */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-title">
          <SparkIcon /> Document Context
        </div>

        {latestDoc ? (
          <>
            {/* Doc info card */}
            <div className="chat-doc-card">
              <div className="chat-doc-icon"><FileIcon /></div>
              <div className="chat-doc-info">
                <div className="chat-doc-name">{latestDoc.filename || latestDoc.title || "Document"}</div>
                <div className="chat-doc-meta">Latest uploaded</div>
              </div>
            </div>

            {/* Badges */}
            <div className="chat-doc-badges">
              {latestDoc.prediction && (
                <span className={`badge ${latestDoc.prediction === "Legal" ? "badge-legal" : "badge-nonlegal"}`}
                  style={{ fontSize: ".72rem" }}>
                  {latestDoc.prediction}
                </span>
              )}
              {latestDoc.category && (
                <span className="badge badge-category" style={{ fontSize: ".72rem" }}>
                  {latestDoc.category}
                </span>
              )}
            </div>

            {/* Summary snippet */}
            {latestDoc.english && (
              <div className="chat-doc-summary">
                <div className="chat-doc-summary-label">Summary</div>
                <p>{latestDoc.english.replace(/\*\*/g, "").slice(0, 280)}{latestDoc.english.length > 280 ? "…" : ""}</p>
              </div>
            )}
          </>
        ) : (
          <div className="chat-no-doc">
            <div className="chat-no-doc-icon"><FileIcon /></div>
            <p>No document uploaded yet.</p>
            <span>Upload a PDF first to enable<br />context-aware answers.</span>
          </div>
        )}

        {/* Tips */}
        <div className="chat-tips">
          <div className="chat-tips-label">💡 Tips</div>
          <ul>
            <li>Ask in Hindi or Marathi — I'll respond in that language</li>
            <li>Ask about specific clauses, dates, or parties</li>
            <li>Request a simplified plain-English explanation</li>
          </ul>
        </div>
      </div>

    </div>
  );
}

export default ChatSection;
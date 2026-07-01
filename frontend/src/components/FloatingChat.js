import React, { useState, useRef, useEffect } from "react";

/* ══════════════════════════════════════════
   INLINE STYLES — fully self-contained
══════════════════════════════════════════ */
const S = {
  bubble: (open) => ({
    position: "fixed",
    bottom: 28,
    right: 28,
    width: 58,
    height: 58,
    borderRadius: "50%",
    background: open
      ? "#d4756b"
      : "linear-gradient(135deg, #18182e 0%, #2d2d50 100%)",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 32px rgba(28,28,46,.38)",
    zIndex: 1001,
    cursor: "pointer",
    transition: "all .22s cubic-bezier(.34,1.56,.64,1)",
    color: open ? "#fff" : "#c9a96e",
  }),
  pulse: {
    position: "absolute",
    top: -2, right: -2,
    width: 14, height: 14,
    borderRadius: "50%",
    background: "#6bab8d",
    border: "2.5px solid #f2f0eb",
  },
  unreadBadge: {
    position: "absolute",
    top: -4, right: -4,
    minWidth: 20, height: 20,
    borderRadius: 10,
    background: "#d4756b",
    color: "#fff",
    fontSize: ".65rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #f2f0eb",
    padding: "0 4px",
  },
  panel: {
    position: "fixed",
    bottom: 100, right: 28,
    width: 370, height: 520,
    background: "#ffffff",
    borderRadius: 22,
    border: "1px solid #e4e0d8",
    boxShadow: "0 20px 60px rgba(28,28,46,.18), 0 4px 16px rgba(28,28,46,.1)",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    animation: "chatFloat .25s cubic-bezier(.34,1.56,.64,1)",
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 18px",
    background: "linear-gradient(135deg, #18182e 0%, #2d2d50 100%)",
    flexShrink: 0,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 11 },
  headerAvatar: {
    width: 36, height: 36,
    borderRadius: 11,
    background: "rgba(201,169,110,.18)",
    border: "1px solid rgba(201,169,110,.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  headerName: {
    fontFamily: "'Fraunces', serif",
    fontSize: ".95rem", fontWeight: 600,
    color: "#ffffff", letterSpacing: "-.2px",
  },
  headerSub: {
    display: "flex", alignItems: "center", gap: 5,
    fontSize: ".68rem", color: "#8888b8", marginTop: 2,
  },
  onlineDot: {
    width: 6, height: 6, borderRadius: "50%",
    background: "#6bab8d", flexShrink: 0,
  },
  closeBtn: {
    width: 30, height: 30, borderRadius: 9,
    background: "rgba(255,255,255,.08)", border: "none",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#8888b8", cursor: "pointer", transition: "all .15s",
  },
  messagesArea: {
    flex: 1, overflowY: "auto",
    padding: "18px 16px",
    display: "flex", flexDirection: "column", gap: 14,
    background: "#f2f0eb",
    scrollbarWidth: "thin",
    scrollbarColor: "#e4e0d8 transparent",
  },
  botRow:  { display: "flex", alignItems: "flex-end", gap: 8 },
  userRow: { display: "flex", alignItems: "flex-end", gap: 8, flexDirection: "row-reverse" },
  botAv: {
    width: 28, height: 28, borderRadius: 9,
    background: "linear-gradient(135deg, #18182e, #2d2d50)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  userAv: {
    width: 28, height: 28, borderRadius: 9,
    background: "linear-gradient(135deg, #c9a96e, #7c6a8e)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  botBubble: {
    maxWidth: "80%", padding: "11px 14px",
    background: "#ffffff", border: "1px solid #e4e0d8",
    borderRadius: "14px 14px 14px 3px",
    fontSize: ".84rem", lineHeight: 1.7, color: "#1c1c2e",
    boxShadow: "0 1px 4px rgba(0,0,0,.05)",
  },
  userBubble: {
    maxWidth: "80%", padding: "11px 14px",
    background: "#1c1c2e",
    borderRadius: "14px 14px 3px 14px",
    fontSize: ".84rem", lineHeight: 1.7, color: "#ffffff",
  },
  errorBubble: {
    background: "#fff5f5", border: "1px solid #f5c6c6", color: "#c44",
  },
  msgTime: { fontSize: ".62rem", marginTop: 5, opacity: .42 },
  typingWrap: { display: "flex", alignItems: "center", gap: 4, padding: "12px 14px" },
  inputBar: {
    display: "flex", alignItems: "center", gap: 9,
    padding: "12px 14px",
    background: "#ffffff", borderTop: "1px solid #e4e0d8", flexShrink: 0,
  },
  input: (focused) => ({
    flex: 1, padding: "10px 14px",
    border: `1.5px solid ${focused ? "#c9a96e" : "#e4e0d8"}`,
    borderRadius: 11, fontSize: ".84rem", color: "#1c1c2e",
    background: focused ? "#fdf9f4" : "#f2f0eb",
    outline: "none", transition: "all .15s",
    fontFamily: "'DM Sans', sans-serif",
  }),
  sendBtn: (active) => ({
    width: 38, height: 38, borderRadius: 10, border: "none",
    background: active ? "#1c1c2e" : "#e4e0d8",
    color: active ? "#c9a96e" : "#7a7a8e",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: active ? "pointer" : "not-allowed",
    transition: "all .18s", flexShrink: 0,
  }),
};

/* Icons */
function BotSvg({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2"/>
      <circle cx="12" cy="5" r="2"/>
      <path d="M12 7v4M8 15h.01M16 15h.01"/>
    </svg>
  );
}
function CloseSvg() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
function SendSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}
function UserSvg() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function TypingDots() {
  return (
    <div style={S.typingWrap}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%", background: "#7a7a8e",
          animation: "dotBounce 1.2s infinite ease-in-out",
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </div>
  );
}

function FormattedMsg({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**")
          ? <strong key={i} style={{ fontWeight: 700 }}>{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </span>
  );
}

const QUICK = [
  "What type of document is this?",
  "Who are the parties involved?",
  "What are the key dates?",
  "Summarize in simple terms",
];

function FloatingChat({ token }) {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([{
    role: "bot",
    text: "Hi! I'm your Legal AI Assistant.\nAsk me anything about your uploaded document — parties, dates, clauses, obligations.",
    time: new Date(),
  }]);
  const [input, setInput]   = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unread, setUnread]   = useState(0);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  /* EXACT same /chat/ API call as your backend */
  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setMessages((p) => [...p, { role: "user", text: msg, time: new Date() }]);
    setInput("");
    setLoading(true);
    try {
        const storedToken = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/chat/", {
        method: "POST",
        headers: { 
  "Content-Type": "application/json", 
  token: storedToken 
},
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      const reply = data.response || data.error || "Something went wrong.";
      setMessages((p) => [...p, { role: "bot", text: reply, time: new Date() }]);
      if (!open) setUnread((n) => n + 1);
    } catch {
      setMessages((p) => [...p, {
        role: "bot",
        text: "Connection error — is the backend running?",
        time: new Date(), isError: true,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => { if (e.key === "Enter") { e.preventDefault(); send(); } };
  const fmt   = (d) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <style>{`
        @keyframes chatFloat {
          from { opacity:0; transform:translateY(18px) scale(.95); }
          to   { opacity:1; transform:translateY(0)    scale(1);   }
        }
        @keyframes dotBounce {
          0%,80%,100% { transform:scale(.75); opacity:.4; }
          40%          { transform:scale(1.1); opacity:1;  }
        }
        @keyframes pulseGlow {
          0%   { box-shadow:0 0 0 0   rgba(107,171,141,.55); }
          70%  { box-shadow:0 0 0 8px rgba(107,171,141,0);   }
          100% { box-shadow:0 0 0 0   rgba(107,171,141,0);   }
        }
        .fc-close:hover { background:rgba(255,255,255,.2) !important; color:#fff !important; }
        .fc-send:hover  { background:#c9a96e !important; }
        .fc-chip:hover  { background:#fdf3e3 !important; border-color:#c9a96e !important; color:#9a7020 !important; }
        .fc-msgs::-webkit-scrollbar { width:4px; }
        .fc-msgs::-webkit-scrollbar-thumb { background:#d8d4cc; border-radius:4px; }
      `}</style>

      {/* ══ PANEL ══ */}
      {open && (
        <div style={S.panel}>

          {/* Header */}
          <div style={S.panelHeader}>
            <div style={S.headerLeft}>
              <div style={S.headerAvatar}><BotSvg size={18} /></div>
              <div>
                <div style={S.headerName}>Legal AI</div>
                <div style={S.headerSub}>
                  <div style={S.onlineDot} />
                  Powered by LLaMA 3.1
                </div>
              </div>
            </div>
            <button className="fc-close" style={S.closeBtn} onClick={() => setOpen(false)}>
              <CloseSvg />
            </button>
          </div>

          {/* Messages */}
          <div className="fc-msgs" style={S.messagesArea}>
            {messages.map((m, i) => (
              <div key={i} style={m.role === "user" ? S.userRow : S.botRow}>
                {m.role === "bot" && <div style={S.botAv}><BotSvg size={14} /></div>}
                <div style={{
                  ...(m.role === "user" ? S.userBubble : S.botBubble),
                  ...(m.isError ? S.errorBubble : {}),
                }}>
                  <FormattedMsg text={m.text} />
                  <div style={{
                    ...S.msgTime,
                    color: m.role === "user" ? "rgba(255,255,255,.5)" : undefined,
                  }}>
                    {fmt(m.time)}
                  </div>
                </div>
                {m.role === "user" && <div style={S.userAv}><UserSvg /></div>}
              </div>
            ))}

            {/* Typing */}
            {loading && (
              <div style={S.botRow}>
                <div style={S.botAv}><BotSvg size={14} /></div>
                <div style={{ ...S.botBubble, padding: 0 }}><TypingDots /></div>
              </div>
            )}

            {/* Quick chips — only on fresh chat */}
            {messages.length === 1 && !loading && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 4 }}>
                {QUICK.map((q, i) => (
                  <button key={i} className="fc-chip" onClick={() => send(q)} style={{
                    padding: "6px 13px",
                    background: "#ffffff", border: "1.5px solid #e4e0d8",
                    borderRadius: 20, fontSize: ".76rem", color: "#1c1c2e",
                    cursor: "pointer", transition: "all .15s",
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div style={S.inputBar}>
            <input
              ref={inputRef}
              style={S.input(focused)}
              placeholder="Ask about your document…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              disabled={loading}
            />
            <button
              className="fc-send"
              style={S.sendBtn(!!input.trim() && !loading)}
              onClick={() => send()}
              disabled={!input.trim() || loading}
            >
              <SendSvg />
            </button>
          </div>

        </div>
      )}

      {/* ══ BUBBLE ══ */}
      <button style={S.bubble(open)} onClick={() => setOpen((v) => !v)} title="Legal AI Assistant">
        {open ? <CloseSvg /> : <BotSvg size={24} />}
        {!open && unread > 0 && <div style={S.unreadBadge}>{unread}</div>}
        {!open && unread === 0 && (
          <div style={{ ...S.pulse, animation: "pulseGlow 2.2s infinite" }} />
        )}
      </button>
    </>
  );
}

export default FloatingChat;
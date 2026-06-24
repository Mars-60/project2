import { useState } from "react";
import { Sparkles, X, Github, Zap, GitBranch, MessageSquare, Lock } from "lucide-react";

function LandingPage({ onLogin }) {
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState("signin");

  const openModal = (tab = "signin") => { setModalTab(tab); setShowModal(true); };

  const features = [
    { icon: <GitBranch size={18} />, title: "File explorer", desc: "Browse any repo tree, click a file, get an instant AI breakdown." },
    { icon: <MessageSquare size={18} />, title: "Repo chat", desc: "Ask architecture questions across the entire codebase at once." },
    { icon: <Zap size={18} />, title: "Streaming answers", desc: "Token-by-token streaming so you see answers as they form." },
    { icon: <Lock size={18} />, title: "OAuth login", desc: "One click with Google or GitHub. No passwords needed." },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#060810", color: "#e2e8f0", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .glow-btn { transition: all 0.2s; }
        .glow-btn:hover { background: #00e87a !important; transform: translateY(-1px); box-shadow: 0 0 24px rgba(0,255,136,0.35) !important; }
        .ghost-btn { transition: all 0.2s; }
        .ghost-btn:hover { background: rgba(0,255,136,0.06) !important; border-color: rgba(0,255,136,0.3) !important; color: #22c55e !important; }
        .feature-card { transition: all 0.2s; }
        .feature-card:hover { border-color: rgba(0,255,136,0.3) !important; transform: translateY(-4px); box-shadow: 0 8px 32px rgba(0,255,136,0.06); }
        .oauth-btn { transition: all 0.15s; }
        .oauth-btn:hover { background: #161b27 !important; border-color: #334155 !important; }
        .tab-btn { transition: all 0.15s; }
        .inp { transition: border-color 0.15s; }
        .inp:focus { outline: none; border-color: #22c55e !important; box-shadow: 0 0 0 3px rgba(0,255,136,0.1); }
        .modal-close:hover { color: #e2e8f0 !important; background: rgba(255,255,255,0.05) !important; }
        @keyframes pulse-glow {
          0%, 100% { text-shadow: 0 0 40px rgba(0,255,136,0.2); }
          50% { text-shadow: 0 0 80px rgba(0,255,136,0.5), 0 0 120px rgba(0,255,136,0.15); }
        }
        .hero-accent { animation: pulse-glow 3s ease-in-out infinite; }
        @media (max-width: 640px) {
          .hero-h1 { font-size: 32px !important; }
          .hero-p { font-size: 15px !important; }
          .stats-row { flex-direction: column !important; }
          .stats-row > div { border-right: none !important; border-bottom: 1px solid #1e293b; }
          .features-grid { grid-template-columns: 1fr 1fr !important; }
          .nav-pad { padding: 14px 16px !important; }
          .hero-pad { padding: 48px 16px 32px !important; }
          .section-pad { padding: 0 16px 48px !important; }
          .hero-ctas { flex-direction: column !important; align-items: stretch !important; }
          .hero-ctas a, .hero-ctas button { text-align: center; }
          .demo-bar { margin: 0 16px 48px !important; }
          .footer-pad { padding: 48px 16px !important; }
          .modal-box { margin: 16px !important; padding: 24px 20px !important; }
        }
      `}</style>

      {/* Nav */}
      <nav className="nav-pad" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: "1px solid #0f172a", position: "sticky", top: 0, background: "rgba(6,8,16,0.92)", backdropFilter: "blur(12px)", zIndex: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={20} color="#22c55e" />
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#22c55e", letterSpacing: "-0.02em" }}>Gitzy</span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="ghost-btn" onClick={() => openModal("signin")} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #1e293b", background: "transparent", color: "#94a3b8", fontSize: "14px", cursor: "pointer" }}>
            Sign in
          </button>
          <button className="glow-btn" onClick={() => openModal("signup")} style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: "#22c55e", color: "#060810", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            Get started
          </button>
        </div>
      </nav>

      {/* Blurred content when modal open */}
      <div style={{ filter: showModal ? "blur(3px)" : "none", transition: "filter 0.2s", pointerEvents: showModal ? "none" : "auto" }}>

        {/* Hero */}
        <section className="hero-pad" style={{ textAlign: "center", padding: "80px 32px 56px", maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", padding: "5px 14px", borderRadius: "999px", background: "rgba(0,255,136,0.07)", color: "#22c55e", border: "1px solid rgba(0,255,136,0.15)", marginBottom: "28px", letterSpacing: "0.04em" }}>
            ◆ AI-powered · Groq API · MERN Stack
          </div>
          <h1 className="hero-h1" style={{ fontSize: "52px", fontWeight: "700", lineHeight: "1.1", color: "#f1f5f9", marginBottom: "20px", letterSpacing: "-0.03em" }}>
            Understand any GitHub repo<br />
            <span className="hero-accent" style={{ color: "#22c55e" }}>in minutes, not hours</span>
          </h1>
          <p className="hero-p" style={{ fontSize: "18px", color: "#64748b", lineHeight: "1.75", marginBottom: "36px", maxWidth: "520px", margin: "0 auto 36px" }}>
            Paste a GitHub URL. Ask anything about the codebase. Gitzy reads every file and answers in plain English.
          </p>
          <div className="hero-ctas" style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="glow-btn" onClick={() => openModal("signup")} style={{ padding: "14px 32px", borderRadius: "10px", border: "none", background: "#22c55e", color: "#060810", fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: "0 0 24px rgba(0,255,136,0.25)" }}>
              Start for free →
            </button>
            <a href="https://github.com/Mars-60/project2" target="_blank" rel="noopener noreferrer" className="ghost-btn" style={{ padding: "14px 32px", borderRadius: "10px", border: "1px solid #1e293b", background: "transparent", color: "#94a3b8", fontSize: "15px", cursor: "pointer", textDecoration: "none", display: "inline-block" }}>
              View on GitHub
            </a>
          </div>
        </section>

        {/* Demo bar */}
        <div className="demo-bar" style={{ maxWidth: "580px", margin: "0 auto 64px", padding: "0 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#0d1117", border: "1px solid #1e293b", borderRadius: "12px", padding: "14px 18px" }}>
            <Github size={16} color="#475569" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: "13px", fontFamily: "'JetBrains Mono', monospace", color: "#475569", flex: 1 }}>github.com/vercel/next.js</span>
            <button className="glow-btn" onClick={() => openModal("signup")} style={{ padding: "7px 16px", borderRadius: "7px", border: "none", background: "#22c55e", color: "#060810", fontSize: "13px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" }}>
              Analyze →
            </button>
          </div>
          <p style={{ textAlign: "center", fontSize: "12px", color: "#334155", marginTop: "10px", fontFamily: "'JetBrains Mono', monospace" }}>
            Works with any public GitHub repository
          </p>
        </div>

        {/* Stats */}
        <div className="stats-row" style={{ display: "flex", borderTop: "1px solid #0f172a", borderBottom: "1px solid #0f172a", marginBottom: "72px" }}>
          {[
            { num: "~60%", label: "Fewer API calls via caching" },
            { num: "⚡ Fast", label: "Groq-powered streaming" },
            { num: "∞", label: "Any public GitHub repo" },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", padding: "28px 16px", borderRight: i < 2 ? "1px solid #0f172a" : "none" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#22c55e", fontFamily: "'JetBrains Mono', monospace", marginBottom: "4px" }}>{s.num}</div>
              <div style={{ fontSize: "12px", color: "#475569" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="section-pad" style={{ maxWidth: "840px", margin: "0 auto", padding: "0 32px 72px" }}>
          <p style={{ textAlign: "center", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: "#334155", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>CAPABILITIES</p>
          <h2 style={{ textAlign: "center", fontSize: "30px", fontWeight: "700", color: "#f1f5f9", marginBottom: "36px", letterSpacing: "-0.02em" }}>
            Everything you need to explore a codebase
          </h2>
          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
            {features.map((f, i) => (
              <div key={i} className="feature-card" style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: "14px", padding: "22px" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(0,255,136,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px", color: "#22c55e" }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#f1f5f9", marginBottom: "6px" }}>{f.title}</h3>
                <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.65" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="footer-pad" style={{ textAlign: "center", padding: "64px 32px", borderTop: "1px solid #0f172a" }}>
          <h2 style={{ fontSize: "30px", fontWeight: "700", color: "#f1f5f9", marginBottom: "10px", letterSpacing: "-0.02em" }}>Ready to explore a codebase?</h2>
          <p style={{ fontSize: "15px", color: "#475569", marginBottom: "28px" }}>Free to use. No credit card required.</p>
          <button className="glow-btn" onClick={() => openModal("signup")} style={{ padding: "14px 40px", borderRadius: "10px", border: "none", background: "#22c55e", color: "#060810", fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: "0 0 24px rgba(0,255,136,0.25)" }}>
            Create free account →
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "16px" }}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: "18px", padding: "28px", width: "100%", maxWidth: "400px", position: "relative" }}>
            <button className="modal-close" onClick={() => setShowModal(false)} style={{ position: "absolute", top: "14px", right: "14px", background: "none", border: "none", color: "#475569", cursor: "pointer", padding: "6px", borderRadius: "6px", display: "flex", transition: "all 0.15s" }}>
              <X size={18} />
            </button>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "4px" }}>
              <Sparkles size={18} color="#22c55e" />
              <span style={{ fontSize: "20px", fontWeight: "700", color: "#22c55e", letterSpacing: "-0.02em" }}>Gitzy</span>
            </div>
            <p style={{ textAlign: "center", fontSize: "13px", color: "#475569", marginBottom: "22px" }}>
              {modalTab === "signin" ? "Welcome back." : "Create your free account."}
            </p>
            {/* Tabs */}
            <div style={{ display: "flex", background: "#060810", borderRadius: "10px", padding: "3px", gap: "3px", marginBottom: "22px" }}>
              {["signin", "signup"].map(tab => (
                <button key={tab} className="tab-btn" onClick={() => setModalTab(tab)} style={{ flex: 1, padding: "8px", borderRadius: "7px", border: "none", background: modalTab === tab ? "#22c55e" : "transparent", color: modalTab === tab ? "#060810" : "#475569", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                  {tab === "signin" ? "Sign in" : "Sign up"}
                </button>
              ))}
            </div>
            <ModalAuthForm tab={modalTab} onLogin={onLogin} onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function ModalAuthForm({ tab, onLogin, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email.trim() || !password.trim()) { setError("Please fill in all fields"); return; }
    if (password.length < 4) { setError("Password must be at least 4 characters"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/${tab === "signin" ? "login" : "signup"}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Authentication failed"); return; }
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", email);
      onLogin(data.token, email);
      onClose();
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const handleOAuth = (provider) => {
    localStorage.removeItem("token"); localStorage.removeItem("userEmail");
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/${provider}`;
  };

  const inp = { width: "100%", padding: "11px 13px", borderRadius: "9px", border: "1px solid #1e293b", background: "#060810", color: "#e2e8f0", fontSize: "14px", marginBottom: "10px", display: "block", fontFamily: "'Inter', sans-serif" };
  const oauthStyle = { width: "100%", padding: "10px", borderRadius: "9px", border: "1px solid #1e293b", background: "#0d1117", color: "#94a3b8", fontSize: "13px", cursor: "pointer", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontFamily: "'Inter', sans-serif" };

  return (
    <>
      {error && <div style={{ marginBottom: "14px", padding: "10px 13px", borderRadius: "9px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", fontSize: "13px", color: "#f87171" }}>{error}</div>}
      <input className="inp" type="email" placeholder="Email address" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} style={inp} />
      <input className="inp" type="password" placeholder="Password (min 4 characters)" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} style={inp} />
      <button className="glow-btn" onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "12px", borderRadius: "9px", border: "none", background: loading ? "#1e293b" : "#22c55e", color: loading ? "#475569" : "#060810", fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", marginBottom: "16px" }}>
        {loading ? "Please wait..." : tab === "signin" ? "Sign in" : "Create account"}
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
        <div style={{ flex: 1, height: "1px", background: "#1e293b" }} /><span style={{ fontSize: "11px", color: "#334155", fontFamily: "'JetBrains Mono', monospace" }}>OR</span><div style={{ flex: 1, height: "1px", background: "#1e293b" }} />
      </div>
      {["google", "github"].map(p => (
        <button key={p} className="oauth-btn" onClick={() => handleOAuth(p)} style={oauthStyle}>
          {p === "google" ? <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> : <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>}
          {tab === "signin" ? "Continue" : "Sign up"} with {p.charAt(0).toUpperCase() + p.slice(1)}
        </button>
      ))}
    </>
  );
}

export default LandingPage;
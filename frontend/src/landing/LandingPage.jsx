import { useState } from "react";
import { Sparkles, X, Github, Zap, GitBranch, MessageSquare, Lock } from "lucide-react";

function LandingPage({ onLogin }) {
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState("signin");

  const openModal = (tab = "signin") => { setModalTab(tab); setShowModal(true); };

  const features = [
    { icon: <GitBranch size={18} />, title: "File explorer", desc: "Browse any repo tree and click a file for an instant AI breakdown." },
    { icon: <MessageSquare size={18} />, title: "Repo chat", desc: "Ask architecture questions across the entire codebase at once." },
    { icon: <Zap size={18} />, title: "Streaming answers", desc: "Token-by-token streaming so you see answers as they form." },
    { icon: <Lock size={18} />, title: "OAuth login", desc: "One click with Google or GitHub. No passwords needed." },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b0b0f", color: "#e2e8f0", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; padding: 0; }

        .g-btn { transition: all 0.2s; background: #22c55e; color: #000; border: none; font-weight: 700; cursor: pointer; border-radius: 10px; }
        .g-btn:hover { background: #16a34a; transform: translateY(-1px); box-shadow: 0 0 20px rgba(34,197,94,0.3); }
        .ghost-btn { transition: all 0.2s; background: transparent; border: 1px solid #27272a; color: #9ca3af; cursor: pointer; border-radius: 10px; }
        .ghost-btn:hover { border-color: rgba(34,197,94,0.4); color: #22c55e; background: rgba(34,197,94,0.05); }
        .feature-card { background: #121217; border: 1px solid #1f1f23; border-radius: 14px; padding: 20px; transition: all 0.2s; cursor: default; }
        .feature-card:hover { border-color: rgba(34,197,94,0.3); transform: translateY(-3px); box-shadow: 0 8px 24px rgba(34,197,94,0.06); }
        .oauth-btn { width: 100%; padding: 11px; border-radius: 9px; border: 1px solid #27272a; background: #18181b; color: #d1d5db; font-size: 14px; cursor: pointer; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: 'Inter', sans-serif; transition: all 0.15s; }
        .oauth-btn:hover { background: #27272a; border-color: #3f3f46; }
        .inp { width: 100%; padding: 11px 13px; border-radius: 9px; border: 1px solid #27272a; background: #0b0b0f; color: #e2e8f0; font-size: 14px; margin-bottom: 10px; display: block; font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .inp:focus { border-color: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,0.1); }
        .modal-close:hover { color: #e2e8f0; background: rgba(255,255,255,0.05); }
        .pill-btn { transition: all 0.15s; }
        .pill-btn:hover { border-color: rgba(34,197,94,0.4); color: #22c55e; background: rgba(34,197,94,0.05); }

        /* Mobile-first base styles */
        .nav { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid #18181b; position: sticky; top: 0; background: rgba(11,11,15,0.95); backdrop-filter: blur(12px); z-index: 40; }
        .hero { text-align: center; padding: 48px 16px 40px; }
        .hero-h1 { font-size: 32px; font-weight: 700; line-height: 1.15; color: #f9fafb; margin: 0 0 16px; letter-spacing: -0.02em; }
        .hero-p { font-size: 15px; color: #6b7280; line-height: 1.75; margin: 0 0 28px; }
        .hero-ctas { display: flex; flex-direction: column; gap: 10px; }
        .demo-wrap { padding: 0 16px; margin-bottom: 48px; }
        .demo-bar { display: flex; align-items: center; gap: 10px; background: #121217; border: 1px solid #1f1f23; border-radius: 12px; padding: 12px 14px; }
        .stats-row { display: flex; flex-direction: column; border-top: 1px solid #18181b; border-bottom: 1px solid #18181b; margin-bottom: 56px; }
        .stat-item { padding: 20px 16px; text-align: center; border-bottom: 1px solid #18181b; }
        .stat-item:last-child { border-bottom: none; }
        .features-section { padding: 0 16px 56px; }
        .features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .footer-cta { text-align: center; padding: 48px 16px; border-top: 1px solid #18181b; }

        /* Tablet+ */
        @media (min-width: 600px) {
          .nav { padding: 14px 24px; }
          .hero { padding: 64px 24px 48px; }
          .hero-h1 { font-size: 40px; }
          .hero-p { font-size: 17px; }
          .hero-ctas { flex-direction: row; justify-content: center; }
          .demo-wrap { padding: 0 24px; max-width: 580px; margin: 0 auto 56px; }
          .stats-row { flex-direction: row; }
          .stat-item { flex: 1; border-bottom: none; border-right: 1px solid #18181b; }
          .stat-item:last-child { border-right: none; }
          .features-section { padding: 0 24px 64px; max-width: 840px; margin: 0 auto; }
          .features-grid { grid-template-columns: repeat(4, 1fr); gap: 12px; }
          .footer-cta { padding: 64px 24px; }
        }

        /* Desktop */
        @media (min-width: 960px) {
          .nav { padding: 16px 40px; }
          .hero { padding: 88px 40px 64px; max-width: 720px; margin: 0 auto; }
          .hero-h1 { font-size: 52px; }
        }
      `}</style>

      {/* Nav */}
      <nav className="nav">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={20} color="#22c55e" />
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#22c55e", letterSpacing: "-0.02em" }}>Gitzy</span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="ghost-btn" onClick={() => openModal("signin")} style={{ padding: "8px 14px", fontSize: "13px" }}>Sign in</button>
          <button className="g-btn" onClick={() => openModal("signup")} style={{ padding: "8px 14px", fontSize: "13px" }}>Get started</button>
        </div>
      </nav>

      {/* Blurred when modal open */}
      <div style={{ filter: showModal ? "blur(3px)" : "none", transition: "filter 0.2s", pointerEvents: showModal ? "none" : "auto" }}>

        {/* Hero */}
        <section className="hero">
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", padding: "4px 12px", borderRadius: "999px", background: "rgba(34,197,94,0.08)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)", marginBottom: "20px", letterSpacing: "0.04em" }}>
            ◆ AI-powered · Groq API
          </div>
          <h1 className="hero-h1">
            Understand any GitHub repo<br />
            <span style={{ color: "#22c55e" }}>in minutes, not hours</span>
          </h1>
          <p className="hero-p">
            Paste a GitHub URL and ask questions about the codebase.<br />
            Gitzy reads every file and answers in plain English.
          </p>
          <div className="hero-ctas">
            <button className="g-btn" onClick={() => openModal("signup")} style={{ padding: "13px 28px", fontSize: "15px", boxShadow: "0 4px 16px rgba(34,197,94,0.25)" }}>
              Start for free →
            </button>
            <a href="https://github.com/Mars-60/project2" target="_blank" rel="noopener noreferrer" className="ghost-btn" style={{ padding: "13px 28px", fontSize: "15px", textDecoration: "none", display: "inline-block", textAlign: "center" }}>
              View on GitHub
            </a>
          </div>
        </section>

        {/* Demo bar */}
        <div className="demo-wrap">
          <div className="demo-bar">
            <Github size={16} color="#4b5563" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", color: "#4b5563", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              github.com/vercel/next.js
            </span>
            <button className="g-btn" onClick={() => openModal("signup")} style={{ padding: "7px 14px", fontSize: "12px", borderRadius: "7px", whiteSpace: "nowrap" }}>
              Analyze →
            </button>
          </div>
          <p style={{ textAlign: "center", fontSize: "12px", color: "#374151", marginTop: "10px", fontFamily: "'JetBrains Mono', monospace" }}>
            Works with any public GitHub repository
          </p>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {[
            { num: "~60%", label: "Fewer API calls via caching" },
            { num: "⚡ Fast", label: "Groq-powered streaming" },
            { num: "∞", label: "Any public GitHub repo" },
          ].map((s, i) => (
            <div key={i} className="stat-item">
              <div style={{ fontSize: "22px", fontWeight: "700", color: "#22c55e", fontFamily: "'JetBrains Mono', monospace", marginBottom: "4px" }}>{s.num}</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="features-section">
          <p style={{ textAlign: "center", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: "#374151", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>CAPABILITIES</p>
          <h2 style={{ textAlign: "center", fontSize: "24px", fontWeight: "700", color: "#f9fafb", marginBottom: "24px", letterSpacing: "-0.01em" }}>
            Everything to explore a codebase
          </h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "rgba(34,197,94,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", color: "#22c55e" }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#f9fafb", marginBottom: "6px" }}>{f.title}</h3>
                <p style={{ fontSize: "12px", color: "#6b7280", lineHeight: "1.6", margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="footer-cta">
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f9fafb", marginBottom: "8px", letterSpacing: "-0.01em" }}>
            Ready to explore a codebase?
          </h2>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>Free to use. No credit card required.</p>
          <button className="g-btn" onClick={() => openModal("signup")} style={{ padding: "14px 36px", fontSize: "15px", boxShadow: "0 4px 16px rgba(34,197,94,0.25)" }}>
            Create free account →
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "16px" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#121217", border: "1px solid #27272a", borderRadius: "16px", padding: "24px 20px", width: "100%", maxWidth: "400px", position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
            <button className="modal-close" onClick={() => setShowModal(false)} style={{ position: "absolute", top: "12px", right: "12px", background: "none", border: "none", color: "#6b7280", cursor: "pointer", padding: "6px", borderRadius: "6px", display: "flex", transition: "all 0.15s" }}>
              <X size={18} />
            </button>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "4px" }}>
              <Sparkles size={18} color="#22c55e" />
              <span style={{ fontSize: "20px", fontWeight: "700", color: "#22c55e", letterSpacing: "-0.02em" }}>Gitzy</span>
            </div>
            <p style={{ textAlign: "center", fontSize: "13px", color: "#6b7280", marginBottom: "20px" }}>
              {modalTab === "signin" ? "Welcome back. Sign in to continue." : "Create your free account."}
            </p>
            <div style={{ display: "flex", background: "#0b0b0f", borderRadius: "10px", padding: "3px", gap: "3px", marginBottom: "20px" }}>
              {["signin", "signup"].map(tab => (
                <button key={tab} onClick={() => setModalTab(tab)} style={{ flex: 1, padding: "8px", borderRadius: "7px", border: "none", background: modalTab === tab ? "#22c55e" : "transparent", color: modalTab === tab ? "#000" : "#6b7280", fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "all 0.15s" }}>
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

  const handleOAuth = (p) => {
    localStorage.removeItem("token"); localStorage.removeItem("userEmail");
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/${p}`;
  };

  return (
    <>
      {error && <div style={{ marginBottom: "12px", padding: "10px 12px", borderRadius: "8px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", fontSize: "13px", color: "#f87171" }}>{error}</div>}
      <input className="inp" type="email" placeholder="Email address" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} />
      <input className="inp" type="password" placeholder="Password (min 4 characters)" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} />
      <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "12px", borderRadius: "9px", border: "none", background: loading ? "#1f2937" : "#22c55e", color: loading ? "#6b7280" : "#000", fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", marginBottom: "16px", transition: "all 0.15s" }}>
        {loading ? "Please wait..." : tab === "signin" ? "Sign in" : "Create account"}
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
        <div style={{ flex: 1, height: "1px", background: "#27272a" }} />
        <span style={{ fontSize: "11px", color: "#374151" }}>OR</span>
        <div style={{ flex: 1, height: "1px", background: "#27272a" }} />
      </div>
      {["google", "github"].map(p => (
        <button key={p} className="oauth-btn" onClick={() => handleOAuth(p)}>
          {p === "google"
            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            : <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          }
          {tab === "signin" ? "Continue" : "Sign up"} with {p.charAt(0).toUpperCase() + p.slice(1)}
        </button>
      ))}
    </>
  );
}

export default LandingPage;
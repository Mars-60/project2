import { useState } from "react";
import { Sparkles, X, Github } from "lucide-react";

function LandingPage({ onLogin, onLogout }) {
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState("signin"); // "signin" | "signup"

  const openModal = (tab = "signin") => {
    setModalTab(tab);
    setShowModal(true);
  };

  const features = [
    { icon: "📁", title: "File explorer", desc: "Browse the full repo tree and click any file for an instant AI breakdown." },
    { icon: "💬", title: "Repo chat", desc: "Ask architecture questions about the entire codebase, not just one file." },
    { icon: "⚡", title: "Streaming answers", desc: "Responses stream token-by-token so you see the answer as it's generated." },
    { icon: "🔐", title: "OAuth login", desc: "Sign in with Google or GitHub — no passwords required." },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b0b0f", color: "#e5e7eb", position: "relative" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px", borderBottom: "1px solid #1f1f23",
        position: "sticky", top: 0, backgroundColor: "#0b0b0f", zIndex: 40,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={20} stroke="#22c55e" />
          <span style={{ fontSize: "20px", fontWeight: "600", color: "#22c55e" }}>Gitzy</span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => openModal("signin")} style={ghostBtn}>Sign in</button>
          <button onClick={() => openModal("signup")} style={primaryBtn}>Get started</button>
        </div>
      </nav>

      {/* Page content — blurs when modal open */}
      <div style={{ filter: showModal ? "blur(2px)" : "none", transition: "filter 0.2s", pointerEvents: showModal ? "none" : "auto" }}>

        {/* Hero */}
        <section style={{ textAlign: "center", padding: "72px 32px 48px", maxWidth: "680px", margin: "0 auto" }}>
          <div style={badgeStyle}>AI-powered · Built with Groq API</div>
          <h1 style={{ fontSize: "44px", fontWeight: "700", lineHeight: "1.15", color: "#f9fafb", marginBottom: "16px", letterSpacing: "-0.02em" }}>
            Understand any GitHub repo<br />
            <span style={{ color: "#22c55e" }}>in minutes, not hours</span>
          </h1>
          <p style={{ fontSize: "17px", color: "#9ca3af", lineHeight: "1.7", marginBottom: "32px" }}>
            Paste a GitHub URL and ask questions about the codebase. Gitzy reads the files,
            understands the structure, and answers in plain English.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => openModal("signup")} style={{ ...primaryBtn, padding: "13px 32px", fontSize: "15px", boxShadow: "0 4px 15px rgba(34,197,94,0.3)" }}>
              Start for free →
            </button>
            <a href="https://github.com/Mars-60/project2" target="_blank" rel="noopener noreferrer" style={{ ...ghostBtn, padding: "13px 32px", fontSize: "15px", textDecoration: "none", display: "inline-block" }}>
              View on GitHub
            </a>
          </div>
        </section>

        {/* Demo bar */}
        <div style={{ maxWidth: "600px", margin: "0 auto 56px", padding: "0 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#18181b", border: "1px solid #27272a", borderRadius: "10px", padding: "12px 16px" }}>
            <Github size={18} color="#9ca3af" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: "13px", fontFamily: "monospace", color: "#6b7280", flex: 1 }}>github.com/vercel/next.js</span>
            <button onClick={() => openModal("signup")} style={{ ...primaryBtn, padding: "6px 14px", fontSize: "13px" }}>Analyze →</button>
          </div>
          <p style={{ textAlign: "center", fontSize: "12px", color: "#6b7280", marginTop: "10px" }}>Works with any public GitHub repository</p>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", borderTop: "1px solid #1f1f23", borderBottom: "1px solid #1f1f23", marginBottom: "56px" }}>
          {[
            { num: "60%", label: "Fewer API calls via caching" },
            { num: "40%", label: "Faster response time" },
            { num: "Any", label: "Public GitHub repo" },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", padding: "24px 16px", borderRight: i < 2 ? "1px solid #1f1f23" : "none" }}>
              <div style={{ fontSize: "26px", fontWeight: "700", color: "#22c55e" }}>{s.num}</div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 32px 56px" }}>
          <h2 style={{ textAlign: "center", fontSize: "28px", fontWeight: "700", color: "#f9fafb", marginBottom: "32px", letterSpacing: "-0.01em" }}>
            Everything you need to explore a codebase
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
            {features.map((f, i) => (
              <div key={i} style={featureCard} onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.35)"; e.currentTarget.style.transform = "translateY(-3px)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#1f1f23"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ fontSize: "20px", marginBottom: "10px" }}>{f.icon}</div>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#f9fafb", marginBottom: "6px" }}>{f.title}</h3>
                <p style={{ fontSize: "13px", color: "#9ca3af", lineHeight: "1.6" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{ textAlign: "center", padding: "56px 32px", borderTop: "1px solid #1f1f23" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f9fafb", marginBottom: "8px" }}>Ready to explore a codebase?</h2>
          <p style={{ fontSize: "15px", color: "#9ca3af", marginBottom: "24px" }}>Free to use. No credit card required.</p>
          <button onClick={() => openModal("signup")} style={{ ...primaryBtn, padding: "14px 40px", fontSize: "15px", boxShadow: "0 4px 15px rgba(34,197,94,0.3)" }}>
            Create free account →
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
        >
          <div onClick={e => e.stopPropagation()} style={{ background: "#121217", border: "1px solid #27272a", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "400px", position: "relative", margin: "0 16px" }}>

            {/* Close button */}
            <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: "12px", right: "14px", background: "none", border: "none", color: "#6b7280", cursor: "pointer", padding: "4px", borderRadius: "6px", display: "flex", alignItems: "center", transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#e5e7eb"} onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}>
              <X size={18} />
            </button>

            {/* Brand */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "4px" }}>
              <Sparkles size={18} stroke="#22c55e" />
              <span style={{ fontSize: "20px", fontWeight: "700", color: "#22c55e" }}>Gitzy</span>
            </div>
            <p style={{ textAlign: "center", fontSize: "13px", color: "#9ca3af", marginBottom: "20px" }}>
              {modalTab === "signin" ? "Welcome back. Sign in to continue." : "Create an account to get started."}
            </p>

            {/* Tabs */}
            <div style={{ display: "flex", background: "#0b0b0f", borderRadius: "8px", padding: "3px", gap: "3px", marginBottom: "20px" }}>
              {["signin", "signup"].map(tab => (
                <button key={tab} onClick={() => setModalTab(tab)} style={{
                  flex: 1, padding: "8px", borderRadius: "6px", border: "none",
                  background: modalTab === tab ? "#22c55e" : "transparent",
                  color: modalTab === tab ? "#000" : "#9ca3af",
                  fontSize: "13px", fontWeight: "500", cursor: "pointer", transition: "all 0.15s",
                }}>
                  {tab === "signin" ? "Sign in" : "Sign up"}
                </button>
              ))}
            </div>

            {/* Inline AuthForm */}
            <ModalAuthForm tab={modalTab} onLogin={onLogin} onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

// Inline auth form inside the modal
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
      const endpoint = tab === "signin" ? "/api/auth/login" : "/api/auth/signup";
      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/${provider}`;
  };

  return (
    <>
      {error && (
        <div style={{ marginBottom: "12px", padding: "10px 12px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", fontSize: "13px", color: "#f87171" }}>
          {error}
        </div>
      )}
      <input type="email" placeholder="Enter your email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
        style={inputStyle} onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#27272a"} />
      <input type="password" placeholder="Password (minimum 4 characters)" value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
        style={inputStyle} onFocus={e => e.target.style.borderColor = "#22c55e"} onBlur={e => e.target.style.borderColor = "#27272a"} />
      <button onClick={handleSubmit} disabled={loading} style={{ ...primaryBtn, width: "100%", padding: "11px", fontSize: "14px", marginBottom: "14px", opacity: loading ? 0.6 : 1 }}>
        {loading ? "Please wait..." : tab === "signin" ? "Sign in" : "Create account"}
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
        <div style={{ flex: 1, height: "1px", background: "#27272a" }} />
        <span style={{ fontSize: "11px", color: "#6b7280" }}>OR</span>
        <div style={{ flex: 1, height: "1px", background: "#27272a" }} />
      </div>
      {["google", "github"].map(p => (
        <button key={p} onClick={() => handleOAuth(p)} style={oauthBtn}
          onMouseEnter={e => { e.currentTarget.style.background = "#27272a"; e.currentTarget.style.borderColor = "#3f3f46"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#18181b"; e.currentTarget.style.borderColor = "#27272a"; }}>
          {p === "google" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          )}
          {tab === "signin" ? "Continue" : "Sign up"} with {p.charAt(0).toUpperCase() + p.slice(1)}
        </button>
      ))}
    </>
  );
}

// Shared style objects
const primaryBtn = {
  borderRadius: "8px", border: "none", background: "#22c55e",
  color: "#000", fontWeight: "600", cursor: "pointer",
  transition: "background 0.15s, transform 0.1s",
};

const ghostBtn = {
  padding: "8px 16px", borderRadius: "8px",
  border: "1px solid #27272a", background: "transparent",
  color: "#e5e7eb", fontSize: "14px", cursor: "pointer",
  transition: "background 0.15s, border-color 0.15s",
};

const featureCard = {
  background: "#121217", border: "1px solid #1f1f23",
  borderRadius: "12px", padding: "20px",
  transition: "border-color 0.2s, transform 0.2s", cursor: "default",
};

const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: "8px",
  border: "1px solid #27272a", background: "#0f0f11",
  color: "#e5e7eb", fontSize: "13px", marginBottom: "10px",
  outline: "none", transition: "border-color 0.15s", display: "block",
};

const oauthBtn = {
  width: "100%", padding: "9px", borderRadius: "8px",
  border: "1px solid #27272a", background: "#18181b",
  color: "#d1d5db", fontSize: "13px", cursor: "pointer",
  marginBottom: "8px", display: "flex", alignItems: "center",
  justifyContent: "center", gap: "8px",
  transition: "background 0.15s, border-color 0.15s",
};

const badgeStyle = {
  display: "inline-flex", alignItems: "center", gap: "6px",
  fontSize: "12px", padding: "4px 12px", borderRadius: "999px",
  background: "rgba(34,197,94,0.1)", color: "#22c55e",
  border: "1px solid rgba(34,197,94,0.2)", marginBottom: "24px",
};

export default LandingPage;
import { useState, useRef, useEffect } from "react";
import { Sparkles, User, LogOut, ChevronDown } from "lucide-react";
import { parseGitHubRepo } from "../utils/parseGitHubRepo";

function HomeScreen({ onAnalyze, userEmail, onLogout }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleAnalyze = () => {
    if (!repoUrl.trim()) return;
    const result = parseGitHubRepo(repoUrl);
    if (!result.valid) { alert(result.error); return; }
    onAnalyze(repoUrl);
  };

  const suggestions = [
    "github.com/facebook/react",
    "github.com/vercel/next.js",
    "github.com/microsoft/vscode",
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#060810", color: "#e2e8f0", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .analyze-btn { transition: all 0.2s; }
        .analyze-btn:hover { background: #00e87a !important; transform: translateY(-1px); box-shadow: 0 0 24px rgba(0,255,136,0.4) !important; }
        .analyze-btn:disabled { background: #1e293b !important; color: #334155 !important; transform: none !important; box-shadow: none !important; cursor: not-allowed; }
        .suggestion-pill { transition: all 0.15s; }
        .suggestion-pill:hover { border-color: rgba(0,255,136,0.4) !important; color: #22c55e !important; background: rgba(0,255,136,0.05) !important; }
        .repo-input:focus { outline: none; border-color: #22c55e !important; box-shadow: 0 0 0 3px rgba(0,255,136,0.1) !important; }
        .user-btn { transition: all 0.15s; }
        .user-btn:hover { background: #0d1117 !important; border-color: #1e293b !important; }
        @keyframes pulse-glow {
          0%, 100% { text-shadow: 0 0 40px rgba(0,255,136,0.15); }
          50% { text-shadow: 0 0 80px rgba(0,255,136,0.4); }
        }
        .hero-accent { animation: pulse-glow 3s ease-in-out infinite; }
        @media (max-width: 640px) {
          .home-hero { padding: 48px 16px 32px !important; }
          .home-h1 { font-size: 30px !important; }
          .home-input-row { flex-direction: column !important; }
          .home-input-row button { width: 100% !important; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "1px solid #0f172a", background: "rgba(6,8,16,0.92)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={18} color="#22c55e" />
          <span style={{ fontSize: "17px", fontWeight: "700", color: "#22c55e", letterSpacing: "-0.02em" }}>Gitzy</span>
        </div>
        <div className="user-btn" ref={menuRef} style={{ position: "relative" }}>
          <button onClick={() => setShowMenu(!showMenu)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "9px", border: "1px solid #0f172a", background: "transparent", color: "#64748b", cursor: "pointer", fontSize: "13px" }}>
            <User size={15} />
            <span style={{ maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userEmail}</span>
            <ChevronDown size={14} style={{ transform: showMenu ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
          </button>
          {showMenu && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#0d1117", border: "1px solid #1e293b", borderRadius: "10px", padding: "8px", minWidth: "180px", zIndex: 50, boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}>
              <div style={{ padding: "8px 10px 10px", borderBottom: "1px solid #1e293b", marginBottom: "6px" }}>
                <div style={{ fontSize: "11px", color: "#334155", fontFamily: "'JetBrains Mono', monospace", marginBottom: "2px" }}>signed in as</div>
                <div style={{ fontSize: "13px", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis" }}>{userEmail}</div>
              </div>
              <button onClick={onLogout} style={{ width: "100%", padding: "8px 10px", borderRadius: "7px", border: "none", background: "transparent", color: "#94a3b8", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", textAlign: "left", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#f87171"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}>
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main */}
      <main className="home-hero" style={{ maxWidth: "680px", margin: "0 auto", padding: "80px 24px 48px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", padding: "4px 12px", borderRadius: "999px", background: "rgba(0,255,136,0.07)", color: "#22c55e", border: "1px solid rgba(0,255,136,0.15)", marginBottom: "24px", letterSpacing: "0.06em" }}>
          ◆ READY TO ANALYZE
        </div>
        <h1 className="home-h1 hero-accent" style={{ fontSize: "40px", fontWeight: "700", lineHeight: "1.15", color: "#f1f5f9", marginBottom: "14px", letterSpacing: "-0.03em" }}>
          What would you like<br />to explore today?
        </h1>
        <p style={{ fontSize: "16px", color: "#475569", marginBottom: "36px", lineHeight: "1.7" }}>
          Paste any public GitHub repository URL below.
        </p>

        {/* Input row */}
        <div className="home-input-row" style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
          <input
            className="repo-input"
            type="text"
            value={repoUrl}
            onChange={e => setRepoUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAnalyze()}
            placeholder="https://github.com/owner/repo"
            style={{ flex: 1, padding: "14px 16px", fontSize: "14px", fontFamily: "'JetBrains Mono', monospace", backgroundColor: "#0d1117", border: "1px solid #1e293b", borderRadius: "10px", color: "#e2e8f0", transition: "border-color 0.15s" }}
          />
          <button className="analyze-btn" onClick={handleAnalyze} disabled={!repoUrl.trim()} style={{ padding: "14px 24px", fontSize: "14px", fontWeight: "700", background: "#22c55e", color: "#060810", border: "none", borderRadius: "10px", cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 0 20px rgba(0,255,136,0.2)" }}>
            Analyze →
          </button>
        </div>

        {/* Suggestion pills */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: "#334155", alignSelf: "center", fontFamily: "'JetBrains Mono', monospace" }}>try:</span>
          {suggestions.map(s => (
            <button key={s} className="suggestion-pill" onClick={() => setRepoUrl("https://" + s)} style={{ padding: "5px 12px", borderRadius: "999px", border: "1px solid #1e293b", background: "transparent", color: "#475569", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", cursor: "pointer" }}>
              {s.split("/").slice(1).join("/")}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

export default HomeScreen;
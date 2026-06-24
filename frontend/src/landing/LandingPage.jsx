import { Sparkles } from "lucide-react";

function LandingPage({ onGetStarted, onSignIn }) {
  const features = [
    {
      icon: "📁",
      title: "File explorer",
      desc: "Browse the full repo tree and click any file to get an instant AI breakdown.",
      color: "#dcfce7",
      iconColor: "#16a34a",
    },
    {
      icon: "💬",
      title: "Repo chat",
      desc: "Ask architecture questions about the entire codebase, not just one file.",
      color: "#dbeafe",
      iconColor: "#1d4ed8",
    },
    {
      icon: "⚡",
      title: "Streaming answers",
      desc: "Responses stream token-by-token so you see the answer as it's generated.",
      color: "#ede9fe",
      iconColor: "#7c3aed",
    },
    {
      icon: "🔐",
      title: "OAuth login",
      desc: "Sign in with Google or GitHub — no passwords required.",
      color: "#fef3c7",
      iconColor: "#d97706",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b0b0f", color: "#e5e7eb" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px", borderBottom: "1px solid #1f1f23",
        position: "sticky", top: 0, backgroundColor: "#0b0b0f", zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={20} stroke="#22c55e" />
          <span style={{ fontSize: "20px", fontWeight: "600", color: "#22c55e" }}>Gitzy</span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={onSignIn}
            style={{
              padding: "8px 16px", borderRadius: "8px",
              border: "1px solid #27272a", background: "transparent",
              color: "#e5e7eb", fontSize: "14px", cursor: "pointer",
            }}
          >
            Sign in
          </button>
          <button
            onClick={onGetStarted}
            style={{
              padding: "8px 16px", borderRadius: "8px",
              border: "none", background: "#22c55e",
              color: "#000", fontSize: "14px", fontWeight: "600", cursor: "pointer",
            }}
          >
            Get started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "72px 32px 48px", maxWidth: "680px", margin: "0 auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          fontSize: "12px", padding: "4px 12px", borderRadius: "999px",
          background: "rgba(34,197,94,0.1)", color: "#22c55e",
          border: "1px solid rgba(34,197,94,0.2)", marginBottom: "24px",
        }}>
          AI-powered · Built with Groq API
        </div>

        <h1 style={{
          fontSize: "44px", fontWeight: "700", lineHeight: "1.15",
          color: "#f9fafb", marginBottom: "16px", letterSpacing: "-0.02em",
        }}>
          Understand any GitHub repo<br />
          <span style={{ color: "#22c55e" }}>in minutes, not hours</span>
        </h1>

        <p style={{ fontSize: "17px", color: "#9ca3af", lineHeight: "1.7", marginBottom: "32px" }}>
          Paste a GitHub URL and ask questions about the codebase. Gitzy reads the files,
          understands the structure, and answers in plain English.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
  <button
    onClick={onGetStarted}
    style={{
      padding: "13px 32px",
      borderRadius: "10px",
      border: "none",
      background: "#22c55e",
      color: "#000",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(34,197,94,0.3)",
    }}
  >
    Start for free →
  </button>

  <a
    href="https://github.com/Mars-60/project2"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      padding: "13px 32px",
      borderRadius: "10px",
      border: "1px solid #27272a",
      background: "transparent",
      color: "#e5e7eb",
      fontSize: "15px",
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-block",
    }}
  >
    View on GitHub
  </a>
</div>
      </section>

      {/* Demo input bar */}
      <div style={{
        maxWidth: "600px", margin: "0 auto 56px", padding: "0 32px",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          background: "#18181b", border: "1px solid #27272a",
          borderRadius: "10px", padding: "12px 16px",
        }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ color: "#9ca3af", flexShrink: 0 }}>
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span style={{ fontSize: "13px", fontFamily: "monospace", color: "#6b7280", flex: 1 }}>
            github.com/vercel/next.js
          </span>
          <button
            onClick={onGetStarted}
            style={{
              padding: "6px 14px", borderRadius: "6px", border: "none",
              background: "#22c55e", color: "#000", fontSize: "13px",
              fontWeight: "600", cursor: "pointer",
            }}
          >
            Analyze →
          </button>
        </div>
        <p style={{ textAlign: "center", fontSize: "12px", color: "#6b7280", marginTop: "10px" }}>
          Works with any public GitHub repository
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: "flex", gap: "0", justifyContent: "center",
        borderTop: "1px solid #1f1f23", borderBottom: "1px solid #1f1f23",
        marginBottom: "56px",
      }}>
        {[
          { num: "60%", label: "Fewer API calls via caching" },
          { num: "40%", label: "Faster response time" },
          { num: "Any", label: "Public GitHub repo supported" },
        ].map((s, i) => (
          <div key={i} style={{
            textAlign: "center", padding: "24px 40px",
            borderRight: i < 2 ? "1px solid #1f1f23" : "none",
          }}>
            <div style={{ fontSize: "26px", fontWeight: "700", color: "#22c55e" }}>{s.num}</div>
            <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 32px 56px" }}>
        <h2 style={{
          textAlign: "center", fontSize: "28px", fontWeight: "700",
          color: "#f9fafb", marginBottom: "32px", letterSpacing: "-0.01em",
        }}>
          Everything you need to explore a codebase
        </h2>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px",
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: "#121217", border: "1px solid #1f1f23",
              borderRadius: "12px", padding: "20px",
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "8px",
                background: f.color + "22", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "18px", marginBottom: "12px",
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#f9fafb", marginBottom: "6px" }}>
                {f.title}
              </h3>
              <p style={{ fontSize: "13px", color: "#9ca3af", lineHeight: "1.6" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{
        textAlign: "center", padding: "56px 32px",
        borderTop: "1px solid #1f1f23",
      }}>
        <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f9fafb", marginBottom: "8px" }}>
          Ready to explore a codebase?
        </h2>
        <p style={{ fontSize: "15px", color: "#9ca3af", marginBottom: "24px" }}>
          Free to use. No credit card required.
        </p>
        <button
          onClick={onGetStarted}
          style={{
            padding: "14px 40px", borderRadius: "10px", border: "none",
            background: "#22c55e", color: "#000", fontSize: "15px",
            fontWeight: "600", cursor: "pointer",
            boxShadow: "0 4px 15px rgba(34,197,94,0.3)",
          }}
        >
          Create free account →
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
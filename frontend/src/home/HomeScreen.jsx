import { useState } from "react";
import { Sparkles, User, Home } from "lucide-react";
import { parseGitHubRepo } from "../utils/parseGitHubRepo";

function HomeScreen({ onAnalyze, userEmail, onLogout }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const handleAnalyze = () => {
    if (!repoUrl.trim()) return;

    // Validating GitHub repo BEFORE navigation
    const result = parseGitHubRepo(repoUrl);

    // If invalid -> stay on HomeScreen
    if (!result.valid) {
      alert(result.error);
      return;
    }

    // If valid -> go to Workspace
    onAnalyze(repoUrl);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f0f11",
        color: "#e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
      }}
    >
      {/* Top-right actions */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          display: "flex",
          gap: "8px",
        }}
      >
        {/* Account / Logout */}
        <div style={{ position: "relative" }}>
          <button
            title="Account"
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            style={{
              padding: "8px",
              borderRadius: "10px",
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              color: "#22c55e",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#27272a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#18181b";
            }}
          >
            <User size={18} />
          </button>

          {/* Account Dropdown */}
          {showAccountMenu && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "10px",
                padding: "12px",
                minWidth: "200px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                zIndex: 50,
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#9ca3af",
                  marginBottom: "8px",
                  paddingBottom: "8px",
                  borderBottom: "1px solid #27272a",
                }}
              >
                {userEmail}
              </div>
              <button
                onClick={onLogout}
                style={{
                  width: "100%",
                  padding: "8px",
                  backgroundColor: "#27272a",
                  border: "none",
                  borderRadius: "6px",
                  color: "#e5e7eb",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#3f3f46";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#27272a";
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          maxWidth: "720px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Branding - Enhanced */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px", // Reduced from 16px
            marginBottom: "32px",
          }}
        >
          {/* Logo - shifted left */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              marginRight: "20px", // Shift left by adding right margin
            }}
          >
            <Sparkles 
              size={40} 
              className="text-white" 
              stroke="#86efac"
              style={{
                filter: "drop-shadow(0 0 8px rgba(134, 239, 172, 0.4))",
              }}
            />
            <h1
              style={{
                fontSize: "56px",
                fontWeight: "700",
                letterSpacing: "-0.02em",
                background: "linear-gradient(135deg, #22c55e 0%, #86efac 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                margin: 0,
              }}
            >
              Gitzy
            </h1>
          </div>

          {/* Tagline - no decorative lines */}
          <div
            style={{
              position: "relative",
              padding: "0", // Removed padding
            }}
          >
            {/* Tagline */}
            <p
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#6b7280",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                margin: 0,
                background: "linear-gradient(90deg, #6b7280, #9ca3af, #6b7280)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AI-Powered GitHub Repository Analyzer
            </p>
          </div>
        </div>

        <p
          style={{
            color: "#9ca3af",
            fontSize: "18px",
            marginBottom: "36px",
          }}
        >
          What would you like to analyze today?
        </p>

        {/* Repo Input */}
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          placeholder="Paste a GitHub repository URL…"
          style={{
            width: "100%",
            padding: "16px",
            fontSize: "16px",
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "10px",
            color: "#e5e7eb",
            marginBottom: "20px",
            outline: "none",
            transition: "all 0.2s",
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = "1px solid #22c55e";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = "1px solid #27272a";
            e.currentTarget.style.boxShadow = "none";
          }}
        />

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          style={{
            padding: "14px 32px",
            fontSize: "16px",
            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
            color: "#000000",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
            boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(34, 197, 94, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(34, 197, 94, 0.3)";
          }}
        >
          Analyze Repository
        </button>
      </div>
    </div>
  );
}

export default HomeScreen;
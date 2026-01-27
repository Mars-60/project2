import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

function WorkspaceView({ repoUrl }) {
    const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    async function fetchTree() {
      try {
        const res = await fetch("http://localhost:5000/api/repo/tree", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ repoUrl }),
        });

        const data = await res.json();
        setTree(data.tree || []);
      } catch (err) {
        console.error("Failed to load repo tree", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTree();
  }, [repoUrl]);

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#0f0f11",
        color: "#e5e7eb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          height: "56px",
          borderBottom: "1px solid #27272a",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: "10px",
          backgroundColor: "#0f0f11",
        }}
      >
        <Sparkles size={20} color="#22c55e" />
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "18px",
          }}
        >
          Gitzy
        </span>
        <span style={{ color: "#9ca3af" }}>•</span>
        <span
          style={{
            color: "#9ca3af",
            fontSize: "14px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {repoUrl}
        </span>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "260px 1fr",
        }}
      >
        {/* Left: Repo Tree */}
        <div
          style={{
            borderRight: "1px solid #27272a",
            padding: "12px",
            backgroundColor: "#18181b",
          }}
        >      
          <div
  style={{
    fontSize: "11px",
    letterSpacing: "0.08em",
    color: "#6b7280",
    marginBottom: "14px",
  }}
>
  EXPLORER
</div>

  <div style={{ marginBottom: "12px" }}>
  <p
    style={{
      fontSize: "13px",
      color: "#9ca3af",
      fontWeight: "600",
      marginBottom: "8px",
      letterSpacing: "0.04em",
    }}
  >
    REPOSITORY FILES
  </p>
</div>

{loading ? (
  <p style={{ color: "#6b7280", fontSize: "13px" }}>
    Loading repository...
  </p>
) : (
  tree.map((item, index) => (
    <div
      key={index}
      style={{
        fontSize: "14px",
        padding: "6px 4px",
        borderRadius: "6px",
        cursor: "pointer",
        color: "#e5e7eb",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "#27272a")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "transparent")
      }
    >
      {item.type === "dir" ? "📁" : "📄"} {item.path}
    </div>
  ))
)}


        </div>

        {/* Right: Gitzy Assistant */}
        <div
  style={{
    padding: "24px",
    overflowY: "auto",
    position: "relative",
  }}
>
<div style={{ marginBottom: "28px" }}>
  <h2
    style={{
      fontSize: "28px",
      fontWeight: "700",
      background: "linear-gradient(90deg, #22c55e, #86efac)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "10px",
    }}
  >
    Welcome to Gitzy ✨
  </h2>

  <p
    style={{
      color: "#9ca3af",
      fontSize: "15px",
      maxWidth: "520px",
      lineHeight: "1.6",
    }}
  >
    Select a file from the repository to start understanding how this project
    works, or ask Gitzy anything about the codebase.
  </p>
</div>
<div style={{ marginTop: "24px" }}>
  <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "10px" }}>
    Try asking:
  </p>

  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
    {[
      "What is this repo about?",
      "Explain the folder structure",
      "Which file should I start with?",
    ].map((q) => (
      <div
        key={q}
        style={{
          fontSize: "13px",
          padding: "8px 14px",
          background: "linear-gradient(180deg, #18181b, #111113)",
          border: "1px solid #27272a",
          borderRadius: "999px",
          color: "#d1d5db",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#22c55e";
          e.currentTarget.style.color = "#22c55e";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#27272a";
          e.currentTarget.style.color = "#d1d5db";
        }}
      >
        {q}
      </div>
    ))}
  </div>
</div>

          <div
  style={{
    position: "absolute",
    bottom: "24px",
    left: "24px",
    right: "24px",
  }}
><div
  style={{
    backgroundColor: "#0b0b0f",
    border: "1px solid #27272a",
    borderRadius: "14px",
    padding: "10px",
    boxShadow: "0 0 0 1px rgba(34,197,94,0.05)",
  }}
>
  <input
    placeholder="Ask Gitzy about this repository…"
    style={{
      width: "100%",
      padding: "10px 12px",
      backgroundColor: "transparent",
      border: "none",
      outline: "none",
      color: "#e5e7eb",
      fontSize: "14px",
    }}
  />
</div>
</div>

        </div>
      </div>
    </div>
  );
}

export default WorkspaceView;

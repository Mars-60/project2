import { Sparkles } from "lucide-react";

function WorkspaceView({ repoUrl }) {
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
          <p style={{ color: "#9ca3af", fontSize: "13px" }}>
            Repository Tree
          </p>
        </div>

        {/* Right: Gitzy Assistant */}
        <div
          style={{
            padding: "24px",
            overflowY: "auto",
          }}
        >
          <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
            Welcome to Gitzy 👋
          </h2>
          <p style={{ color: "#9ca3af" }}>
            Select a file from the repository to start understanding the code.
          </p>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceView;

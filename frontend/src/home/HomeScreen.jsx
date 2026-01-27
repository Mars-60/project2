import { useState } from "react";
import { Sparkles } from "lucide-react";

function HomeScreen({ onAnalyze }) {
  const [repoUrl, setRepoUrl] = useState("");

  const handleAnalyze = () => {
    if (!repoUrl.trim()) return;
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
      }}
    >
      <div
        style={{
          maxWidth: "720px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <Sparkles color="#22c55e" size={36} />
     <h1
  style={{
    fontSize: "42px",
    fontWeight: "600",
    letterSpacing: "-0.02em",
  }}
>
  Gitzy
</h1>


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
          }}
        />

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          style={{
            padding: "12px 28px",
            fontSize: "16px",
            backgroundColor: "#22c55e",
            color: "#0f0f11",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Analyze Repository
        </button>
      </div>
    </div>
  );
}

export default HomeScreen;

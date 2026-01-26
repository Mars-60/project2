import GitzyMain from "../components/gitzy/GitzyMain";


function MainLayout() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        height: "calc(100vh - 56px)", // navbar height
      }}
    >
      {/* Left: Repo Tree */}
      <div
        style={{
          borderRight: "1px solid #27272a",
          backgroundColor: "#18181b",
          padding: "12px",
          overflowY: "auto",
        }}
      >
        Repo Tree
      </div>

      {/* Right: Gitzy Main */}
      <div
        style={{
          backgroundColor: "#0f0f11",
          padding: "24px",
          overflowY: "auto",
        }}
      >
        <GitzyMain />
      </div>
    </div>
  );
}

export default MainLayout;

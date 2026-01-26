import { useState } from "react";
import AuthScreen from "./auth/AuthScreen.jsx";
import HomeScreen from "./home/HomeScreen.jsx";
import WorkspaceView from "./workspace/WorkspaceView.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");

  // 1️⃣ Not logged in → show login/signup
  if (!isAuthenticated) {
    return <AuthScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  // 2️⃣ Logged in but no repo yet → show Gitzy Home
  if (!repoUrl) {
    return <HomeScreen onAnalyze={(url) => setRepoUrl(url)} />;
  }

  // 3️⃣ Repo selected → show workspace
  return <WorkspaceView repoUrl={repoUrl} />;
}

export default App;

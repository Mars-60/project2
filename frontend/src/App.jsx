import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthScreen from "./auth/AuthScreen.jsx";
import AuthCallback from "./auth/AuthCallback.jsx";
import HomeScreen from "./home/HomeScreen.jsx";
import WorkspaceView from "./workspace/WorkspaceView.jsx";
import LandingPage from "./landing/LandingPage.jsx";  // ← new

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [currentView, setCurrentView] = useState("landing"); // ← changed from "home"
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    
    if (token && email) {
      fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.userId) {
            setIsAuthenticated(true);
            setUserEmail(email);
            setCurrentView("home"); // ← skip landing if already logged in
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userEmail');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (token, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    setIsAuthenticated(true);
    setUserEmail(email);
    setCurrentView("home");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserEmail("");
    setRepoUrl("");
    setCurrentView("landing"); // ← goes back to landing on logout
  };

  const handleAnalyze = (url) => {
    setRepoUrl(url);
    setCurrentView("workspace");
  };

  const handleGoHome = () => {
    setCurrentView("home");
    setRepoUrl("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback onLogin={handleLogin} />} />
        <Route path="*" element={
          !isAuthenticated ? (
            currentView === "landing" ? (
              <LandingPage
                onGetStarted={() => setCurrentView("auth")}
                onSignIn={() => setCurrentView("auth")}
              />
            ) : (
              <AuthScreen onLogin={handleLogin} onLogout={handleLogout} />
            )
          ) : currentView === "home" ? (
            <HomeScreen onAnalyze={handleAnalyze} userEmail={userEmail} onLogout={handleLogout} />
          ) : (
            <WorkspaceView repoUrl={repoUrl} userEmail={userEmail} onLogout={handleLogout} onGoHome={handleGoHome} />
          )
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
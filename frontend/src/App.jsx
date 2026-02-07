import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthScreen from "./auth/AuthScreen.jsx";
import AuthCallback from "./auth/AuthCallback.jsx";
import HomeScreen from "./home/HomeScreen.jsx";
import WorkspaceView from "./workspace/WorkspaceView.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [currentView, setCurrentView] = useState("home"); 
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    
    if (token && email) {
      // Verifying if token is still valid
      fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.userId) {
            setIsAuthenticated(true);
            setUserEmail(email);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
          }
        })
        .catch(() => {
          // Network error or invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('userEmail');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (token, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserEmail("");
    setRepoUrl("");
    setCurrentView("home");
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
        {/* OAuth Callback Route */}
        <Route path="/auth/callback" element={<AuthCallback onLogin={handleLogin} />} />

        {/* Protected Routes */}
        {!isAuthenticated ? (
          <Route path="*" element={<AuthScreen onLogin={handleLogin} />} />
        ) : (
          <>
            {currentView === "home" ? (
              <Route 
                path="*" 
                element={
                  <HomeScreen 
                    onAnalyze={handleAnalyze} 
                    userEmail={userEmail}
                    onLogout={handleLogout}
                  />
                } 
              />
            ) : (
              <Route 
                path="*" 
                element={
                  <WorkspaceView 
                    repoUrl={repoUrl} 
                    userEmail={userEmail} 
                    onLogout={handleLogout}
                    onGoHome={handleGoHome}
                  />
                } 
              />
            )}
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
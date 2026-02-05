import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Github, Sparkles, AlertCircle } from "lucide-react";

function AuthScreen({ onLogin }) {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check for OAuth errors on mount
  useEffect(() => {
    const errorParam = searchParams.get('error');
    const messageParam = searchParams.get('message');
    const emailParam = searchParams.get('email');

    if (errorParam === 'no_account') {
      setError(messageParam || 'This account does not exist. Please sign up first.');
      setIsLogin(false); // Switch to signup mode
      if (emailParam) {
        setEmail(decodeURIComponent(emailParam));
      }
    } else if (errorParam === 'auth_failed') {
      setError('Authentication failed. Please try again.');
    }
  }, [searchParams]);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|in)$/i;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    return password.length >= 4;
  };

  const handleSubmit = async () => {
    setError('');

    // Validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email must end with .com or .in');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 4 characters');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Authentication failed');
        setLoading(false);
        return;
      }

      // Store token and email
      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', email);
        onLogin(data.token, email);
      } else {
        // Auto-login after signup
        setError('');
        setIsLogin(true);
        setPassword('');
        setError('Account created! Please login.');
      }

    } catch (err) {
      console.error('Auth error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

const handleOAuthLogin = (provider) => {
  // ✅ Clear any existing tokens before OAuth
  localStorage.removeItem('token');
  localStorage.removeItem('userEmail');
  
  window.location.href = `http://localhost:5000/api/auth/${provider}`;
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0f] px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#121217] p-8 shadow-xl">
        
        {/* Branding - Enhanced */}
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center gap-3 mb-3">
            <div
              style={{
                padding: "10px",
                borderRadius: "12px",
                //background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                //boxShadow: "0 0 20px rgba(34, 197, 94, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles className="h-7 w-7 text-white" stroke="#86efac"/>
          
            <h1 
              style={{
                fontSize: "36px",
                fontWeight: "700",
                background: "linear-gradient(135deg, #22c55e 0%, #86efac 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >   Gitzy
            </h1>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            {isLogin
              ? "Welcome back. Sign in to continue."
              : "Create an account to get started with Gitzy."}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2">
            <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-5">
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email (must end with .com or .in)"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3.5
              text-white placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
            {email && !validateEmail(email) && (
              <p className="text-xs text-red-400 mt-1">Email must end with .com or .in</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password (minimum 4 characters)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3.5
              text-white placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
            {password && !validatePassword(password) && (
              <p className="text-xs text-red-400 mt-1">Password must be at least 4 characters</p>
            )}
          </div>

          {/* Primary Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full text-white font-semibold
            rounded-lg px-4 py-3.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: loading ? "#6b7280" : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              boxShadow: loading ? "none" : "0 4px 15px rgba(34, 197, 94, 0.3)",
            }}
          >
            {loading ? 'Please wait...' : (isLogin ? "Sign In" : "Create Account")}
          </button>
        </div>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3 text-xs text-gray-500">
          <div className="h-px flex-1 bg-gray-800" />
          OR
          <div className="h-px flex-1 bg-gray-800" />
        </div>

        {/* OAuth Buttons */}
        <div className="mt-6 space-y-3">
          <button 
            onClick={() => handleOAuthLogin('google')}
            className="w-full flex items-center justify-center gap-3 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-4 py-3.5 hover:bg-gray-700 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isLogin ? "Continue with Google" : "Sign up with Google"}
          </button>

          <button 
            onClick={() => handleOAuthLogin('github')}
            className="w-full flex items-center justify-center gap-3 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-4 py-3 hover:bg-gray-700 transition"
          >
            <Github className="w-5 h-5" />
            {isLogin ? "Continue with GitHub" : "Sign up with GitHub"}
          </button>
        </div>

        {/* Toggle Login/Signup */}
        <p className="mt-5 text-center text-sm text-gray-400">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                className="text-green-400 hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                className="text-green-400 hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default AuthScreen;
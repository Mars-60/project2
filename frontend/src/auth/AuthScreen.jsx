import { useState } from "react";
import { Github, Mail, Lock, Sparkles } from "lucide-react";
// Login/Signup Component
function AuthScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onLogin();
  };
return (
  <div className="min-h-screen flex items-center justify-center bg-[#0b0b0f] px-4">
    <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#121217] p-8 shadow-xl">

      {/* Branding */}
      <div className="mb-8 text-center">
        <div className="flex justify-center items-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-green-400" />
          <h1 className="text-3xl font-semibold text-green-400">
            Gitzy
          </h1>
        </div>
       <p className="text-sm text-gray-400">
  {isLogin
    ? "Welcome back. Sign in to continue."
    : "Create an account to get started with Gitzy."}
</p>

      </div>
<div className="space-y-5">
  {/* Email */}
  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3.5
    text-white placeholder-gray-500
    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
  />

  {/* Password */}
  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3.5
    text-white placeholder-gray-500
    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
  />

  {/* Primary Button */}
  <button
    onClick={handleSubmit}
    className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold
    rounded-lg px-4 py-3.5 transition shadow-lg shadow-green-500/20"
  >
    {isLogin ? "Sign In" : "Create Account"}
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
  <button className="w-full flex items-center justify-center gap-3 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-4 py-3.5 hover:bg-gray-700 transition">
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z"/>
      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
    {isLogin ? "Continue with Google" : "Sign up with Google"}
  </button>

  <button className="w-full flex items-center justify-center gap-3 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-4 py-3 hover:bg-gray-700 transition">
    <Github className="w-5 h-5" />
    {isLogin ? "Continue with GitHub" : "Sign up with GitHub"}
  </button>
</div>


      {/* Signup */}
      <p className="mt-5 text-center text-sm text-gray-400">
  {isLogin ? (
    <>
      Don’t have an account?{" "}
      <button
        onClick={() => setIsLogin(false)}
        className="text-green-400 hover:underline"
      >
        Sign up
      </button>
    </>
  ) : (
    <>
      Already have an account?{" "}
      <button
        onClick={() => setIsLogin(true)}
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

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function AuthCallback({ onLogin }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const error = searchParams.get("error");

    if (error) {
      alert("Authentication failed. Please try again.");
      navigate("/");
      return;
    }

    if (token && email) {
      // Store token and email
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", email);
      
      // Call parent login handler
      onLogin(token, email);
      
      // Navigate to home
      navigate("/");
    } else {
      navigate("/");
    }
  }, [searchParams, navigate, onLogin]);

  return (
    <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default AuthCallback;
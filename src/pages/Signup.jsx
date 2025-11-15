import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Please enter both email and password.");
        setLoading(false);
        return;
      }

      console.log("⏳ Creating user in Supabase...");
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user) throw new Error("User not created.");

      console.log("✅ User created:", data.user.id);

      // ✅ REMOVE manual profile insert
      // Supabase auth trigger will automatically create a profile row

      alert("✅ Account created! Please check your email to verify.");
      navigate("/login");
    } catch (err) {
      console.error("🔥 Signup failed:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#FFEE8C] rounded-full -translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#FFEE8C] rounded-full -translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-32 bg-[#FFEE8C] transform rotate-45 translate-x-1/2 translate-y-1/2"></div>

      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 mb-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-full h-full text-[#FFEE8C]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#FFEE8C]">Pet Care</h1>
          </div>

          <h2 className="text-center text-gray-800 text-lg mb-8">
            Create an Account
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFEE8C] focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFEE8C] focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label className="flex items-center cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 text-[#FFEE8C] border-gray-300 rounded focus:ring-[#FFEE8C]"
              />
              <span className="ml-2 text-gray-600">Remember me</span>
            </label>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFEE8C] text-gray-800 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors shadow-lg disabled:opacity-70"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="block text-sm text-gray-600 hover:text-[#FFEE8C] text-center mt-4"
            >
              ← Back to Login
            </button>
          </form>

          <div className="mt-8 flex justify-center space-x-4 text-xs text-gray-500">
            <button className="hover:text-[#FFEE8C]">Terms & Conditions</button>
            <button className="hover:text-[#FFEE8C]">Privacy Policy</button>
          </div>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden lg:flex w-1/2 bg-[#FFEE8C] items-center justify-center relative overflow-hidden">
        <div className="relative z-10 w-full h-full flex items-center justify-center p-12">
          <div className="bg-[#FFEE8C] rounded-3xl overflow-hidden shadow-2xl w-full max-w-lg">
            <img
              src="https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&auto=format&fit=crop&q=80"
              alt="Pet Care"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

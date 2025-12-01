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

      // 1️⃣ Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      if (!authData.user) throw new Error("User not created.");

      const userId = authData.user.id;

      // 2️⃣ Upsert the profile in the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .upsert([{ id: userId, email, role: "owner" }], { onConflict: "id" });

      if (profileError) {
        console.log("Profile upsert error:", profileError);
        throw profileError;
      }

      alert("✅ Account created! Please check your email to verify.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Circles */}
      <div className="absolute top-0 left-0 w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-[#FFEE8C] rounded-full -translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 bg-[#FFEE8C] rounded-full -translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-24 sm:w-80 sm:h-28 md:w-96 md:h-32 bg-[#FFEE8C] rotate-45 translate-x-1/2 translate-y-1/2"></div>

      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 w-full max-w-md">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6 sm:mb-8">
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

          <h2 className="text-center text-gray-800 text-lg mb-6 sm:mb-8">Create an Account</h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFEE8C] focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFEE8C] focus:border-transparent"
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

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

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

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-4 text-xs text-gray-500 text-center">
            <button className="hover:text-[#FFEE8C]">Terms & Conditions</button>
            <button className="hover:text-[#FFEE8C]">Privacy Policy</button>
          </div>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden md:flex lg:w-1/2 items-center justify-center relative overflow-hidden">
        <div className="relative z-10 w-full h-full flex items-center justify-center p-6 sm:p-12">
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

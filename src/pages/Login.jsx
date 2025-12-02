import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { PawPrint } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      title: "We Love The Pet Like You Love The Pet",
      description:
        "Caring for your furry friends as much as you do because every paw, wag, and purr deserves gentle hands, expert care, and a little extra love.",
    },
    {
      title: "Your Pet's Health Is Our Priority",
      description:
        "Professional care and attention for your beloved companions. Schedule appointments and track wellness easily.",
    },
    {
      title: "Join Our Pet-Loving Community",
      description:
        "Connect with veterinarians, groomers, and fellow pet owners who share your passion for animal care.",
    },
  ];

  // AUTO-REDIRECT IF LOGGED IN
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        navigate("/homepage");
      }
    };

    checkSession();
  }, []);

  // HANDLE LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      // Sign in the user
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) throw loginError;
      if (!loginData.user) throw new Error("No user found.");

      // Optional: check email confirmation
      if (!loginData.user.confirmed_at) {
        throw new Error("Please verify your email before logging in.");
      }

      // Redirect to homepage
      navigate("/homepage");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FDFFB6]">
      {/* Left Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="text-amber-600">
              <PawPrint className="w-8 h-8 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">PETCARE</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Paws and purrs Welcome!
          </h1>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg border border-transparent bg-gradient-to-r from-[#FFF0F5] to-[#FFD6E0] focus:outline-none focus:ring-2 focus:ring-[#E7D27C] shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg border border-transparent bg-gradient-to-r from-[#FFF0F5] to-[#FFD6E0] focus:outline-none focus:ring-2 focus:ring-[#E7D27C] shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-amber-600"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => alert("Forgot password")}
                className="text-sm text-amber-600 hover:text-amber-700"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full font-semibold text-white bg-gradient-to-r from-[#E0BBE4] via-[#FFDFD3] to-[#FEC8D8] hover:opacity-90 transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300"
            >
              {loading ? "Logging in..." : "🐾 Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Not registered yet?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Sign up for free
            </button>
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-300 via-gray-200 to-stone-300 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-8 right-8 opacity-20 text-white">
          <PawPrint className="w-20 h-20" />
        </div>

        <div className="relative z-10 text-center max-w-lg">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6 leading-tight">
            {slides[currentSlide].title}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {slides[currentSlide].description}
          </p>

          <div className="flex justify-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === i ? "bg-amber-500 scale-110" : "bg-gray-400"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Navigate } from "react-router-dom";
import loadingGif from "../assets/Loading.png"; // Updated to PNG for Vite compatibility

// -----------------------------
// Loading Screen with PNG
// -----------------------------
function LoadingScreen({ gifSrc = loadingGif }) {
  const [bounce, setBounce] = useState(0);

  useEffect(() => {
    const bounceInterval = setInterval(() => {
      setBounce(prev => {
        const next = prev + 0.1;
        return next > Math.PI * 2 ? 0 : next;
      });
    }, 50);

    return () => clearInterval(bounceInterval);
  }, []);

  const bounceOffset = Math.sin(bounce) * 20;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div
        className="relative flex flex-col items-center"
        style={{ transform: `translateY(${bounceOffset}px)` }}
      >
        <img
          src={gifSrc}
          alt="Loading..."
          className="w-48 sm:w-64 md:w-72 lg:w-80 object-contain transition-all duration-500 bg-transparent"
        />

        <div className="mt-6 text-center">
          <p className="text-2xl font-bold text-amber-700 animate-pulse">Loading...</p>
          <p className="text-sm text-amber-600 mt-2">Woof woof! 🐾</p>
        </div>
      </div>
    </div>
  );
}

// -----------------------------
// Protected Route with Role Check
// -----------------------------
export default function ProtectedRoute({ children, allowedRoles }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session;
      setSession(currentSession);

      if (currentSession) {
        const { data: roleData } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentSession.user.id)
          .single();

        setRole(roleData?.role || null);
      }

      setLoading(false);
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <LoadingScreen />;

  if (!session) return <Navigate to="/login" replace />;

  // ROLE CHECK
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

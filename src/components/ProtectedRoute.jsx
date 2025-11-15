import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Navigate } from "react-router-dom";

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
          .from("user_roles")
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

  if (loading) return <p>Loading...</p>;

  if (!session) return <Navigate to="/login" replace />;

  // ROLE CHECK
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

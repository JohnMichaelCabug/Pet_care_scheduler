import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import PetRecords from "./pages/PetRecords";
import Reminders from "./pages/Reminders";
import Unauthorized from "./pages/Unauthorized";
import Homepage from "./pages/Homepage";
import ProtectedRoute from "./components/ProtectedRoute";
import { supabase } from "./lib/supabaseClient";
import LoadingScreen from "./components/LoadingScreen";


export default function App() {
  const [session, setSession] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    // Show loading page for 1s (you can adjust)
    const timer = setTimeout(() => setLoadingPage(false), 1000);

    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      clearTimeout(timer);
      listener.subscription.unsubscribe();
    };
  }, []);

  // ✅ Show loading screen before app renders
  if (loadingPage) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Header />
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Homepage - accessible after login */}
        <Route
          path="/homepage"
          element={
            <ProtectedRoute allowedRoles={["owner", "vet", "admin"]}>
              <Homepage />
            </ProtectedRoute>
          }
        />

        {/* Dashboard - Owner + Admin */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["owner", "admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Appointments - Vet + Admin */}
        <Route
          path="/appointments"
          element={
            <ProtectedRoute allowedRoles={["vet", "admin"]}>
              <Appointments />
            </ProtectedRoute>
          }
        />

        {/* Pet Records - Vet + Admin */}
        <Route
          path="/pets"
          element={
            <ProtectedRoute allowedRoles={["vet", "admin"]}>
              <PetRecords />
            </ProtectedRoute>
          }
        />

        {/* Reminders - Owner + Admin */}
        <Route
          path="/reminders"
          element={
            <ProtectedRoute allowedRoles={["owner", "admin"]}>
              <Reminders />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </Router>
  );
}

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import {
  PawPrint,
  Menu,
  X,
  Home,
  Calendar,
  FileText,
  Users,
  Settings,
  LogOut,
  Bell,
  Check,
  Repeat,
  House, // <-- NEW ICON
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(""); 
  const [reminders, setReminders] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [showReminders, setShowReminders] = useState(false);
  const alertRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setRole(user?.user_metadata?.role || "user");
      setEmail(user?.email || "");
    };
    getUserRole();
  }, []);

  useEffect(() => {
    let channel;

    const fetchAllReminders = async () => {
      setLoadingReminders(true);
      const today = new Date().toISOString().slice(0, 10);
      const future = new Date();
      future.setDate(future.getDate() + 60);
      const isoFuture = future.toISOString().slice(0, 10);

      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .gte("return_date", today)
        .lte("return_date", isoFuture)
        .order("return_date", { ascending: true });

      if (!error) {
        setReminders(data || []);
        playDueAlerts(data || []);
      }
      setLoadingReminders(false);
    };

    fetchAllReminders();

    channel = supabase
      .channel("realtime-reminders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        fetchAllReminders
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const playDueAlerts = (remindersList) => {
    const today = new Date();
    const due = remindersList.some((r) => {
      if (!r.return_date) return false;
      const diff =
        new Date(r.return_date).setHours(0, 0, 0, 0) -
        today.setHours(0, 0, 0, 0);
      return diff <= 0 && r.status !== "completed";
    });
    if (due && alertRef.current) {
      alertRef.current.volume = 0.5;
      alertRef.current.play().catch(() => {
        console.log("Audio play blocked by browser interaction");
      });
    }
  };

  const markAsDone = async (id) => {
    await supabase.from("appointments").update({ status: "completed" }).eq("id", id);
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const snoozeDays = async (id, days) => {
    const { data } = await supabase.from("appointments").select("return_date").eq("id", id).single();
    const curr = new Date(data.return_date || new Date());
    curr.setDate(curr.getDate() + days);
    await supabase.from("appointments").update({ return_date: curr.toISOString().slice(0, 10) }).eq("id", id);
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, return_date: curr.toISOString().slice(0, 10) } : r))
    );
  };

  const daysUntil = (dateStr) => {
    if (!dateStr) return null;
    const diff = new Date(dateStr).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleLogoClick = () => {
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 w-12 h-12 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        {isOpen ? <X className="w-6 h-6 text-purple-600" /> : <Menu className="w-6 h-6 text-purple-600" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <nav
        onMouseLeave={() => window.innerWidth >= 1024 && setIsOpen(false)}
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 border-r border-purple-200 shadow-2xl transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0 z-50" : "-translate-x-full z-40"} w-64`}
      >
        <div className="flex flex-col h-full p-6 pt-20 relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-transform hover:scale-110 z-50"
          >
            <X className="w-5 h-5 text-purple-600" />
          </button>

          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex items-center gap-3 mb-2 cursor-pointer"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center shadow-md">
              <PawPrint className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <span className="font-bold text-gray-800 text-lg block">Pet Care</span>
              <span className="text-xs text-gray-600">Scheduler</span>
            </div>
          </Link>

          {email && (
            <p className="text-gray-700 text-sm mb-4 px-2 break-words">
              Logged in as: <span className="font-medium">{email}</span>
            </p>
          )}

          <div className="flex flex-col gap-3">

            {/* ⭐ NEW — Go to Homepage Button */}
            <Link
              to="/homepage"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/80 hover:bg-white text-gray-800 hover:text-purple-600 font-medium text-sm transition-all hover:scale-105 shadow-sm border border-purple-100 group"
            >
              <House className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Go to Homepage</span>
            </Link>

            {/* ORIGINAL DASHBOARD BUTTON */}
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/80 hover:bg-white text-gray-700 hover:text-purple-600 font-medium text-sm transition-all hover:scale-105 shadow-sm border border-purple-100 group"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Dashboard</span>
            </Link>

            {role === "user" && (
              <>
                <Link
                  to="/appointments"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/80 hover:bg-white text-gray-700 hover:text-purple-600 font-medium text-sm transition-all hover:scale-105 shadow-sm border border-purple-100 group"
                >
                  <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Appointments</span>
                </Link>

                <Link
                  to="/pets"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/80 hover:bg-white text-gray-700 hover:text-purple-600 font-medium text-sm transition-all hover:scale-105 shadow-sm border border-purple-100 group"
                >
                  <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Pet Records</span>
                </Link>
              </>
            )}

            {role === "admin" && (
              <>
                <Link
                  to="/manage-users"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/80 hover:bg-white text-gray-700 hover:text-purple-600 font-medium text-sm transition-all hover:scale-105 shadow-sm border border-purple-100 group"
                >
                  <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Manage Users</span>
                </Link>

                <Link
                  to="/reports"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/80 hover:bg-white text-gray-700 hover:text-purple-600 font-medium text-sm transition-all hover:scale-105 shadow-sm border border-purple-100 group"
                >
                  <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Reports</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/80 hover:bg-white text-gray-700 hover:text-purple-600 font-medium text-sm transition-all hover:scale-105 shadow-sm border border-purple-100 group"
                >
                  <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Settings</span>
                </Link>
              </>
            )}

            {/* REMINDERS DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setShowReminders(!showReminders)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/80 hover:bg-white text-gray-700 hover:text-purple-600 font-medium text-sm transition-all hover:scale-105 shadow-sm border border-purple-100 group w-full justify-between"
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Reminders</span>
                </div>
                <span className="text-xs font-bold bg-purple-200 text-purple-700 px-2 py-1 rounded-full">
                  {reminders.length}
                </span>
              </button>

              {showReminders && (
                <div className="absolute left-0 mt-2 w-full max-h-96 overflow-y-auto bg-white rounded-2xl border border-purple-200 shadow-lg z-50 p-3">
                  <audio ref={alertRef} src="/alert-tone.wav" preload="auto" />
                  {loadingReminders && <p className="text-gray-500 text-sm">Loading...</p>}
                  {!loadingReminders && reminders.length === 0 && (
                    <p className="text-gray-500 text-sm text-center">No reminders</p>
                  )}
                  {!loadingReminders &&
                    reminders.map((r) => {
                      const days = daysUntil(r.return_date);
                      return (
                        <div
                          key={r.id}
                          className="flex justify-between items-center p-2 border-b border-purple-100 last:border-b-0 rounded-lg hover:bg-purple-50"
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-700">{r.pet_name || "Unknown Pet"}</span>
                            <span className="text-xs text-gray-500">{r.return_date} {r.time || ""}</span>
                          </div>
                          <div className="flex gap-1 items-center">
                            <button
                              onClick={() => markAsDone(r.id)}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" /> Done
                            </button>
                            <button
                              onClick={() => snoozeDays(r.id, 7)}
                              className="px-2 py-1 bg-yellow-50 text-amber-700 rounded-full text-xs font-semibold flex items-center gap-1"
                            >
                              <Repeat className="w-3 h-3" /> +7d
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-auto pt-6 border-t border-purple-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-sm font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>

            <div className="text-center text-xs text-gray-600 mt-4">
              <div className="mb-2">🐾</div>
              <p>Made with love</p>
              <p>for your pets</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
}

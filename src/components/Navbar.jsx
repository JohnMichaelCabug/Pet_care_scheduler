import { useState, useEffect } from "react";
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
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [role, setRole] = useState(null); // 🟢 "admin" or "user"
  const navigate = useNavigate();

  // 🔍 Fetch user role from Supabase on mount
  useEffect(() => {
    const getUserRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // if you store role in metadata, fetch it like:
        setRole(user.user_metadata?.role || "user");
      } else {
        setRole("user");
      }
    };
    getUserRole();
  }, []);

  const handleLogoClick = () => {
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const sidebarVisible = isOpen || isHovered;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 w-12 h-12 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        {sidebarVisible ? (
          <X className="w-6 h-6 text-purple-600" />
        ) : (
          <Menu className="w-6 h-6 text-purple-600" />
        )}
      </button>

      {/* Sidebar */}
      <nav
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 border-r border-purple-200 shadow-2xl z-40 transition-transform duration-300 ease-in-out
        ${sidebarVisible ? "translate-x-0" : "-translate-x-full"} w-64`}
      >
        <div className="flex flex-col h-full p-6 pt-20">
          {/* Logo */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex items-center gap-3 mb-8 pb-6 border-b border-purple-200 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center shadow-md">
              <PawPrint className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <span className="font-bold text-gray-800 text-lg block">
                Pet Care
              </span>
              <span className="text-xs text-gray-600">Scheduler</span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="flex flex-col gap-3">
            {/* 🌸 Common Links for all roles */}
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/80 hover:bg-white text-gray-700 hover:text-purple-600 font-medium text-sm transition-all hover:scale-105 shadow-sm border border-purple-100 group"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Dashboard</span>
            </Link>

            {/* 🐾 User POV */}
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

            {/* 🛠️ Admin POV */}
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
          </div>

          {/* Footer with Logout */}
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

      {/* Spacer for desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
}

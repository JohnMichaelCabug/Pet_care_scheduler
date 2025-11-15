import { Heart, Calendar, Bell, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import logo from "../assets/logo1-removebg-preview.png"; // Import your 3D cute logo here

export default function Dashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [reminders, setReminders] = useState([]);

  // Fetch appointments & reminders on load
  useEffect(() => {
    fetchAppointments();
    fetchReminders();

    // Realtime subscriptions
    const channelAppointments = supabase
      .channel("realtime-appointments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => {
          fetchAppointments();
          fetchReminders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelAppointments);
    };
  }, []);

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("date", { ascending: true });

    if (!error) setAppointments(data);
  };

  // Fetch upcoming reminders (next 60 days)
  const fetchReminders = async () => {
    const { data } = await supabase.from("appointments").select("*");

    if (!data) return;

    const today = new Date().toISOString().slice(0, 10);
    const future = new Date();
    future.setDate(future.getDate() + 60);
    const isoFuture = future.toISOString().slice(0, 10);

    const upcoming = data.filter(
      (a) => a.return_date >= today && a.return_date <= isoFuture
    );

    setReminders(upcoming);
  };

  const upcoming = appointments.filter((a) => a.status === "upcoming").length;
  const completed = appointments.filter((a) => a.status === "completed").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-30 h-30 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full mb-4 shadow-2xl transform hover:scale-110 transition-transform">
            <img
              src={logo}
              alt="Pet Care Logo"
              className="w-30 h-30 object-contain"
            />
          </div>

          {/* Headline */}
          <h1
            className="text-3xl sm:text-4xl font-extrabold mb-2 text-pink-400"
            style={{
              fontFamily: "'Baloo 2', cursive",
              
            }}
          >
            Pet Care Scheduler
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 text-sm sm:text-base">
            Keep your furry friends happy and healthy! 🐾
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Appointments */}
          <div
            className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-6 shadow-lg border border-blue-200 hover:scale-105 transition-transform cursor-pointer"
            onClick={() => navigate("/appointments")}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-blue-700">{upcoming}</span>
            </div>
            <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wide">
              Appointments
            </h3>
          </div>

          {/* Reminders */}
          <div
            className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-6 shadow-lg border border-purple-200 hover:scale-105 transition-transform cursor-pointer"
            onClick={() => navigate("/reminders")}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-purple-700">{reminders.length}</span>
            </div>
            <h3 className="text-sm font-semibold text-purple-900 uppercase tracking-wide">
              Reminders
            </h3>
          </div>

          {/* Pet Records */}
          <div
            className="bg-gradient-to-br from-rose-100 to-orange-100 rounded-3xl p-6 shadow-lg border border-rose-200 hover:scale-105 transition-transform cursor-pointer sm:col-span-2 lg:col-span-1"
            onClick={() => navigate("/pets")}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-rose-600" />
              </div>
              <span className="text-3xl font-bold text-rose-700">{completed}</span>
            </div>
            <h3 className="text-sm font-semibold text-rose-900 uppercase tracking-wide">
              Pet Health Records
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

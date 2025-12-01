import { Heart, Calendar as CalendarIcon, Bell, FileText, Clock, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { ChevronLeft, ChevronRight, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import logo from "../assets/logo1-removebg-preview.png";
import { Calendar } from "lucide-react";

// -----------------------------
// 📅 Appointment Calendar Component
// -----------------------------
function AppointmentCalendar({ appointments }) {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalData, setModalData] = useState([]);

  const today = new Date();

  // Normalize appointments to YYYY-MM-DD
  const daysWithAppointments = appointments.map(a =>
    new Date(a.date).toISOString().slice(0, 10)
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDayClick = (day) => {
    const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(fullDate);

    // Filter appointments for modal
    const selectedDayAppointments = appointments.filter(
      a => new Date(a.date).toISOString().slice(0, 10) === fullDate
    );
    setModalData(selectedDayAppointments);

    // Navigate to appointments page
    navigate(`/appointments?date=${fullDate}`);
  };

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 mb-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-lg hover:bg-gray-100">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-lg font-bold text-gray-900">
          {monthName} {year}
        </h2>

        <button onClick={handleNextMonth} className="p-2 rounded-lg hover:bg-gray-100">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-600">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 text-center mt-2">
        {Array(firstDay).fill(null).map((_, i) => (
          <div key={i}></div>
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

          const isToday =
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;

          const hasAppointment = daysWithAppointments.includes(dateStr);

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`relative h-10 flex items-center justify-center rounded-lg transition-all 
                ${isToday ? "bg-blue-600 text-white font-bold shadow-md" : "hover:bg-gray-100"}
              `}
            >
              {day}
              {/* Appointment Dot */}
              {hasAppointment && (
                <span className="absolute bottom-1 w-2 h-2 bg-pink-500 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Modal for selected day */}
      {selectedDate && (
        <div className="mt-4 p-3 border rounded-xl bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Appointments on {selectedDate}
          </h3>

          {modalData.length === 0 ? (
            <p className="text-xs text-gray-500">No appointments.</p>
          ) : (
            modalData.map((a, i) => (
              <div key={i} className="p-2 bg-white rounded-lg shadow mb-2 border text-sm">
                <p className="font-semibold">{a.pet_name}</p>
                <p className="text-gray-600">{a.service_type || "Checkup"}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}


// -----------------------------
// Pet GIF Carousel Component
// -----------------------------
function PetCarousel() {
  const gifs = [
    "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NnBleXp6NGEzd2tyeWZkb2VkM3RpeGFiaW9oa3Q0emJ0NjV6N3YxbCZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/sLQ0sUAFjdI4VSYZxX/giphy.gif",        // Regular Checkups
    "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3ZTdkc2xyYTA1Mnlkanp2MDJ5ZnA0dWpxMTJ0c2ZhemU0Nm5raDFiOCZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/ND9uSyunNfNCZnuNud/giphy.gif",    // Vaccination Tracking
    "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bGkzaTk5N2kxbWlndnc0ZDF6aTg5NW51ZzFzN2Jxc2tobnhhc2M3YiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3ohjUSGpIXMiNMuLjW/giphy.gif",         // Health Monitoring
  ];

  const [currentGif, setCurrentGif] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGif((prev) => (prev + 1) % gifs.length);
    }, 3000); // change GIF every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const nextGif = () => setCurrentGif((prev) => (prev + 1) % gifs.length);
  const prevGif = () => setCurrentGif((prev) => (prev - 1 + gifs.length) % gifs.length);

  return (
    <div className="mb-5 relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-xl border-2 border-white">
      <img
  src={gifs[currentGif]}
  alt="Pet GIF"
  className="w-full h-60 sm:h-70 md:h-60 lg:h-60 object-contain rounded-3xl transition-all duration-500"
/>


      {/* Navigation buttons */}
      <button
        onClick={prevGif}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all z-20 hover:scale-110"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      <button
        onClick={nextGif}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all z-20 hover:scale-110"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-4 sm:mt-6 absolute bottom-3 w-full">
        {gifs.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentGif(index)}
            className={`w-2 h-2 sm:h-2 sm:w-2 rounded-full transition-all ${
              index === currentGif ? "bg-white w-5 sm:w-6" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// -----------------------------
// Health Analytics Component
// -----------------------------
function HealthAnalytics({ appointments = [], reminders = [] }) {
  const upcoming = appointments.filter((a) => a.status === "upcoming").length;
  const completed = appointments.filter((a) => a.status === "completed").length;
  const total = appointments.length;

  const thisMonth = new Date().getMonth();
  const thisMonthAppointments = appointments.filter(
    (a) => new Date(a.date).getMonth() === thisMonth
  ).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const healthScore = reminders.length === 0 ? "A+" : reminders.length <= 2 ? "B+" : "C+";

  return (
    <div className="mb-6 bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Pet Health Analytics</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 sm:p-4 text-center shadow-sm hover:shadow-md transition-shadow border border-blue-200">
          <div className="text-2xl sm:text-3xl font-bold text-blue-700">{total}</div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Total Records</div>
          <div className="mt-2 text-xl sm:text-2xl">📋</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 sm:p-4 text-center shadow-sm hover:shadow-md transition-shadow border border-purple-200">
          <div className="text-2xl sm:text-3xl font-bold text-purple-700">{thisMonthAppointments}</div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">This Month</div>
          <div className="mt-2 text-xl sm:text-2xl">📅</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 sm:p-4 text-center shadow-sm hover:shadow-md transition-shadow border border-green-200">
          <div className="text-2xl sm:text-3xl font-bold text-green-700">{completionRate}%</div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Completion</div>
          <div className="mt-2 text-xl sm:text-2xl">✅</div>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-3 sm:p-4 text-center shadow-sm hover:shadow-md transition-shadow border border-pink-200">
          <div className="text-2xl sm:text-3xl font-bold text-pink-700">{healthScore}</div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Health Score</div>
          <div className="mt-2 text-xl sm:text-2xl">⭐</div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        <div className="flex flex-col gap-2">
  <div className="flex items-center justify-between">
    <span className="text-xs sm:text-sm font-semibold text-gray-700">Overall Progress</span>
    <span className="text-xs sm:text-sm font-bold text-gray-700">{completionRate}%</span>
  </div>

  <div className="relative w-full bg-gray-200 rounded-full h-6 sm:h-8">
    {/* Emoji progress */}
    <span
      className="absolute top-1/2 -translate-y-1/2 text-2xl sm:text-3xl transition-all duration-1000 ease-out"
      style={{ left: `calc(${completionRate}% - 0.75rem)` }} // adjust offset for center alignment
    >
      {completionRate < 25
        ? "🐶"
        : completionRate < 50
        ? "🐱"
        : completionRate < 75
        ? "🐰"
        : "🦊"}
    </span>

    {/* Optional background track */}
    <div className="w-full h-full rounded-full overflow-hidden">
      <div className="w-full h-full bg-gray-200 rounded-full" />
    </div>
  </div>
</div>

      </div>

      <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-3">
        <div className="bg-green-50 rounded-xl p-2 sm:p-3 flex items-center gap-1 sm:gap-2 border border-green-200">
          <span className="text-xl sm:text-2xl">✨</span>
          <div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Completed</div>
            <div className="text-sm sm:text-lg font-bold text-green-700">{completed}</div>
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl p-2 sm:p-3 flex items-center gap-1 sm:gap-2 border border-blue-200">
          <span className="text-xl sm:text-2xl">🎯</span>
          <div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Upcoming</div>
            <div className="text-sm sm:text-lg font-bold text-blue-700">{upcoming}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------
// Recent Activity Component
// -----------------------------
function RecentActivity({ appointments = [] }) {
  const sortedAppointments = [...appointments]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getStatusIcon = (status) => {
    if (status === "completed") return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (status === "upcoming") return <Clock className="w-4 h-4 text-blue-600" />;
    return <AlertCircle className="w-4 h-4 text-orange-600" />;
  };

  const getStatusColor = (status) => {
    if (status === "completed") return "bg-green-100 text-green-700 border-green-200";
    if (status === "upcoming") return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-orange-100 text-orange-700 border-orange-200";
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Activity</h2>
        </div>
      </div>

      <div className="space-y-3">
        {sortedAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No appointments yet</p>
          </div>
        ) : (
          sortedAppointments.map((appointment, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <div className="flex-shrink-0 mt-1">{getStatusIcon(appointment.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{appointment.pet_name}</p>
                    <p className="text-xs text-gray-600 truncate">{appointment.service_type || "Checkup"}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium border ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <p className="text-xs text-gray-500">{formatDate(appointment.date)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {sortedAppointments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:bg-indigo-50 rounded-lg py-2 transition-colors">
            View All Activities →
          </button>
        </div>
      )}
    </div>
  );
}

// -----------------------------
// PROFESSIONAL DASHBOARD
// -----------------------------
export default function Dashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    fetchAppointments();
    fetchReminders();

    const channelAppointments = supabase
      .channel("realtime-appointments")
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, () => {
        fetchAppointments();
        fetchReminders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channelAppointments);
    };
  }, []);

  const fetchAppointments = async () => {
    const { data, error } = await supabase.from("appointments").select("*").order("date", { ascending: true });
    if (!error) setAppointments(data || []);
  };

  const fetchReminders = async () => {
    const { data } = await supabase.from("appointments").select("*");
    if (!data) return;
    const today = new Date().toISOString().slice(0, 10);
    const future = new Date();
    future.setDate(future.getDate() + 60);
    const isoFuture = future.toISOString().slice(0, 10);

    const upcoming = data.filter((a) => a.return_date >= today && a.return_date <= isoFuture);
    setReminders(upcoming);
  };

  const upcoming = appointments.filter((a) => a.status === "upcoming").length;
  const completed = appointments.filter((a) => a.status === "completed").length;

  return (
   <div className="min-h-screen bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl p-4 sm:p-6 lg:p-8">
  <div className="max-w-7xl mx-auto">
    {/* Header */}
    <div className="my-0.5 sm:my-0.5 lg:my-0.5"> {/* Adjustable top & bottom margins */}
      <div className="flex items-center gap-1 mb-1 sm:mb-6 lg:mb-8"> {/* Gap between logo & text */}
        <div className="w-30 h-30 sm:w-32 sm:h-32 bg-transparent rounded-xl flex items-center justify-center">
          <img src={logo} alt="Pet Care Logo" className="w-12/8 h-12/8 object-contain" />
        </div>

        <div>
          <h1
            className="text-3xl sm:text-4xl font-bold animate-typing"
            style={{ color: "#FFD6A5" }}
          >
            Pet Care Management
          </h1>

          <p className="text-gray-600 text-sm sm:text-base mt-1 sm:mt-2">
            Pet health tracking and scheduling.
          </p>
        </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pet GIF Carousel */}
            <PetCarousel />

            {/* Health Analytics */}
            <HealthAnalytics appointments={appointments} reminders={reminders} />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Appointments Card */}
              <div
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => navigate("/appointments")}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <Calendar className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-3xl font-bold text-blue-700">{upcoming}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Appointments</h3>
              </div>

              {/* Reminders Card */}
              <div
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => navigate("/reminders")}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                    <Bell className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-3xl font-bold text-purple-700">{reminders.length}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Reminders</h3>
              </div>

              {/* Health Records Card */}
              <div
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => navigate("/pets")}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center group-hover:bg-rose-600 transition-colors">
                    <FileText className="w-6 h-6 text-rose-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-3xl font-bold text-rose-700">{completed}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Health Records</h3>
              </div>
            </div>
          </div>

          {/* Right Column - Recent Activity (Full Height) */}
          <div className="lg:col-span-1">
            <RecentActivity appointments={appointments} />
          </div>
    <style>{`
  /* Typing */
  @keyframes typing {
    0% { width: 0 }
    40% { width: 19ch }   /* fully typed */
    60% { width: 19ch }   /* pause */
    100% { width: 0 }      /* erase */
  }

  /* Blinking cursor */
  @keyframes cursor {
    0%, 50% { border-color: transparent }
    51%, 100% { border-color: peachpuff }
  }

  .animate-typing {
    width: 19ch;               
    overflow: hidden;
    white-space: nowrap;
    border-right: 4px solid purple;
    animation: 
      typing 4s steps(19) infinite,
      cursor 0.7s infinite;
  }
`}</style>

        </div>
      </div>
    </div>
  );
}

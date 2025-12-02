import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from "../lib/supabaseClient";

export default function Homepage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // ---------------------- STATES ----------------------
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const [showServicesPopup, setShowServicesPopup] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const services = [
    { name: "AI Chatbot", description: "Ask questions and get instant advice about your pet.", icon: "🤖" },
    { name: "Generative AI", description: "Create personalized pet care plans using AI.", icon: "🧠" },
    { name: "Pet Health Tracking", description: "Track your pet’s appointments, vaccinations, and routines.", icon: "🐾" },
    { name: "Appointment Scheduler", description: "Easily book appointments with our care center.", icon: "📅" },
  ];
  // -----------------------------------------------------------

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    const { data, error } = await supabase.from("appointments").select("*");
    if (!error && data) setAppointments(data);
  }

  function hasAppointment(year, month, day) {
    return appointments.some(appt => {
      const d = new Date(appt.date);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  }

  function openAppointmentsPopup(year, month, day) {
    const found = appointments.filter(appt => {
      const d = new Date(appt.date);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
    setSelectedAppointments(found);
    setShowPopup(true);
  }

  // ---------------- SUPABASE FUNCTION CHATBOT ----------------
  async function sendMessageToAI(message) {
    setChatLoading(true);
    try {
      // Calls Supabase Edge Function `genAi` (server-side) which uses Google GenAI
      const { data, error } = await supabase.functions.invoke("genAi", {
        body: { prompt: message },
      });

      if (error) throw error;

      const aiReply = data?.response || "Sorry, I couldn't generate a response.";
      setChatMessages(prev => [...prev, { role: "ai", content: aiReply }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: "ai", content: "Error communicating with AI." }]);
    } finally {
      setChatLoading(false);
    }
  }
  // -------------------------------------------------------

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(selectedDate);
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const today = new Date();
  const isCurrentMonth = selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getFullYear() === today.getFullYear();

  const prevMonth = () => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1));
  const nextMonth = () => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1));
  const petEmojis = ['🐕', '🐈', '🐇', '🐹', '🐦', '🐠'];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT SECTION */}
          <div className="space-y-8 relative">
            <div className="absolute -left-4 top-0 text-gray-200 text-4xl opacity-30 hidden sm:block">🐾</div>

            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight"
                  style={{ fontFamily: "'Baloo 2', cursive", color: "#FFEE8C", textShadow: "2px 2px 4px rgba(0,0,0,0.2)" }}>
                Your Pet<br />care center
              </h1>
              <p className="mt-4 text-gray-600 text-base sm:text-lg">
                Before you bring home your pet, be sure you're ready to take care of it properly.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowServicesPopup(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold flex items-center gap-2 shadow-lg transition-all text-sm sm:text-base">
                Our Services
                <ArrowRight size={20} />
              </button>
              <button className="text-gray-900 font-semibold underline hover:text-purple-600 transition-colors text-sm sm:text-base">
                Schedule a Call
              </button>
            </div>

            {/* CALENDAR */}
            <div className="relative mt-12">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-6 max-w-md shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={prevMonth} className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-purple-50 transition-colors">
                    <ChevronLeft size={20} className="text-purple-600" />
                  </button>
                  <div className="text-center">
                    <h3 className="font-bold text-gray-900 text-xl">
                      {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                    </h3>
                    <p className="text-sm text-purple-600 font-semibold mt-1">🐾 Pet Care Calendar 🐾</p>
                  </div>
                  <button onClick={nextMonth} className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-purple-50 transition-colors">
                    <ChevronRight size={20} className="text-purple-600" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Su','Mo','Tu','We','Th','Fr','Sa'].map(day => (
                    <div key={day} className="text-center text-xs font-bold text-purple-700 py-2">{day}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square"></div>
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isToday = isCurrentMonth && day === today.getDate();
                    const petIcon = petEmojis[day % petEmojis.length];
                    const year = selectedDate.getFullYear();
                    const month = selectedDate.getMonth();
                    const marked = hasAppointment(year, month, day);
                    return (
                      <div
                        key={day}
                        onClick={() => marked && openAppointmentsPopup(year, month, day)}
                        className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-semibold transition-all
                          ${marked ? 'cursor-pointer ring-2 ring-red-400' : ''}
                          ${isToday ? 'bg-gradient-to-br from-orange-400 to-pink-400 text-white shadow-lg scale-110 ring-2 ring-white'
                                     : 'bg-white hover:bg-purple-50 text-gray-700'}`}
                      >
                        {marked && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
                        <span className="text-xs">{isToday ? petIcon : ''}</span>
                        <span>{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="relative flex justify-center lg:justify-end order-2 lg:order-1 mt-12 lg:mt-0">
            <div className="relative z-10 w-56 sm:w-64 md:w-80 lg:w-[350px] h-72 sm:h-80 md:h-96 lg:h-[420px] mx-auto">
              <img
                src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=500&fit=crop"
                alt="Woman with French Bulldog"
                className="w-full h-full object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* APPOINTMENTS POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-80 shadow-xl">
            <h2 className="text-xl font-bold text-purple-700 mb-3">Appointments</h2>
            {selectedAppointments.length === 0 ? (
              <p className="text-gray-600 text-sm">No appointments found.</p>
            ) : (
              <ul className="space-y-2">
                {selectedAppointments.map(appt => (
                  <li key={appt.id} className="p-2 bg-purple-100 rounded-lg text-sm">
                    <p className="font-semibold">{appt.pet_name}</p>
                    <p className="text-gray-700">{appt.service}</p>
                    <p className="text-gray-500 text-xs">{appt.date}</p>
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => setShowPopup(false)} className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg">Close</button>
          </div>
        </div>
      )}

      {/* SERVICES POPUP */}
      {showServicesPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-80 sm:w-96 shadow-xl">
            <h2 className="text-xl font-bold text-purple-700 mb-4">Our Services</h2>
            <ul className="space-y-3">
              {services.map((service, idx) => (
                <li
                  key={idx}
                  onClick={() => service.name === "AI Chatbot" && setShowChatbot(true)}
                  className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-all cursor-pointer"
                >
                  <span className="text-2xl">{service.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{service.name}</p>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button onClick={() => setShowServicesPopup(false)} className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg">Close</button>
          </div>
        </div>
      )}

      {/* AI CHATBOT POPUP */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-80 sm:w-96 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-purple-700">AI Chatbot</h2>
              <button onClick={() => setShowChatbot(false)} className="text-gray-500 font-bold">X</button>
            </div>
            <div className="flex-1 overflow-y-auto h-64 p-2 border rounded-lg mb-2 space-y-2">
              {chatMessages.length === 0 && <p className="text-gray-400 text-sm">Ask me anything about your pet!</p>}
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg text-sm ${msg.role === "ai" ? "bg-purple-100 text-purple-900 self-start" : "bg-gray-200 text-gray-900 self-end"}`}
                >
                  {msg.content}
                </div>
              ))}
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!chatInput.trim()) return;
                setChatMessages(prev => [...prev, { role: "user", content: chatInput }]);
                await sendMessageToAI(chatInput);
                setChatInput("");
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 p-2 border rounded-lg"
                placeholder="Type a message..."
              />
              <button type="submit" className="bg-purple-600 text-white px-4 rounded-lg disabled:opacity-50" disabled={chatLoading}>Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

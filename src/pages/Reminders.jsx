import { useEffect, useState, useRef } from "react";
import { Bell, Calendar, Clock, Check, Repeat } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const alertRef = useRef(null); // 🔊 Audio reference

  useEffect(() => {
    let channel;

    const fetchAllReminders = async () => {
      setLoading(true);
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
        playDueAlerts(data || []); // 🔔 Check for due reminders
      }

      setLoading(false);
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

  // Play alert for reminders due today or overdue
  const playDueAlerts = (remindersList) => {
    const today = new Date();
    const due = remindersList.some((r) => {
      if (!r.return_date) return false;
      const diff = new Date(r.return_date).setHours(0,0,0,0) - today.setHours(0,0,0,0);
      return diff <= 0 && r.status !== "completed"; // due today or overdue
    });
    if (due && alertRef.current) {
      alertRef.current.volume = 0.5; // 50% volume
      alertRef.current.play().catch(() => {
        console.log("Audio play blocked by browser, user must interact first");
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
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, return_date: curr.toISOString().slice(0, 10) } : r)));
  };

  const daysUntil = (dateStr) => {
    if (!dateStr) return null;
    const diff = new Date(dateStr).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <audio ref={alertRef} src="/alert-tone.wav" preload="auto" />
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-600" /> Reminders
          </h1>
          <p className="text-gray-600">Upcoming return visits, boosters, and follow-ups</p>
        </div>

        {loading && <p className="text-gray-500">Loading reminders...</p>}

        {!loading && reminders.length === 0 && (
          <div className="bg-white/80 rounded-3xl p-8 text-center border border-purple-100">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No upcoming reminders in the next 60 days.</p>
          </div>
        )}

        <div className="grid gap-4 mt-4">
          {reminders.map((r) => {
            const days = daysUntil(r.return_date);
            const urgent = days !== null && days <= 7;
            return (
              <div key={r.id} className="bg-white/90 rounded-3xl p-5 border border-purple-100 shadow">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{r.pet_name || "Unknown Pet"}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="inline-flex items-center gap-2 mr-3">
                        <Calendar className="w-4 h-4 text-purple-500" /> {r.return_date}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-500" /> {r.time || "—"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">
                      <strong>{r.type}</strong>
                      {r.veterinarian ? ` • ${r.veterinarian}` : ""}
                    </p>
                    {r.notes && <p className="mt-2 text-sm text-gray-600"><strong>Notes:</strong> {r.notes}</p>}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {urgent ? (
                      <div className="text-xs px-2 py-1 rounded-full bg-rose-100 text-rose-700 font-semibold">
                        Due in {days} day{days !== 1 ? "s" : ""}
                      </div>
                    ) : (
                      <div className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                        {days !== null ? `In ${days} day${days !== 1 ? "s" : ""}` : "No date"}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                      <button onClick={() => markAsDone(r.id)} className="px-3 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        <Check className="w-4 h-4 inline mr-1" /> Mark Done
                      </button>
                      <button onClick={() => snoozeDays(r.id, 7)} className="px-3 py-2 bg-yellow-50 text-amber-700 rounded-full text-sm font-semibold">
                        <Repeat className="w-4 h-4 inline mr-1" /> Snooze 7d
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

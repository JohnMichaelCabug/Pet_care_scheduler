import { useState, useEffect } from "react";
import { Calendar, Clock, Plus, X, Check, Edit2, Trash2, PawPrint } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    petName: "",
    type: "",
    date: "",
    time: "",
    veterinarian: "",
    notes: "",
    returnDate: "",
  });

  const appointmentTypes = [
    "Veterinary Checkup",
    "Vaccination",
    "Grooming",
    "Dental Cleaning",
    "Surgery",
    "Emergency Visit",
    "Follow-up",
  ];

  /* --------------------- FETCH APPOINTMENTS --------------------- */
  useEffect(() => {
    fetchAppointments();

    const channel = supabase
      .channel("realtime-appointments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => fetchAppointments()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("date", { ascending: true });

    if (!error) setAppointments(data || []);
  };

  /* --------------------- INPUT HANDLER --------------------- */
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* --------------------- CREATE / UPDATE --------------------- */
  const handleSubmit = async () => {
    if (!formData.petName || !formData.type || !formData.date || !formData.time || !formData.veterinarian) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      if (editingId) {
        // UPDATE
        const { error } = await supabase
          .from("appointments")
          .update({
            pet_name: formData.petName,
            type: formData.type,
            date: formData.date,
            time: formData.time,
            veterinarian: formData.veterinarian,
            notes: formData.notes,
            return_date: formData.returnDate || null,
          })
          .eq("id", editingId);

        if (error) throw error;
      } else {
        // INSERT
        const { error } = await supabase.from("appointments").insert([
          {
            pet_name: formData.petName,
            type: formData.type,
            date: formData.date,
            time: formData.time,
            veterinarian: formData.veterinarian,
            notes: formData.notes,
            return_date: formData.returnDate || null,
            status: "upcoming",
          },
        ]);
        if (error) throw error;

        // AUTO-CREATE FOLLOW-UP
        if (formData.returnDate) {
          await supabase.from("appointments").insert([
            {
              pet_name: formData.petName,
              type:
                formData.type === "Vaccination"
                  ? "Vaccination - Booster"
                  : "Follow-up",
              date: formData.returnDate,
              time: formData.time,
              veterinarian: formData.veterinarian,
              notes: `Follow-up for ${formData.type} on ${formData.date}`,
              status: "upcoming",
            },
          ]);
        }
      }

      fetchAppointments();
      resetForm();
    } catch (err) {
      console.error("Error saving appointment:", err);
    }
  };

  /* --------------------- EDIT --------------------- */
  const handleEdit = (appointment) => {
    setFormData({
      petName: appointment.pet_name,
      type: appointment.type,
      date: appointment.date,
      time: appointment.time,
      veterinarian: appointment.veterinarian,
      notes: appointment.notes || "",
      returnDate: appointment.return_date || "",
    });

    setEditingId(appointment.id);
    setShowModal(true);
  };

  /* --------------------- DELETE --------------------- */
  const handleDelete = async (id) => {
    await supabase.from("appointments").delete().eq("id", id);
    fetchAppointments();
  };

  /* --------------------- STATUS TOGGLE --------------------- */
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "upcoming" ? "completed" : "upcoming";
    await supabase.from("appointments").update({ status: newStatus }).eq("id", id);
    fetchAppointments();
  };

  /* --------------------- RESET FORM --------------------- */
  const resetForm = () => {
    setFormData({
      petName: "",
      type: "",
      date: "",
      time: "",
      veterinarian: "",
      notes: "",
      returnDate: "",
    });
    setEditingId(null);
    setShowModal(false);
  };

  /* --------------------- FILTERS --------------------- */
  const upcomingAppointments = appointments.filter((apt) => apt.status === "upcoming");
  const completedAppointments = appointments.filter((apt) => apt.status === "completed");

  /* --------------------- UI SECTION --------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              Appointments
            </h1>
            <p className="text-gray-600">
              Schedule and manage your pet care appointments
            </p>
          </div>

          {/* 3D Pastel Cute New Appointment Button */}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 text-gray-800 rounded-full font-semibold 
                       shadow-[0_5px_0px_#d3baff] hover:shadow-[0_8px_0px_#d3baff] transition-all transform active:translate-y-1 active:shadow-[0_2px_0px_#d3baff]"
          >
            <Plus className="w-5 h-5" />
            New Appointment
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-6 border border-blue-200">
            <p className="text-sm text-blue-700 font-semibold mb-1">Upcoming</p>
            <p className="text-3xl font-bold text-blue-800">{upcomingAppointments.length}</p>
          </div>

          <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-6 border border-green-200">
            <p className="text-sm text-green-700 font-semibold mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-800">{completedAppointments.length}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-6 border border-purple-200">
            <p className="text-sm text-purple-700 font-semibold mb-1">Total</p>
            <p className="text-3xl font-bold text-purple-800">{appointments.length}</p>
          </div>
        </div>

        {/* LISTS */}
        {["Upcoming", "Completed"].map((section) => {
          const list = section === "Upcoming" ? upcomingAppointments : completedAppointments;

          return (
            <div key={section} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {section} Appointments
              </h2>

              {list.length === 0 ? (
                <div className="bg-white/80 rounded-3xl p-8 text-center border border-purple-100">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No {section.toLowerCase()} appointments
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {list.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center">
                              <PawPrint className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">
                                {appointment.pet_name}
                              </h3>
                              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                {appointment.type}
                              </span>
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-purple-500" />
                              <span>{appointment.date}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-purple-500" />
                              <span>{appointment.time}</span>
                            </div>

                            <div className="sm:col-span-2">
                              <strong>Doctor:</strong> {appointment.veterinarian}
                            </div>

                            {appointment.notes && (
                              <div className="sm:col-span-2">
                                <strong>Notes:</strong> {appointment.notes}
                              </div>
                            )}

                            {appointment.return_date && (
                              <div className="sm:col-span-2 text-amber-700 text-sm">
                                🔄 Return Visit: {appointment.return_date}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-row sm:flex-col gap-2">
                          {section === "Upcoming" && (
                            <button
                              type="button"
                              onClick={() => toggleStatus(appointment.id, appointment.status)}
                              className="px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors text-sm font-semibold"
                            >
                              <Check className="w-4 h-4 inline mr-1" /> Complete
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleEdit(appointment)}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors text-sm font-semibold"
                          >
                            <Edit2 className="w-4 h-4 inline mr-1" /> Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(appointment.id)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors text-sm font-semibold"
                          >
                            <Trash2 className="w-4 h-4 inline mr-1" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

       {/* MODAL */}
{showModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {editingId ? "Edit Appointment" : "New Appointment"}
        </h2>

        <button
          type="button"
          onClick={resetForm}
          className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="space-y-4">
        <InputField label="Pet Name *" name="petName" value={formData.petName} onChange={handleInputChange} placeholder="Enter pet name" />
        <SelectField label="Appointment Type *" name="type" value={formData.type} onChange={handleInputChange} options={appointmentTypes} />

        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Date *" type="date" name="date" value={formData.date} onChange={handleInputChange} />
          <InputField label="Time *" type="time" name="time" value={formData.time} onChange={handleInputChange} />
        </div>

        <InputField label="Veterinarian / Location *" name="veterinarian" value={formData.veterinarian} onChange={handleInputChange} placeholder="Dr. Name or Location" />

        <TextAreaField label="Notes (Optional)" name="notes" value={formData.notes} onChange={handleInputChange} />

        {(formData.type === "Vaccination" ||
          formData.type === "Follow-up" ||
          formData.type === "Surgery" ||
          formData.type === "Dental Cleaning") && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <label className="block text-sm font-semibold text-amber-800 mb-2">
              📅 Return/Follow-up Date (Optional)
            </label>
            
            <input
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-2xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            
            <p className="text-xs text-amber-700 mt-2">
              Set a reminder for the next appointment or follow-up visit
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={resetForm}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            {editingId ? "Update" : "Create"} Appointment
          </button>
        </div>
      </div>

    </div>
  </div>
)}

      </div>
    </div>
  );
}

/* --------------------- REUSABLE COMPONENTS --------------------- */
function InputField({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-2xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-2xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="">Select type</option>
        {options.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextAreaField({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        className="w-full px-4 py-3 rounded-2xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>  
  );
}

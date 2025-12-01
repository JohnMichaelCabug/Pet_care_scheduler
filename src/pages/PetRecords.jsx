import { useState, useEffect } from 'react';
import { Plus, X, Edit2, Trash2, PawPrint, Heart, Calendar, Weight, Ruler, Syringe, Pill, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from "../lib/supabaseClient";

export default function PetRecords() {
  const [pets, setPets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedPet, setExpandedPet] = useState(null);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [selectedPetForMedical, setSelectedPetForMedical] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    weight: '',
    color: '',
    gender: '',
    dateOfBirth: '',
    microchipId: '',
    allergies: '',
    currentMedications: '',
    insuranceInfo: '',
    profilePic: null
  });

  const [medicalFormData, setMedicalFormData] = useState({
    date: '',
    type: '',
    description: '',
    vet: ''
  });

  const speciesOptions = ["Dog", "Cat", "Bird", "Rabbit", "Hamster", "Guinea Pig", "Other"];
  const genderOptions = ["Male", "Female"];
  const medicalTypes = ["Vaccination", "Checkup", "Surgery", "Emergency", "Dental", "Other"];

  // Fetch pets from Supabase on mount
 useEffect(() => {
  const fetchPets = async () => {
    const { data: petsData, error: petsError } = await supabase
      .from('pets')
      .select('*');

    if (petsError) {
      console.error(petsError);
      return;
    }

    // Fetch all medical records
    const { data: medicalData, error: medicalError } = await supabase
      .from('medical_records')
      .select('*');

    if (medicalError) {
      console.error(medicalError);
      return;
    }

    // Map medical records to each pet
    const mappedPets = petsData.map(pet => ({
      ...pet,
      dateOfBirth: pet.date_of_birth,
      microchipId: pet.microchip_id,
      currentMedications: pet.current_medications,
      insuranceInfo: pet.insurance_info,
      profilePic: pet.profile_pic,
      medicalHistory: medicalData.filter(record => record.pet_id === pet.id)
    }));

    setPets(mappedPets);
  };

  fetchPets();
}, []);


  // Handle input change for pet form
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle medical record input change
  const handleMedicalInputChange = (e) => {
    const { name, value } = e.target;
    setMedicalFormData(prev => ({ ...prev, [name]: value }));
  };

  // Reset pet form
  const resetForm = () => {
    setFormData({
      name: '',
      species: '',
      breed: '',
      age: '',
      weight: '',
      color: '',
      gender: '',
      dateOfBirth: '',
      microchipId: '',
      allergies: '',
      currentMedications: '',
      insuranceInfo: '',
      profilePic: null
    });
    setEditingId(null);
    setShowModal(false);
  };

  // Add / Update pet
  const handleSubmit = async () => {
    if (!formData.name || !formData.species || !formData.breed) {
      alert('Please fill in required fields (Name, Species, Breed)');
      return;
    }

    const petData = {
      name: formData.name,
      species: formData.species,
      breed: formData.breed,
      age: formData.age,
      weight: formData.weight,
      color: formData.color,
      gender: formData.gender,
      date_of_birth: formData.dateOfBirth,
      microchip_id: formData.microchipId,
      allergies: formData.allergies,
      current_medications: formData.currentMedications,
      insurance_info: formData.insuranceInfo,
      profile_pic: formData.profilePic,
      created_at: new Date()
    };

    try {
      if (editingId) {
        const { data, error } = await supabase
          .from('pets')
          .update(petData)
          .eq('id', editingId)
          .select();

        if (error) throw error;

        setPets(prev =>
          prev.map(p => p.id === editingId ? {
            ...data[0],
            dateOfBirth: data[0].date_of_birth,
            microchipId: data[0].microchip_id,
            currentMedications: data[0].current_medications,
            insuranceInfo: data[0].insurance_info,
            profilePic: data[0].profile_pic
          } : p)
        );
      } else {
        const { data, error } = await supabase
          .from('pets')
          .insert([petData])
          .select();

        if (error) throw error;

        const newPet = {
          ...data[0],
          dateOfBirth: data[0].date_of_birth,
          microchipId: data[0].microchip_id,
          currentMedications: data[0].current_medications,
          insuranceInfo: data[0].insurance_info,
          profilePic: data[0].profile_pic,
          medicalHistory: []
        };

        setPets(prev => [...prev, newPet]);
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Failed to save pet. Check console for details.');
    }
  };

  // Add medical record
  const addMedicalRecord = async () => {
    if (!medicalFormData.date || !medicalFormData.type || !medicalFormData.description) {
      alert('Please fill all medical record fields');
      return;
    }

    try {
      const record = {
        pet_id: selectedPetForMedical,
        ...medicalFormData
      };

      const { data, error } = await supabase
        .from('medical_records')
        .insert([record])
        .select();

      if (error) throw error;

      setPets(prev =>
        prev.map(p =>
          p.id === selectedPetForMedical
            ? { ...p, medicalHistory: [...(p.medicalHistory || []), data[0]] }
            : p
        )
      );

      setMedicalFormData({ date: '', type: '', description: '', vet: '' });
      setSelectedPetForMedical(null);
      setShowMedicalModal(false);
    } catch (err) {
      console.error(err);
      alert('Failed to add medical record. See console for details.');
    }
  };

  // Edit pet
  const handleEdit = (pet) => {
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      weight: pet.weight,
      color: pet.color,
      gender: pet.gender,
      dateOfBirth: pet.dateOfBirth,
      microchipId: pet.microchipId || '',
      allergies: pet.allergies || '',
      currentMedications: pet.currentMedications || '',
      insuranceInfo: pet.insuranceInfo || '',
      profilePic: pet.profilePic || null
    });
    setEditingId(pet.id);
    setShowModal(true);
  };

  // Delete pet
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) return;

    try {
      const { error } = await supabase.from('pets').delete().eq('id', id);
      if (error) throw error;

      setPets(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete pet. See console for details.');
    }
  };

  const toggleExpanded = (id) => setExpandedPet(expandedPet === id ? null : id);
  const openMedicalModal = (petId) => {
    setSelectedPetForMedical(petId);
    setShowMedicalModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              Pet Records
            </h1>
            <p className="text-gray-600">Manage your pets' health records and information</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 text-white rounded-3xl font-semibold shadow-[0_6px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_0px_0px_rgba(0,0,0,0.2)] hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add New Pet
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-semibold mb-1">Total Pets</p>
                <p className="text-3xl font-bold text-purple-800">{pets.length}</p>
              </div>
              <PawPrint className="w-10 h-10 text-purple-600" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-semibold mb-1">Dogs</p>
                <p className="text-3xl font-bold text-blue-800">{pets.filter(p => p.species === 'Dog').length}</p>
              </div>
              <Heart className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl p-6 border border-pink-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-pink-700 font-semibold mb-1">Cats</p>
                <p className="text-3xl font-bold text-pink-800">{pets.filter(p => p.species === 'Cat').length}</p>
              </div>
              <Heart className="w-10 h-10 text-pink-600" />
            </div>
          </div>
        </div>

        {/* Pet Records List */}
        {pets.length === 0 ? (
          <div className="bg-white/80 rounded-3xl p-8 text-center border border-purple-100">
            <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No pet records yet. Add your first pet!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pets.map(pet => (
              <div
                key={pet.id}
                className="bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-100 shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* Pet Header */}
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {pet.profilePic ? (
                          <img
                            src={pet.profilePic}
                            alt={pet.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <PawPrint className="w-8 h-8 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800">{pet.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">{pet.species}</span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">{pet.breed}</span>
                          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">{pet.gender}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col gap-2">
                      <button
                        onClick={() => openMedicalModal(pet.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors text-sm font-semibold"
                      >
                        <Syringe className="w-4 h-4" />
                        <span className="hidden sm:inline">Add Medical</span>
                      </button>
                      <button
                        onClick={() => handleEdit(pet)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors text-sm font-semibold"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(pet.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors text-sm font-semibold"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <div>
                        <p className="font-semibold text-gray-800">{pet.age}</p>
                        <p className="text-xs">Age</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Weight className="w-4 h-4 text-purple-500" />
                      <div>
                        <p className="font-semibold text-gray-800">{pet.weight}</p>
                        <p className="text-xs">Weight</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Pill className="w-4 h-4 text-purple-500" />
                      <div>
                        <p className="font-semibold text-gray-800">{pet.allergies || 'None'}</p>
                        <p className="text-xs">Allergies</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4 text-purple-500" />
                      <div>
                        <p className="font-semibold text-gray-800">{pet.medicalHistory?.length || 0}</p>
                        <p className="text-xs">Records</p>
                      </div>
                    </div>
                  </div>

                  {/* Expand Button */}
                  <button
                    onClick={() => toggleExpanded(pet.id)}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-2xl transition-colors text-purple-700 font-semibold text-sm"
                  >
                    {expandedPet === pet.id ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        View Full Details
                      </>
                    )}
                  </button>
                </div>

                {/* Expanded Details */}
                {expandedPet === pet.id && (
                  <div className="bg-purple-50/50 p-6 border-t border-purple-100">
                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Basic Info */}
                      <div>
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-purple-600" />
                          Basic Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div><strong>Date of Birth:</strong> {pet.dateOfBirth}</div>
                          <div><strong>Color:</strong> {pet.color}</div>
                          <div><strong>Microchip ID:</strong> {pet.microchipId || 'N/A'}</div>
                          <div><strong>Current Medications:</strong> {pet.currentMedications || 'None'}</div>
                          <div><strong>Insurance:</strong> {pet.insuranceInfo || 'Not insured'}</div>
                        </div>
                      </div>

                      {/* Medical History */}
                      <div>
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <Syringe className="w-5 h-5 text-purple-600" />
                          Medical History
                        </h4>
                        {pet.medicalHistory && pet.medicalHistory.length > 0 ? (
                          <div className="space-y-3">
                            {pet.medicalHistory.map((record, index) => (
                              <div key={index} className="bg-white rounded-2xl p-3 border border-purple-100">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">{record.type}</span>
                                      <span className="text-xs text-gray-500">{record.date}</span>
                                    </div>
                                    <p className="text-sm text-gray-700">{record.description}</p>
                                    {record.vet && (<p className="text-xs text-gray-500 mt-1">by {record.vet}</p>)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No medical history recorded</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Pet Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingId ? 'Edit Pet Record' : 'Add New Pet'}
                </h2>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Profile Picture Upload */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Profile Picture</label>
                  <input type="file" name="profilePic" accept="image/*" onChange={handleInputChange} className="w-full text-sm text-gray-700" />
                  
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Pet Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300" />
                </div>

                {/* Species */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Species *</label>
                  <select name="species" value={formData.species} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300">
                    <option value="">Select species</option>
                    {speciesOptions.map(species => <option key={species} value={species}>{species}</option>)}
                  </select>
                </div>

                {/* Breed */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Breed *</label>
                  <input type="text" name="breed" value={formData.breed} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300" />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Age</label>
                  <input type="text" name="age" value={formData.age} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300" />
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Weight</label>
                  <input type="text" name="weight" value={formData.weight} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300" />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Color</label>
                  <input type="text" name="color" value={formData.color} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300" />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300">
                    <option value="">Select gender</option>
                    {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300" />
                </div>

                {/* Microchip ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Microchip ID</label>
                  <input type="text" name="microchipId" value={formData.microchipId} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300" />
                </div>

                {/* Allergies */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Allergies</label>
                  <input type="text" name="allergies" value={formData.allergies} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300" />
                </div>

                {/* Current Medications */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Current Medications</label>
                  <input type="text" name="currentMedications" value={formData.currentMedications} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300" />
                </div>

                {/* Insurance */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Insurance Info</label>
                  <input type="text" name="insuranceInfo" value={formData.insuranceInfo} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300" />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button onClick={resetForm} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-3xl font-semibold hover:bg-gray-300 transition-colors">Cancel</button>
                <button onClick={handleSubmit} className="px-6 py-3 bg-purple-400 text-white rounded-3xl font-semibold shadow-[0_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[0_2px_0px_0px_rgba(0,0,0,0.2)] hover:scale-105 transition-all">{editingId ? 'Update Pet' : 'Add Pet'}</button>
              </div>
            </div>
          </div>
        )}

        {/* Medical Record Modal */}
        {showMedicalModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Add Medical Record</h2>
                <button onClick={() => setShowMedicalModal(false)} className="text-gray-500 hover:text-gray-700 transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date *</label>
                  <input type="date" name="date" value={medicalFormData.date} onChange={handleMedicalInputChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Type *</label>
                  <select name="type" value={medicalFormData.type} onChange={handleMedicalInputChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300">
                    <option value="">Select type</option>
                    {medicalTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                  <textarea name="description" value={medicalFormData.description} onChange={handleMedicalInputChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"></textarea>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Veterinarian</label>
                  <input type="text" name="vet" value={medicalFormData.vet} onChange={handleMedicalInputChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300" />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button onClick={() => setShowMedicalModal(false)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-3xl font-semibold hover:bg-gray-300 transition-colors">Cancel</button>
                <button onClick={addMedicalRecord} className="px-6 py-3 bg-green-400 text-white rounded-3xl font-semibold hover:scale-105 transition-all">Add Record</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

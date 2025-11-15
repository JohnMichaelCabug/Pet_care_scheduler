import { useState, useEffect } from "react";
import { PawPrint, Sparkles, Search, X } from "lucide-react";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Search Function
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const storedPets = JSON.parse(localStorage.getItem("pets") || "[]");
    const query = searchQuery.toLowerCase();

    const filtered = storedPets.filter((pet) =>
      pet.name?.toLowerCase().includes(query) ||
      pet.species?.toLowerCase().includes(query) ||
      pet.breed?.toLowerCase().includes(query) ||
      pet.color?.toLowerCase().includes(query) ||
      pet.microchipId?.toLowerCase().includes(query)
    );

    setSearchResults(filtered);
    setShowResults(true);
  }, [searchQuery]);

  return (
    <header className="bg-gradient-to-r from-[#FFD6A5] via-[#FDFFB6] to-[#B3E1F8] p-6 shadow-xl border-b border-white/50 shadow-pink-100 relative">

      {/* TOP BAR LAYOUT */}
      <div className="max-w-6xl mx-auto relative">

        {/* --- CENTERED TITLE (ALWAYS CENTERED) --- */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 text-center pointer-events-none">
          <div className="flex items-center justify-center gap-3 pointer-events-none">
            <div className="bg-white/70 p-2 rounded-full shadow-md">
              <PawPrint className="w-8 h-8 text-blue-400 animate-bounce" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide text-[#BA8E23] drop-shadow-md">
              Pet Care Scheduler
            </h1>

            <div className="bg-white/70 p-2 rounded-full shadow-md">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-spin-slow" />
            </div>
          </div>
        </div>

        {/* --- SEARCH (RIGHT SIDE) --- */}
        <div className="flex justify-end">

          {/* Mobile toggle */}
          <button
            className="block sm:hidden bg-white/70 p-2 rounded-full shadow-md"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="w-6 h-6 text-gray-700" />
          </button>

          {/* Desktop Search */}
          <div className="hidden sm:flex items-center bg-white/80 backdrop-blur-md rounded-full px-4 py-2 shadow-md w-80">
            <Search className="w-5 h-5 text-gray-600" />
            <input
              type="text"
              placeholder="Global Pet Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 ml-2 bg-transparent outline-none text-gray-700"
            />
            {searchQuery && (
              <X
                className="w-5 h-5 text-gray-600 cursor-pointer"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="sm:hidden mt-4 bg-white/80 backdrop-blur-md rounded-xl p-3 shadow-md">
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow">
              <Search className="w-5 h-5 text-gray-600" />
              <input
                type="text"
                placeholder="Search pets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 ml-2 bg-transparent outline-none text-gray-700"
              />
              {searchQuery && (
                <X
                  className="w-5 h-5 text-gray-600 cursor-pointer"
                  onClick={() => setSearchQuery("")}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* SEARCH RESULTS WITH FULL DETAILS + SEE MORE */}
      {showResults && (
        <div className="absolute right-6 top-32 sm:top-24 bg-white w-96 max-h-80 overflow-y-auto rounded-xl shadow-xl p-4 border border-gray-200 z-50">
          {searchResults.length === 0 ? (
            <p className="text-center text-gray-500 py-2">No pets found.</p>
          ) : (
            searchResults.map((pet, index) => (
              <div
                key={index}
                className="p-3 border-b border-gray-200 last:border-none"
              >
                <p className="font-bold text-gray-800 text-lg">{pet.name}</p>

                <p className="text-sm text-gray-700 mt-1">
                  <strong>Species:</strong> {pet.species}
                </p>

                <p className="text-sm text-gray-700">
                  <strong>Breed:</strong> {pet.breed}
                </p>

                <p className="text-sm text-gray-700">
                  <strong>Color:</strong> {pet.color}
                </p>

                <p className="text-sm text-gray-700 mb-2">
                  <strong>Microchip:</strong> {pet.microchipId || "None"}
                </p>

               
              </div>
            ))
          )}
        </div>
      )}

      {/* Subtitle */}
      <p className="text-center text-purple-500 text-sm mt-6 font-semibold tracking-wide">
        🐶 Making Pet Care Fun, Easy & Full of Love 🐱
      </p>

      {/* Soft glowing line effect */}
      <div className="h-1 bg-gradient-to-r from-pink-200 via-purple-200 to-teal-200 rounded-full mt-3 animate-pulse"></div>

      <style>{`
        .animate-spin-slow {
          animation: spin 5s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
}

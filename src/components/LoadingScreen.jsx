export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="flex flex-col items-center">
        {/* Running Pets Animation Container */}
        <div className="relative w-80 h-32 overflow-hidden mb-8">
          {/* Dog */}
          <div className="absolute top-8 left-0 animate-[slideRun_3s_ease-in-out_infinite]">
            <svg viewBox="0 0 64 64" className="w-20 h-20" fill="none">
              {/* Dog body */}
              <ellipse cx="32" cy="36" rx="16" ry="12" fill="#FFB5E8" />
              {/* Dog head */}
              <circle cx="42" cy="28" r="10" fill="#FFB5E8" />
              {/* Ears */}
              <ellipse cx="38" cy="22" rx="4" ry="8" fill="#FF9CEE" transform="rotate(-20 38 22)" />
              <ellipse cx="46" cy="22" rx="4" ry="8" fill="#FF9CEE" transform="rotate(20 46 22)" />
              {/* Nose */}
              <circle cx="45" cy="30" r="2" fill="#B4A7D6" />
              {/* Eye */}
              <circle cx="40" cy="27" r="2" fill="#6B5B95" />
              {/* Tail */}
              <path d="M 16 32 Q 10 30 12 24" stroke="#FF9CEE" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Legs */}
              <rect x="24" y="44" width="3" height="8" rx="1.5" fill="#FFB5E8" className="animate-[wiggle_0.3s_ease-in-out_infinite]" />
              <rect x="30" y="44" width="3" height="8" rx="1.5" fill="#FFB5E8" className="animate-[wiggle_0.3s_ease-in-out_infinite_0.15s]" />
              <rect x="36" y="44" width="3" height="8" rx="1.5" fill="#FFB5E8" className="animate-[wiggle_0.3s_ease-in-out_infinite]" />
              <rect x="42" y="44" width="3" height="8" rx="1.5" fill="#FFB5E8" className="animate-[wiggle_0.3s_ease-in-out_infinite_0.15s]" />
            </svg>
          </div>

          {/* Cat */}
          <div className="absolute top-8 left-0 animate-[slideRun_3s_ease-in-out_infinite] opacity-0" style={{ animationDelay: '0.6s' }}>
            <svg viewBox="0 0 64 64" className="w-20 h-20" fill="none">
              {/* Cat body */}
              <ellipse cx="32" cy="36" rx="14" ry="10" fill="#B5E7FF" />
              {/* Cat head */}
              <circle cx="40" cy="28" r="9" fill="#B5E7FF" />
              {/* Ears */}
              <path d="M 36 20 L 34 14 L 38 18 Z" fill="#A7D7F5" />
              <path d="M 44 20 L 46 14 L 42 18 Z" fill="#A7D7F5" />
              {/* Nose */}
              <circle cx="42" cy="30" r="1.5" fill="#FFB5D9" />
              {/* Eyes */}
              <circle cx="38" cy="27" r="2" fill="#6B5B95" />
              <circle cx="43" cy="27" r="2" fill="#6B5B95" />
              {/* Tail */}
              <path d="M 18 32 Q 14 28 16 22" stroke="#A7D7F5" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Legs */}
              <rect x="26" y="42" width="2.5" height="8" rx="1.25" fill="#B5E7FF" />
              <rect x="31" y="42" width="2.5" height="8" rx="1.25" fill="#B5E7FF" />
              <rect x="36" y="42" width="2.5" height="8" rx="1.25" fill="#B5E7FF" />
              <rect x="41" y="42" width="2.5" height="8" rx="1.25" fill="#B5E7FF" />
            </svg>
          </div>

          {/* Bunny */}
          <div className="absolute top-8 left-0 animate-[slideRun_3s_ease-in-out_infinite] opacity-0" style={{ animationDelay: '1.2s' }}>
            <svg viewBox="0 0 64 64" className="w-20 h-20" fill="none">
              {/* Bunny body */}
              <ellipse cx="32" cy="38" rx="12" ry="10" fill="#E7C6FF" />
              {/* Bunny head */}
              <circle cx="38" cy="30" r="8" fill="#E7C6FF" />
              {/* Long ears */}
              <ellipse cx="34" cy="18" rx="3" ry="10" fill="#D4A5FF" />
              <ellipse cx="42" cy="18" rx="3" ry="10" fill="#D4A5FF" />
              {/* Nose */}
              <circle cx="40" cy="32" r="1.5" fill="#FFB5C5" />
              {/* Eye */}
              <circle cx="36" cy="29" r="2" fill="#6B5B95" />
              {/* Tail */}
              <circle cx="22" cy="38" r="4" fill="#F0D6FF" />
              {/* Legs */}
              <ellipse cx="28" cy="46" rx="3" ry="4" fill="#E7C6FF" />
              <ellipse cx="36" cy="46" rx="3" ry="4" fill="#E7C6FF" />
            </svg>
          </div>

          {/* Hamster */}
          <div className="absolute top-8 left-0 animate-[slideRun_3s_ease-in-out_infinite] opacity-0" style={{ animationDelay: '1.8s' }}>
            <svg viewBox="0 0 64 64" className="w-20 h-20" fill="none">
              {/* Hamster body */}
              <ellipse cx="32" cy="38" rx="14" ry="11" fill="#FFE5B5" />
              {/* Hamster head */}
              <circle cx="38" cy="30" r="9" fill="#FFE5B5" />
              {/* Ears */}
              <circle cx="34" cy="24" r="3" fill="#FFD699" />
              <circle cx="42" cy="24" r="3" fill="#FFD699" />
              {/* Cheeks */}
              <circle cx="32" cy="32" r="3" fill="#FFEACC" />
              <circle cx="44" cy="32" r="3" fill="#FFEACC" />
              {/* Nose */}
              <circle cx="40" cy="33" r="1.5" fill="#D4A574" />
              {/* Eyes */}
              <circle cx="36" cy="29" r="2" fill="#6B5B95" />
              <circle cx="41" cy="29" r="2" fill="#6B5B95" />
              {/* Tiny legs */}
              <ellipse cx="26" cy="46" rx="2" ry="3" fill="#FFE5B5" />
              <ellipse cx="32" cy="47" rx="2" ry="3" fill="#FFE5B5" />
              <ellipse cx="38" cy="46" rx="2" ry="3" fill="#FFE5B5" />
            </svg>
          </div>

          {/* Bird */}
          <div className="absolute top-8 left-0 animate-[slideRun_3s_ease-in-out_infinite] opacity-0" style={{ animationDelay: '2.4s' }}>
            <svg viewBox="0 0 64 64" className="w-20 h-20" fill="none">
              {/* Bird body */}
              <ellipse cx="32" cy="36" rx="12" ry="10" fill="#B5FFD9" />
              {/* Bird head */}
              <circle cx="40" cy="28" r="7" fill="#B5FFD9" />
              {/* Beak */}
              <path d="M 46 28 L 50 28 L 46 30 Z" fill="#FFB347" />
              {/* Eye */}
              <circle cx="42" cy="27" r="2" fill="#6B5B95" />
              {/* Wing */}
              <ellipse cx="26" cy="36" rx="8" ry="6" fill="#9FFFC9" transform="rotate(-20 26 36)" />
              {/* Tail feathers */}
              <path d="M 20 38 L 16 42 L 18 38 L 16 36 Z" fill="#9FFFC9" />
              {/* Legs */}
              <line x1="30" y1="44" x2="30" y2="48" stroke="#FFB347" strokeWidth="2" />
              <line x1="36" y1="44" x2="36" y2="48" stroke="#FFB347" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Text with cute styling */}
        <div className="text-center">
          <p className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Loading PetCare
          </p>
          <div className="flex justify-center gap-1 mt-2">
            <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideRun {
          0% {
            transform: translateX(-100px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translateX(400px);
            opacity: 0;
          }
        }

        @keyframes wiggle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }
      `}</style>
    </div>
  );
}
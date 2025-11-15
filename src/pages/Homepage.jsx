import React from 'react';
import { ArrowRight, Play, Heart } from 'lucide-react';

export default function Homepage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Section */}
          <div className="space-y-8 relative">
            {/* Decorative paw print */}
            <div className="absolute -left-4 top-0 text-gray-200 text-4xl opacity-30">🐾</div>
            
            {/* Headline */}
            <div>
              <h1
  className="text-5xl lg:text-6xl font-extrabold leading-tight"
  style={{
    fontFamily: "'Baloo 2', cursive", // Bubble-style font
    color: "#FFEE8C",                 // Pastel pink
    textShadow: "2px 2px 4px rgba(0,0,0,0.2)" // subtle 3D effect
  }}
>
  Your Pet<br />care center
</h1>

              <p className="mt-4 text-gray-600 text-lg">
                Before you bring home your pet, be sure you're ready to take care of it properly.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 shadow-lg transition-all">
                Our Services
                <ArrowRight size={20} />
              </button>
              <button className="text-gray-900 font-semibold underline hover:text-purple-600 transition-colors">
                Schedule a Call
              </button>
            </div>

            {/* Info Card */}
            <div className="relative mt-12">
              <div className="bg-yellow-100 rounded-2xl p-6 max-w-md relative">
                {/* Decorative Circle */}
                <div className="absolute -left-6 -top-6 w-24 h-24 bg-yellow-200 rounded-full flex items-center justify-center">
                  <img 
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23FCD34D'/%3E%3Ccircle cx='35' cy='40' r='5' fill='%23000'/%3E%3Ccircle cx='65' cy='40' r='5' fill='%23000'/%3E%3Cpath d='M 35 60 Q 50 70 65 60' stroke='%23000' stroke-width='3' fill='none'/%3E%3C/svg%3E"
                    alt="Pet"
                    className="w-16 h-16 rounded-full"
                  />
                </div>
                
                {/* Play Button */}
                <div className="absolute -top-4 left-20 w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center shadow-lg">
                  <Play size={20} className="text-white fill-white ml-1" />
                </div>

                {/* Card Content */}
                <div className="ml-20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <span className="text-2xl">🐾</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      How to take care<br />of your pets
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Learn how to take care of your pet with proper guidance
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Hero Image */}
          <div className="relative">
            {/* Background Circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full"></div>
            <div className="absolute top-0 right-24 w-40 h-40 bg-yellow-400 rounded-full"></div>

            {/* Hero Image Container */}
            <div className="relative z-10 w-80 h-96 mx-auto">
              <img 
                src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=500&fit=crop"
                alt="Woman with French Bulldog"
                className="w-full h-full object-cover rounded-3xl shadow-2xl"
              />
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center hidden">
                <span className="text-gray-500 text-lg">Image</span>
              </div>

              {/* Floating Pet Health Card */}
              <div className="absolute bottom-4 right-4 bg-white rounded-2xl shadow-2xl p-4 w-48 z-20">
                <div className="flex items-start gap-3">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-orange-100 rounded-xl flex items-center justify-center">
                    <span className="text-3xl">🐶</span>
                  </div>
                   <div className="flex flex-col justify-center">
                        <h4 className="font-bold text-gray-900">Pet Health</h4>
                        <p className="text-xs text-gray-500">Blog | Article</p>
                    </div>
                </div>
              </div>

              {/* Floating Pet Icons */}
              <div className="absolute top-8 right-12 w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-white">
                <span className="text-2xl">🐕</span>
              </div>

              <div className="absolute top-32 left-8 w-16 h-16 bg-orange-400 rounded-full shadow-xl flex items-center justify-center">
                <span className="text-2xl">🦊</span>
              </div>

              <div className="absolute top-48 right-4 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
                <span className="text-xl">🐾</span>
              </div>

              <div className="absolute bottom-32 left-12 w-16 h-16 bg-pink-200 rounded-full shadow-xl flex items-center justify-center border-4 border-white">
                <span className="text-2xl">🐕</span>
              </div>

              <div className="absolute -bottom-8 right-32 w-12 h-12 bg-pink-500 rounded-full shadow-xl flex items-center justify-center">
                <Heart size={20} className="text-white fill-white" />
              </div>
            </div>

            {/* Decorative paw prints */}
            <div className="absolute top-4 right-0 text-blue-300 text-3xl opacity-40">🐾</div>
            <div className="absolute bottom-4 left-4 text-gray-200 text-3xl opacity-30">🐾</div>
          </div>
        </div>
      </div>
    </div>
  );
}

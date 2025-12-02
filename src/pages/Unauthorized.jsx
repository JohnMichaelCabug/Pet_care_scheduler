import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-6">
      
       <AlertTriangle size={80} className="text-red-500 mb-4" />
      
      <img 
        src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaG9idWVzY2p0bHhuOXZ6a2JoOHRnMXVkZzAybTV4OHdlNjZyaDloaCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ySM2PakMSmw7u/giphy.gif" 
        alt="Sad dog" 
        className="w-30 h-30 object-cover rounded-lg mb-4"
      />

      <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
      <p className="text-gray-600 mb-6">
        You are not allowed to access this page.
      </p>

      <Link
        to="/signup"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Go Back to Sign Up
      </Link>

    </div>
  );
}

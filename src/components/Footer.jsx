import { useState, useEffect } from "react";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // scrolling down → hide
        setIsVisible(false);
      } else {
        // scrolling up → show
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <footer
      className={`bg-gradient-to-r from-pink-100 via-purple-100 to-teal-100 text-purple-600 text-sm font-semibold py-4 text-center shadow-inner border-t border-white/40 fixed bottom-0 left-0 w-full transition-transform duration-500 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <p>
        🐾 &copy; {new Date().getFullYear()}{" "}
        <span className="text-pink-400 font-bold">Pet Care Scheduler</span> — Made with love 💕
      </p>
    </footer>
  );
}

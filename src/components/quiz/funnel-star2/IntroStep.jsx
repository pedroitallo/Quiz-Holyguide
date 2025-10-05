import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function IntroStep({ onContinue }) {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    setCurrentDate(today.toLocaleDateString('en-US', options));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center space-y-6 max-w-2xl mx-auto px-4">

      <h1 className="text-[2.5rem] md:text-[3.5rem] font-bold text-[#7c3aed] leading-tight">
        I will use my psychic abilities to reveal the face of your soulmate.
      </h1>

      <p className="text-black text-base md:text-lg font-medium leading-relaxed">
        Press play and see why over 10,000 people trust Aura, Hollywood's number #1 psychic
      </p>

      <div className="py-6">
        <img
          src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/WzQEhs1818943.gif?quality=84#727799"
          alt="Psychic Vision"
          className="w-full max-w-md mx-auto rounded-lg shadow-lg"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4">

        <p className="text-gray-700 text-sm mx-auto max-w-sm leading-relaxed">
          ⏳ Takes just 1 minute
        </p>

        <button
          onClick={onContinue}
          className="w-full max-w-sm md:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold whitespace-nowrap inline-flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform active:scale-95 hover:scale-105 px-10 py-5 text-base md:px-16 md:py-6 md:text-lg animate-bounce-subtle cursor-pointer touch-manipulation"
          style={{
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
            userSelect: 'none'
          }}
        >
          Discover My Soulmate
          <span className="ml-2">→</span>
        </button>

        {currentDate && (
          <p className="text-red-600 text-xs animate-pulse">
            ⏳ This reading will be available until <strong>{currentDate}</strong>, only on this page!
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

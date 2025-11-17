import React, { useState } from "react";
import { motion } from "framer-motion";

export default function IdealPartnerQualities({ onSubmit, zodiacSign }) {
  const [selectedQualities, setSelectedQualities] = useState([]);

  const qualities = [
    { value: "supportive", label: "Supportive", emoji: "👐" },
    { value: "honest", label: "Honest", emoji: "🤝" },
    { value: "loyal", label: "Loyal", emoji: "🧑‍🤝‍🧑" },
    { value: "caring", label: "Caring", emoji: "😘" },
    { value: "confident", label: "Confident", emoji: "🤩" },
    { value: "passionate", label: "Passionate", emoji: "🔥" },
    { value: "funny", label: "Funny", emoji: "😁" },
    { value: "protective", label: "Protective", emoji: "💪" }
  ];

  const toggleQuality = (value) => {
    setSelectedQualities(prev =>
      prev.includes(value)
        ? prev.filter(q => q !== value)
        : [...prev, value]
    );
  };

  const handleContinue = () => {
    if (selectedQualities.length > 0) {
      onSubmit(selectedQualities);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl mx-auto px-4 py-8"
    >
      <motion.div className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
            What qualities do you look for in your ideal partner?
          </h2>
          <p className="text-gray-600 text-lg">Please select all that apply</p>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {qualities.map((quality, index) => (
            <motion.button
              key={quality.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleQuality(quality.value)}
              className={`p-3 rounded-2xl border-2 transition-all duration-300 ${
                selectedQualities.includes(quality.value)
                  ? "bg-purple-500 border-purple-600 text-white shadow-lg"
                  : "bg-white border-purple-200 hover:border-purple-400 text-gray-800"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">{quality.emoji}</span>
                <span className="font-semibold text-xs">{quality.label}</span>
              </div>
            </motion.button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={selectedQualities.length === 0}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white text-lg font-bold py-4 px-8 rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Continue
        </button>
      </motion.div>
    </motion.div>
  );
}

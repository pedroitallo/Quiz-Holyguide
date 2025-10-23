import React from "react";
import { motion } from "framer-motion";

export default function RelationshipEnergy({ onSelect }) {
  const energies = [
    { value: "sweetness_affection", label: "Sweetness and affection", emoji: "💖" },
    { value: "calm_stability", label: "Calm and stability", emoji: "🌊" },
    { value: "intensity_passion", label: "Intensity and passion", emoji: "🌋" },
    { value: "joy_lightness", label: "Joy and lightness", emoji: "🎈" },
    { value: "partnership_complicity", label: "Partnership and complicity", emoji: "🤝" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto px-4 py-8"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10 leading-tight"
        >
          What kind of energy do you feel most balances you in a relationship?
        </motion.h2>

        <div className="space-y-4">
          {energies.map((energy, index) => (
            <motion.button
              key={energy.value}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(energy.value)}
              className="w-full bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-200 hover:border-purple-400 rounded-2xl p-5 text-left transition-all duration-300 shadow-md hover:shadow-lg group"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {energy.emoji}
                </span>
                <span className="text-base md:text-lg font-semibold text-gray-800">
                  {energy.label}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

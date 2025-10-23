import React from "react";
import { motion } from "framer-motion";

export default function GenderSelection({ onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto px-4 py-8"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12"
        >
          You are a:
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect("man")}
            className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border-4 border-transparent hover:border-blue-400 transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            <div className="text-center space-y-4">
              <div className="w-32 h-32 md:w-40 md:h-40 mx-auto bg-white rounded-full p-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="80" r="35" fill="#D4A574" />
                  <path d="M65 115 Q100 125 135 115 L135 180 Q100 190 65 180 Z" fill="#4A90E2" />
                  <circle cx="85" cy="75" r="5" fill="#333" />
                  <circle cx="115" cy="75" r="5" fill="#333" />
                  <path d="M90 95 Q100 100 110 95" stroke="#333" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <span className="text-2xl md:text-3xl font-bold text-gray-800">Man</span>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect("woman")}
            className="group relative bg-gradient-to-br from-pink-50 to-pink-100 rounded-3xl p-8 border-4 border-transparent hover:border-pink-400 transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            <div className="text-center space-y-4">
              <div className="w-32 h-32 md:w-40 md:h-40 mx-auto bg-white rounded-full p-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="80" r="35" fill="#D4A574" />
                  <path d="M70 60 Q60 50 70 40" stroke="#333" strokeWidth="3" fill="none" />
                  <path d="M130 60 Q140 50 130 40" stroke="#333" strokeWidth="3" fill="none" />
                  <path d="M65 115 Q100 125 135 115 L135 180 Q100 190 65 180 Z" fill="#E91E63" />
                  <circle cx="85" cy="75" r="5" fill="#333" />
                  <circle cx="115" cy="75" r="5" fill="#333" />
                  <path d="M90 95 Q100 100 110 95" stroke="#E91E63" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <span className="text-2xl md:text-3xl font-bold text-gray-800">Woman</span>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SoulmateConnection({ onSubmit, zodiacSign }) {
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [showComment, setShowComment] = useState(false);

  const connections = [
    { value: "soul_union", label: "Union of souls", emoji: "💞" },
    { value: "growth_together", label: "Growth together", emoji: "🌱" },
    { value: "freedom_authenticity", label: "Freedom and authenticity", emoji: "🎭" },
    { value: "unconditional_support", label: "Unconditional support", emoji: "🌊" },
    { value: "karmic_connection", label: "Karmic connection", emoji: "🔮" }
  ];

  const handleSelect = (value) => {
    setSelectedConnection(value);
    setShowComment(true);
  };

  const handleFinalContinue = () => {
    onSubmit(selectedConnection);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto px-4 py-8"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <AnimatePresence mode="wait">
          {!showComment ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 leading-tight">
                Which of these connections do you most want with your soulmate?
              </h2>

              <div className="space-y-4">
                {connections.map((connection, index) => (
                  <motion.button
                    key={connection.value}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(connection.value)}
                    className="w-full bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-200 hover:border-purple-400 rounded-2xl p-5 text-left transition-all duration-300 shadow-md hover:shadow-lg group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl group-hover:scale-110 transition-transform">
                        {connection.emoji}
                      </span>
                      <span className="text-base md:text-lg font-semibold text-gray-800">
                        {connection.label}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="comment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4 bg-purple-50 rounded-2xl p-6">
                <img
                  src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
                  alt="Master Aura"
                  className="w-12 h-12 rounded-full flex-shrink-0 border-2 border-purple-300"
                />
                <div className="flex-1">
                  <p className="text-lg text-gray-800 leading-relaxed">
                    People born under <span className="font-bold text-purple-600">{zodiacSign}</span> often feel that love needs to be meaningful, aligned with their energy, and emotionally real.
                  </p>
                </div>
              </div>

              <button
                onClick={handleFinalContinue}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white text-lg font-bold py-4 px-8 rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Continue
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

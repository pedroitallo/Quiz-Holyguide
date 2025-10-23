import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IdealPartnerQualities({ onSubmit, zodiacSign }) {
  const [selectedQualities, setSelectedQualities] = useState([]);
  const [showComment, setShowComment] = useState(false);

  const qualities = [
    { value: "kind", label: "Kind", emoji: "🤗" },
    { value: "supportive", label: "Supportive", emoji: "👐" },
    { value: "honest", label: "Honest", emoji: "🤝" },
    { value: "optimistic", label: "Optimistic", emoji: "🙂" },
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
      setShowComment(true);
    }
  };

  const handleFinalContinue = () => {
    onSubmit(selectedQualities);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl mx-auto px-4 py-8"
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
              <div className="text-center space-y-3">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                  What qualities do you look for in your ideal partner?
                </h2>
                <p className="text-gray-600 text-lg">Please select all that apply</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {qualities.map((quality, index) => (
                  <motion.button
                    key={quality.value}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleQuality(quality.value)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                      selectedQualities.includes(quality.value)
                        ? "bg-purple-500 border-purple-600 text-white shadow-lg"
                        : "bg-white border-purple-200 hover:border-purple-400 text-gray-800"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl">{quality.emoji}</span>
                      <span className="font-semibold text-sm md:text-base">{quality.label}</span>
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
                    Interesting! This kind of value usually appears strongly in people of the sign <span className="font-bold text-purple-600">{zodiacSign}</span>. Let's see if it shows up in your birth chart...
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

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function SoulmateDrawingLoading({ onComplete, birthDate, zodiacSign }) {
  const [progress, setProgress] = useState(0);
  const [showReady, setShowReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowReady(true), 500);
          return 100;
        }
        return prev + 12.5;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl mx-auto px-4 py-8"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <AnimatePresence mode="wait">
          {!showReady ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  <Sparkles className="w-16 h-16 text-purple-500" />
                </motion.div>

                <h2 className="text-2xl md:text-3xl font-bold text-purple-600">
                  The drawing of your soul mate is being prepared…
                </h2>
              </div>

              <div className="space-y-4">
                <div className="relative w-48 h-48 mx-auto">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="90"
                      stroke="#E9D5FF"
                      strokeWidth="12"
                      fill="none"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="90"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: progress / 100 }}
                      transition={{ duration: 0.5 }}
                      strokeDasharray="565"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#9333EA" />
                        <stop offset="100%" stopColor="#C084FC" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-purple-600">{progress}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-6 space-y-3 text-center">
                <p className="text-gray-800">
                  <span className="font-semibold">Birth Date:</span> {birthDate}
                </p>
                <p className="text-gray-800">
                  <span className="font-semibold">Zodiac Sign:</span> {zodiacSign}
                </p>
                <p className="text-gray-800">
                  <span className="font-semibold">Probability of meeting your soul mate:</span>{" "}
                  <span className="text-green-600 font-bold">High 98%</span>
                </p>
              </div>

              <div className="text-center text-gray-700 leading-relaxed">
                <p>
                  Based on your birth chart and the answers you've given so far, we've been able to identify ALL the information about your soulmate and your relationship with them.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Sparkles className="w-20 h-20 text-purple-500 mx-auto" />
              </motion.div>

              <h2 className="text-2xl md:text-4xl font-bold text-gray-800 leading-tight">
                Are you ready to find out who your soulmate is?
              </h2>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={onComplete}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white text-xl font-bold py-5 px-8 rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                YES! I'M READY
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

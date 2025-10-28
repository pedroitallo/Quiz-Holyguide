import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SoulmateDrawingLoading({ onComplete, birthDate, zodiacSign }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }
        return prev + 12.5;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-purple-600 px-4">
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
    </div>
  );
}

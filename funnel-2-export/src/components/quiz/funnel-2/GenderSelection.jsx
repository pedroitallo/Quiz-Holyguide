import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const ManAvatar = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <circle cx="100" cy="80" r="35" fill="#f4c2b2"/>
    <path d="M 70 70 Q 75 50 100 45 Q 125 50 130 70" fill="#5a4a8a"/>
    <circle cx="85" cy="75" r="4" fill="#2c2c54"/>
    <circle cx="115" cy="75" r="4" fill="#2c2c54"/>
    <path d="M 90 85 Q 100 90 110 85" stroke="#e88d8d" strokeWidth="2" fill="none"/>
    <rect x="60" y="115" width="80" height="85" rx="10" fill="#5d7fb8"/>
    <path d="M 100 115 L 100 200" stroke="#4a6b9e" strokeWidth="2"/>
  </svg>
);

const WomanAvatar = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <circle cx="100" cy="80" r="35" fill="#f4c2b2"/>
    <path d="M 60 60 Q 70 30 100 25 Q 130 30 140 60 L 140 90 Q 130 95 100 95 Q 70 95 60 90 Z" fill="#6a4a8a"/>
    <circle cx="85" cy="75" r="4" fill="#2c2c54"/>
    <circle cx="115" cy="75" r="4" fill="#2c2c54"/>
    <path d="M 90 85 Q 100 90 110 85" stroke="#e88d8d" strokeWidth="2" fill="none"/>
    <circle cx="80" cy="80" r="3" fill="#f0a0a0"/>
    <circle cx="120" cy="80" r="3" fill="#f0a0a0"/>
    <rect x="60" y="115" width="80" height="85" rx="10" fill="#b39ac7"/>
    <circle cx="70" cy="125" r="3" fill="#9a7ab5"/>
    <circle cx="80" cy="128" r="3" fill="#9a7ab5"/>
    <circle cx="90" cy="130" r="3" fill="#9a7ab5"/>
    <circle cx="100" cy="131" r="3" fill="#9a7ab5"/>
    <circle cx="110" cy="130" r="3" fill="#9a7ab5"/>
    <circle cx="120" cy="128" r="3" fill="#9a7ab5"/>
    <circle cx="130" cy="125" r="3" fill="#9a7ab5"/>
  </svg>
);

export default function GenderSelection({ onSelect }) {
  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-purple-600 mb-6 text-xl md:text-2xl font-bold leading-tight">
          YOU ARE A:
        </h1>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className="cursor-pointer transition-all duration-300 border-2 hover:border-blue-400 hover:bg-blue-50"
              onClick={() => onSelect("man")}
            >
              <CardContent className="p-4">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-full p-4 mb-3">
                <ManAvatar />
              </div>
              <p className="text-lg font-bold text-gray-800">Man</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className="cursor-pointer transition-all duration-300 border-2 hover:border-pink-400 hover:bg-pink-50"
              onClick={() => onSelect("woman")}
            >
              <CardContent className="p-4">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-gradient-to-br from-purple-50 to-purple-100 rounded-full p-4 mb-3">
                <WomanAvatar />
              </div>
              <p className="text-lg font-bold text-gray-800">Woman</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

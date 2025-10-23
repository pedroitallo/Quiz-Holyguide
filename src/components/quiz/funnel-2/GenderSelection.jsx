import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

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
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-white rounded-full p-3 mb-3">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="80" r="35" fill="#D4A574" />
                  <path d="M65 115 Q100 125 135 115 L135 180 Q100 190 65 180 Z" fill="#4A90E2" />
                  <circle cx="85" cy="75" r="5" fill="#333" />
                  <circle cx="115" cy="75" r="5" fill="#333" />
                  <path d="M90 95 Q100 100 110 95" stroke="#333" strokeWidth="2" fill="none" />
                </svg>
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
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-white rounded-full p-3 mb-3">
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
              <p className="text-lg font-bold text-gray-800">Woman</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

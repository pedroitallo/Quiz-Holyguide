import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function RelationshipEnergy({ onSelect }) {
  const energies = [
    { value: "sweetness_affection", label: "Sweetness and affection", emoji: "💖" },
    { value: "calm_stability", label: "Calm and stability", emoji: "🌊" },
    { value: "intensity_passion", label: "Intensity and passion", emoji: "🌋" },
    { value: "joy_lightness", label: "Joy and lightness", emoji: "🎈" },
    { value: "partnership_complicity", label: "Partnership and complicity", emoji: "🤝" }
  ];

  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-purple-600 mb-6 text-xl md:text-2xl font-bold leading-tight px-4">
          WHAT KIND OF ENERGY DO YOU FEEL MOST BALANCES YOU IN A RELATIONSHIP?
        </h1>

        <div className="space-y-3 max-w-md mx-auto px-4">
          {energies.map((energy, index) => (
            <motion.div
              key={energy.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="cursor-pointer transition-all duration-300 border-2 hover:border-purple-400 hover:bg-purple-50"
                onClick={() => onSelect(energy.value)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">{energy.emoji}</span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-semibold text-gray-800">
                        {energy.label}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

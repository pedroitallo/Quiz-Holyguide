import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AppearanceImportance({ onSelect, zodiacSign }) {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionSelect = (optionValue) => {
    setSelectedOption(optionValue);
  };

  const handleContinue = () => {
    if (selectedOption) {
      onSelect(selectedOption);
    }
  };

  const options = [
    { value: "matters", label: "It really matters", emoji: "✨" },
    { value: "not_much", label: "It doesn't matter much", emoji: "💭" }
  ];

  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-purple-600 mb-6 text-xl md:text-2xl font-bold leading-tight px-4">
          HOW MUCH DOES APPEARANCE MATTER IN A REAL CONNECTION FOR YOU?
        </h1>

        <div className="space-y-3 max-w-md mx-auto px-4">
          {options.map((option, index) => (
            <motion.div
              key={option.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 border-2 ${
                  selectedOption === option.value ? 'border-purple-400 bg-purple-50' : 'hover:border-purple-400 hover:bg-purple-50'
                }`}
                onClick={() => handleOptionSelect(option.value)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">{option.emoji}</span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-semibold text-gray-800">
                        {option.label}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {selectedOption && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6"
          >
            <Button
              onClick={handleContinue}
              className="w-full max-w-sm md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-5 text-xl md:px-16 md:py-6 md:text-2xl"
            >
              Continue
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

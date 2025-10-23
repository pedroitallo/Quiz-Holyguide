import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TypingIndicator from '../shared/TypingIndicator';

export default function AppearanceImportance({ onSelect, zodiacSign }) {
  const [selectedOption, setSelectedOption] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timer;
    if (showMessage) {
      setIsTyping(true);
      timer = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showMessage]);

  const handleOptionSelect = (optionValue) => {
    setSelectedOption(optionValue);
    setShowMessage(true);
  };

  const handleContinue = () => {
    onSelect(selectedOption);
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
                } ${showMessage ? 'pointer-events-none opacity-70' : ''}`}
                onClick={() => !showMessage && handleOptionSelect(option.value)}
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

        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6"
          >
            {isTyping ? (
              <TypingIndicator />
            ) : (
              <>
                <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 mb-6 max-w-md mx-auto">
                  <div className="flex items-start gap-3">
                    <img
                      src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
                      alt="Master Aura"
                      className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                    />
                    <div className="text-left">
                      <p className="text-base text-gray-700 leading-relaxed">
                        Interesting! This kind of value usually appears strongly in people of the sign <span className="font-bold">{zodiacSign || 'your sign'}</span>. Let's see if it shows up in your birth chart...
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleContinue}
                  className="w-full max-w-sm md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-5 text-xl md:px-16 md:py-6 md:text-2xl"
                >
                  Continue
                </Button>
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

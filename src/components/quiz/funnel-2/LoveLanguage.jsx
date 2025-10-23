import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function LoveLanguage({ onSelect }) {
  const languages = [
    { value: "words_affirmation", label: "Words of affirmation", emoji: "🗣️" },
    { value: "meaningful_gifts", label: "Meaningful gifts", emoji: "🎁" },
    { value: "physical_touch", label: "Physical touch", emoji: "🤗" },
    { value: "quality_time", label: "Quality time", emoji: "🕰️" },
    { value: "acts_service", label: "Acts of service", emoji: "🤲" }
  ];

  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-purple-600 mb-6 text-xl md:text-2xl font-bold leading-tight px-4">
          HOW DO YOU MOST LIKE TO EXPRESS AND RECEIVE LOVE?
        </h1>

        <div className="space-y-3 max-w-md mx-auto px-4">
          {languages.map((language, index) => (
            <motion.div
              key={language.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="cursor-pointer transition-all duration-300 border-2 hover:border-purple-400 hover:bg-purple-50"
                onClick={() => onSelect(language.value)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">{language.emoji}</span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-semibold text-gray-800">
                        {language.label}
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

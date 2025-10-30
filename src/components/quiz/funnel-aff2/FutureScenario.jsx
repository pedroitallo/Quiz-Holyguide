import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TypingIndicator from './TypingIndicator';

export default function FutureScenario({ onSubmit, zodiacSign }) {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [showComment, setShowComment] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const scenarios = [
    { value: "stable_life", label: "Construir una vida estable", emoji: "🏡" },
    { value: "travel_world", label: "Viajar por el mundo juntos", emoji: "🌍" },
    { value: "have_children", label: "Tener hijos e iniciar una familia", emoji: "🧒" },
    { value: "growing_together", label: "Crecer juntos", emoji: "🧠" },
    { value: "other", label: "Otro", emoji: "❓" }
  ];

  useEffect(() => {
    let timer;
    if (showComment) {
      setIsTyping(true);
      timer = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showComment]);

  const handleSelect = (value) => {
    setSelectedScenario(value);
    setShowComment(true);
  };

  const handleFinalContinuar = () => {
    onSubmit(selectedScenario);
  };

  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-purple-600 mb-6 text-xl md:text-2xl font-bold leading-tight px-4">
          🔮 CUANDO PIENSAS EN TU VIDA FUTURA CON TU ALMA GEMELA, ¿CUÁL DE ESTOS ESCENARIOS TE ATRAE MÁS?
        </h1>

        <div className="space-y-3 max-w-md mx-auto px-4">
          {scenarios.map((scenario, index) => {
            const isSelected = selectedScenario === scenario.value;
            return (
              <motion.div
                key={scenario.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 border-2 ${
                    isSelected ? 'border-purple-400 bg-purple-50' : 'hover:border-purple-400 hover:bg-purple-50'
                  } ${showComment ? 'pointer-events-none opacity-70' : ''}`}
                  onClick={() => !showComment && handleSelect(scenario.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">{scenario.emoji}</span>
                      </div>
                      <div className="text-left">
                        <h3 className="text-base font-semibold text-gray-800">
                          {scenario.label}
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {showComment && (
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
                        Este deseo habla profundamente de tu viaje amoroso en esta vida. Las personas nacidas bajo <span className="font-bold text-purple-600">{zodiacSign || 'tu signo'}</span> a menudo sienten que el amor debe tener propósito, conexión y verdad. Tu carta completa revelará cómo esto se manifiesta en tu energía.
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleFinalContinuar}
                  className="w-full max-w-sm md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-5 text-xl md:px-16 md:py-6 md:text-2xl"
                >
                  Continuar
                </Button>
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

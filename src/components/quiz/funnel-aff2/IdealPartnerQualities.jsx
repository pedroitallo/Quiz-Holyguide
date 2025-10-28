import React, { useState } from "react";
import { motion } from "framer-motion";

export default function IdealPartnerQualities({ onSubmit, zodiacSign }) {
  const [selectedQualities, setSelectedQualities] = useState([]);

  const qualities = [
    { value: "kind", label: "Amable", emoji: "🤗" },
    { value: "supportive", label: "Comprensivo(a)", emoji: "👐" },
    { value: "honest", label: "Honesto(a)", emoji: "🤝" },
    { value: "optimistic", label: "Optimista", emoji: "🙂" },
    { value: "loyal", label: "Leal", emoji: "🧑‍🤝‍🧑" },
    { value: "caring", label: "Cariñoso(a)", emoji: "😘" },
    { value: "confident", label: "Seguro(a)", emoji: "🤩" },
    { value: "passionate", label: "Apasionado(a)", emoji: "🔥" },
    { value: "funny", label: "Divertido(a)", emoji: "😁" },
    { value: "protective", label: "Protector(a)", emoji: "💪" }
  ];

  const toggleQuality = (value) => {
    setSelectedQualities(prev =>
      prev.includes(value)
        ? prev.filter(q => q !== value)
        : [...prev, value]
    );
  };

  const handleContinuar = () => {
    if (selectedQualities.length > 0) {
      onSubmit(selectedQualities);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl mx-auto px-4 py-8"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <motion.div className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
              ¿Qué cualidades buscas en tu pareja ideal?
            </h2>
            <p className="text-gray-600 text-lg">Por favor selecciona todas las que apliquen</p>
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
            onClick={handleContinuar}
            disabled={selectedQualities.length === 0}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white text-lg font-bold py-4 px-8 rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Continuar
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

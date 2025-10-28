import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function BirthChartResults({ onContinuar }) {
  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl font-bold text-center text-purple-600 leading-tight px-4 mb-6"
          >
            ¡Los Resultados De Tu Lectura De Carta Astral Fueron Sorprendentes!
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 text-base text-gray-700 leading-relaxed px-4 max-w-2xl mx-auto"
          >
            <p className="font-semibold text-lg text-gray-800">
              Tu carta astral muestra una energía muy fascinante.
            </p>

            <p>
              Estaba tan feliz de ver que tendrás una historia de amor que trasciende lo ordinario.
            </p>

            <p>
              Tu Alma Gemela es alguien de belleza iluminadora, con una presencia magnética que atrae y un instinto protector inquebrantable.
            </p>

            <p>
              Siento que él/ella traerá no solo pasión, sino un profundo sentido de seguridad, abriendo caminos hacia la prosperidad que construirán juntos.
            </p>

            <p className="font-semibold text-purple-600">
              Hay un secreto, una revelación aún mayor, esperándote. Estoy casi terminando con la lectura completa, así que sigamos's continue.
            </p>
          </motion.div>

          <Button
            onClick={onContinuar}
            className="w-full max-w-sm md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-5 text-xl md:px-16 md:py-6 md:text-2xl"
          >
            Continuar
          </Button>
      </motion.div>
    </div>
  );
}

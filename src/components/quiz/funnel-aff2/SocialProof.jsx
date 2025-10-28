import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function SocialProof({ onContinuar }) {
  const handleContinuar = () => {
    if (typeof window !== 'undefined' && window.uetq) {
      window.uetq.push('event', 'endquiz', {});
    }
    onContinuar();
  };

  const testimonials = [
    {
      text: "Conocí a mi novio tres semanas después de recibir el dibujo de alma gemela de Auraly. Era idéntico. Todavía tengo escalofríos.",
      author: "Julia"
    },
    {
      text: "Estaba impactada. El boceto mostró el rostro de mi esposo actual - hemos estado juntos por 8 años.",
      author: "Kate",
      icon: "💍"
    },
    {
      text: "Pensé que era solo un dibujo, pero la lectura astral también reveló el nombre y las características de mi alma gemela.",
      author: "Loretta"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto px-4 py-8"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-4"
          >
            <Heart className="w-16 h-16 text-red-500 mx-auto fill-current" />
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 leading-tight">
              ¡Más de 490,000 personas se encontraron con su verdadero amor después de este dibujo de alma gemela — ¡Y tú serás la próxima!
            </h2>
          </motion.div>

          <div className="space-y-4">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.2 }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg border-2 border-purple-100"
              >
                <div className="space-y-3">
                  {testimonial.icon && (
                    <span className="text-3xl">{testimonial.icon}</span>
                  )}
                  <p className="text-gray-800 text-base md:text-lg leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <p className="text-purple-600 font-semibold">
                    — {testimonial.author}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            onClick={handleContinuar}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white text-lg font-bold py-4 px-8 rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Ir a la Revelación Completa
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

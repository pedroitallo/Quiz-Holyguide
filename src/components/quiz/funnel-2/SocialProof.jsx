import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function SocialProof({ onContinue }) {
  const handleContinue = () => {
    if (typeof window !== 'undefined' && window.uetq) {
      window.uetq.push('event', 'endquiz', {});
    }
    onContinue();
  };

  const testimonials = [
    {
      name: "Rebecca Bauman",
      date: "28 de agosto de 2024",
      title: "Mudou a minha vida!",
      text: "Sou grata por este app e pela Akho! Ela é uma excelente quiromante e astróloga—clara, minuciosa e tranquilizadora. Mal posso esperar por mais sessões com ela!",
      avatar: "https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
    },
    {
      name: "Mika Ryan",
      date: "29 de agosto de 2024",
      title: "Depois de anos procurando, finalmente encontrei um amor verdadeiro.",
      text: "Eu estava hesitante se realmente valia a pena tentar, mas agora não tenho arrependimentos e estou curtindo meus novos relacionamentos!",
      avatar: "https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto px-4 py-8"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.2 }}
              className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{testimonial.name}</h3>
                    <p className="text-gray-400 text-sm">{testimonial.date}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-gray-800 text-xl">{testimonial.title}</h4>
                <p className="text-gray-600 text-base leading-relaxed">
                  {testimonial.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white text-lg font-bold py-4 px-8 rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Go To Full Revelation
        </motion.button>
      </div>
    </motion.div>
  );
}

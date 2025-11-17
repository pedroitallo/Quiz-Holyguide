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
      name: "Rebecca",
      date: "August 19, 2025",
      title: "It changed my life.!",
      text: "I’m so grateful for this app and for Master Aura! She’s an amazing astrologer — detailed and calming. I can’t wait for more sessions with her!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg"
    },
     {
      name: "Lily Morgan",
      date: "November 9, 2025",
      title: "It changed my life.!",
      text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned — like we were truly meant to meet. I’m beyond happy!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg"
    },
    {
      name: "Emily Carter",
      date: "August 29, 2025",
      title: "After years of searching, I finally found true love.",
      text: "After using the Auraly App I gotta admit, I wasn’t sure if it was worth it, but seriously… no regrets! I’m having some amazing connections now 😍",
      avatar: "https://diariotribuna.com.br/wp-content/uploads/2021/08/Juliana-1.jpg"
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

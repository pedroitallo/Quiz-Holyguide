import React from "react";
import { motion } from "framer-motion";
import { Heart, Check } from "lucide-react";

export default function SocialProof({ onContinue }) {
  const handleContinue = () => {
    if (typeof window !== 'undefined' && window.uetq) {
      window.uetq.push('event', 'endquiz', {});
    }
    onContinue();
  };

  const testimonials = [
    {
      text: "I met my boyfriend three weeks after receiving Auraly's soulmate drawing. It was identical. I still get goosebumps.",
      author: "Julia"
    },
    {
      text: "I was shocked. The sketch showed the face of my current husband - we've been together for 8 years.",
      author: "Kate",
      icon: "💍"
    },
    {
      text: "I thought it was just a drawing, but the astral reading also revealed the name and characteristics of my soul mate.",
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
              Over 490,000 People Joined Their True Love After This Soulmate Drawing — And You'll Be The Next!
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-8"
          >
            <img
              src="/Gemini_Generated_Image_bkk26vbkk26vbkk2.png"
              alt="App Features"
              className="w-full max-w-md mx-auto rounded-2xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="mt-6 bg-purple-50/80 border-2 border-purple-200 rounded-2xl p-6 shadow-md"
          >
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">
              When you join, you'll receive exclusive access to my app — the Auraly App ✨, where you'll get to see the drawing of your soulmate 🎨💕
            </h3>

            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🔮</span>
                <div>
                  <p className="text-gray-800 font-semibold">Plus, every month you'll receive intuitive and insightful readings</p>
                  <p className="text-gray-600 text-sm">offering powerful guidance about your love life and showing you how to connect energetically with your soulmate 💌💕</p>
                </div>
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              </div>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white text-lg font-bold py-4 px-8 rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mt-6"
          >
            Go To Full Revelation
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

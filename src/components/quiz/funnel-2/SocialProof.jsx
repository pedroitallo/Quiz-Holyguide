import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SocialProof({ onContinue }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleContinue = () => {
    if (typeof window !== "undefined" && window.uetq) {
      window.uetq.push("event", "endquiz", {});
    }
    onContinue();
  };

  const testimonials = [
    {
      name: "Rebecca",
      date: "August 19, 2025",
      title: "It changed my life.!",
      text: "I’m so grateful for this app and for Master Aura! She’s an amazing astrologer — detailed and calming. I can’t wait for more sessions with her!",
      avatar: "https://cdn.eutotal.com/imagens/pose-para-selfies.jpg",
    },
    {
      name: "Lily Morgan",
      date: "November 9, 2025",
      title: "I am very happy.",
      text: "I finally found the relationship of my dreams! 💕 Everything feels so natural and aligned — like we were truly meant to meet. I’m beyond happy!",
      avatar: "https://cdn.eutotal.com/imagens/poses-para-foto6.jpg",
    },
    {
      name: "Emily Carter",
      date: "August 29, 2025",
      title: "After years of searching, I finally found true love.",
      text: "After using the Auraly App I gotta admit, I wasn’t sure if it was worth it, but seriously… no regrets! I’m having some amazing connections now 😍",
      avatar: "https://diariotribuna.com.br/wp-content/uploads/2021/08/Juliana-1.jpg",
    },
  ];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  // Auto slide every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const current = testimonials[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto px-4 py-8"
    >
      <div className="space-y-6">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={current.avatar}
                    alt={current.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      {current.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{current.date}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">
                      ⭐
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-gray-800 text-xl">
                  {current.title}
                </h4>
                <p className="text-gray-600 text-base leading-relaxed">
                  {current.text}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Arrows */}
          <button
            type="button"
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white/90 border border-gray-200 rounded-full p-2 shadow-md hover:bg-gray-50 transition"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <button
            type="button"
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white/90 border border-gray-200 rounded-full p-2 shadow-md hover:bg-gray-50 transition"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
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

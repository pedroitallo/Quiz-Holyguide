import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function InitiateQuiz({ onContinue }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto px-4 py-8"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block"
          >
            <Sparkles className="w-16 h-16 text-purple-500 mx-auto" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight"
          >
            ✨ Ready to find out who your true soulmate is?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-gray-600"
          >
            Take this 1-minute online astral reading to uncover the face of your soulmate!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="py-6"
          >
            <img
              src="/image copy.png"
              alt="Soulmate Reading"
              className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white text-lg md:text-xl font-bold py-4 px-8 rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

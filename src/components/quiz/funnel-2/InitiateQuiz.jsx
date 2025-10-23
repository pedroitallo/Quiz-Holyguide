import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function InitiateQuiz({ onContinue }) {
  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 leading-tight px-4">
          ✨ Ready to find out who your true soulmate is?
        </h1>

        <p className="text-base md:text-lg text-gray-600 mb-6 px-4">
          Take this 1-minute online astral reading to uncover the face of your soulmate!
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <img
            src="/image copy.png"
            alt="Soulmate Reading"
            className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
          />
        </motion.div>

        <Button
          onClick={onContinue}
          className="w-full max-w-sm md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-5 text-xl md:px-16 md:py-6 md:text-2xl"
        >
          Start Now
        </Button>
      </motion.div>
    </div>
  );
}

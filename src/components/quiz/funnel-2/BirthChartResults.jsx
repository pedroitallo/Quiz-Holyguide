import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function BirthChartResults({ onContinue }) {
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
            The Results Of Your Birth Chart Reading Were Surprising!
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 text-base text-gray-700 leading-relaxed px-4 max-w-2xl mx-auto"
          >
            <p className="font-semibold text-lg text-gray-800">
              Your birth chart shows a very fascinating energy.
            </p>

            <p>
              I was so happy to see that you'll have a love story that transcends the ordinary.
            </p>

            <p>
              Your Soulmate is someone of illuminating beauty, with a magnetic presence that attracts and an unwavering protective instinct.
            </p>

            <p>
              I feel that he will bring not only passion, but a deep sense of security, opening paths to prosperity that you will build together.
            </p>

            <p className="font-semibold text-purple-600">
              There is a secret, an even greater revelation, waiting for you. I am almost finished with the complete reading, so let's continue.
            </p>
          </motion.div>

          <Button
            onClick={onContinue}
            className="w-full max-w-sm md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-5 text-xl md:px-16 md:py-6 md:text-2xl"
          >
            Continue
          </Button>
      </motion.div>
    </div>
  );
}

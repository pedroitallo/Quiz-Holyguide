import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function BirthChartResults({ onContinue }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl mx-auto px-4 py-8"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-center"
          >
            <Sparkles className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-center text-purple-600 leading-tight"
          >
            The Results Of Your Birth Chart Reading Were Surprising!
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6 text-lg text-gray-700 leading-relaxed"
          >
            <p className="font-semibold text-xl text-gray-800">
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

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white text-lg font-bold py-4 px-8 rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Continue
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

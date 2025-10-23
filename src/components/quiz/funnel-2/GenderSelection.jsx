import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function GenderSelection({ onSelect }) {
  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-purple-600 mb-6 text-xl md:text-2xl font-bold leading-tight">
          YOU ARE A:
        </h1>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className="cursor-pointer transition-all duration-300 border-2 hover:border-blue-400 hover:bg-blue-50"
              onClick={() => onSelect("man")}
            >
              <CardContent className="p-4">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-white rounded-full p-3 mb-3">
                <img
                  src="/Captura de Tela 2025-10-22 às 22.56.54-Photoroom (2).png"
                  alt="Man"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-lg font-bold text-gray-800">Man</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className="cursor-pointer transition-all duration-300 border-2 hover:border-pink-400 hover:bg-pink-50"
              onClick={() => onSelect("woman")}
            >
              <CardContent className="p-4">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-white rounded-full p-3 mb-3">
                <img
                  src="/Captura de Tela 2025-10-22 às 22.57.10-Photoroom.png"
                  alt="Woman"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-lg font-bold text-gray-800">Woman</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

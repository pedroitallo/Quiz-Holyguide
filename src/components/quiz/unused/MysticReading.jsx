
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, Gem, Star, ArrowRight } from "lucide-react";

export default function MysticReading({ reading, isGenerating, onContinue, userName }) {
  if (isGenerating) {
    return (
      <div className="text-center py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mb-8">
            <Gem className="w-20 h-20 mx-auto text-purple-500 animate-pulse" />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-purple-300 border-t-purple-600"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {userName}, o cosmos está revelando seus segredos...
          </h2>
          
          <div className="space-y-2 text-gray-600">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              ✨ Analisando as linhas da sua palma...
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              🔮 Interpretando a energia da carta escolhida...
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
            >
              💫 Consultando seu mapa astral amoroso...
            </motion.p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-8">
          <Star className="w-16 h-16 mx-auto text-purple-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Sua Leitura Espiritual, {userName}
          </h1>
          <p className="text-gray-600 text-lg">
            O universo revelou mensagens especiais para você
          </p>
        </div>

        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200 shadow-lg mb-8">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <Sparkles className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
              <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {reading}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            onClick={onContinue}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-12 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Continuar minha jornada
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

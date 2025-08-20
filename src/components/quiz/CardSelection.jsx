import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Moon, Sun, Stars } from "lucide-react";

const cards = [
  {
    id: "carta_1",
    name: "A Lua",
    icon: Moon,
    description: "Intuição e mistério",
    gradient: "from-indigo-500 to-purple-600"
  },
  {
    id: "carta_2", 
    name: "O Sol",
    icon: Sun,
    description: "Paixão e energia vital",
    gradient: "from-orange-400 to-pink-500"
  },
  {
    id: "carta_3",
    name: "As Estrelas", 
    icon: Stars,
    description: "Esperança e destino",
    gradient: "from-blue-400 to-purple-500"
  }
];

export default function CardSelection({ onCardSelected }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isRevealing, setIsRevealing] = useState(false);

  const handleCardClick = (cardId) => {
    if (selectedCard || isRevealing) return;
    
    setSelectedCard(cardId);
    setIsRevealing(true);
    
    setTimeout(() => {
      onCardSelected(cardId);
    }, 2500);
  };

  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
          Escolha a carta que mais ressoa com sua alma
        </h1>
        
        <p className="text-gray-600 text-lg mb-12 leading-relaxed max-w-md mx-auto">
          Deixe sua intuição guiá-la. O universo já sabe qual carta revelará seus segredos amorosos.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card, index) => {
          const isSelected = selectedCard === card.id;
          const IconComponent = card.icon;
          
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              <Card 
                className={`cursor-pointer transition-all duration-500 hover:shadow-xl transform hover:scale-105 ${
                  isSelected ? 'ring-4 ring-purple-400 shadow-2xl' : 'hover:shadow-lg'
                } ${isRevealing && !isSelected ? 'opacity-50' : ''}`}
                onClick={() => handleCardClick(card.id)}
              >
                <CardContent className="p-8 h-72 flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Card back (initial state) */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center"
                    animate={{ 
                      rotateY: isSelected ? 180 : 0,
                      opacity: isSelected ? 0 : 1 
                    }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="text-center text-white">
                      <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-white/40 rounded" />
                      </div>
                      <p className="text-lg font-medium">Carta Misteriosa</p>
                    </div>
                  </motion.div>

                  {/* Card front (revealed state) */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white`}
                    initial={{ rotateY: -180, opacity: 0 }}
                    animate={{ 
                      rotateY: isSelected ? 0 : -180,
                      opacity: isSelected ? 1 : 0 
                    }}
                    transition={{ duration: 0.8, delay: isSelected ? 0.2 : 0 }}
                  >
                    <div className="text-center">
                      <IconComponent className="w-16 h-16 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">{card.name}</h3>
                      <p className="text-lg opacity-90">{card.description}</p>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {selectedCard && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-center"
        >
          <p className="text-purple-600 text-lg font-medium">
            ✨ Essa carta revela a energia que está guiando sua alma neste momento...
          </p>
        </motion.div>
      )}
    </div>
  );
}
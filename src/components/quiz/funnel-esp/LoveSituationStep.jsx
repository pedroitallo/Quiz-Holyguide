
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Heart, Users, Search, Check } from "lucide-react";
import TypingIndicator from '../shared/TypingIndicator';

const getZodiacSign = (dateString) => {
  if (!dateString) return "Signo";
  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;

  const signs = [
  { name: "Capricornio", start: [12, 22], end: [1, 19] },
  { name: "Acuario", start: [1, 20], end: [2, 18] },
  { name: "Piscis", start: [2, 19], end: [3, 20] },
  { name: "Aries", start: [3, 21], end: [4, 19] },
  { name: "Tauro", start: [4, 20], end: [5, 20] },
  { name: "Géminis", start: [5, 21], end: [6, 20] },
  { name: "Cáncer", start: [6, 21], end: [7, 22] },
  { name: "Leo", start: [7, 23], end: [8, 22] },
  { name: "Virgo", start: [8, 23], end: [9, 22] },
  { name: "Libra", start: [9, 23], end: [10, 22] },
  { name: "Escorpio", start: [10, 23], end: [11, 21] },
  { name: "Sagitario", start: [11, 22], end: [12, 21] }];


  for (let sign of signs) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;
    if (sign.name === "Capricornio") {
      if (month === 12 && day >= 22 || month === 1 && day <= 19) return sign.name;
    } else {
      if (month === startMonth && day >= startDay || month === endMonth && day <= endDay) return sign.name;
    }
  }
  return "Capricornio";
};

const loveSituationOptions = [
{ id: "single", label: "Estoy soltera/o", icon: Search, description: "Buscando amor" },
{ id: "dating", label: "Estoy saliendo o hablando con alguien", icon: Users, description: "Explorando conexiones" },
{ id: "relationship_missing", label: "Estoy en una relación, pero siento que falta algo", icon: Heart, description: "Buscando completitud" },
{ id: "happy_relationship", label: "Estoy en una relación feliz y quiero confirmar si es mi Alma Gemela", icon: Check, description: "Buscando confirmación" }];


export default function LoveSituationStep({ userName, birthDate, onSubmit }) {
  const [selectedOption, setSelectedOption] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const zodiacSign = getZodiacSign(birthDate);

  useEffect(() => {
    let timer;
    if (showMessage) {
      setIsTyping(true);
      timer = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showMessage]);

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    setShowMessage(true);
  };

  const handleContinue = () => {
    onSubmit(selectedOption);
  };

  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>

        <h1 className="text-purple-600 mb-2 text-xl font-bold leading-tight">¿CÓMO ESTÁ TU VIDA AMOROSA EN ESTE MOMENTO?

        </h1>

        <div className="space-y-2 max-w-md mx-auto">
          {loveSituationOptions.map((option, index) => {
            const IconComponent = option.icon;
            const isSelected = selectedOption === option.id;

            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}>

                <Card
                  className={`cursor-pointer transition-all duration-300 border-2 ${isSelected ? 'border-purple-400 bg-purple-50' : 'hover:border-purple-300'} ${showMessage ? 'pointer-events-none opacity-70' : ''}`}
                  onClick={() => !showMessage && handleOptionSelect(option.id)}>

                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-semibold text-gray-800">
                          {option.label}
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>);

          })}
        </div>

        {showMessage &&
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6">

            {isTyping ?
          <TypingIndicator /> :

          <>
                    <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 mb-6 max-w-md mx-auto">
                    <div className="flex items-start gap-3">
                        <img
                  src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
                  alt="Master Aura"
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />

                        <div className="text-left">
                        <p className="text-base text-gray-700 leading-relaxed">
                            {userName ? <><span className="font-bold">{userName}</span>, me encanta escuchar que las cosas están progresando en tu vida.</> : "Me encanta escuchar que las cosas están progresando en tu vida."} Las personas del signo <span className="font-bold">{zodiacSign}</span> tienden a tener un viaje romántico más profundo, y <strong>¡mi visión indica que estás a punto de tener una revelación transformadora!</strong>
                        </p>
                        </div>
                    </div>
                    </div>
                    <Button
              onClick={handleContinue}
              className="w-full max-w-sm md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-5 text-xl md:px-16 md:py-6 md:text-2xl">

                    Continuar
                    </Button>
                </>
          }
          </motion.div>
        }
      </motion.div>
    </div>);

}


import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Heart, Users, Search, Check } from "lucide-react";
import TypingIndicator from './TypingIndicator';

const getZodiacSign = (dateString) => {
  if (!dateString) return "Signo";
  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;

  const signs = [
  { name: "Capricorn", start: [12, 22], end: [1, 19] },
  { name: "Aquarius", start: [1, 20], end: [2, 18] },
  { name: "Pisces", start: [2, 19], end: [3, 20] },
  { name: "Aries", start: [3, 21], end: [4, 19] },
  { name: "Taurus", start: [4, 20], end: [5, 20] },
  { name: "Gemini", start: [5, 21], end: [6, 20] },
  { name: "Cancer", start: [6, 21], end: [7, 22] },
  { name: "Leo", start: [7, 23], end: [8, 22] },
  { name: "Virgo", start: [8, 23], end: [9, 22] },
  { name: "Libra", start: [9, 23], end: [10, 22] },
  { name: "Scorpio", start: [10, 23], end: [11, 21] },
  { name: "Sagittarius", start: [11, 22], end: [12, 21] }];


  for (let sign of signs) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;
    if (sign.name === "Capricorn") {
      if (month === 12 && day >= 22 || month === 1 && day <= 19) return sign.name;
    } else {
      if (month === startMonth && day >= startDay || month === endMonth && day <= endDay) return sign.name;
    }
  }
  return "Capricorn";
};

const loveSituationOptions = [
{ id: "single", label: "I am single", icon: Search, description: "Looking for love" },
{ id: "dating", label: "I am dating or talking to someone", icon: Users, description: "Exploring connections" },
{ id: "relationship_missing", label: "I am in a relationship, but I feel like something is missing", icon: Heart, description: "Seeking completeness" },
{ id: "happy_relationship", label: "I am in a happy relationship and want to confirm if this is my Divine Soulmate", icon: Check, description: "Seeking confirmation" }];


export default function LoveSituationStep({ userName, birthDate, onSubmit }) {
  const [selectedOption, setSelectedOption] = useState("");
  const [showInitialTyping, setShowInitialTyping] = useState(true);
  const [showInitialMessage, setShowInitialMessage] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showResponseMessage, setShowResponseMessage] = useState(false);
  const [isResponseTyping, setIsResponseTyping] = useState(false);
  const zodiacSign = getZodiacSign(birthDate);

  useEffect(() => {
    // Initial typing (1s) then show message and options
    const timer = setTimeout(() => {
      setShowInitialTyping(false);
      setShowInitialMessage(true);
      setShowOptions(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let timer;
    if (showResponseMessage) {
      setIsResponseTyping(true);
      timer = setTimeout(() => {
        setIsResponseTyping(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showResponseMessage]);

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    setShowOptions(false);
    setShowResponseMessage(true);
  };

  const handleContinue = () => {
    // The selected option is already saved by being passed to the onSubmit prop.
    // This correctly implements the "Salvar Progresso" requirement.
    onSubmit(selectedOption);
  };

  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>

        {/* Initial typing indicator */}
        <div className="min-h-[120px] mb-6">
          <div className={`transition-opacity duration-300 ${showInitialTyping ? 'opacity-100' : 'opacity-0'} ${showInitialMessage ? 'hidden' : ''}`}>
            <TypingIndicator />
          </div>

          {/* Initial message */}
          <div className={`transition-opacity duration-300 ${showInitialMessage ? 'opacity-100' : 'opacity-0'} ${!showInitialMessage ? 'hidden' : ''}`}>
            <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <img
                  src="https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/adbb98955_Perfil.webp"
                  alt="Madame Aura"
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />
                <div className="text-left">
                  <p className="text-base text-gray-700 leading-relaxed">
                    {userName}, in just <strong>2 minutes</strong>, I will visualize and draw the <strong>soulmate's face</strong>…
                    <br /><br />
                    Now, let's uncover your love life at this very moment 💞✨
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Options - only show after initial message */}
        {showOptions && (
        <div className="space-y-3 max-w-md mx-auto">
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
                  onClick={() => !showResponseMessage && handleOptionSelect(option.id)}>

                  <CardContent className="p-3">
                    <div className="flex items-center gap-3 min-h-[60px]">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-semibold text-gray-800 leading-relaxed">
                          {option.label}
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>);

          })}
        </div>
        )}

        {showResponseMessage &&
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6">

            {isResponseTyping ?
          <TypingIndicator /> :

          <>
                    <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 mb-6 max-w-md mx-auto">
                    <div className="flex items-start gap-3">
                        <img
                  src="https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/adbb98955_Perfil.webp"
                  alt="Madame Aura"
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />

                        <div className="text-left">
                        <p className="text-base text-gray-700 leading-relaxed">
                            {userName ? <><span className="font-bold">{userName}</span>, I am delighted to hear that things are progressing in your life.</> : "I am delighted to hear that things are progressing in your life."} People of the <span className="font-bold">{zodiacSign}</span> sign tend to have a deeper romantic journey, and <strong>my vision indicates that you are about to have a transformative revelation!</strong>
                        </p>
                        </div>
                    </div>
                    </div>
                    <Button
              onClick={handleContinue}
              id="btn-step6"        
              className="w-full max-w-sm md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-5 text-xl md:px-16 md:py-6 md:text-2xl">

                    Continue
                    </Button>
                </>
          }
          </motion.div>
        }
      </motion.div>
    </div>);

}

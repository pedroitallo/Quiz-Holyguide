import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TypingIndicator from './TypingIndicator';

export default function LoadingRevelation({ onContinue, userName, birthDate, quizResultId }) {
  const [userCity, setUserCity] = useState("your city");
  const [showFirstTyping, setShowFirstTyping] = useState(true);
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showSecondTyping, setShowSecondTyping] = useState(false);
  const [showSecondMessage, setShowSecondMessage] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showThirdTyping, setShowThirdTyping] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  // Function to get user's location by IP
  const getUserLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (data.city) {
        setUserCity(data.city);
      }
    } catch (error) {
      console.warn('Failed to get user location:', error);
      // Keep default "your city"
    }
  };

  useEffect(() => {
    // Get user location when component mounts
    getUserLocation();
  }, []);

  useEffect(() => {
    const timers = [];

    // First typing (1s) then first message
    timers.push(setTimeout(() => {
      setShowFirstTyping(false);
      setShowFirstMessage(true);
    }, 1000));

    // Second typing after first message (1.5s)
    timers.push(setTimeout(() => {
      setShowSecondTyping(true);
    }, 2000));

    // Second message after second typing (1.5s)
    timers.push(setTimeout(() => {
      setShowSecondTyping(false);
      setShowSecondMessage(true);
    }, 3500));

    // Third typing after second message (1.5s)
    timers.push(setTimeout(() => {
      setShowThirdTyping(true);
    }, 5000));

    // Final message after third typing (1.5s)
    timers.push(setTimeout(() => {
      setShowThirdTyping(false);
      setShowFinalMessage(true);
    }, 6500));

    return () => timers.forEach(clearTimeout);
  }, []);

  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full"
    >
      <div className="flex items-start gap-3">
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
          alt="Madame Aura"
          loading="lazy"
          decoding="async"
          className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
        />
        <div className="flex items-center gap-2 mt-2">
          <div className="w-5 h-5 text-red-500 animate-pulse">🎤</div>
          <span className="text-sm text-gray-500 ml-2">Madame Aura is recording an audio...</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="py-8 w-full max-w-lg mx-auto flex flex-col items-center gap-4">
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&display=swap"
        rel="stylesheet" />

      {/* First typing indicator */}
      <AnimatePresence>
        {showFirstTyping && <TypingIndicator />}
      </AnimatePresence>

      {/* First message */}
      <AnimatePresence>
        {showFirstMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full">
            <div className="flex items-start gap-3">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
                alt="Madame Aura"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                loading="eager"
                decoding="async" />
              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                  {userName ? <><span className="font-bold">{userName}</span>, I've already connected with the astrological chart between you and your soulmate. Everything points to a meeting in <strong>{userCity}</strong> — or somewhere very close.</> : "I've already connected with the astrological chart between you and your soulmate. Everything points to a meeting in your city — or somewhere very close."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Second typing indicator */}
      <AnimatePresence>
        {showSecondTyping && <TypingIndicator />}
      </AnimatePresence>

      {/* Second message */}
      <AnimatePresence>
        {showSecondMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full">
            <div className="flex items-start gap-3">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
                alt="Madame Aura"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                loading="eager"
                decoding="async" />
              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                  In this astrological chart, besides revealing the face of your soulmate... I will also reveal their <strong>name</strong>, <strong>age</strong>, <strong>date of the encounter</strong>, and <strong>unique characteristics</strong>. Take a look:
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Third typing indicator */}
      <AnimatePresence>
        {showThirdTyping && <TypingIndicator />}
      </AnimatePresence>

    </div>
  );
}
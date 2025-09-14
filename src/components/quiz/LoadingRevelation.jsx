import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
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
  const [showSendingTyping, setShowSendingTyping] = useState(false);
  const [showBlurredCards, setShowBlurredCards] = useState(false);
  const [showAudioTyping, setShowAudioTyping] = useState(false);
  const [showAudioMessage, setShowAudioMessage] = useState(false);
  const [showRecordingAudio, setShowRecordingAudio] = useState(false);
  const [showGreenButton, setShowGreenButton] = useState(false);

  const imageUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/b6f3d66de_image.png";

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
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Retorna apenas dia e mês (formato DD/MM)
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  };

  const TextOverlay = () => (
  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div
      className="absolute"
      style={{
        top: '22%',
        right: '13%',
        width: '18%',
        height: '18%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <div
        style={{
          fontFamily: 'Dancing Script, cursive',
          fontWeight: '600',
          fontSize: 'clamp(7px, 2.2vw, 11px)',
          lineHeight: '1.3',
          textAlign: 'center',
          color: '#4a4a4a',
          textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.1)',
          filter: 'sepia(10%) contrast(1.1)',
          transform: 'rotate(-1deg)'
        }}>
          <div style={{ marginBottom: '2px' }}>
            {userName || ''}
          </div>
          <div>
            {formatDate(birthDate) || '...'}
          </div>
        </div>
      </div>
    </div>);

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

    // Show blurred cards after final message
    timers.push(setTimeout(() => {
      setShowSendingTyping(true);
    }, 9500)); // 3s after final message

    // Show blurred cards after sending typing (1s typing)
    timers.push(setTimeout(() => {
      setShowSendingTyping(false);
      setShowBlurredCards(true);
    }, 10500));

    // Show button after blurred cards
    timers.push(setTimeout(() => {
      setShowAudioTyping(true);
    }, 11500));

    // Show audio message after typing (2s)
    timers.push(setTimeout(() => {
      setShowAudioTyping(false);
      setShowAudioMessage(true);
    }, 13500));

    // Show recording audio after message
    timers.push(setTimeout(() => {
      setShowRecordingAudio(true);
    }, 14000));

    // Show green button after recording (5s)
    timers.push(setTimeout(() => {
      setShowRecordingAudio(false);
      setShowGreenButton(true);
    }, 19000));

    return () => timers.forEach(clearTimeout);
  }, []);


  const RecordingAudioIndicator = () => (
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

  const handleCheckoutRedirect = () => {
    window.open('https://payments.securitysacred.online/checkout/184553763:1', '_blank');
  };

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

      {/* Final message */}
      <AnimatePresence>
        {showFinalMessage && (
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
                  {userName ? <><span className="font-bold">{userName}</span>, based on the <strong>reading of your destiny</strong> and your <strong>date of birth</strong>, I've started sketching the <strong>face of your soulmate</strong>. 🔮</> : "Based on the reading of your destiny and your date of birth, I've started sketching the face of your soulmate. 🔮"}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sending details typing indicator */}
      <AnimatePresence>
        {showSendingTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full"
          >
            <div className="flex items-start gap-3">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
                alt="Madame Aura"
                loading="eager"
                decoding="async"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
              />
              <div className="flex items-center gap-2 mt-2">
                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-500 ml-2">Sending details of your soulmate...</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blurred Cards */}
      <AnimatePresence>
        {showBlurredCards && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 w-full"
          >
            {/* Expected Date of Meeting */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="font-semibold text-gray-800 mb-2">Expected Date of Meeting:</div>
              <div className="text-gray-600">
                {userName} will meet <span className="blur-sm bg-gray-300 px-2 py-1 rounded">someone special</span> at <strong>{userCity}</strong> on <span className="blur-sm bg-gray-300 px-2 py-1 rounded">March 2025</span>.
              </div>
            </div>

            {/* Name of Soulmate */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="font-semibold text-gray-800 mb-2">Name of your Soulmate:</div>
              <div className="text-gray-600">
                The revealed name was <span className="blur-sm bg-gray-300 px-2 py-0.5 rounded">Alexander</span>, this person is closer than you can imagine.
              </div>
            </div>

            {/* Main Characteristics */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="font-semibold text-gray-800 mb-2">Main Characteristics of your Soulmate:</div>
              <div className="text-gray-600">
                {userName}, your soulmate has <span className="blur-sm bg-gray-300 px-2 py-0.5 rounded">brown</span> eyes, a remarkable smile, and a special mark <span className="blur-sm bg-gray-300 px-2 py-0.5 rounded">on their left hand</span>.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio typing indicator */}
      <AnimatePresence>
        {showAudioTyping && <TypingIndicator />}
      </AnimatePresence>

      {/* Audio message */}
      <AnimatePresence>
        {showAudioMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full">
            <div className="flex items-start gap-3">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
                alt="Madame Aura"
                loading="eager"
                decoding="async"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />
              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                  Listen to the audio below to learn how to receive the face of your soulmate and all the complete details.👇🏼
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording audio indicator */}
      <AnimatePresence>
        {showRecordingAudio && <RecordingAudioIndicator />}
      </AnimatePresence>

      {/* Continue button */}
      {showGreenButton && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8">

        <Button
          onClick={handleCheckoutRedirect}
          className="w-full max-w-sm md:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-5 text-xl md:px-16 md:py-6 md:text-2xl mt-6"
        >
          Continue to Full Revelation
        </Button>

        </motion.div>
      )}
    </div>);
}
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import TypingIndicator from './TypingIndicator';

export default function LoadingRevelation({ onContinue, userName, birthDate, quizResultId }) {
  const [userCity, setUserCity] = useState("your city");
  const [showFirstTyping, setShowFirstTyping] = useState(true);
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showSecondTyping, setShowSecondTyping] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

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

    // Skip first message and image since they moved to audio step
    // Go directly to second typing
    timers.push(setTimeout(() => {
      setShowFirstTyping(false);
      setShowSecondTyping(true);
    }, 1000));

    // Second typing (1s) then final message
    timers.push(setTimeout(() => {
      setShowSecondTyping(false);
      setShowFinalMessage(true);
    }, 2000));

    // Show button after final message
    timers.push(setTimeout(() => {
      setShowNextButton(true);
    }, 2500));

    return () => timers.forEach(clearTimeout);
  }, []);


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
          <div style={{ display: 'none' }}>
            {/* Message moved to audio step */}
          </div>
        )}
      </AnimatePresence>

      {/* Image - removed as it was moved to audio step */}
      <AnimatePresence>
        {showImage && <div style={{ display: 'none' }} />}
      </AnimatePresence>

      {/* Second typing indicator */}
      <AnimatePresence>
        {showSecondTyping && <TypingIndicator />}
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
                  {userName ? <><span className="font-bold">{userName}</span>, something special is happening...</> : "Something special is happening..."}
                  <br /><br />
                  Based on the reading of your destiny and your date of birth, I've started to sketch the face of your soulmate. Everything points to a meeting in <strong>{userCity}</strong>—or somewhere very close.
                  <br /><br />
                  This person carries a beautiful energy and is closer than you think... patiently waiting for you. ✨
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue button */}
      {showNextButton && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8">

        <div className="text-center">
          <h2 className="text-2xl font-bold text-purple-600 mb-4">
            ✨ Your Divine Soul Drawing Is Complete! ✨
          </h2>
          <p className="text-gray-700 text-lg mb-6 max-w-md mx-auto">
            {userName ? `${userName}, your` : "Your"} personalized soulmate drawing has been prepared based on your unique spiritual energy and birth chart.
          </p>
          <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-sm border border-purple-100 mb-6">
            <p className="text-gray-600 text-base leading-relaxed">
              🎨 <strong>Your complete revelation includes:</strong>
              <br />• Detailed drawing of your soulmate's face
              <br />• When and where you'll meet them
              <br />• Their personality traits and characteristics
              <br />• How to recognize them when you meet
            </p>
          </div>
          <p className="text-purple-600 font-semibold text-lg">
            Your divine connection awaits! 💜
          </p>
        </div>

        <Button
          onClick={() => {
            // Scroll to top before moving to next step
            setTimeout(() => {
              window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
              });
            }, 50);
            onContinue();
          }}
          className="w-full max-w-sm md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-5 text-xl md:px-16 md:py-6 md:text-2xl mt-6"
        >
          Continue to Full Revelation
        </Button>

        </motion.div>
      )}
    </div>);
}
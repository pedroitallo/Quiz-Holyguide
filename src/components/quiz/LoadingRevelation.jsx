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

    // Show image immediately after first message
    timers.push(setTimeout(() => {
      setShowImage(true);
    }, 1500));

    return () => timers.forEach(clearTimeout);
  }, []);

  // Handle image load and trigger second message
  const handleImageLoad = () => {
    setImageLoaded(true);
    
    // Start second typing after image loads
    setTimeout(() => {
      setShowSecondTyping(true);
    }, 500);

    // Second typing (1s) then final message
    setTimeout(() => {
      setShowSecondTyping(false);
      setShowFinalMessage(true);
    }, 1500);

    // Show button after final message
    setTimeout(() => {
      setShowNextButton(true);
    }, 2000);
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
                <p className="text-base text-gray-700 leading-relaxed">Based on your birth chart, <strong>I am preparing a drawing of your soulmate</strong>. I'm starting right now👇🔮
              </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image */}
      <AnimatePresence>
        {showImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-2 shadow-sm border border-gray-200 mb-4 relative w-full">

            <img
            src={imageUrl}
            alt="Preparing your revelation"
            className="w-full rounded-lg"
            onLoad={handleImageLoad}
            loading="eager"
            decoding="async"
            style={{
              imageRendering: 'crisp-edges',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }} />

            <TextOverlay />
          </motion.div>
        )}
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
                  {userName ? <><span className="font-bold">{userName}</span>, something special is unfolding...</> : "Something special is unfolding..."}
                  Your birth chart shows that your soulmate has a <strong>beautiful energy and is closer than you think</strong>✨
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

        </motion.div>
      )}
    </div>);
}
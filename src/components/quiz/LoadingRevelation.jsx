import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import TypingIndicator from './TypingIndicator';

export default function LoadingRevelation({ onContinue, userName, birthDate, quizResultId }) {
  const [userCity, setUserCity] = useState("your city");
  const [showFirstTyping, setShowFirstTyping] = useState(true);
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showSecondTyping, setShowSecondTyping] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  const imageUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/b6f3d66de_image.png";

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const TextOverlay = () =>
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
    </div>;

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

    // Start second typing after image appears
    timers.push(setTimeout(() => {
      setShowSecondTyping(true);
    }, 2000));

    // Second typing (1s) then final message
    timers.push(setTimeout(() => {
      setShowSecondTyping(false);
      setShowFinalMessage(true);
    }, 3000));

    // Show button after final message
    timers.push(setTimeout(() => {
      setShowNextButton(true);
    }, 3500));

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
        {showFirstMessage &&
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full">

            <div className="flex items-start gap-3">
              <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c8fa6c6f1_image.png"
              alt="Madame Aura"
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />

              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">Based on your birth chart, I am preparing a portrait of your divine soul. I'm starting right now👇🔮
              </p>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Image */}
      <AnimatePresence>
        {showImage &&
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-2 shadow-sm border border-gray-200 mb-4 relative w-full">

            <img
            src={imageUrl}
            alt="Preparing your revelation"
            className="w-full rounded-lg"
            style={{
              loading: 'lazy',
              decoding: 'async',
              imageRendering: 'crisp-edges',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }} />

            <TextOverlay />
          </motion.div>
        }
      </AnimatePresence>

      {/* Second typing indicator */}
      <AnimatePresence>
        {showSecondTyping && <TypingIndicator />}
      </AnimatePresence>

      {/* Final message */}
      <AnimatePresence>
        {showFinalMessage &&
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full">

            <div className="flex items-start gap-3">
              <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c8fa6c6f1_image.png"
              alt="Madame Aura"
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />

              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                  {userName ? <><span className="font-bold">{userName}</span>, something special is unfolding...</> : "Something special is unfolding..."}
                  <br /><br />
                  Based on the reading of your destiny and your birth date, I've started to draw the face of your soulmate. Everything points to a meeting in <span className="font-bold">{userCity}</span> — or somewhere very close.
                  <br /><br />
                  This person has a beautiful energy and is closer than you think… patiently waiting for you. ✨
                </p>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Continue button */}
      {showNextButton &&
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8">

         <button
  id="btn-vsl"
  className="btn-primary btn-paywall w-full max-w-sm md:w-auto"
  onClick={() => {
    onContinue(); // mantém sua ação normal
    window.metrito.track('paywall'); // dispara apenas o evento
  }}
>
  Discover the face of my divine soul
</button>

        </motion.div>
      }
    </div>);
}
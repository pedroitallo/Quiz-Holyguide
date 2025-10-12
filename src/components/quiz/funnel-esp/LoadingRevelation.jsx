import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import TypingIndicator from '../shared/TypingIndicator';
import { useTracking } from '@/hooks/useTracking';

export default function LoadingRevelation({ onContinue, userName, birthDate, quizResultId }) {
  const { trackEndQuiz, trackFacebookEvent } = useTracking();
  const [userCity, setUserCity] = useState("tu ciudad");
  const [showFirstTyping, setShowFirstTyping] = useState(true);
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showSecondTyping, setShowSecondTyping] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  const imageUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/b6f3d66de_image.png";

  const handleContinue = () => {
    trackEndQuiz();
    onContinue();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
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

    timers.push(setTimeout(() => {
      setShowFirstTyping(false);
      setShowFirstMessage(true);
    }, 1000));

    timers.push(setTimeout(() => {
      setShowImage(true);
    }, 1500));

    timers.push(setTimeout(() => {
      setShowSecondTyping(true);
    }, 2000));

    timers.push(setTimeout(() => {
      setShowSecondTyping(false);
      setShowFinalMessage(true);
    }, 3000));

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

      <AnimatePresence>
        {showFirstTyping && <TypingIndicator />}
      </AnimatePresence>

      <AnimatePresence>
        {showFirstMessage &&
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full">

            <div className="flex items-start gap-3">
              <img
              src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
              alt="Master Aura"
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />

              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">Basándome en tu carta natal, estoy preparando un retrato de tu alma gemela. Estoy comenzando ahora mismo👇🔮
              </p>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      <AnimatePresence>
        {showImage &&
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-2 shadow-sm border border-gray-200 mb-4 relative w-full">

            <img
            src={imageUrl}
            alt="Preparando tu revelación"
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

      <AnimatePresence>
        {showSecondTyping && <TypingIndicator />}
      </AnimatePresence>

      <AnimatePresence>
        {showFinalMessage &&
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full">

            <div className="flex items-start gap-3">
              <img
              src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
              alt="Master Aura"
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />

              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                  {userName ? <><span className="font-bold">{userName}</span>, algo especial se está desarrollando...</> : "Algo especial se está desarrollando..."}
                  <br /><br />
                  Basándome en la lectura de tu destino y tu fecha de nacimiento, he comenzado a dibujar el rostro de tu alma gemela. Todo indica un encuentro en <span className="font-bold">{userCity}</span> — o en algún lugar muy cercano.
                  <br /><br />
                  Esta persona tiene una energía hermosa y está más cerca de lo que piensas… esperándote pacientemente. ✨
                </p>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {showNextButton &&
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8">

          <button
          onClick={handleContinue}
          className="btn-primary w-full max-w-sm md:w-auto">
            Descubrir el rostro de mi alma gemela
          </button>
        </motion.div>
      }
    </div>);
}

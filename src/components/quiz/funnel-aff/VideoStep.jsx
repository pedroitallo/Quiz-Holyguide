
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTracking } from '@/hooks/useTracking';

export default function VideoStep({ onContinue }) {
  const [currentDate, setCurrentDate] = useState('');
  const { trackStartQuiz, trackFacebookEvent } = useTracking();

  useEffect(() => {
    const today = new Date();
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    setCurrentDate(today.toLocaleDateString('en-US', options));
  }, []);

  useEffect(() => {
    const scriptSrc = "https://scripts.converteai.net/8f5333fd-fe8a-42cd-9840-10519ad6c7c7/players/6887d876e08b97c1c6617aab/v4/player.js";

    if (document.querySelector(`script[src="${scriptSrc}"]`)) {
      return;
    }

    console.log("Carregando script do VSL - VideoStep montado");
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      console.log("Removendo script do VSL - VideoStep desmontado");
      const scriptElements = document.querySelectorAll(`script[src="${scriptSrc}"]`);
      scriptElements.forEach((s) => {
        if (document.head.contains(s)) {
          document.head.removeChild(s);
        }
      });

      const playerContainer = document.getElementById("vid-6887d876e08b97c1c6617aab");
      if (playerContainer) {
        playerContainer.innerHTML = "";
      }

      if (window.smartplayer) {
        delete window.smartplayer;
      }
    };
  }, []);

  const handleContinue = () => {
    trackStartQuiz();
    onContinue();
  };

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>

        <h1 className="text-xl md:text-2xl mb-2 font-bold text-black leading-tight">I will use my psychic abilities to reveal the face of your soulmate.
        </h1>

        <p className="text-gray-600 text-base mb-6 max-w-2xl mx-auto leading-relaxed">Press play and see why over 10,000 people trust Aura, Hollywood's number #1 psychic
        </p>

        <div className="mb-8 w-full max-w-lg mx-auto">
          <div className="shadow-lg rounded-xl overflow-hidden">
            <vturb-smartplayer
              id="vid-6887d876e08b97c1c6617aab"
              style={{
                display: 'block',
                margin: '0 auto',
                width: '100%'
              }}>
            </vturb-smartplayer>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>

          <p className="text-gray-700 text-sm mb-4 mx-auto max-w-sm leading-relaxed">⏳Takes just 1 minute
          </p>

          <button
            onClick={handleContinue}
            className="w-full max-w-sm md:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold whitespace-nowrap inline-flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform active:scale-95 hover:scale-105 px-10 py-5 text-base md:px-16 md:py-6 md:text-lg animate-bounce-subtle cursor-pointer touch-manipulation"
            style={{
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
              userSelect: 'none'
            }}
          >
            Discover my soulmate
            <span className="ml-2">→</span>
          </button>
        </motion.div>

        {currentDate &&
        <p className="text-red-600 mt-4 text-xs animate-pulse">
            ⏳ This reading will be available until <strong>{currentDate}</strong>, only on this page!
          </p>
        }
      </motion.div>
    </div>);

}

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function VideoStepTt({ onContinue }) {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    setCurrentDate(today.toLocaleDateString('en-US', options));
  }, []);

  useEffect(() => {
    // VSL inicial específica do funnel-tt
    const scriptSrc = "https://scripts.converteai.net/8f5333fd-fe8a-42cd-9840-10519ad6c7c7/players/68c9cd3fad75e9d1ba465f49/v4/player.js";

    // Verificar se o script já existe
    if (document.querySelector(`script[src="${scriptSrc}"]`)) {
      return;
    }

    console.log("Carregando script do VSL inicial - VideoStepTt montado");
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // CLEANUP COMPLETO QUANDO ESTE COMPONENTE É DESMONTADO
      console.log("Removendo script do VSL inicial - VideoStepTt desmontado");
      const scriptElements = document.querySelectorAll(`script[src="${scriptSrc}"]`);
      scriptElements.forEach((s) => {
        if (document.head.contains(s)) {
          document.head.removeChild(s);
        }
      });

      // Limpar o container do player
      const playerContainer = document.getElementById("vid-68c9cd3fad75e9d1ba465f49");
      if (playerContainer) {
        playerContainer.innerHTML = "";
      }

      // Limpar variáveis globais do player se existirem
      if (window.smartplayer) {
        delete window.smartplayer;
      }
    };
  }, []); // Este useEffect roda apenas quando o VideoStepTt é montado/desmontado

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>

        <h1 className="text-2xl mb-2 font-bold leading-tight">I will use my psychic abilities to reveal the face of your divine soul.
        </h1>
        
        <p className="text-gray-600 text-base mb-6 max-w-2xl mx-auto leading-relaxed">Press play and see why over 10,000 people trust Aura, Hollywood's number #1 psychic
        </p>
        <div className="mb-8 w-full max-w-lg mx-auto">
          <div className="shadow-lg rounded-xl overflow-hidden">
            <vturb-smartplayer
              id="vid-68c9cd3fad75e9d1ba465f49"
              style={{
                display: 'block',
                margin: '0 auto',
                width: '100%'
              }}>
            </vturb-smartplayer>
          </div>
        </div>
        
        {/* Texto e botão aparecem imediatamente - SEM DELAY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>

          <p className="text-gray-700 text-sm mb-4 mx-auto max-w-sm leading-relaxed">⏳ Leva apenas 1 minuto
          </p>

          <button
            onClick={onContinue} 
            id="btn-startquiz-tt"
            className="w-full max-w-sm md:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold whitespace-nowrap inline-flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform active:scale-95 hover:scale-105 px-10 py-5 text-base md:px-16 md:py-6 md:text-lg animate-bounce-subtle cursor-pointer touch-manipulation"
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
              userSelect: 'none'
            }}
          >
            Descobrir minha alma divina AGORA
            <span className="ml-2">→</span>
          </button>
        </motion.div>
        
        {currentDate &&
        <p className="text-red-600 mt-4 text-xs animate-pulse">
            ⏳ Esta leitura estará disponível até <strong>{currentDate}</strong>, apenas nesta página!
          </p>
        }
      </motion.div>
    </div>);

}
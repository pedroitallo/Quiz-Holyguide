
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTracking } from '@/hooks/useTracking';
import { useVisualEditorContext } from '@/contexts/VisualEditorContext';
import EditableElement from '@/components/editor/EditableElement';

export default function VideoStep({ onContinue }) {
  const [currentDate, setCurrentDate] = useState('');
  const { trackStartQuiz, trackFacebookEvent } = useTracking();
  const { isEditorMode, selectedElement, setSelectedElement, getElementConfig } = useVisualEditorContext();

  useEffect(() => {
    const today = new Date();
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    setCurrentDate(today.toLocaleDateString('en-US', options));
  }, []);

  useEffect(() => {
    // CARREGAR O SCRIPT DO PLAYER APENAS QUANDO ESTE COMPONENTE ESTÁ MONTADO
    const scriptSrc = "https://scripts.converteai.net/8f5333fd-fe8a-42cd-9840-10519ad6c7c7/players/6887d876e08b97c1c6617aab/v4/player.js";

    // Verificar se o script já existe
    if (document.querySelector(`script[src="${scriptSrc}"]`)) {
      return;
    }

    console.log("Carregando script do VSL - VideoStep montado");
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // CLEANUP COMPLETO QUANDO ESTE COMPONENTE É DESMONTADO
      console.log("Removendo script do VSL - VideoStep desmontado");
      const scriptElements = document.querySelectorAll(`script[src="${scriptSrc}"]`);
      scriptElements.forEach((s) => {
        if (document.head.contains(s)) {
          document.head.removeChild(s);
        }
      });

      // Limpar o container do player
      const playerContainer = document.getElementById("vid-6887d876e08b97c1c6617aab");
      if (playerContainer) {
        playerContainer.innerHTML = "";
      }

      // Limpar variáveis globais do player se existirem
      if (window.smartplayer) {
        delete window.smartplayer;
      }
    };
  }, []); // Este useEffect roda apenas quando o VideoStep é montado/desmontado

  const handleContinue = () => {
    // Rastrear início do quiz
    trackStartQuiz();
    
    // Continuar com a lógica original
    onContinue();
  };

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>

        <EditableElement
          elementId="video-title"
          elementType="text"
          isEditorMode={isEditorMode}
          onSelect={setSelectedElement}
          isSelected={selectedElement?.elementId === 'video-title'}
          config={getElementConfig('video-title')}
          defaultContent={{ text: 'I will use my psychic abilities to reveal the face of your soulmate.' }}
          defaultStyles={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000', textAlign: 'center' }}
        >
          {(content, styles) => (
            <h1 style={styles} className="mb-2 leading-tight">
              {content.text}
            </h1>
          )}
        </EditableElement>
        
        <EditableElement
          elementId="video-subtitle"
          elementType="text"
          isEditorMode={isEditorMode}
          onSelect={setSelectedElement}
          isSelected={selectedElement?.elementId === 'video-subtitle'}
          config={getElementConfig('video-subtitle')}
          defaultContent={{ text: "Press play and see why over 10,000 people trust Aura, Hollywood's number #1 psychic" }}
          defaultStyles={{ fontSize: '1rem', color: '#4b5563', textAlign: 'center' }}
        >
          {(content, styles) => (
            <p style={styles} className="mb-6 max-w-2xl mx-auto leading-relaxed">
              {content.text}
            </p>
          )}
        </EditableElement>
        
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
        
        {/* Texto e botão aparecem imediatamente - SEM DELAY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>

          <p className="text-gray-700 text-sm mb-4 mx-auto max-w-sm leading-relaxed">⏳Takes just 1 minute
          </p>

          <EditableElement
            elementId="video-cta-button"
            elementType="button"
            isEditorMode={isEditorMode}
            onSelect={setSelectedElement}
            isSelected={selectedElement?.elementId === 'video-cta-button'}
            config={getElementConfig('video-cta-button')}
            defaultContent={{ text: 'Discover my soulmate' }}
            defaultStyles={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              padding: '1.25rem 2.5rem',
              borderRadius: '9999px'
            }}
          >
            {(content, styles) => (
              <button
                onClick={handleContinue}
                style={styles}
                className="w-full max-w-sm md:w-auto whitespace-nowrap inline-flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform active:scale-95 hover:scale-105 animate-bounce-subtle cursor-pointer touch-manipulation"
              >
                {content.text}
                <span className="ml-2">→</span>
              </button>
            )}
          </EditableElement>
        </motion.div>
        
        {currentDate &&
        <p className="text-red-600 mt-4 text-xs animate-pulse">
            ⏳ This reading will be available until <strong>{currentDate}</strong>, only on this page!
          </p>
        }
      </motion.div>
    </div>);

}

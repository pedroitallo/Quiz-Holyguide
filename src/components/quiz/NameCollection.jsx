import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import TypingIndicator from './TypingIndicator';
import { trackButtonClick } from '@/utils/buttonTracking'; // Importar a função de tracking

export default function NameCollection({ onNameSubmit }) {
  const [name, setName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [showTyping, setShowTyping] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [showTypingAfterName, setShowTypingAfterName] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  useEffect(() => {
    // Show typing for 1 second, then show message
    const timer1 = setTimeout(() => {
      setShowTyping(false);
      setShowMessage(true);
    }, 1000); // Changed from 3000 to 1000

    return () => {
      clearTimeout(timer1);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    trackButtonClick('Send Name', 'NameCollection'); // Tracking do botão 'Send'
    setNameSubmitted(true);
    setShowTypingAfterName(true);

    // After 1 second of typing, show final message
    // Reduzido para resposta mais rápida
    setTimeout(() => {
      setShowTypingAfterName(false);
      setShowFinalMessage(true);
    }, 500); // Reduzido de 1000 para 500ms
  };

  const handleFinalContinue = () => {
    trackButtonClick('Yes! Continue', 'NameCollection'); // Tracking do botão 'Yes! Continue'
    // Execução imediata sem delay
    onNameSubmit(name.trim() || "");
  };

  return (
    <div className="text-center py-8 min-h-[600px]">
      {/* CONTAINER FIXO PARA MENSAGEM PRINCIPAL - EVITA LAYOUT SHIFT */}
      <div className="min-h-[120px] mb-6">
        {/* TYPING - APARECE POR 3 SEGUNDOS */}
        <div className={`transition-opacity duration-300 ${showTyping ? 'opacity-100' : 'opacity-0'} ${showMessage ? 'hidden' : ''}`}>
          <TypingIndicator />
        </div>

        {/* MENSAGEM DA MADAME AURA - ESTÁTICA APÓS APARECER */}
        <div className={`transition-opacity duration-300 ${showMessage ? 'opacity-100' : 'opacity-0'} ${!showMessage ? 'hidden' : ''}`}>
          <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <img
                src="https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/adbb98955_Perfil.webp"
                alt="Madame Aura"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />
              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                  Before We Begin This Sacred Journey Of Love, <strong>What Is Your Name?</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CAMPO DE INPUT - VISÍVEL QUANDO MENSAGEM APARECER E ATÉ SER ENVIADO */}
      {showMessage && !nameSubmitted && (
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2 font-bold">
                Enter your name below to find your divine soul 👇
              </p>
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg py-4 px-6 rounded-full border-2 border-purple-300 focus:border-purple-500 text-center w-full max-w-md h-14 bg-white placeholder:text-gray-400 placeholder:text-sm"
                required
                autoFocus />
            </div>
            <Button
              type="submit"
              disabled={false}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 px-12 py-4 text-xl disabled:opacity-50 disabled:cursor-not-allowed">
              Send
            </Button>
          </form>
        </div>
      )}

      {/* MENSAGEM DO USUÁRIO - APARECE APÓS ENVIAR O NOME */}
      <AnimatePresence>
        {nameSubmitted && (
          <div className="flex justify-end mb-2">
            <div className="bg-purple-600 text-white p-3 rounded-xl max-w-xs mr-4">
              <p className="text-base">{name.trim() || "[No name provided]"}</p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* CONTAINER FIXO PARA ÁREA FINAL - EVITA LAYOUT SHIFT */}
      <div className="min-h-[120px] mt-6">
        {/* TYPING APÓS ENVIO DO NOME - APARECE POR 2 SEGUNDOS */}
        <div className={`transition-opacity duration-300 ${showTypingAfterName ? 'opacity-100' : 'opacity-0'} ${showFinalMessage ? 'hidden' : ''}`}>
          <TypingIndicator />
        </div>

        {/* MENSAGEM FINAL - APARECE APÓS O TYPING FINAL */}
        <div className={`transition-opacity duration-300 ${showFinalMessage ? 'opacity-100' : 'opacity-0'} ${!showFinalMessage ? 'hidden' : ''}`}>
          <div className="space-y-6">
            {/* TERCEIRA MENSAGEM DA MADAME AURA */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <img
                  src="https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/adbb98955_Perfil.webp"
                  alt="Madame Aura"
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />
                <div className="text-left">
                  <p className="text-base text-gray-700 leading-relaxed">It is a great pleasure to have you here, {name}. 

✨ I feel that a <strong>special connection is about to manifest in your life</strong> in the coming days!

Are you ready to <strong>discover who is the divine love that God has destined for you?</strong> 
                  </p>
                </div>
              </div>
            </div>
            
            {/* BOTÃO "Yes! Continue" */}
            <Button onClick={handleFinalContinue}
            className="bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 px-12 py-4 text-xl">
              Yes! Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
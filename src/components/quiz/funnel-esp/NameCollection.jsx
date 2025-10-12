
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import TypingIndicator from '../shared/TypingIndicator';

export default function NameCollection({ onNameSubmit }) {
  const [name, setName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [showTyping, setShowTyping] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [showTypingAfterName, setShowTypingAfterName] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowTyping(false);
      setShowMessage(true);
    }, 1000);

    return () => {
      clearTimeout(timer1);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setNameSubmitted(true);
    setShowTypingAfterName(true);

    setTimeout(() => {
      setShowTypingAfterName(false);
      setShowFinalMessage(true);
    }, 500);
  };

  const handleFinalContinue = () => {
    onNameSubmit(name.trim() || "");
  };

  return (
    <div className="text-center py-8 min-h-[600px]">
      <div className="min-h-[120px] mb-6">
        <div className={`transition-opacity duration-300 ${showTyping ? 'opacity-100' : 'opacity-0'} ${showMessage ? 'hidden' : ''}`}>
          <TypingIndicator />
        </div>

        <div className={`transition-opacity duration-300 ${showMessage ? 'opacity-100' : 'opacity-0'} ${!showMessage ? 'hidden' : ''}`}>
          <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <img
                src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
                alt="Master Aura"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />
              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                  Antes De Comenzar Este Sagrado Viaje Del Amor, <strong>¿Cuál Es Tu Nombre?</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showMessage && !nameSubmitted && (
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2 font-bold">
                Ingresa tu nombre abajo para encontrar tu alma gemela 👇
              </p>
              <Input
                type="text"
                placeholder="Ingresa tu nombre"
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
              Enviar
            </Button>
          </form>
        </div>
      )}

      <AnimatePresence>
        {nameSubmitted && (
          <div className="flex justify-end mb-2">
            <div className="bg-purple-600 text-white p-3 rounded-xl max-w-xs mr-4">
              <p className="text-base">{name.trim() || "[Nombre no proporcionado]"}</p>
            </div>
          </div>
        )}
      </AnimatePresence>

      <div className="min-h-[120px] mt-6">
        <div className={`transition-opacity duration-300 ${showTypingAfterName ? 'opacity-100' : 'opacity-0'} ${showFinalMessage ? 'hidden' : ''}`}>
          <TypingIndicator />
        </div>

        <div className={`transition-opacity duration-300 ${showFinalMessage ? 'opacity-100' : 'opacity-0'} ${!showFinalMessage ? 'hidden' : ''}`}>
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <img
                  src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
                  alt="Master Aura"
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />
                <div className="text-left">
                  <p className="text-base text-gray-700 leading-relaxed">Es un gran placer tenerte aquí, {name}.

✨ ¡Siento que una <strong>conexión especial está a punto de manifestarse en tu vida</strong> en los próximos días!

¿Estás lista/o para <strong>descubrir quién es el amor divino que Dios ha destinado para ti?</strong>
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleFinalContinue}
            className="bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 px-12 py-4 text-xl">
              ¡Sí! Continuar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

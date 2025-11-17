import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TypingIndicator from "./TypingIndicator";
import { useTracking } from "@/hooks/useTracking";

export default function LoadingRevelation({
  onContinue,
  userName,
  birthDate
}) {
  const { trackEndQuiz } = useTracking();

  const [showFirstTyping, setShowFirstTyping] = useState(true);
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  const handleContinue = () => {
    trackEndQuiz();
    onContinue();
  };

  useEffect(() => {
    const t1 = setTimeout(() => {
      setShowFirstTyping(false);
      setShowFirstMessage(true);
    }, 1000);

    const t2 = setTimeout(() => {
      setShowImage(true);
    }, 1500);

    const t3 = setTimeout(() => {
      setShowNextButton(true);
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="py-8 w-full max-w-lg mx-auto flex flex-col items-center gap-4">
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Typing 1 */}
      <AnimatePresence>
        {showFirstTyping && <TypingIndicator />}
      </AnimatePresence>

      {/* Primeiro texto */}
      <AnimatePresence>
        {showFirstMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 w-full"
          >
            <div className="flex items-start gap-3">
              <img
                src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
                alt="Master Aura"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
              />
              <div className="text-left">
                <p className="text-base text-gray-700 leading-relaxed">
                  Based on your birth chart, I am preparing a portrait of your
                  soulmate. I'm starting right now👇🔮
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Imagem */}
      <AnimatePresence>
        {showImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-2 shadow-sm border border-gray-200 w-full"
          >
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/tXMSzr3464284.png?quality=83#875227"
              alt="Preparing your revelation"
              className="w-full rounded-lg"
              style={{
                loading: "lazy",
                decoding: "async",
                imageRendering: "crisp-edges",
                backfaceVisibility: "hidden",
                transform: "translateZ(0)"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão próximo da imagem e maior */}
      {showNextButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-2 w-full flex justify-center"
        >
          <button
            onClick={handleContinue}
            className="btn-primary w-full max-w-sm md:w-auto text-lg md:text-xl font-bold py-4 px-10 rounded-full"
          >
            Discover the face of my soulmate
          </button>
        </motion.div>
      )}
    </div>
  );
}

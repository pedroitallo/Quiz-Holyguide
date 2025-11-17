import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TypingIndicator from "./TypingIndicator";
import { useTracking } from "@/hooks/useTracking";

export default function LoadingRevelation({
  onContinue,
  userName,
  birthDate,
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const TextOverlay = () => (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div
        className="absolute"
        style={{
          top: "22%",
          right: "13%",
          width: "18%",
          height: "18%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontFamily: "Dancing Script, cursive",
            fontWeight: "600",
            fontSize: "clamp(7px, 2.2vw, 11px)",
            lineHeight: "1.3",
            textAlign: "center",
            color: "#4a4a4a",
            textShadow: "0.5px 0.5px 1px rgba(0,0,0,0.1)",
            filter: "sepia(10%) contrast(1.1)",
            transform: "rotate(-1deg)",
          }}
        >
          <div style={{ marginBottom: "2px" }}>{userName || ""}</div>
          <div>{formatDate(birthDate) || "..."}</div>
        </div>
      </div>
    </div>
  );

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

      {/* Mensagem 1 */}
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
            className="bg-white rounded-lg p-2 shadow-sm border border-gray-200 mb-4 relative w-full"
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
                transform: "translateZ(0)",
              }}
            />
            <TextOverlay />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão */}
      {showNextButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4"
        >
          <button
            onClick={handleContinue}
            className="btn-primary w-full max-w-sm md:w-auto"
          >
            Discover the face of my soulmate
          </button>
        </motion.div>
      )}
    </div>
  );
}

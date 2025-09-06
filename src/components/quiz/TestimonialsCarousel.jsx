
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import TypingIndicator from './TypingIndicator';

const testimonials = [
{
  imageUrl: "https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/14ed61e13_DEP1.webp"
},
{
  imageUrl: "https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/e858f01a6_DEP2.webp"
},
{
  imageUrl: "https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/80e6a766a_DEP3.webp"
}];

// Preload all testimonial images immediately when component loads
const preloadImages = () => {
  testimonials.forEach((testimonial) => {
    const img = new Image();
    img.src = testimonial.imageUrl;
  });
};
const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

export default function TestimonialsCarousel({ onContinue }) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [showFirstTyping, setShowFirstTyping] = useState(true);
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showSecondTyping, setShowSecondTyping] = useState(false);
  const [showSecondMessage, setShowSecondMessage] = useState(false);
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [showThirdTyping, setShowThirdTyping] = useState(false);
  const [showThirdMessage, setShowThirdMessage] = useState(false);
  const [showFourthTyping, setShowFourthTyping] = useState(false);
  const [showFourthMessage, setShowFourthMessage] = useState(false);
  const [showFifthTyping, setShowFifthTyping] = useState(false);
  const [showFifthMessage, setShowFifthMessage] = useState(false);
  const [showFirstButton, setShowFirstButton] = useState(false);
  const [firstButtonClicked, setFirstButtonClicked] = useState(false);
  const [showSixthTyping, setShowSixthTyping] = useState(false);
  const [showSixthMessage, setShowSixthMessage] = useState(false);
  const [showSeventhTyping, setShowSeventhTyping] = useState(false);
  const [showSeventhMessage, setShowSeventhMessage] = useState(false);
  const [showFinalButton, setShowFinalButton] = useState(false);

  // Preload images on component mount
  useEffect(() => {
    preloadImages();
  }, []);

  useEffect(() => {
    const timers = [];

    // First typing (1.5s) then first message
    timers.push(setTimeout(() => {
      setShowFirstTyping(false);
      setShowFirstMessage(true);
    }, 1500));

    // Second typing (1s after first message) then second message (Aura introduction)
    timers.push(setTimeout(() => {
      setShowSecondTyping(true);
    }, 2000));

    timers.push(setTimeout(() => {
      setShowSecondTyping(false);
      setShowSecondMessage(true);
    }, 3000));

    // Third typing (1s after second message) then third message (This Year Alone)
    timers.push(setTimeout(() => {
      setShowThirdTyping(true);
    }, 3500));

    timers.push(setTimeout(() => {
      setShowThirdTyping(false);
      setShowThirdMessage(true);
    }, 4500));

    // Show testimonials after third message
    timers.push(setTimeout(() => {
      setShowTestimonials(true);
    }, 5000));

    // Fourth typing (1.5s after testimonials appear)
    timers.push(setTimeout(() => {
      setShowFourthTyping(true);
    }, 6500));

    // Fourth message (1.5s after fourth typing starts)
    timers.push(setTimeout(() => {
      setShowFourthTyping(false);
      setShowFourthMessage(true);
    }, 8000));

    // Fifth typing (1s after fourth message)
    timers.push(setTimeout(() => {
      setShowFifthTyping(true);
    }, 8500));

    // Fifth message (1s after fifth typing starts)
    timers.push(setTimeout(() => {
      setShowFifthTyping(false);
      setShowFifthMessage(true);
      setShowFirstButton(true);
    }, 9500));

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleFirstButtonClick = () => {
    setFirstButtonClicked(true);
    setShowFirstButton(false);
    
    // Show sixth typing after button click
    setTimeout(() => {
      setShowSixthTyping(true);
    }, 500);
    
    // Show sixth message after typing
    setTimeout(() => {
      setShowSixthTyping(false);
      setShowSixthMessage(true);
    }, 1500);
    
    // Show seventh typing after sixth message
    setTimeout(() => {
      setShowSeventhTyping(true);
    }, 2000);
    
    // Show seventh message and final button after typing
    setTimeout(() => {
      setShowSeventhTyping(false);
      setShowSeventhMessage(true);
      setShowFinalButton(true);
    }, 3000);
  };
  const paginate = (newDirection) => {
    setPage([(page + newDirection + testimonials.length) % testimonials.length, newDirection]);
  };

  useEffect(() => {
    if (!showTestimonials) return;
    const timer = setInterval(() => paginate(1), 6000);
    return () => clearInterval(timer);
  }, [page, showTestimonials]);

  const testimonialIndex = page;

  return (
    <div className="text-center py-8">
      {/* Astral Reading Card */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-purple-100 to-purple-50 border border-purple-200 rounded-full px-4 py-2 inline-block shadow-sm">
          <p className="text-purple-700 text-sm font-medium">
            ✨ Your astral reading is starting...
          </p>
        </div>
      </div>

      {/* Preload all images invisibly */}
      <div className="hidden">
        {testimonials.map((testimonial, index) => (
          <img
            key={`preload-${index}`}
            src={testimonial.imageUrl}
            alt=""
            loading="eager"
            decoding="async"
          />
        ))}
      </div>

      {/* Container fixo para mensagens - evita layout shift */}
      <div className="min-h-[200px] mb-8">
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
              className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto mb-4"
            >
              <div className="flex items-start gap-3">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
                  alt="Madame Aura"
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                  loading="eager"
                  decoding="async"
                />
                <div className="text-left">
                  <p className="text-base text-gray-700 leading-relaxed">
                   Hello, my dear! I’m so happy and grateful that you chose to follow your heart and find me here today. 🙏
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Second typing indicator */}
        <AnimatePresence>
          {showSecondTyping && <TypingIndicator />}
        </AnimatePresence>

        {/* Second message */}
        <AnimatePresence>
          {showSecondMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto mb-4"
            >
              <div className="flex items-start gap-3">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
                  alt="Madame Aura"
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                  loading="eager"
                  decoding="async"
                />
                <div className="text-left">
                  <p className="text-base text-gray-700 leading-relaxed">
                    My name is Aura, and I became famous in 2024 as Hollywood's #1 medium, bringing soulmates together through my drawings.
                    <br /><br />
                    In just 2 minutes, I will visualize and sketch the face of your soulmate…
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Third typing indicator */}
        <AnimatePresence>
          {showThirdTyping && <TypingIndicator />}
        </AnimatePresence>

        {/* Third message - This Year Alone */}
        <AnimatePresence>
          {showThirdMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto"
            >
              <div className="flex items-start gap-3">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
                  alt="Madame Aura"
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                  loading="eager"
                  decoding="async"
                />
                <div className="text-left">
                  <p className="text-base text-gray-700 leading-relaxed">
                    This Year Alone, <strong>I Have Connected With More Than 9,200 Divine Souls</strong> Through My Drawings And Revelations👇🏼
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Testimonials carousel - só aparece após segunda mensagem */}
      {showTestimonials && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative h-[320px] mb-4 flex items-center justify-center">
            {/* Render all images but only show the current one - this keeps them in DOM and cached */}
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute w-full flex flex-col items-center transition-opacity duration-300 ${
                  index === testimonialIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <div className="mb-3">
                  <img
                    src={testimonial.imageUrl}
                    alt="Testimonial couple"
                    className="w-64 h-80 object-cover rounded-xl shadow-lg"
                    loading="eager"
                    decoding="async"
                    style={{
                      imageRendering: 'crisp-edges',
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(0)'
                    }}
                  />
                </div>
              </div>
            ))}

            {/* Navigation buttons */}
            <button
              onClick={() => paginate(-1)}
              className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            
            <button
              onClick={() => paginate(1)}
              className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center space-x-2 mb-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setPage([index, index > testimonialIndex ? 1 : -1])}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === testimonialIndex ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

        </motion.div>
      )}

      {/* Container fixo para mensagens após depoimentos */}
      <div className="min-h-[200px] mt-8">
        {/* Fourth typing indicator */}
        <AnimatePresence>
          {showFourthTyping && <TypingIndicator />}
        </AnimatePresence>

        {/* Fourth message */}
        <AnimatePresence>
          {showFourthMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto mb-4"
            >
              <div className="flex items-start gap-3">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
                  alt="Madame Aura"
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                  loading="eager"
                  decoding="async"
                />
                <div className="text-left">
                  <p className="text-base text-gray-700 leading-relaxed">
                    First, I ask that you <strong>don't cross your arms or legs</strong> so I can visualize your soulmate faster🔮
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fifth typing indicator */}
        <AnimatePresence>
          {showFifthTyping && <TypingIndicator />}
        </AnimatePresence>

        {/* Fifth message - Drawing permission */}
        <AnimatePresence>
          {showFifthMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto mb-4"
            >
              <div className="flex items-start gap-3">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
                  alt="Madame Aura"
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                  loading="eager"
                  decoding="async"
                />
                <div className="text-left">
                  <p className="text-base text-gray-700 leading-relaxed">
                    May I begin your drawing? Now, I must warn you: this may bring you to tears or awaken deep emotions, but I believe you'll want to see it… 💞✨
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* First button - Drawing permission */}
        <AnimatePresence>
          {showFirstButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-6 text-center"
            >
              <button
                onClick={handleFirstButtonClick}
                className="btn-primary w-full max-w-sm md:w-auto animate-pulse-gentle"
              >
                Yes, I want to discover my soulmate!
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User's response message */}
        <AnimatePresence>
          {firstButtonClicked && (
            <div className="flex justify-end mb-4">
              <div className="bg-purple-600 text-white p-3 rounded-xl max-w-xs mr-4">
                <p className="text-sm">Yes, I want to discover my soulmate!</p>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Sixth typing indicator */}
        <AnimatePresence>
          {showSixthTyping && <TypingIndicator />}
        </AnimatePresence>

        {/* Sixth message - Arms/legs instruction */}
        <AnimatePresence>
          {showSixthMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto mb-4"
            >
              <div className="flex items-start gap-3">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
                  alt="Madame Aura"
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                  loading="eager"
                  decoding="async"
                />
                <div className="text-left">
                  <p className="text-base text-gray-700 leading-relaxed">
                    First, I ask that you <strong>don't cross your arms or legs</strong> so I can visualize your soulmate faster🔮
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Seventh typing indicator */}
        <AnimatePresence>
          {showSeventhTyping && <TypingIndicator />}
        </AnimatePresence>

        {/* Seventh message - Are you ready */}
        <AnimatePresence>
          {showSeventhMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto mb-4"
            >
              <div className="flex items-start gap-3">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
                  alt="Madame Aura"
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                  loading="eager"
                  decoding="async"
                />
                <div className="text-left">
                  <p className="text-base text-gray-700 leading-relaxed">
                    Are you ready to see <strong>your soulmate's face</strong>?💕
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final button appears after seventh message */}
        <AnimatePresence>
          {showFinalButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-6 text-center"
            >
              <button
                onClick={onContinue}
                id="btn-step3" 
                className="btn-primary w-full max-w-sm md:w-auto animate-pulse-gentle"
              >
                Yes, I am ready!
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>);

}
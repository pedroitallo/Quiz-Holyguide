import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import TypingIndicator from './TypingIndicator';

export default function WelcomeMessage({ userName, onContinue }) {
  const [isTyping, setIsTyping] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Add CartPanda script to head
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://assets.mycartpanda.com/cartx-ecomm-ui-assets/js/cpsales.js';
    document.head.appendChild(script);

    // Cleanup function to remove script when component unmounts
    return () => {
      const existingScript = document.querySelector('script[src="https://assets.mycartpanda.com/cartx-ecomm-ui-assets/js/cpsales.js"]');
      if (existingScript && document.head.contains(existingScript)) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false);
      setShowContent(true);
    }, 3000); // 3 seconds typing
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center py-8 min-h-[400px]">
        <div className="h-24">
            <AnimatePresence>
                {isTyping && <TypingIndicator />}
            </AnimatePresence>
        </div>
      
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 mb-6 max-w-md mx-auto">
                <div className="flex items-start gap-3">
                    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c8fa6c6f1_image.png" alt="Madame Aura" className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" loading="lazy" decoding="async" />
                    <div className="text-left text-base text-gray-700 leading-relaxed">
                        <p className="mb-4">It is a great pleasure to have you here, <span className="font-bold">{userName}</span>.</p>
                        <p className="mb-4">✨ I feel that a special connection is about to manifest in your life in the coming days!</p>
                        <p>Are you ready to discover who is the divine love that God has destined for you?</p>
                    </div>
                </div>
            </div>

            <Button
              onClick={onContinue}
              className="w-full max-w-sm md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-5 text-xl md:px-16 md:py-6 md:text-2xl"
            >
              Yes! I am ready
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
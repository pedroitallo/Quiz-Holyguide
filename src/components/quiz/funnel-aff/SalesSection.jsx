
/*
 * SalesSection Component - Funnel Aff
 *
 * This component handles the sales page for the Divine Love Reading product in funnel-aff.
 * Key features:
 * - Displays pricing, testimonials, and product benefits
 * - Handles checkout redirection to https://checkout.auralyapp.com/checkout/auralyapp-tiktok
 * - Consolidates UTM parameters and tracking params
 * - Always passes sc_ref (quiz result ID) and sc_vis (funnel identifier)
 * - Cleans up quiz state before checkout redirect
 *
 * Checkout URL format: baseUrl?sc_ref=QUIZ_RESULT_ID&sc_vis=funnel-aff + UTM params
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Clock, Shield, UserCheck, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTracking } from '@/hooks/useTracking';

const CHECKOUT_CONFIG = {
  baseUrl: "https://checkout.auralyapp.com/checkout/auralyapp-tiktok"
};

const TextOverlay = ({ name, date }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "02/03";
    const [year, month, day] = dateString.split('-');
    if (day && month) {
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}`;
    }
    return dateString;
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div
        className="absolute"
        style={{
          top: '35%',
          right: '13%',
          width: '18%',
          height: '18%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
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
          }}
        >
          <div style={{ marginBottom: '2px' }}>
            {name || ''}
          </div>
          <div>
            {formatDate(date)}
          </div>
        </div>
      </div>
    </div>
  );
};


const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-red-600 font-bold text-2xl">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
};

const PulsatingButton = ({ children, onClick, className = "" }) => (
  <Button
    onClick={onClick}
    className={`checkout-button w-full max-w-2xl mx-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 px-12 rounded-full text-lg shadow-2xl transform transition-all duration-300 hover:scale-105 leading-tight ${className}`}
    style={{ minHeight: '70px' }}
  >
    <span className="block text-center leading-tight">{children}</span>
  </Button>
);


export default function SalesSection({ userName, birthDate, quizResultId, src, onCheckout }) {
  const { trackEndQuiz, trackFacebookEvent } = useTracking();

  const handleCheckout = async () => {
    try {
      if (quizResultId && quizResultId !== 'offline-mode' && quizResultId !== 'admin-mode' && quizResultId !== 'bot-mode') {
        try {
          Promise.resolve().then(async () => {
            try {
              const { HybridQuizResult } = await import('@/entities/HybridQuizResult');
              await HybridQuizResult.update(quizResultId, { pitch_step_viewed: true });
              console.log('Pitch view tracked successfully');
            } catch (error) {
              console.warn("Failed to track pitch view:", error);
            }
          });
        } catch (error) {
          console.warn("Failed to import HybridQuizResult:", error);
        }
      }

      const url = new URL(CHECKOUT_CONFIG.baseUrl);

      let allUtms = {};

      if (typeof window !== 'undefined' && window.utmify) {
        try {
          allUtms = window.utmify.getUtms() || {};
          console.log('UTMs from UTMIFY:', allUtms);
        } catch (error) {
          console.warn('Failed to get UTMs from UTMIFY:', error);
        }
      }

      if (Object.keys(allUtms).length === 0) {
        const currentUrlParams = new URLSearchParams(window.location.search);
        const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

        utmParams.forEach((param) => {
          const value = currentUrlParams.get(param);
          if (value) {
            allUtms[param] = value;
          }
        });

        const otherParams = ['fbclid', 'gclid', 'ttclid', 'src'];
        otherParams.forEach((param) => {
          const value = currentUrlParams.get(param);
          if (value) {
            allUtms[param] = value;
          }
        });
      }

      Object.keys(allUtms).forEach((key) => {
        if (allUtms[key]) {
          url.searchParams.set(key, allUtms[key]);
        }
      });

      if (src && !allUtms.src) {
        url.searchParams.set('src', src);
      }

      if (quizResultId && quizResultId !== 'offline-mode' && quizResultId !== 'admin-mode' && quizResultId !== 'bot-mode') {
        url.searchParams.set('sc_ref', quizResultId);
        url.searchParams.set('sc_vis', 'funnel-aff');
      }

      console.log('Redirecting to checkout:', url.toString());

      localStorage.removeItem('holymind_quiz_state');
      window.location.href = url.toString();
    } catch (error) {
      console.error("Error building checkout URL:", error);
      window.location.href = CHECKOUT_CONFIG.baseUrl;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center space-y-4 p-4"
    >
      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle { animation: bounce-subtle 1.5s infinite ease-in-out; }
      `}</style>

      <div className="space-y-3 -mt-4">
        <p className="text-gray-700 text-sm font-bold">Click Below To Secure Your Drawing👇🏻</p>
        <PulsatingButton onClick={handleCheckout}>
          YES! Claim My Soulmate's<br/>Drawing
        </PulsatingButton>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-yellow-500 text-xl">⚠️</span>
            <span className="text-red-600 font-bold text-lg">HIGH DEMAND:</span>
          </div>

          <div className="space-y-2">
            <div className="text-gray-800 text-base">
              The LAST <span className="text-2xl font-bold">5</span> spots may fill up in
            </div>

            <CountdownTimer />
          </div>
        </div>
      </div>
    </motion.div>
  );
}


/*
 * SalesSection Component
 *
 * This component handles the sales page for the Divine Love Reading product.
 * Key features:
 * - Displays pricing, testimonials, and product benefits
 * - Handles checkout redirection to Hotmart
 * - Consolidates UTM parameters in 'src' query param (separated by |)
 * - Always passes Metrito Lead ID via 'xcod' parameter (from localStorage or URL 'mlid')
 * - Cleans up quiz state before checkout redirect
 *
 * Checkout URL format: baseUrl + &xcod=LEAD_ID + &src=utm1|utm2|utm3 + other tracking params
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Clock, Shield, UserCheck, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Checkout configuration
const CHECKOUT_CONFIG = {
  baseUrl: "https://payments.holymind.life/checkout/map-of-the-divine-soul"
  // Add more checkout URLs here if needed for different products
  // premiumUrl: "https://pay.hotmart.com/PREMIUM123",
  // basicUrl: "https://pay.hotmart.com/BASIC456",
};

const TextOverlay = ({ name, date }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "2004-03-02";
    const [year, month, day] = dateString.split('-');
    if (day && month && year) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
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
            {name || 'pe'}
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
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

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
  const handleCheckout = async () => {
    try {
      // Track pitch view IMMEDIATELY when checkout is initiated
      if (quizResultId && quizResultId !== 'offline-mode' && quizResultId !== 'admin-mode' && quizResultId !== 'bot-mode') {
        try {
          // Use Promise.resolve to avoid blocking redirect
          Promise.resolve().then(async () => {
            try {
              const { QuizResult } = await import('@/entities/QuizResult');
              await QuizResult.update(quizResultId, { pitch_step_viewed: true });
              console.log('Pitch view tracked successfully');
            } catch (error) {
              console.warn("Failed to track pitch view:", error);
            }
          });
        } catch (error) {
          console.warn("Failed to import QuizResult:", error);
        }
      }

      const url = new URL(CHECKOUT_CONFIG.baseUrl);

      // Get Metrito Lead ID from localStorage or URL parameter
      let metritoLeadId = localStorage.getItem('metrito_lead_id');
      if (!metritoLeadId) {
        const urlParams = new URLSearchParams(window.location.search);
        metritoLeadId = urlParams.get('mlid');
        if (metritoLeadId) {
          localStorage.setItem('metrito_lead_id', metritoLeadId);
        }
      }

      // Always pass the Metrito Lead ID if available
      if (metritoLeadId) {
        url.searchParams.set('xcod', metritoLeadId);
      }

      // Track InitiateCheckout event with Metrito
      if (typeof window !== 'undefined' && window.metrito && typeof window.metrito.track === 'function') {
        try {
         window.metrito.track('InitiateCheckout', {
            lead: {
              id: metritoLeadId
            },
            event: {
              facebook:{
                data: {
                  currency: 'USD',
                  value: 19.00
                }
              }
            }
          });
        } catch (error) {
          console.warn("Failed to track InitiateCheckout with Metrito:", error);
        }
      }

      // Collect all UTM parameters and consolidate them in src
      const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
      const currentUrlParams = new URLSearchParams(window.location.search);
      const utmValues = [];

      utmParams.forEach((param) => {
        const value = currentUrlParams.get(param);
        if (value) {
          utmValues.push(`${param}=${value}`);
        }
      });

      // Add src parameter if it exists
      if (src) {
        utmValues.push(`src=${src}`);
      }

      // Consolidate all UTM parameters into the src parameter
      if (utmValues.length > 0) {
        url.searchParams.set('src', utmValues.join('|'));
      }

      // Add quiz_result_id for webhook connection
      if (quizResultId && quizResultId !== 'offline-mode' && quizResultId !== 'admin-mode' && quizResultId !== 'bot-mode') {
        url.searchParams.set('quiz_result_id', quizResultId);
      }

      // Add other tracking parameters
      const otherParams = ['fbclid', 'gclid', 'ttclid'];
      otherParams.forEach((param) => {
        const value = currentUrlParams.get(param);
        if (value) {
          url.searchParams.set(param, value);
        }
      });

      console.log('Redirecting to checkout:', url.toString());

      // Clean state and redirect
      localStorage.removeItem('holymind_quiz_state');
      window.location.href = url.toString();
    } catch (error) {
      console.error("Error building checkout URL:", error);
      // Fallback redirect
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

      {/* Main CTA Section - Moved closer to VSL */}
      <div className="space-y-3 -mt-4">
        <p className="text-gray-700 text-sm font-bold">Click Below To Secure Your Drawing👇🏻</p>
        <PulsatingButton onClick={handleCheckout}>
          YES! Claim My Divine<br/>Soul Drawing
        </PulsatingButton>
      </div>

      {/* High Demand Warning with Countdown - Single line format */}
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

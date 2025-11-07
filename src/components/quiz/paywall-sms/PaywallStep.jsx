import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag, Sparkles, Clock } from 'lucide-react';
import { HybridQuizResult } from '@/entities/HybridQuizResult';

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click"
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

const PulsatingButton = ({ children, onClick }) => (
  <Button
    onClick={onClick}
    className="w-full max-w-2xl mx-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 px-12 rounded-full text-lg shadow-2xl transform transition-all duration-300 hover:scale-105 leading-tight"
    style={{ minHeight: '70px' }}
  >
    <span className="block text-center leading-tight">{children}</span>
  </Button>
);

export default function PaywallStepSMS({ userName, birthDate, quizResultId, src }) {

  useEffect(() => {
    window.scrollTo(0, 0);

    if (quizResultId && quizResultId !== 'offline-mode' && quizResultId !== 'admin-mode' && quizResultId !== 'bot-mode') {
      HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(e =>
        console.warn("Failed to update pitch step view:", e)
      );
    }
  }, [quizResultId]);

  const handleCheckout = async () => {
    const trackCheckout = async () => {
      if (quizResultId && quizResultId !== 'offline-mode' && quizResultId !== 'admin-mode' && quizResultId !== 'bot-mode') {
        try {
          await HybridQuizResult.update(quizResultId, { checkout_step_clicked: true });
          console.log('Checkout click tracked successfully');
        } catch (error) {
          console.warn("Falha ao rastrear clique de checkout:", error);
        }
      }
    };

    trackCheckout().then(() => {
      try {
        const checkoutUrl = CHECKOUT_CONFIG.baseUrl;
        const url = new URL(checkoutUrl);

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
          const currentUrl = new URL(window.location.href);
          const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

          utmParams.forEach(param => {
            const value = currentUrl.searchParams.get(param);
            if (value) {
              allUtms[param] = value;
            }
          });

          const otherParams = ['fbclid', 'gclid', 'ttclid', 'src', 'xcod'];
          otherParams.forEach(param => {
            const value = currentUrl.searchParams.get(param);
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

        if (quizResultId && quizResultId !== 'offline-mode' && quizResultId !== 'admin-mode' && quizResultId !== 'bot-mode') {
          url.searchParams.set('quiz_result_id', quizResultId);
        }

        console.log('Redirecting to checkout:', url.toString());
        localStorage.removeItem('holymind_quiz_state');
        localStorage.setItem('holymind_last_quiz_id', quizResultId);
        window.location.href = url.toString();
      } catch (error) {
        console.error("Erro ao construir URL de checkout:", error);
        window.location.href = CHECKOUT_CONFIG.baseUrl;
      }
    }).catch((error) => {
      console.error("Erro ao rastrear checkout, mas redirecionando mesmo assim:", error);
      window.location.href = CHECKOUT_CONFIG.baseUrl;
    });
  };

  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8">

        <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 px-4">
          Your Birth Chart Reading Is Ready!
        </h2>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6"
        >
          <Card className="w-fit mx-auto bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-3">
                <div className="bg-green-500 p-2.5 rounded-full">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-xs text-green-700 font-semibold uppercase tracking-wide">
                    Special SMS Discount
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    50% OFF
                  </p>
                </div>
                <div className="bg-green-500 p-2.5 rounded-full">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <h1 className="text-purple-600 mb-6 text-xl font-semibold md:text-2xl leading-tight px-4">
          HERE'S YOUR SOULMATE'S DRAWING
        </h1>

        <div className="mb-6">
          <img
            src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759873292152-ltl34v44ham.png"
            alt="Your True Love Preview"
            className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
          />
        </div>

        <h3 className="text-lg md:text-xl font-semibold text-purple-600 mb-4 px-4 uppercase tracking-wide">
          See Who Your True Love Is👇🏼
        </h3>

        <Card className="max-w-md mx-auto bg-white/80 border-purple-100 shadow-md mb-6">
          <CardContent className="p-6 text-center space-y-3">
            <p className="text-sm md:text-base text-gray-700 flex items-center justify-center gap-2">
              <span className="text-green-600">✔</span>
              Access the Full Astral Reading
            </p>
            <p className="text-sm md:text-base text-gray-700 flex items-center justify-center gap-2">
              <span className="text-green-600">✔</span>
              Your Soulmate's Name
            </p>
            <p className="text-sm md:text-base text-gray-700 flex items-center justify-center gap-2">
              <span className="text-green-600">✔</span>
              Key Dates & Moments
            </p>
            <p className="text-sm md:text-base text-gray-700 flex items-center justify-center gap-2">
              <span className="text-green-600">✔</span>
              Detailed Love Compatibility
            </p>
            <p className="text-sm md:text-base text-gray-600 mt-4 leading-relaxed">
              Your soulmate's drawing is already done and will be sent directly to your email as soon as you confirm your access on the button below.
            </p>
            <div className="mt-4 space-y-1">
              <p className="text-sm md:text-base text-gray-600">
                from <span className="line-through text-red-600 font-semibold">$19</span>
              </p>
              <p className="text-lg md:text-xl text-green-600 font-bold">
                for only $9
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center space-y-4 p-4"
      >
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
    </div>
  );
}

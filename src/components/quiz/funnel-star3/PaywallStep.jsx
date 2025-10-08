import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar } from 'lucide-react';
import { HybridQuizResult } from '@/entities/HybridQuizResult';
import SalesSection from '../funnel-1/SalesSection';

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click"
};

export default function PaywallStep({ userName, birthDate, quizResultId, src }) {
  const [showSales, setShowSales] = useState(true);

  useEffect(() => {
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

  const formatDate = (dateString) => {
    if (!dateString) return "Não informado";
    const [year, month, day] = dateString.split('-');
    if (day && month) {
        return `${day}/${month}`;
    }
    return dateString;
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

        <Card className="w-fit mx-auto bg-white/50 border-purple-100 shadow-md mb-6">
            <CardContent className="p-3 flex items-center justify-center gap-4 md:gap-6">
                <div className="flex items-center gap-2">
                    <div className="bg-purple-100 p-2 rounded-full">
                        <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="text-sm font-semibold text-gray-800">{userName || ''}</p>
                    </div>
                </div>
                <div className="h-8 w-px bg-purple-200"></div>
                <div className="flex items-center gap-2">
                    <div className="bg-purple-100 p-2 rounded-full">
                        <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-gray-500">Date of Birth</p>
                        <p className="text-sm font-semibold text-gray-800">{formatDate(birthDate)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>

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
          See Who Your True Love Is
        </h3>
        <Card className="max-w-md mx-auto bg-white/80 border-purple-100 shadow-md mb-6">
          <CardContent className="p-6 text-center space-y-3">
            <p className="text-sm md:text-base text-gray-700 flex items-center justify-center gap-2">
              <span className="text-green-600">✔</span>
              <span><strong>Name:</strong> ******</span>
            </p>
            <p className="text-sm md:text-base text-gray-700 flex items-center justify-center gap-2">
              <span className="text-green-600">✔</span>
              <span><strong>Date of meeting:</strong> **/**/2025</span>
            </p>
            <p className="text-sm md:text-base text-gray-700 flex items-center justify-center gap-2">
              <span className="text-green-600">✔</span>
              <span><strong>Your Soulmate's Vibe:</strong> Warm and caring</span>
            </p>
            <p className="text-sm md:text-base text-gray-700 flex items-center justify-center gap-2">
              <span className="text-green-600">✔</span>
              <span><strong>Special Trait:</strong> very self-confident</span>
            </p>
            <p className="text-sm md:text-base text-gray-600 mt-4 leading-relaxed">
              Your soulmate's drawing is already done and will be sent directly to your email as soon as you confirm your access on the button below.
            </p>
          </CardContent>
        </Card>

        <Card className="max-w-md mx-auto bg-purple-50/80 border-purple-200 shadow-md mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-3 mb-3">
                <img src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png" alt="Master Aura" className="w-12 h-12 rounded-full object-cover border-2 border-purple-200" />
                <p className="font-semibold text-gray-800 text-lg">Master Aura</p>
              </div>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed text-left">
                We don't actually charge for your personalized soulmate drawing — there's just a small, one-time symbolic fee of $19.
                This helps us cover the secure delivery system and the special materials used to create your unique astral reading and artwork.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6 px-4">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            Click Below To Secure Your Drawing 👇
          </h3>
          <button
            onClick={handleCheckout}
            className="w-full max-w-md mx-auto block bg-green-500 hover:bg-green-600 text-white font-bold text-lg md:text-xl py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            YES! Claim My Divine Soul Drawing
          </button>
        </div>

        {showSales && (
          <SalesSection
            userName={userName}
            birthDate={birthDate}
            quizResultId={quizResultId}
            src={src}
            onCheckout={handleCheckout}
          />
        )}
      </motion.div>
    </div>
  );
}

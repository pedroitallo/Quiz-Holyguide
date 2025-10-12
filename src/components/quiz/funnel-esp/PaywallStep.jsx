import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar, Heart, Sparkles, Shield, Clock } from 'lucide-react';
import { HybridQuizResult } from '@/entities/HybridQuizResult';
import { trackStepView } from '@/utils/stepTracking';
import SalesSection from '../funnel-1/SalesSection';

const CHECKOUT_CONFIG = {
  baseUrl: "https://tkk.holyguide.online/click"
};

export default function PaywallStep({ userName, birthDate, quizResultId, src, funnelType = 'funnel-esp' }) {
  const [showSales, setShowSales] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSales(true);

      if (quizResultId && quizResultId !== 'offline-mode' && quizResultId !== 'admin-mode' && quizResultId !== 'bot-mode') {
        HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(e =>
          console.warn("Failed to update pitch step view:", e)
        );
      }
    }, 275000);

    return () => clearTimeout(timer);
  }, [quizResultId]);

  const handleCheckout = async () => {
    const trackCheckout = async () => {
      await trackStepView(funnelType, 'checkout');

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
        }

        Object.entries(allUtms).forEach(([key, value]) => {
          if (value) {
            url.searchParams.set(key, value);
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
    if (!dateString) return "No informado";
    const [year, month, day] = dateString.split('-');
    if (day && month) {
        return `${day}/${month}`;
    }
    return dateString;
  };

  useEffect(() => {
    const scriptSrc = "https://scripts.converteai.net/8f5333fd-fe8a-42cd-9840-10519ad6c7c7/players/68a204ee95de0adfa0e77121/v4/player.js";
    const playerId = "vid-68a204ee95de0adfa0e77121";

    if (document.querySelector(`script[src="${scriptSrc}"]`)) {
      return;
    }

    console.log("Carregando script do VSL - PaywallStep montado");
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      console.log("Removendo script do VSL - PaywallStep desmontado");
      const scriptElements = document.querySelectorAll(`script[src="${scriptSrc}"]`);
      scriptElements.forEach((s) => {
        if (document.head.contains(s)) {
          document.head.removeChild(s);
        }
      });

      const playerContainer = document.getElementById(playerId);
      if (playerContainer) {
        playerContainer.innerHTML = "";
      }

      if (window.smartplayer) {
        delete window.smartplayer;
      }
    };
  }, []);

  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8">

        <h1 className="text-purple-600 mb-4 text-lg font-bold md:text-3xl leading-tight">¡Tu Revelación Está Lista! Descubre Quién Es Tu Alma Gemela</h1>

        <Card className="w-fit mx-auto bg-white/50 border-purple-100 shadow-md mb-6">
            <CardContent className="p-3 flex items-center justify-center gap-4 md:gap-6">
                <div className="flex items-center gap-2">
                    <div className="bg-purple-100 p-2 rounded-full">
                        <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-gray-500">Nombre</p>
                        <p className="text-sm font-semibold text-gray-800">{userName || ''}</p>
                    </div>
                </div>
                <div className="h-8 w-px bg-purple-200"></div>
                <div className="flex items-center gap-2">
                    <div className="bg-purple-100 p-2 rounded-full">
                        <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-gray-500">Fecha de Nacimiento</p>
                        <p className="text-sm font-semibold text-gray-800">{formatDate(birthDate)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="mb-2 shadow-lg rounded-xl overflow-hidden bg-gray-200 min-h-[300px] flex items-center justify-center">
          <vturb-smartplayer
            id="vid-68a204ee95de0adfa0e77121"
            style={{
              display: 'block',
              margin: '0 auto',
              width: '100%',
              maxWidth: '400px',
              minHeight: '250px'
            }}>
          </vturb-smartplayer>
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

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar } from 'lucide-react';
import { HybridQuizResult } from '@/entities/HybridQuizResult';
import SalesSection from '../funnel-1/SalesSection';

const CHECKOUT_CONFIG = {
  baseUrl: "https://payments.securitysacred.online/checkout/200854896:1"
};

export default function PaywallStep({ userName, birthDate, quizResultId, src }) {
  const [showSales, setShowSales] = useState(true);

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
        localStorage.removeItem('holymind_quiz_state_funnel_aff2');
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
          ¡Tu Lectura de Carta Astral Está Lista!
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
                        <p className="text-xs text-gray-500">Fecha de Nacimiento</p>
                        <p className="text-sm font-semibold text-gray-800">{formatDate(birthDate)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <h1 className="text-purple-600 mb-6 text-xl font-semibold md:text-2xl leading-tight px-4">
          AQUÍ ESTÁ EL DIBUJO DE TU ALMA GEMELA
        </h1>

        <div className="mb-6">
          <img
            src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759873292152-ltl34v44ham.png"
            alt="Your True Love Preview"
            className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
          />
        </div>
<h3 className="text-lg md:text-xl font-semibold text-purple-600 mb-4 px-4 uppercase tracking-wide">
          Mira Quién Es Tu Verdadero Amor👇🏼
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
              El dibujo de tu alma gemela ya está listo y será enviado directamente a tu correo electrónico tan pronto como confirmes tu acceso en el botón de abajo.
            </p>
            <div className="mt-4 space-y-1">
              <p className="text-sm md:text-base text-gray-600">
                from <span className="line-through text-red-600 font-semibold">$29</span>
              </p>
              <p className="text-lg md:text-xl text-green-600 font-bold">
                for only $14
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3 mb-6 px-4">
          <p className="text-gray-700 text-sm font-bold">Click Below To Secure Your Drawing👇🏻</p>
          <button
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 px-12 rounded-full text-lg shadow-2xl transform transition-all duration-300 hover:scale-105 leading-tight"
            style={{ minHeight: '70px' }}
          >
            <span className="block text-center leading-tight">¡SÍ! Reclama Mi Dibujo<br/>Divino del Alma</span>
          </button>
        </div>

        <Card className="max-w-md mx-auto bg-purple-50/80 border-purple-200 shadow-md mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-3 mb-3">
                <img src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png" alt="Master Aura" className="w-12 h-12 rounded-full object-cover border-2 border-purple-200" />
                <p className="font-semibold text-gray-800 text-lg">Master Aura</p>
              </div>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed text-left">
         Cuando te unas, recibirás acceso exclusivo a mi aplicación — <strong>la Aplicación Auraly</strong> 💫, donde podrás ver el <strong>dibujo de tu alma gemela</strong> 🎨💖
              </p>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed text-left mt-3">
Además, cada mes recibirás <strong>lecturas intuitivas y perspicaces</strong> 🔮, ofreciendo orientación poderosa sobre tu vida amorosa y mostrándote cómo <strong>conectarte energéticamente con tu alma gemela</strong> 💌💞
              </p>
            </div>
          </CardContent>
        </Card>

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

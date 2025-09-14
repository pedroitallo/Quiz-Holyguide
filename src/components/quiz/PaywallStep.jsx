
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar, Heart, Sparkles, Shield, Clock } from 'lucide-react';
import { HybridQuizResult } from '@/entities/HybridQuizResult';

export default function PaywallStep({ userName, birthDate, quizResultId, src }) {

  const handleCheckout = async () => {
    // Track checkout click IMMEDIATELY before any redirect
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

    // Execute tracking synchronously and then redirect
    trackCheckout().then(() => {
      try {
        // Corrected URL: removed extra '}'
        const checkoutUrl = "https://payments.securitysacred.online/checkout/184553763:1";
        const url = new URL(checkoutUrl);

        // Use UTMIFY to get all UTM parameters
        let allUtms = {};
        
        // Try to get UTMs from UTMIFY if available
        if (typeof window !== 'undefined' && window.utmify) {
          try {
            allUtms = window.utmify.getUtms() || {};
            console.log('UTMs from UTMIFY:', allUtms);
          } catch (error) {
            console.warn('Failed to get UTMs from UTMIFY:', error);
          }
        }
        
        // Fallback: get UTMs from URL if UTMIFY is not available
        if (Object.keys(allUtms).length === 0) {
          const currentUrl = new URL(window.location.href);
          const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
          
          utmParams.forEach(param => {
            const value = currentUrl.searchParams.get(param);
            if (value) {
              allUtms[param] = value;
            }
          });
          
          // Also get other tracking parameters
          const otherParams = ['fbclid', 'gclid', 'ttclid', 'src', 'xcod'];
          otherParams.forEach(param => {
            const value = currentUrl.searchParams.get(param);
            if (value) {
              allUtms[param] = value;
            }
          });
        }
        
        // Add all UTM parameters directly to the checkout URL
        Object.keys(allUtms).forEach((key) => {
          if (allUtms[key]) {
            url.searchParams.set(key, allUtms[key]);
          }
        });
        
        // Adicionar quiz_result_id como parâmetro para conectar com o webhook
        if (quizResultId && quizResultId !== 'offline-mode' && quizResultId !== 'admin-mode' && quizResultId !== 'bot-mode') {
          url.searchParams.set('quiz_result_id', quizResultId);
        }

        console.log('Redirecting to checkout:', url.toString());
        // Limpar estado do quiz em andamento antes de redirecionar
        localStorage.removeItem('holymind_quiz_state');
        localStorage.setItem('holymind_last_quiz_id', quizResultId);
        window.location.href = url.toString();
      } catch (error) {
        console.error("Erro ao construir URL de checkout:", error);
        // Fallback para garantir que o usuário seja redirecionado mesmo em caso de erro
        window.location.href = "https://payments.securitysacred.online/checkout/184553763:1";
      }
    }).catch((error) => {
      console.error("Erro ao rastrear checkout, mas redirecionando mesmo assim:", error);
      // Se o tracking falhar, ainda assim redireciona
      window.location.href = "https://payments.securitysacred.online/checkout/184553763:1";
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not informed";
    const [year, month, day] = dateString.split('-');
    if (day && month && year) {
        return `${day}/${month}`;
    }
    return dateString;
  };

  // Track pitch step view when component mounts
  useEffect(() => {
    if (quizResultId && quizResultId !== 'offline-mode' && quizResultId !== 'admin-mode' && quizResultId !== 'bot-mode') {
      HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(e => 
        console.warn("Failed to update pitch step view:", e)
      );
    }
  }, [quizResultId]);

  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8">

        <h1 className="text-purple-600 mb-4 text-lg font-bold md:text-3xl leading-tight">Your Revelation Is Ready! Discover Who Your Divine Soul Is</h1>
        
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

        <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-sm border border-purple-100 mb-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Your Divine Soul Drawing Is Ready!</h2>
            <p className="text-gray-600 text-lg">
              Based on your birth chart and spiritual energy, I have prepared a personalized drawing of your soulmate.
            </p>
            <div className="flex items-center justify-center gap-2 text-purple-600">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Complete revelation includes:</span>
            </div>
            <ul className="text-left max-w-md mx-auto space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Your soulmate's detailed drawing
              </li>
              <li className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                When and where you'll meet
              </li>
              <li className="flex items-center gap-2">
                <User className="w-4 h-4 text-green-500" />
                Their personality and characteristics
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleCheckout}
            className="w-full max-w-md bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 px-8 rounded-full text-xl shadow-2xl transform transition-all duration-300 hover:scale-105 animate-pulse"
          >
            🎨 Get My Divine Soul Drawing Now
          </button>
          <p className="text-sm text-gray-500 mt-4">
            ✨ Instant access to your complete spiritual revelation
          </p>
        </div>
      </motion.div>
    </div>
  );
}

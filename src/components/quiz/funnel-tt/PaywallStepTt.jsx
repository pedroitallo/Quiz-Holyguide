import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar, Heart, Sparkles, Shield, Clock } from 'lucide-react';
import { HybridQuizResult } from '@/entities/HybridQuizResult';
import SalesSection from '../SalesSection';

export default function PaywallStepTt({ userName, birthDate, quizResultId, src }) {
  const [showSales, setShowSales] = useState(false);

  // This useEffect handles timing for SalesSection and tracking pitch step view
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSales(true);
      
      // Track pitch step view when sales section appears
      if (quizResultId && quizResultId !== 'offline-mode' && quizResultId !== 'admin-mode' && quizResultId !== 'bot-mode') {
        HybridQuizResult.update(quizResultId, { pitch_step_viewed: true }).catch(e => 
          console.warn("Failed to update pitch step view:", e)
        );
      }
    }, 275000); // 4 minutes and 35 seconds = 275000ms

    return () => clearTimeout(timer);
  }, [quizResultId]);

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
        // URL específica para funnel-tt
        const checkoutUrl = "https://tkk.holyguide.online/click";
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
        localStorage.removeItem('holymind_quiz_state_funnel_tt');
        localStorage.setItem('holymind_last_quiz_id', quizResultId);
        window.location.href = url.toString();
      } catch (error) {
        console.error("Erro ao construir URL de checkout:", error);
        // Fallback para garantir que o usuário seja redirecionado mesmo em caso de erro
        window.location.href = "https://tkk.holyguide.online/click";
      }
    }).catch((error) => {
      console.error("Erro ao rastrear checkout, mas redirecionando mesmo assim:", error);
      // Se o tracking falhar, ainda assim redireciona
      window.location.href = "https://tkk.holyguide.online/click";
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Não informado";
    const [year, month, day] = dateString.split('-');
    if (day && month && year) {
        return `${day}/${month}/${year}`;
    }
    return dateString;
  };

  useEffect(() => {
    // VSL do paywall específica do funnel-tt
    const scriptSrc = "https://scripts.converteai.net/8f5333fd-fe8a-42cd-9840-10519ad6c7c7/players/68c9cd3fec56d0bf4606ab48/v4/player.js";
    const playerId = "vid-68c9cd3fec56d0bf4606ab48";

    if (document.querySelector(`script[src="${scriptSrc}"]`)) {
      return;
    }

    console.log("Carregando script do VSL paywall - PaywallStepTt montado");
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      console.log("Removendo script do VSL paywall - PaywallStepTt desmontado");
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

      // Limpar variáveis globais do player se existirem
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

        <h1 className="text-purple-600 mb-4 text-lg font-bold md:text-3xl leading-tight">Sua Revelação Está Pronta! Descubra Quem É Sua Alma Divina</h1>
        
        <Card className="w-fit mx-auto bg-white/50 border-purple-100 shadow-md mb-6">
            <CardContent className="p-3 flex items-center justify-center gap-4 md:gap-6">
                <div className="flex items-center gap-2">
                    <div className="bg-purple-100 p-2 rounded-full">
                        <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-gray-500">Nome</p>
                        <p className="text-sm font-semibold text-gray-800">{userName || ''}</p>
                    </div>
                </div>
                <div className="h-8 w-px bg-purple-200"></div>
                <div className="flex items-center gap-2">
                    <div className="bg-purple-100 p-2 rounded-full">
                        <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-gray-500">Data de Nascimento</p>
                        <p className="text-sm font-semibold text-gray-800">{formatDate(birthDate)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="mb-2 shadow-lg rounded-xl overflow-hidden bg-gray-200 min-h-[300px] flex items-center justify-center">
          <vturb-smartplayer
            id="vid-68c9cd3fec56d0bf4606ab48"
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
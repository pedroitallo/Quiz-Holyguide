import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar } from 'lucide-react';
import { HybridQuizResult } from '@/entities/HybridQuizResult';
import SalesSection from '../components/quiz/funnel-vsl/SalesSection';
import { trackStepView } from '../utils/stepTracking';

export default function FunnelVslPage() {
  const [showSales, setShowSales] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    birth_date: "",
    quizResultId: null
  });

  // Initialize quiz session on mount
  useEffect(() => {
    const initializeQuizSession = async () => {
      try {
        console.log('🚀 Creating new quiz session (funnel-vsl)...');
        const currentUrl = new URL(window.location.href);
        const utmSource = currentUrl.searchParams.get('utm_source') || 'direct';
        const utmMedium = currentUrl.searchParams.get('utm_medium') || 'organic';
        const utmCampaign = currentUrl.searchParams.get('utm_campaign') || 'none';
        const src = currentUrl.searchParams.get('src') || '';

        console.log('📊 UTM Parameters (funnel-vsl):', { utmSource, utmMedium, utmCampaign, src });

        const newQuizResult = await HybridQuizResult.create({
          funnel_type: 'funnel-vsl',
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          src: src,
          current_step: 1,
          started_at: new Date().toISOString()
        });

        setFormData(prev => ({ ...prev, quizResultId: newQuizResult.id }));
        console.log('✅ New QuizResult created successfully (funnel-vsl):', newQuizResult.id);
      } catch (error) {
        console.error('❌ CRITICAL: Failed to create QuizResult (funnel-vsl), using offline mode:', error.message, error);
        setFormData(prev => ({ ...prev, quizResultId: 'offline-mode' }));
      }
    };

    initializeQuizSession();
    trackStepView('funnel-vsl', 'video');
  }, []);

  // Handle VSL script loading and sales section timing
  useEffect(() => {
    // Load VSL script
    const scriptSrc = "https://scripts.converteai.net/8f5333fd-fe8a-42cd-9840-10519ad6c7c7/players/68d8690edb6fabbf5ea2c44c/v4/player.js";
    const playerId = "vid-68d8690edb6fabbf5ea2c44c";

    if (document.querySelector(`script[src="${scriptSrc}"]`)) {
      return;
    }

    console.log("Carregando script do VSL - FunnelVsl montado");
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    document.head.appendChild(script);

    // Show sales section after 4 minutes and 35 seconds (same timing as other funnels)
    const timer = setTimeout(() => {
      setShowSales(true);
      trackStepView('funnel-vsl', 'sales');

      // Track pitch step view when sales section appears
      if (formData.quizResultId && formData.quizResultId !== 'offline-mode' && formData.quizResultId !== 'admin-mode' && formData.quizResultId !== 'bot-mode') {
        HybridQuizResult.update(formData.quizResultId, { pitch_step_viewed: true }).catch(e =>
          console.warn("Failed to update pitch step view:", e)
        );
      }
    }, 275000); // 4 minutes and 35 seconds = 275000ms

    return () => {
      clearTimeout(timer);
      
      console.log("Removendo script do VSL - FunnelVsl desmontado");
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
  }, [formData.quizResultId]);

  const handleCheckout = async () => {
    // Track checkout click IMMEDIATELY before any redirect
    const trackCheckout = async () => {
      if (formData.quizResultId && formData.quizResultId !== 'offline-mode' && formData.quizResultId !== 'admin-mode' && formData.quizResultId !== 'bot-mode') {
        try {
          await HybridQuizResult.update(formData.quizResultId, { checkout_step_clicked: true });
          console.log('Checkout click tracked successfully');
        } catch (error) {
          console.warn("Falha ao rastrear clique de checkout:", error);
        }
      }
    };

    // Execute tracking synchronously and then redirect
    trackCheckout().then(() => {
      try {
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
        if (formData.quizResultId && formData.quizResultId !== 'offline-mode' && formData.quizResultId !== 'admin-mode' && formData.quizResultId !== 'bot-mode') {
          url.searchParams.set('quiz_result_id', formData.quizResultId);
        }

        console.log('Redirecting to checkout (funnel-vsl):', url.toString());
        // Limpar estado do quiz em andamento antes de redirecionar
        localStorage.removeItem('holymind_quiz_state_funnel_vsl');
        localStorage.setItem('holymind_last_quiz_id', formData.quizResultId);
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
    if (day && month) {
        return `${day}/${month}`;
    }
    return dateString;
  };

  return (
    <div className="min-h-screen bg-[#f9f5ff] relative overflow-hidden" style={{ userSelect: 'none' }}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-purple-200/40">
          <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div className="absolute top-32 right-16 text-purple-200/40">
          <svg className="w-8 h-8 animate-pulse" style={{ animationDelay: '1s' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="absolute bottom-20 left-20 text-purple-200/40">
          <svg className="w-7 h-7 animate-pulse" style={{ animationDelay: '2s' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="absolute bottom-32 right-12 text-purple-200/40">
          <svg className="w-5 h-5 animate-pulse" style={{ animationDelay: '0.5s' }} fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM15 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4z" />
          </svg>
        </div>
      </div>

      {/* Header with progress */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="px-4 md:px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png" alt="Master Aura" className="w-10 md:w-12 h-10 md:h-12 rounded-full object-cover border-2 border-purple-200" />
              <div className="absolute -bottom-1 -right-1 w-3 md:w-4 h-3 md:h-4 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm md:text-base font-semibold text-gray-800">Master Aura</h3>
                <div className="w-3 md:w-4 h-3 md:h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-2 md:w-2.5 h-2 md:h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              </div>
              <p className="text-xs md:text-sm text-green-600 font-medium">online</p>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="w-full bg-gray-200 h-1">
            <motion.div 
              className="bg-gradient-to-r from-purple-400 to-purple-600 h-1" 
              initial={{ width: 0 }} 
              animate={{ width: showSales ? "100%" : "50%" }} 
              transition={{ duration: 0.5, ease: "easeOut" }} 
            />
          </div>
          <div className="absolute right-2 -top-6 text-xs text-gray-600 font-medium">
            {showSales ? "100%" : "50%"}
          </div>
        </div>
      </div>

      <div className="bg-[#f9f5ff] pt-24 pb-8 px-2 md:pt-28 md:px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center py-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8">

              <h1 className="text-xl md:text-2xl mb-2 font-bold text-black leading-tight">
                I will use my psychic abilities to reveal the face of your soulmate.
              </h1>
              
              <p className="text-gray-600 text-base mb-6 max-w-2xl mx-auto leading-relaxed">
                Press play and see why over 10,000 people trust Aura, Hollywood's number #1 psychic
              </p>
              
              <div className="mb-8 w-full max-w-lg mx-auto">
                <div className="shadow-lg rounded-xl overflow-hidden bg-gray-200 min-h-[300px] flex items-center justify-center">
                  <vturb-smartplayer
                    id="vid-68d8690edb6fabbf5ea2c44c"
                    style={{
                      display: 'block',
                      margin: '0 auto',
                      width: '100%',
                      maxWidth: '400px',
                      minHeight: '250px'
                    }}>
                  </vturb-smartplayer>
                </div>
              </div>

              {showSales && (
                <SalesSection 
                  userName={formData.name}
                  birthDate={formData.birth_date}
                  quizResultId={formData.quizResultId}
                  onCheckout={handleCheckout}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
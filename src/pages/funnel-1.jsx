import React, { useState, useEffect, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { Stars, Moon, Heart, Sparkles, Loader2 } from "lucide-react";
import { HybridQuizResult } from '@/entities/HybridQuizResult';
import StepTracker from '../components/quiz/StepTracker';

// Carregar apenas o VideoStep imediatamente (primeira etapa)
import VideoStep from "../components/quiz/VideoStep";
import NameCollection from "../components/quiz/NameCollection";
import BirthDataCollection from "../components/quiz/BirthDataCollection";
import LoveSituationStep from "../components/quiz/LoveSituationStep";
import LoadingRevelation from "../components/quiz/LoadingRevelation";
import TestimonialsCarousel from "../components/quiz/TestimonialsCarousel";
import PaywallStep from "../components/quiz/PaywallStep";
import ThankYouStep from "../components/quiz/ThankYouStep";
import PalmReadingResults from "../components/quiz/PalmReadingResults";

export default function Funnel1Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    birth_date: "",
    birth_time: "",
    love_situation: "",
    quizResultId: null
  });

  const totalSteps = 5; // Testimonials, Name, Love, Audio, Revelation

  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    // Save state up to the LoadingRevelation (step 6)
    if (currentStep < 7) {
        const stateToSave = {
            step: currentStep,
            data: formData
        };
        localStorage.setItem('holymind_quiz_state', JSON.stringify(stateToSave));
    } else if (currentStep === 7) { // After final step
        localStorage.removeItem('holymind_quiz_state');
    }
  }, [currentStep, formData]);

  useEffect(() => {
    const initializeQuizSession = async () => {
      const savedStateJSON = localStorage.getItem('holymind_quiz_state');
      if (savedStateJSON) {
          try {
              const savedState = JSON.parse(savedStateJSON);
              if (savedState && savedState.step) {
                  console.log("Sessão anterior encontrada. Restaurando progresso.", savedState);
                  setFormData(savedState.data || { name: "", birth_date: "", birth_time: "", love_situation: "" });
                  setCurrentStep(savedState.step);
                  return;
              }
          } catch (e) {
              console.warn("Erro ao parsear estado salvo do quiz, iniciando nova sessão.", e);
              localStorage.removeItem('holymind_quiz_state');
          }
      }
      
      // Create new QuizResult if no saved session
      try {
        console.log('🚀 Creating new quiz session...');
        const currentUrl = new URL(window.location.href);
        const utmSource = currentUrl.searchParams.get('utm_source') || 'direct';
        const utmMedium = currentUrl.searchParams.get('utm_medium') || 'organic';
        const utmCampaign = currentUrl.searchParams.get('utm_campaign') || 'none';
        const src = currentUrl.searchParams.get('src') || '';
        
        console.log('📊 UTM Parameters:', { utmSource, utmMedium, utmCampaign, src });
        
        const newQuizResult = await HybridQuizResult.create({
          funnel_type: 'funnel-1',
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          src: src,
          current_step: 1,
          started_at: new Date().toISOString()
        });
        
        setFormData(prev => ({ ...prev, quizResultId: newQuizResult.id }));
        console.log('✅ New QuizResult created successfully:', newQuizResult.id);
      } catch (error) {
        console.error('❌ CRITICAL: Failed to create QuizResult, using offline mode:', error.message, error);
        setFormData(prev => ({ ...prev, quizResultId: 'offline-mode' }));
      }
    };
    
    initializeQuizSession();
  }, []);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      
      // Garantir que a próxima etapa sempre inicie no topo da página
      setTimeout(() => {
        window.scrollTo({ 
          top: 0, 
          behavior: 'smooth' 
        });
      }, 50);
    }
  };

  const handleNameSubmit = async (name) => {
    const updatedData = { 
      ...formData, 
      name: typeof name === 'string' ? name : name.name,
      birth_date: typeof name === 'object' ? name.birth_date : formData.birth_date,
      birth_day: typeof name === 'object' ? name.birth_day : formData.birth_day,
      birth_month: typeof name === 'object' ? name.birth_month : formData.birth_month,
      birth_year: typeof name === 'object' ? name.birth_year : formData.birth_year
    };
    setFormData(updatedData);
    nextStep();
  };

  const handleBirthDataSubmit = async (birthData) => {
    const updatedData = { ...formData, ...birthData };
    setFormData(updatedData);
    nextStep();
  };

  const handleLoveSituationSubmit = async (loveSituation) => {
    const updatedData = { ...formData, love_situation: loveSituation };
    setFormData(updatedData);
    nextStep();
  };
  
  return (
    <div className="min-h-screen bg-[#f9f5ff] relative overflow-hidden" style={{ userSelect: 'none' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-purple-200/40"><Stars className="w-6 h-6 animate-pulse" /></div>
        <div className="absolute top-32 right-16 text-purple-200/40"><Moon className="w-8 h-8 animate-pulse" style={{ animationDelay: '1s' }} /></div>
        <div className="absolute bottom-20 left-20 text-purple-200/40"><Heart className="w-7 h-7 animate-pulse" style={{ animationDelay: '2s' }} /></div>
        <div className="absolute bottom-32 right-12 text-purple-200/40"><Sparkles className="w-5 h-5 animate-pulse" style={{ animationDelay: '0.5s' }} /></div>
        <div className="absolute top-1/2 left-8 text-purple-200/40"><Stars className="w-4 h-4 animate-pulse" style={{ animationDelay: '3s' }} /></div>
        <div className="absolute top-1/3 right-6 text-purple-200/40"><Heart className="w-6 h-6 animate-pulse" style={{ animationDelay: '1.5s' }} /></div>
        <div className="absolute bottom-1/3 left-1/4 text-purple-200/40"><Moon className="w-5 h-5 animate-pulse" style={{ animationDelay: '2.5s' }} /></div>
        <div className="absolute top-2/3 right-1/4 text-purple-200/40"><Sparkles className="w-4 h-4 animate-pulse" style={{ animationDelay: '4s' }} /></div>
      </div>

      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="px-4 md:px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp" alt="Madame Aura" className="w-10 md:w-12 h-10 md:h-12 rounded-full object-cover border-2 border-purple-200" />
              <div className="absolute -bottom-1 -right-1 w-3 md:w-4 h-3 md:h-4 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm md:text-base font-semibold text-gray-800">Madame Aura</h3>
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
            <motion.div className="bg-gradient-to-r from-purple-400 to-purple-600 h-1" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
          </div>
          <div className="absolute right-2 -top-6 text-xs text-gray-600 font-medium">{Math.round(progress)}%</div>
        </div>
      </div>

      <div className="bg-[#f9f5ff] pt-24 pb-8 px-2 md:pt-28 md:px-4">
        <div className="max-w-lg mx-auto">
          <StepTracker currentStep={currentStep} quizResultId={formData.quizResultId} />
          {currentStep === 1 && <TestimonialsCarousel onContinue={nextStep} />}
          {currentStep === 2 && <NameCollection onNameSubmit={handleNameSubmit} />}
          {currentStep === 3 && <LoveSituationStep userName={formData.name} birthDate={formData.birth_date} onSubmit={handleLoveSituationSubmit} />}
          {currentStep === 4 && <PalmReadingResults onContinue={nextStep} userName={formData.name} />}
          {currentStep === 5 && <LoadingRevelation onContinue={() => {}} userName={formData.name} birthDate={formData.birth_date} quizResultId={formData.quizResultId} />}
        </div>
      </div>
    </div>
  );
}
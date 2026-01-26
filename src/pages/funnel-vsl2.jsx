import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Stars, Moon, Heart, Sparkles } from "lucide-react";
import { HybridQuizResult } from '@/entities/HybridQuizResult';
import StepTracker from '../components/quiz/shared/StepTracker';
import { trackStepView } from '../utils/stepTracking';
import { useTracking } from '@/hooks/useTracking';

import InitiateQuiz from "../components/quiz/funnel-2/InitiateQuiz";
import TestimonialsCarousel from "../components/quiz/shared/TestimonialsCarousel";
import BirthDateWithZodiac from "../components/quiz/funnel-2/BirthDateWithZodiac";
import LoveSituationStep from "../components/quiz/shared/LoveSituationStep";
import IdealPartnerQualities from "../components/quiz/funnel-2/IdealPartnerQualities";
import PartnerPreference from "../components/quiz/funnel-2/PartnerPreference";
import BirthChartResults from "../components/quiz/funnel-2/BirthChartResults";
import LoveChallenge from "../components/quiz/funnel-2/LoveChallenge";
import LoveDesire from "../components/quiz/funnel-2/LoveDesire";
import SoulmateConnection from "../components/quiz/funnel-2/SoulmateConnection";
import LoveLanguage from "../components/quiz/funnel-2/LoveLanguage";
import RelationshipEnergy from "../components/quiz/funnel-2/RelationshipEnergy";
import FutureScenario from "../components/quiz/funnel-2/FutureScenario";
import LoadingRevelation from "../components/quiz/shared/LoadingRevelation";
import SoulmateDrawingLoading from "../components/quiz/funnel-2/SoulmateDrawingLoading";
import PaywallStep from "../components/quiz/funnel-vsl1/PaywallStep";
import ThankYouStep from "../components/quiz/shared/ThankYouStep";

export default function FunnelVsl2Page() {
  const { trackStartQuiz } = useTracking();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    birth_date: "",
    zodiac_sign: "",
    love_situation: "",
    ideal_qualities: [],
    partner_preference: "",
    love_challenge: "",
    love_desire: "",
    soulmate_connection: "",
    love_language: "",
    relationship_energy: "",
    future_scenario: "",
    quizResultId: null
  });

  const totalSteps = 17;
  const progress = currentStep / totalSteps * 100;

  useEffect(() => {
    if (currentStep < 17) {
      const stateToSave = {
        step: currentStep,
        data: formData
      };
      localStorage.setItem('holymind_quiz_state_funnel_vsl2', JSON.stringify(stateToSave));
    } else if (currentStep === 17) {
      localStorage.removeItem('holymind_quiz_state_funnel_vsl2');
    }
  }, [currentStep, formData]);

  useEffect(() => {
    const initializeQuizSession = async () => {
      const savedStateJSON = localStorage.getItem('holymind_quiz_state_funnel_vsl2');
      if (savedStateJSON) {
        try {
          const savedState = JSON.parse(savedStateJSON);
          if (savedState && savedState.step) {
            console.log("Sessão anterior encontrada. Restaurando progresso.", savedState);
            setFormData(savedState.data || {});
            setCurrentStep(savedState.step);
            return;
          }
        } catch (e) {
          console.warn("Erro ao parsear estado salvo do quiz, iniciando nova sessão.", e);
          localStorage.removeItem('holymind_quiz_state_funnel_vsl2');
        }
      }

      try {
        console.log('🚀 Creating new quiz session...');
        trackStartQuiz();

        const currentUrl = new URL(window.location.href);
        const utmSource = currentUrl.searchParams.get('utm_source') || 'direct';
        const utmMedium = currentUrl.searchParams.get('utm_medium') || 'organic';
        const utmCampaign = currentUrl.searchParams.get('utm_campaign') || 'none';
        const src = currentUrl.searchParams.get('src') || '';

        const newQuizResult = await HybridQuizResult.create({
          funnel_type: 'funnel-vsl2',
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
  }, [trackStartQuiz]);

  const nextStep = () => {
    const newStep = currentStep + 1;
    setCurrentStep(newStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const stepNames = [
      'initiate', 'testimonials', 'birth_date', 'love_situation',
      'qualities', 'preference', 'chart_results', 'challenge',
      'desire', 'connection', 'love_language', 'energy', 'future',
      'loading_revelation', 'loading', 'paywall', 'thank_you'
    ];
    if (currentStep <= stepNames.length) {
      trackStepView('funnel-vsl2', stepNames[currentStep - 1]);
    }
  }, [currentStep]);

  const handleBirthDateSubmit = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    nextStep();
  };

  const handleLoveSituationSubmit = (loveSituation) => {
    setFormData(prev => ({ ...prev, love_situation: loveSituation }));
    nextStep();
  };

  const handleQualitiesSubmit = (qualities) => {
    setFormData(prev => ({ ...prev, ideal_qualities: qualities }));
    nextStep();
  };

  const handlePreferenceSelect = (value) => {
    setFormData(prev => ({ ...prev, partner_preference: value }));
    nextStep();
  };

  const handleChallengeSubmit = (challenge) => {
    setFormData(prev => ({ ...prev, love_challenge: challenge }));
    nextStep();
  };

  const handleDesireSubmit = (desire) => {
    setFormData(prev => ({ ...prev, love_desire: desire }));
    nextStep();
  };

  const handleConnectionSubmit = (connection) => {
    setFormData(prev => ({ ...prev, soulmate_connection: connection }));
    nextStep();
  };

  const handleLoveLanguageSelect = (language) => {
    setFormData(prev => ({ ...prev, love_language: language }));
    nextStep();
  };

  const handleEnergySelect = (energy) => {
    setFormData(prev => ({ ...prev, relationship_energy: energy }));
    nextStep();
  };

  const handleScenarioSubmit = (scenario) => {
    setFormData(prev => ({ ...prev, future_scenario: scenario }));
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

      {currentStep !== 16 && (
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
              <motion.div className="bg-gradient-to-r from-purple-400 to-purple-600 h-1" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
            </div>
            <div className="absolute right-2 -top-6 text-xs text-gray-600 font-medium">{Math.round(progress)}%</div>
          </div>
        </div>
      )}

      <div className={`bg-[#f9f5ff] pb-8 px-2 md:px-4 ${currentStep === 16 ? 'pt-8' : 'pt-24 md:pt-28'}`}>
        <div className="max-w-lg mx-auto">
          <StepTracker currentStep={currentStep} quizResultId={formData.quizResultId} />
          {currentStep === 1 && <InitiateQuiz onContinue={nextStep} />}
          {currentStep === 2 && <TestimonialsCarousel onContinue={nextStep} />}
          {currentStep === 3 && <BirthDateWithZodiac onSubmit={handleBirthDateSubmit} />}
          {currentStep === 4 && <LoveSituationStep userName="" birthDate={formData.birth_date} onSubmit={handleLoveSituationSubmit} />}
          {currentStep === 5 && <IdealPartnerQualities onSubmit={handleQualitiesSubmit} zodiacSign={formData.zodiac_sign} />}
          {currentStep === 6 && <PartnerPreference onSelect={handlePreferenceSelect} />}
          {currentStep === 7 && <BirthChartResults onContinue={nextStep} birthDate={formData.birth_date} />}
          {currentStep === 8 && <LoveChallenge onSubmit={handleChallengeSubmit} />}
          {currentStep === 9 && <LoveDesire onSubmit={handleDesireSubmit} />}
          {currentStep === 10 && <SoulmateConnection onSubmit={handleConnectionSubmit} zodiacSign={formData.zodiac_sign} />}
          {currentStep === 11 && <LoveLanguage onSelect={handleLoveLanguageSelect} />}
          {currentStep === 12 && <RelationshipEnergy onSelect={handleEnergySelect} />}
          {currentStep === 13 && <FutureScenario onSubmit={handleScenarioSubmit} zodiacSign={formData.zodiac_sign} />}
          {currentStep === 14 && <LoadingRevelation onContinue={nextStep} userName="" birthDate={formData.birth_date} quizResultId={formData.quizResultId} />}
          {currentStep === 15 && <SoulmateDrawingLoading onComplete={nextStep} birthDate={formData.birth_date} zodiacSign={formData.zodiac_sign} />}
          {currentStep === 16 && <PaywallStep userName="" birthDate={formData.birth_date} quizResultId={formData.quizResultId} />}
          {currentStep === 17 && <ThankYouStep userName="" />}
        </div>
      </div>
    </div>
  );
}

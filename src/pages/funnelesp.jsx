import React, { useState, useEffect, Suspense, lazy } from "react";
import { QuizResult } from "@/api/entities";
import { User } from "@/api/entities";
import { motion } from "framer-motion";
import { Stars, Moon, Heart, Sparkles, Loader2 } from "lucide-react";

// Carregar apenas o VideoStep imediatamente (primeira etapa)
import VideoStep from "../components/quiz/VideoStep";
import StepTracker from '../components/quiz/StepTracker';

// Lazy loading para todas as outras etapas do funil
const NameCollection = lazy(() => import("../components/quiz/NameCollection"));
const BirthDataCollection = lazy(() => import("../components/quiz/BirthDataCollection"));
const LoveSituationStep = lazy(() => import("../components/quiz/LoveSituationStep"));
const PalmReadingResults = lazy(() => import("../components/quiz/PalmReadingResults"));
const LoadingRevelation = lazy(() => import("../components/quiz/LoadingRevelation"));
const TestimonialsCarousel = lazy(() => import("../components/quiz/TestimonialsCarousel"));
const PaywallStep = lazy(() => import("../components/quiz/PaywallStep"));
const ThankYouStep = lazy(() => import("../components/quiz/ThankYouStep"));

// Componente de loading para as etapas sendo carregadas
const StepLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
  </div>
);

export default function FunnelEspPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    birth_date: "",
    birth_time: "",
    love_situation: ""
  });
  const [quizResultId, setQuizResultId] = useState(null);
  const [src, setSrc] = useState('');

  const totalSteps = 8; // Video, Testimonials, Name, Birth, Love, Palm, Revelation, Paywall
  const progress = currentStep / totalSteps * 100;

  const isBot = () => {
    if (typeof window === 'undefined') return false;
    
    const userAgent = window.navigator.userAgent.toLowerCase();
    const botPatterns = [
      'facebookexternalhit',
      'facebookcatalog',
      'facebookcrawler',
      'facebookbot',
      'facebookplatform',
      'twitterbot',
      'linkedinbot',
      'whatsapp',
      'telegrambot',
      'skypeuripreview',
      'slackbot',
      'discordbot',
      'googlebot',
      'bingbot',
      'yandexbot',
      'baiduspider',
      'ia_archiver',
      'crawler',
      'spider',
      'bot/',
      'crawl',
      'preview',
      'scraper'
    ];
    
    const isBot = botPatterns.some(pattern => userAgent.includes(pattern));
    
    if (isBot) {
      console.log('Bot detectado:', userAgent);
    }
    
    return isBot;
  };

  const getNextVisitorId = async () => {
    try {
      const allResults = await QuizResult.list('-visitor_id', 1);
      if (allResults.length === 0) {
        return 1;
      }
      return (allResults[0].visitor_id || 0) + 1;
    } catch (error) {
      console.warn("Erro ao obter visitor_id, usando fallback:", error);
      return Date.now() % 1000000;
    }
  };

  useEffect(() => {
    // Save state up to the PaywallStep (step 8), clear on ThankYouStep (step 9)
    if (quizResultId && quizResultId !== 'offline-mode' && quizResultId !== 'admin-mode' && quizResultId !== 'bot-mode' && currentStep < 9) {
        const stateToSave = {
            id: quizResultId,
            step: currentStep,
            data: formData
        };
        localStorage.setItem('holymind_quiz_state_funnelesp', JSON.stringify(stateToSave));
    } else if (currentStep === 9) { // ThankYouStep
        localStorage.removeItem('holymind_quiz_state_funnelesp');
    }
  }, [currentStep, formData, quizResultId]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const srcParam = urlParams.get('src');
    if (srcParam) {
        setSrc(srcParam);
    }
  }, []);

  useEffect(() => {
    const initializeQuizSession = async () => {
      const savedStateJSON = localStorage.getItem('holymind_quiz_state_funnelesp');
      if (savedStateJSON) {
          try {
              const savedState = JSON.parse(savedStateJSON);
              if (savedState && savedState.id && savedState.step) {
                  console.log("Sessão anterior encontrada. Restaurando progresso.", savedState);
                  
                  // Verificar se o registro ainda existe antes de tentar atualizar
                  if (savedState.id !== 'offline-mode' && savedState.id !== 'admin-mode' && savedState.id !== 'bot-mode') {
                      try {
                          const existingRecord = await QuizResult.get(savedState.id);
                          if (existingRecord) {
                              setQuizResultId(savedState.id);
                              setFormData(savedState.data || { name: "", birth_date: "", birth_time: "", love_situation: "" });
                              setCurrentStep(savedState.step);
                              await QuizResult.update(savedState.id, { last_resumed_at: new Date().toISOString() }).catch(e => console.warn("Failed to update resumed session timestamp", e));
                              return;
                          } else {
                            console.warn("Registro salvo não existe mais, iniciando nova sessão: Registro não encontrado na base.");
                            localStorage.removeItem('holymind_quiz_state_funnelesp');
                          }
                      } catch (error) {
                          console.warn("Registro salvo não existe mais, iniciando nova sessão:", error);
                          localStorage.removeItem('holymind_quiz_state_funnelesp');
                      }
                  } else {
                      // Para modos especiais, não precisa verificar no banco
                      setQuizResultId(savedState.id);
                      setFormData(savedState.data || { name: "", birth_date: "", birth_time: "", love_situation: "" });
                      setCurrentStep(savedState.step);
                      return;
                  }
              }
          } catch (e) {
              console.warn("Erro ao parsear estado salvo do quiz, iniciando nova sessão.", e);
              localStorage.removeItem('holymind_quiz_state_funnelesp');
          }
      }

      if (isBot()) {
        console.log('Bot detectado - não criando registro de analytics');
        setQuizResultId('bot-mode');
        return;
      }

      try {
        const user = await User.me();
        if (user && user.role === 'admin') {
          console.log('Admin detectado - não criando registro de analytics');
          setQuizResultId('admin-mode');
          return;
        }
      } catch (error) {
        // User not logged in or cannot be checked
      }

      const lastQuizId = localStorage.getItem('holymind_last_quiz_id_funnelesp');
      if (lastQuizId) {
          try {
              const lastResult = await QuizResult.get(lastQuizId);
              if (lastResult && lastResult.purchased) {
                  console.log("Compra anterior detectada. Pulando para a página de agradecimento.");
                  setFormData(prev => ({ ...prev, name: lastResult.name || 'Amigo(a)' }));
                  setCurrentStep(9); // ThankYouStep
                  return;
              }
          } catch (error) {
              console.warn("Não foi possível recuperar o último resultado do quiz. Iniciando nova sessão.", error);
              localStorage.removeItem('holymind_last_quiz_id_funnelesp');
          }
      }
      
      const createNewRecord = async () => {
        try {
          const nextId = await getNextVisitorId();
          const urlParams = new URLSearchParams(window.location.search);
          const srcParam = urlParams.get('src');
          const utmContentParam = urlParams.get('utm_content');
          const newRecord = await QuizResult.create({ 
            visitor_id: nextId,
            src: srcParam || null,
            utm_content: utmContentParam || null,
            funnel_variant: 'funnelesp' 
          });
          setQuizResultId(newRecord.id);
        } catch (creationError) {
          console.warn("Erro ao criar novo registro de quiz, operando em modo offline:", creationError);
          setQuizResultId('offline-mode');
        }
      };
      
      await createNewRecord();
    };
    
    initializeQuizSession();
  }, []);

  const nextStep = () => {
    if (currentStep < totalSteps || currentStep === totalSteps) { // Allow advancing from totalSteps (Paywall) to ThankYou
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      
      // Garantir que a próxima etapa sempre inicie no topo da página
      setTimeout(() => {
        window.scrollTo({ 
          top: 0, 
          behavior: 'smooth' 
        });
      }, 50); // Reduzido de 100 para 50ms para scroll mais imediato
    }
  };

  const handleNameSubmit = async (name) => {
    const updatedData = { ...formData, name };
    setFormData(updatedData);

    try {
      if (quizResultId && quizResultId !== 'offline-mode' && quizResultId !== 'admin-mode' && quizResultId !== 'bot-mode') {
        // Verificar se o registro ainda existe antes de atualizar
        const existingRecord = await QuizResult.get(quizResultId);
        if (existingRecord) {
          await QuizResult.update(quizResultId, { name });
        } else {
          console.warn("Registro não encontrado, continuando em modo offline");
          setQuizResultId('offline-mode');
        }
      }
    } catch (error) {
      console.warn("Erro ao salvar nome, continuando offline:", error);
      setQuizResultId('offline-mode');
    }
    
    nextStep();
  };

  const handleBirthDataSubmit = async (birthData) => {
    const updatedData = { ...formData, ...birthData };
    setFormData(updatedData);

    try {
      if (quizResultId && quizResultId !== 'offline-mode' && quizResultId !== 'admin-mode' && quizResultId !== 'bot-mode') {
        // Verificar se o registro ainda existe antes de atualizar
        const existingRecord = await QuizResult.get(quizResultId);
        if (existingRecord) {
          await QuizResult.update(quizResultId, {
            birth_date: birthData.birth_date
            // Agora inclui o ano completo no birth_date
          });
        } else {
          console.warn("Registro não encontrado, continuando em modo offline");
          setQuizResultId('offline-mode');
        }
      }
    } catch (error) {
      console.warn("Erro ao salvar dados de nascimento, continuando offline:", error);
      setQuizResultId('offline-mode');
    }

    nextStep();
  };

  const handleLoveSituationSubmit = async (loveSituation) => {
    const updatedData = { ...formData, love_situation: loveSituation };
    setFormData(updatedData);

    try {
      if (quizResultId && quizResultId !== 'offline-mode' && quizResultId !== 'admin-mode' && quizResultId !== 'bot-mode') {
        // Verificar se o registro ainda existe antes de atualizar
        const existingRecord = await QuizResult.get(quizResultId);
        if (existingRecord) {
          await QuizResult.update(quizResultId, { love_situation: loveSituation });
        } else {
          console.warn("Registro não encontrado, continuando em modo offline");
          setQuizResultId('offline-mode');
        }
      }
    } catch (error) {
      console.warn("Erro ao salvar situação amorosa, continuando offline:", error);
      setQuizResultId('offline-mode');
    }
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
              <div className="absolute -bottom-1 -right-1 w-3 md:w-4 h-3 md:h-4 bg-green-500 border-2 border-white rounded-full"></div>
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
          <Suspense fallback={<StepLoader />}>
            {/* Renderização condicional com StepTracker para rastrear visualizações */}
            {currentStep === 1 && (
                <>
                    <StepTracker quizResultId={quizResultId} stepName="video" />
                    <VideoStep onContinue={nextStep} />
                </>
            )}
            {currentStep === 2 && (
                <>
                    <StepTracker quizResultId={quizResultId} stepName="testimonials" />
                    <TestimonialsCarousel onContinue={nextStep} />
                </>
            )}
            {currentStep === 3 && (
                <>
                    <StepTracker quizResultId={quizResultId} stepName="name" />
                    <NameCollection onNameSubmit={handleNameSubmit} />
                </>
            )}
            {currentStep === 4 && (
                <>
                    <StepTracker quizResultId={quizResultId} stepName="birth" />
                    <BirthDataCollection onSubmit={handleBirthDataSubmit} />
                </>
            )}
            {currentStep === 5 && (
                <>
                    <StepTracker quizResultId={quizResultId} stepName="love" />
                    <LoveSituationStep userName={formData.name} birthDate={formData.birth_date} onSubmit={handleLoveSituationSubmit} />
                </>
            )}
            {currentStep === 6 && (
                <>
                    <StepTracker quizResultId={quizResultId} stepName="palm" />
                    <PalmReadingResults onContinue={nextStep} userName={formData.name} />
                </>
            )}
            {currentStep === 7 && (
                <>
                    <StepTracker quizResultId={quizResultId} stepName="revelation" />
                    <LoadingRevelation onContinue={nextStep} userName={formData.name} birthDate={formData.birth_date} />
                </>
            )}
            {currentStep === 8 && (
              <>
                  <StepTracker quizResultId={quizResultId} stepName="paywall" />
                  <PaywallStep 
                    userName={formData.name}
                    birthDate={formData.birth_date}
                    quizResultId={quizResultId}
                    src={src}
                  />
              </>
            )}
            {currentStep === 9 && <ThankYouStep userName={formData.name} />}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
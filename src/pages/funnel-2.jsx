import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stars, Moon, Heart, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { HybridQuizResult } from '@/entities/HybridQuizResult';
import StepTracker from '../components/quiz/shared/StepTracker';
import { trackStepView } from '../utils/stepTracking';

const quizSteps = [
  {
    id: 1,
    question: "Qual é o seu gênero?",
    type: "single",
    key: "gender",
    options: [
      { value: "female", label: "Feminino" },
      { value: "male", label: "Masculino" },
      { value: "other", label: "Outro" }
    ]
  },
  {
    id: 2,
    question: "Qual é a sua faixa etária?",
    type: "single",
    key: "age_range",
    options: [
      { value: "18-24", label: "18-24 anos" },
      { value: "25-34", label: "25-34 anos" },
      { value: "35-44", label: "35-44 anos" },
      { value: "45-54", label: "45-54 anos" },
      { value: "55+", label: "55+ anos" }
    ]
  },
  {
    id: 3,
    question: "Qual é o seu status de relacionamento atual?",
    type: "single",
    key: "relationship_status",
    options: [
      { value: "single", label: "Solteiro(a)" },
      { value: "dating", label: "Namorando" },
      { value: "married", label: "Casado(a)" },
      { value: "divorced", label: "Divorciado(a)" },
      { value: "complicated", label: "É complicado" }
    ]
  },
  {
    id: 4,
    question: "O que você está procurando?",
    type: "single",
    key: "looking_for",
    options: [
      { value: "serious", label: "Relacionamento sério" },
      { value: "casual", label: "Algo casual" },
      { value: "friendship", label: "Amizade" },
      { value: "not_sure", label: "Não tenho certeza" }
    ]
  },
  {
    id: 5,
    question: "Qual a faixa etária ideal do seu parceiro?",
    type: "single",
    key: "ideal_partner_age",
    options: [
      { value: "18-24", label: "18-24 anos" },
      { value: "25-34", label: "25-34 anos" },
      { value: "35-44", label: "35-44 anos" },
      { value: "45-54", label: "45-54 anos" },
      { value: "55+", label: "55+ anos" },
      { value: "no_preference", label: "Sem preferência" }
    ]
  },
  {
    id: 6,
    question: "Quais características você mais valoriza? (escolha até 3)",
    type: "multiple",
    key: "personality_traits",
    maxSelections: 3,
    options: [
      { value: "honesty", label: "Honestidade" },
      { value: "humor", label: "Senso de humor" },
      { value: "intelligence", label: "Inteligência" },
      { value: "kindness", label: "Gentileza" },
      { value: "ambition", label: "Ambição" },
      { value: "loyalty", label: "Lealdade" },
      { value: "adventure", label: "Espírito aventureiro" },
      { value: "empathy", label: "Empatia" }
    ]
  },
  {
    id: 7,
    question: "Como você descreveria seu estilo de vida?",
    type: "single",
    key: "lifestyle",
    options: [
      { value: "active", label: "Ativo e esportivo" },
      { value: "social", label: "Social e extrovertido" },
      { value: "homebody", label: "Caseiro e tranquilo" },
      { value: "workaholic", label: "Focado na carreira" },
      { value: "balanced", label: "Equilibrado" }
    ]
  },
  {
    id: 8,
    question: "O que é mais importante para você em um relacionamento?",
    type: "single",
    key: "values",
    options: [
      { value: "communication", label: "Comunicação aberta" },
      { value: "trust", label: "Confiança mútua" },
      { value: "respect", label: "Respeito" },
      { value: "passion", label: "Paixão e química" },
      { value: "support", label: "Apoio emocional" }
    ]
  },
  {
    id: 9,
    question: "Qual é sua linguagem do amor principal?",
    subtitle: "Como você prefere receber e demonstrar amor?",
    type: "single",
    key: "love_language",
    options: [
      { value: "words", label: "Palavras de afirmação" },
      { value: "time", label: "Tempo de qualidade" },
      { value: "gifts", label: "Presentes" },
      { value: "service", label: "Atos de serviço" },
      { value: "touch", label: "Toque físico" }
    ]
  },
  {
    id: 10,
    question: "Qual é o seu melhor email?",
    subtitle: "Enviaremos seu Soulmate Map personalizado",
    type: "email",
    key: "email"
  }
];

function QuizStep({ step, answer, onAnswer, onNext, onBack, canGoBack, isLastStep }) {
  const [localAnswer, setLocalAnswer] = useState(answer || (step.type === "multiple" ? [] : ""));
  const [error, setError] = useState("");

  const handleSelect = (value) => {
    if (step.type === "multiple") {
      const currentValues = Array.isArray(localAnswer) ? localAnswer : [];
      if (currentValues.includes(value)) {
        setLocalAnswer(currentValues.filter(v => v !== value));
      } else if (currentValues.length < (step.maxSelections || 999)) {
        setLocalAnswer([...currentValues, value]);
      }
    } else {
      setLocalAnswer(value);
      setTimeout(() => {
        onAnswer(step.key, value);
        onNext();
      }, 300);
    }
    setError("");
  };

  const handleTextChange = (value) => {
    setLocalAnswer(value);
    setError("");
  };

  const handleSubmit = () => {
    if (!localAnswer || (Array.isArray(localAnswer) && localAnswer.length === 0)) {
      setError("Por favor, selecione uma opção");
      return;
    }

    if (step.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localAnswer)) {
      setError("Por favor, insira um email válido");
      return;
    }

    onAnswer(step.key, localAnswer);
    if (!isLastStep) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            {step.question}
          </h2>
          {step.subtitle && (
            <p className="text-base md:text-lg text-gray-600">{step.subtitle}</p>
          )}
        </div>

        <div className="space-y-3 mb-6">
          {step.type === "single" || step.type === "multiple" ? (
            step.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  (step.type === "multiple" && Array.isArray(localAnswer) && localAnswer.includes(option.value)) ||
                  (step.type === "single" && localAnswer === option.value)
                    ? "border-purple-500 bg-purple-50 shadow-md"
                    : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                }`}
              >
                <span className="text-base md:text-lg font-medium text-gray-700">{option.label}</span>
              </button>
            ))
          ) : step.type === "email" ? (
            <input
              type="email"
              value={localAnswer}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="seu@email.com"
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-base md:text-lg"
            />
          ) : null}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          {canGoBack && (
            <button
              onClick={onBack}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          )}

          {(step.type === "multiple" || step.type === "email") && (
            <button
              onClick={handleSubmit}
              disabled={!localAnswer || (Array.isArray(localAnswer) && localAnswer.length === 0)}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                !localAnswer || (Array.isArray(localAnswer) && localAnswer.length === 0)
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
              }`}
            >
              {isLastStep ? "Ver Resultado" : "Continuar"}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Funnel2Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    quizResultId: null,
    answers: {}
  });

  const totalSteps = quizSteps.length;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    const initializeQuizSession = async () => {
      const savedStateJSON = localStorage.getItem('funnel2_quiz_state');
      if (savedStateJSON) {
        try {
          const savedState = JSON.parse(savedStateJSON);
          if (savedState && savedState.step) {
            console.log("Sessão anterior encontrada. Restaurando progresso.", savedState);
            setFormData(savedState.data || { answers: {} });
            setCurrentStep(savedState.step);
            return;
          }
        } catch (e) {
          console.warn("Erro ao parsear estado salvo do quiz, iniciando nova sessão.", e);
          localStorage.removeItem('funnel2_quiz_state');
        }
      }

      try {
        console.log('🚀 Creating new quiz session...');
        const currentUrl = new URL(window.location.href);
        const utmSource = currentUrl.searchParams.get('utm_source') || 'direct';
        const utmMedium = currentUrl.searchParams.get('utm_medium') || 'organic';
        const utmCampaign = currentUrl.searchParams.get('utm_campaign') || 'none';
        const src = currentUrl.searchParams.get('src') || '';

        const newQuizResult = await HybridQuizResult.create({
          funnel_type: 'funnel-2',
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

  useEffect(() => {
    if (currentStep <= totalSteps) {
      const stateToSave = {
        step: currentStep,
        data: formData
      };
      localStorage.setItem('funnel2_quiz_state', JSON.stringify(stateToSave));
    }
  }, [currentStep, formData]);

  useEffect(() => {
    trackStepView('funnel-2', `step_${currentStep}`);
  }, [currentStep]);

  const handleAnswer = async (key, value) => {
    const updatedAnswers = { ...formData.answers, [key]: value };
    setFormData(prev => ({ ...prev, answers: updatedAnswers }));

    if (formData.quizResultId && formData.quizResultId !== 'offline-mode') {
      try {
        await HybridQuizResult.update(formData.quizResultId, {
          quiz_data: updatedAnswers,
          current_step: currentStep
        });
      } catch (error) {
        console.error('Failed to update quiz result:', error);
      }
    }

    if (key === "email") {
      try {
        if (formData.quizResultId && formData.quizResultId !== 'offline-mode') {
          await HybridQuizResult.update(formData.quizResultId, {
            email: value,
            completed_at: new Date().toISOString()
          });
        }
        localStorage.removeItem('funnel2_quiz_state');
        alert('Obrigado! Seu Soulmate Map será enviado para ' + value);
      } catch (error) {
        console.error('Failed to save email:', error);
      }
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentStepData = quizSteps[currentStep - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-purple-200/40"><Stars className="w-6 h-6 animate-pulse" /></div>
        <div className="absolute top-32 right-16 text-purple-200/40"><Moon className="w-8 h-8 animate-pulse" style={{ animationDelay: '1s' }} /></div>
        <div className="absolute bottom-20 left-20 text-purple-200/40"><Heart className="w-7 h-7 animate-pulse" style={{ animationDelay: '2s' }} /></div>
        <div className="absolute bottom-32 right-12 text-purple-200/40"><Sparkles className="w-5 h-5 animate-pulse" style={{ animationDelay: '0.5s' }} /></div>
      </div>

      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg md:text-xl font-bold text-gray-800">Soulmate Map Quiz</h1>
            <span className="text-sm font-medium text-purple-600">
              {Math.round(progress)}% completo
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <span>Pergunta {currentStep} de {totalSteps}</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-purple-400 to-purple-600 h-2"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      <div className="pt-32 pb-12 px-4">
        <StepTracker currentStep={currentStep} quizResultId={formData.quizResultId} />
        <AnimatePresence mode="wait">
          <QuizStep
            key={currentStep}
            step={currentStepData}
            answer={formData.answers[currentStepData.key]}
            onAnswer={handleAnswer}
            onNext={nextStep}
            onBack={prevStep}
            canGoBack={currentStep > 1}
            isLastStep={currentStep === totalSteps}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

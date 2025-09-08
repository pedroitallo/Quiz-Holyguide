import React, { useState, useEffect } from 'react';

const LoadingRevelation = ({ userName, birthDate, quizResultId, onContinue }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showContinueButton, setShowContinueButton] = useState(false);

  const steps = [
    "Analisando sua energia espiritual...",
    "Conectando com o universo...",
    "Interpretando os sinais cósmicos...",
    "Revelando seu destino..."
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setShowContinueButton(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentStep, steps.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <div className="mb-8">
            <img
              src="https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/public/68850befb229de9dd8e4dc73/7f64f63b1_CapturadeTela2025-09-07as232549.png"
              alt="Master Aura"
              className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white/20"
            />
            <h2 className="text-2xl font-bold text-white mb-2">Master Aura</h2>
          </div>

          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
            <p className="text-white/90 text-lg">
              {steps[currentStep]}
            </p>
          </div>

          {showContinueButton && (
            <button
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
            >
              Ver Revelação
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingRevelation;
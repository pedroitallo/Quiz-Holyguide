import React, { useState, useEffect } from "react";
import { HybridQuizResult } from '@/entities/HybridQuizResult';
import { trackStepView } from '../utils/stepTracking';
import PaywallStep from "../components/quiz/funnel-1/PaywallStep";

export default function PaywallSmsPage() {
  const [quizResultId, setQuizResultId] = useState(null);

  useEffect(() => {
    const initQuiz = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const birthDate = urlParams.get('birth_date') || '';
        const userName = urlParams.get('name') || '';

        const quizResult = new HybridQuizResult({
          birth_date: birthDate,
          user_name: userName,
          funnel: 'paywall-sms'
        });

        await quizResult.save();
        setQuizResultId(quizResult.id);

        await trackStepView('paywall-sms', 'paywall', quizResult.id);
      } catch (error) {
        console.error('Error initializing paywall:', error);
      }
    };

    initQuiz();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <PaywallStep
          userName=""
          birthDate=""
          quizResultId={quizResultId}
        />
      </div>
    </div>
  );
}

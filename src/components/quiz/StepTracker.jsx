import { useEffect } from 'react';
import { HybridQuizResult } from '@/entities/HybridQuizResult';

export default function StepTracker({ currentStep, quizResultId }) {
    useEffect(() => {
        const trackStep = async () => {
            if (!quizResultId || quizResultId === 'offline-mode' || quizResultId === 'admin-mode' || quizResultId === 'bot-mode') {
                console.log(`Step ${currentStep} viewed (no tracking - invalid ID)`);
                return;
            }

            try {
                await HybridQuizResult.update(quizResultId, { 
                    current_step: currentStep,
                    last_step_viewed: currentStep,
                    updated_at: new Date().toISOString()
                });
                console.log(`Step ${currentStep} tracked successfully in hybrid storage`);
            } catch (error) {
                console.warn(`Failed to track step ${currentStep}:`, error);
            }
        };

        if (currentStep && quizResultId) {
            trackStep();
        }
    }, [currentStep, quizResultId]);

    return null; // Componente invisível
}
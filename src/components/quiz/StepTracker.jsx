import { useEffect } from 'react';
import { HybridQuizResult } from '@/entities/HybridQuizResult';

// Mapping between step numbers and their corresponding database columns
const STEP_TRACKING_MAP = {
    1: 'video_step_viewed',
    2: 'testimonials_step_viewed', 
    3: 'name_collection_step_viewed',
    4: 'birth_data_collection_step_viewed',
    5: 'love_situation_step_viewed',
    6: 'palm_reading_results_step_viewed',
    7: 'loading_revelation_step_viewed',
    8: 'paywall_step_viewed'
    // Note: No step 9 (ThankYouStep) tracking as requested
};

export default function StepTracker({ currentStep, quizResultId }) {
    useEffect(() => {
        const trackStep = async () => {
            if (!quizResultId || quizResultId === 'offline-mode' || quizResultId === 'admin-mode' || quizResultId === 'bot-mode') {
                console.log(`Step ${currentStep} viewed (no tracking - invalid ID)`);
                return;
            }

            // Prepare update data with step tracking
            const updateData = {
                current_step: currentStep,
                last_step_viewed: currentStep,
                updated_at: new Date().toISOString()
            };

            // Add step-specific tracking column if it exists in our mapping
            const stepTrackingColumn = STEP_TRACKING_MAP[currentStep];
            if (stepTrackingColumn) {
                updateData[stepTrackingColumn] = true;
            }

            try {
                // Use Promise.resolve to make this truly non-blocking
                Promise.resolve().then(async () => {
                    try {
                        await HybridQuizResult.update(quizResultId, updateData);
                        console.log(`Step ${currentStep} tracked successfully in hybrid storage${stepTrackingColumn ? ` (${stepTrackingColumn}: true)` : ''}`);
                    } catch (error) {
                        console.warn(`Failed to track step ${currentStep}:`, error);
                    }
                });
            } catch (error) {
                console.warn(`Failed to initiate step ${currentStep} tracking:`, error);
            }
        };

        if (currentStep && quizResultId) {
            trackStep();
        }
    }, [currentStep, quizResultId]);

    return null; // Componente invisível
}
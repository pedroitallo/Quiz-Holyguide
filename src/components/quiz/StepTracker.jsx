import { useEffect } from 'react';
import { HybridQuizResult } from '@/entities/HybridQuizResult';

// Mapping between step numbers and their corresponding database columns
const STEP_TRACKING_MAP = {
    1: 'video_step_viewed',
    2: 'testimonials_step_viewed', 
    3: 'name_collection_step_viewed', // Combined name + birth data
    4: 'love_situation_step_viewed',
    5: 'palm_reading_results_step_viewed',
    6: 'loading_revelation_step_viewed'
};

export default function StepTracker({ currentStep, quizResultId }) {
    useEffect(() => {
        const trackStep = async () => {
            console.log('🎯 StepTracker called:', { currentStep, quizResultId })
            
            if (!quizResultId || quizResultId === 'offline-mode' || quizResultId === 'admin-mode' || quizResultId === 'bot-mode') {
                console.warn(`⚠️ Step ${currentStep} viewed (no tracking - invalid ID: ${quizResultId})`);
                return;
            }

            console.log(`🔄 Tracking step ${currentStep} for quiz result: ${quizResultId}`);

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
                console.log(`📊 Adding step tracking: ${stepTrackingColumn} = true`);
            }

            console.log('📤 Sending update data:', updateData);

            try {
                // Make this synchronous and immediate for better reliability
                await HybridQuizResult.update(quizResultId, updateData);
                console.log(`✅ Step ${currentStep} tracked successfully${stepTrackingColumn ? ` (${stepTrackingColumn}: true)` : ''}`);
            } catch (error) {
                console.error(`❌ Failed to track step ${currentStep}:`, error.message, error);
                console.error('🔍 Step tracking error stack:', error.stack);
            }
        };

        if (currentStep && quizResultId) {
            console.log('🚀 Initiating step tracking...');
            trackStep();
        }
    }, [currentStep, quizResultId]);

    return null; // Componente invisível
}
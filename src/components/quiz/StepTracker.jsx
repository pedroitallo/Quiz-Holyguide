import { useEffect } from 'react';
import { QuizResult } from '@/api/entities';
import { User } from '@/api/entities';

export default function StepTracker({ quizResultId, stepName }) {
    useEffect(() => {
        const stepFieldMapping = {
            'video': 'video_step_viewed',
            'name': 'name_step_viewed',
            'birth': 'birth_step_viewed',
            'love': 'love_step_viewed',
            'palm': 'palm_step_viewed',
            'revelation': 'revelation_step_viewed',
            'testimonials': 'testimonials_step_viewed',
            'paywall': 'paywall_step_viewed'
        };
        
        const fieldName = stepFieldMapping[stepName];

        const trackStepView = async () => {
            // Verificar se é admin antes de rastrear
            try {
                const user = await User.me();
                if (user && user.role === 'admin') {
                    console.log('Admin detectado - não rastreando visualização da etapa:', stepName);
                    return;
                }
            } catch (error) {
                // User não logado, continuar com o rastreamento normal
            }

            if (quizResultId && 
                quizResultId !== 'offline-mode' && 
                quizResultId !== 'admin-mode' && 
                quizResultId !== 'bot-mode' && 
                fieldName) {
                
                try {
                    // Verificar se o registro ainda existe antes de atualizar
                    const existingRecord = await QuizResult.get(quizResultId);
                    if (existingRecord) {
                        await QuizResult.update(quizResultId, { [fieldName]: true });
                    } else {
                        console.warn("Registro não encontrado para rastrear visualização");
                    }
                } catch (error) {
                    console.warn("Erro ao rastrear visualização da etapa:", error);
                }
            }
        };

        if (fieldName) {
            trackStepView();
        }
    }, [quizResultId, stepName]);

    return null; // Componente invisível
}
import { useEffect } from 'react';

export default function StepTracker({ stepName }) {
    useEffect(() => {
        console.log(`Step viewed: ${stepName}`);
    }, [stepName]);

    return null; // Componente invisível
}
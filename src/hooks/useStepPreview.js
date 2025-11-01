import { useState, useCallback, useEffect } from 'react';
import { getFunnelSteps } from '../config/funnelStepsMapping';

export function useStepPreview(funnelSlug) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const steps = getFunnelSteps(funnelSlug);

  const openPreview = useCallback((stepIndex = 0) => {
    setCurrentStepIndex(stepIndex);
    setIsOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setIsOpen(false);
  }, []);

  const goToNextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentStepIndex, steps.length]);

  const goToPreviousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const goToStep = useCallback((stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStepIndex(stepIndex);
    }
  }, [steps.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          closePreview();
          break;
        case 'ArrowLeft':
          goToPreviousStep();
          break;
        case 'ArrowRight':
          goToNextStep();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closePreview, goToPreviousStep, goToNextStep]);

  return {
    isOpen,
    currentStepIndex,
    currentStep: steps[currentStepIndex],
    steps,
    totalSteps: steps.length,
    openPreview,
    closePreview,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    hasNextStep: currentStepIndex < steps.length - 1,
    hasPreviousStep: currentStepIndex > 0
  };
}

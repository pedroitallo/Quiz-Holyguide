import { useState, useEffect } from 'react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { FUNNEL_STEPS_MAP, getMockPropsForStep } from '../../config/funnelStepsMapping';

export default function StepPreviewModal({ isOpen, onClose, funnelSlug, initialStepIndex = 0 }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);
  const [error, setError] = useState(null);

  const funnelId = funnelSlug?.replace(/^\//, '') || '';
  const steps = FUNNEL_STEPS_MAP[funnelId] || [];
  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    setCurrentStepIndex(initialStepIndex);
    setError(null);
  }, [initialStepIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && currentStepIndex > 0) {
        setCurrentStepIndex(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex, steps.length, onClose]);

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setError(null);
    }
  };

  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setError(null);
    }
  };

  const renderStepPreview = () => {
    if (!currentStep) {
      return (
        <div className="flex flex-col items-center justify-center h-full py-20">
          <Eye className="w-16 h-16 text-slate-300 mb-4" />
          <p className="text-slate-600 text-lg">Etapa não encontrada</p>
        </div>
      );
    }

    try {
      const StepComponent = currentStep.component;
      if (!StepComponent) {
        throw new Error('Componente não disponível');
      }

      const mockProps = getMockPropsForStep(funnelId, currentStep.id);

      return (
        <div className="w-full h-full overflow-y-auto">
          <div className="min-h-full bg-[#f9f5ff] p-4">
            <div className="max-w-lg mx-auto">
              <StepComponent {...mockProps} />
            </div>
          </div>
        </div>
      );
    } catch (err) {
      console.error('Error rendering step preview:', err);
      setError(err.message);
      return (
        <div className="flex flex-col items-center justify-center h-full py-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <p className="text-red-700 font-medium mb-2">Erro ao carregar preview</p>
            <p className="text-sm text-red-600">{err.message}</p>
          </div>
        </div>
      );
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative z-[101] w-full max-w-5xl h-[90vh] mx-4 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-4 flex-1">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousStep}
                disabled={currentStepIndex === 0}
                className="gap-2"
              >
                <ChevronLeft size={16} />
                Anterior
              </Button>

              <div className="flex-1 text-center">
                <h3 className="text-lg font-semibold text-slate-900">
                  {currentStep?.name || 'Preview'}
                </h3>
                <p className="text-sm text-slate-600">
                  Etapa {currentStepIndex + 1} de {steps.length}
                  {currentStep?.description && ` - ${currentStep.description}`}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextStep}
                disabled={currentStepIndex === steps.length - 1}
                className="gap-2"
              >
                Próxima
                <ChevronRight size={16} />
              </Button>
            </div>

            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-slate-200 rounded-lg transition-colors"
              aria-label="Fechar preview"
            >
              <X size={20} className="text-slate-600" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-1 px-6 py-2 bg-slate-100 border-b border-slate-200">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentStepIndex(index);
                  setError(null);
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentStepIndex
                    ? 'w-8 bg-purple-600'
                    : index < currentStepIndex
                    ? 'w-2 bg-purple-300'
                    : 'w-2 bg-slate-300'
                }`}
                title={step.name}
              />
            ))}
          </div>

          <div className="flex-1 overflow-hidden relative">
            <div className="absolute inset-0 overflow-y-auto">
              {renderStepPreview()}
            </div>
          </div>

          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span>Funil: <strong>{funnelId}</strong></span>
                <span>Step ID: <strong>{currentStep?.id}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs">ESC</kbd>
                <span>para fechar</span>
                <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs ml-2">←</kbd>
                <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs">→</kbd>
                <span>para navegar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

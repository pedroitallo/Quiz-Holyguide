import React, { useRef, useState } from 'react';
import { FUNNEL_STEPS_MAP, getMockPropsForStep } from '@/config/funnelStepsMapping';

export default function CentralPreview({
  funnel,
  step,
  onElementSelect,
  selectedElement
}) {
  const previewRef = useRef(null);
  const [mockFormData] = useState({
    name: 'Preview User',
    userName: 'Preview User',
    birth_date: '1990-01-01',
    birthDate: '1990-01-01',
    birth_time: '12:00',
    zodiac_sign: 'Capricorn',
    zodiacSign: 'Capricorn',
    love_situation: 'single',
    quizResultId: 'preview-mode'
  });

  if (!step || !funnel) {
    return (
      <div className="flex-1 bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Selecione uma etapa para visualizar</p>
      </div>
    );
  }

  const funnelSteps = FUNNEL_STEPS_MAP[funnel.slug] || [];

  const stepIndex = (step.step_order || 1) - 1;
  const stepComponent = funnelSteps[stepIndex];

  if (!stepComponent) {
    return (
      <div className="flex-1 bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 font-medium mb-2">Componente não encontrado</p>
          <p className="text-sm text-slate-500">
            Etapa: {step.step_name} (ordem: {step.step_order})
          </p>
          <p className="text-sm text-slate-500">
            Componente: {step.component_name}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Funil: {funnel.slug} ({funnelSteps.length} etapas mapeadas)
          </p>
        </div>
      </div>
    );
  }

  const StepComponent = stepComponent.component;

  const mockHandlers = {
    onContinue: () => console.log('Preview: Continue clicked'),
    onSubmit: (data) => console.log('Preview: Submit', data),
    onNameSubmit: (name) => console.log('Preview: Name submitted', name),
    onSelect: (value) => console.log('Preview: Selected', value),
    onComplete: () => console.log('Preview: Completed'),
    onBirthDataSubmit: (data) => console.log('Preview: Birth data', data)
  };

  const componentProps = {
    ...mockFormData,
    ...mockHandlers
  };

  return (
    <div className="flex-1 bg-slate-100 overflow-auto">
      <div className="min-h-full flex items-start justify-center p-8">
        <div
          ref={previewRef}
          className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden"
          style={{
            transform: 'scale(0.9)',
            transformOrigin: 'top center'
          }}
        >
          <div className="relative">
            <div className="absolute top-2 right-2 z-50">
              <div className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                Preview Mode
              </div>
            </div>

            <div className="pointer-events-none">
              <StepComponent {...componentProps} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

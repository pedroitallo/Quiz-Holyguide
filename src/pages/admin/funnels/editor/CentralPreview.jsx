import React, { useRef, useEffect } from 'react';
import { VisualEditorProvider } from '@/contexts/VisualEditorContext';
import EditableElement from '@/components/editor/EditableElement';

export default function CentralPreview({
  funnel,
  step,
  onElementSelect,
  selectedElement
}) {
  const previewRef = useRef(null);

  if (!step || !funnel) {
    return (
      <div className="flex-1 bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Selecione uma etapa para visualizar</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-100 overflow-auto">
      <div className="min-h-full flex items-start justify-center p-8">
        <div
          ref={previewRef}
          className="w-full max-w-md bg-white rounded-lg shadow-xl min-h-[600px]"
          style={{
            transform: 'scale(0.9)',
            transformOrigin: 'top center'
          }}
        >
          {/* Preview Content */}
          <div className="p-6">
            <div className="mb-6">
              <EditableElement
                elementId={`step-${step.id}-title`}
                elementType="text"
                isEditorMode={true}
                onSelect={onElementSelect}
                isSelected={selectedElement?.elementId === `step-${step.id}-title`}
                config={null}
                defaultContent={{ text: step.step_name || 'Título da Etapa' }}
                defaultStyles={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  textAlign: 'center'
                }}
              >
                {(content, styles) => (
                  <h2 style={styles}>{content.text}</h2>
                )}
              </EditableElement>
            </div>

            <div className="space-y-4">
              <EditableElement
                elementId={`step-${step.id}-description`}
                elementType="text"
                isEditorMode={true}
                onSelect={onElementSelect}
                isSelected={selectedElement?.elementId === `step-${step.id}-description`}
                config={null}
                defaultContent={{ text: 'Descrição da etapa aqui' }}
                defaultStyles={{
                  fontSize: '1rem',
                  color: '#6b7280',
                  textAlign: 'center'
                }}
              >
                {(content, styles) => (
                  <p style={styles}>{content.text}</p>
                )}
              </EditableElement>
            </div>

            <div className="mt-8">
              <EditableElement
                elementId={`step-${step.id}-button`}
                elementType="button"
                isEditorMode={true}
                onSelect={onElementSelect}
                isSelected={selectedElement?.elementId === `step-${step.id}-button`}
                config={null}
                defaultContent={{ text: 'Continuar' }}
                defaultStyles={{
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: '600',
                  padding: '12px 32px',
                  borderRadius: '8px',
                  width: '100%',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {(content, styles) => (
                  <button style={styles}>
                    {content.text}
                  </button>
                )}
              </EditableElement>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

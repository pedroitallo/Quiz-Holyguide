import { Plus, GripVertical, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BuilderSidebar({
  steps,
  selectedStep,
  onSelectStep,
  onAddStep,
  onUpdateStep,
  onDeleteStep
}) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Páginas</h2>
        <Button
          onClick={onAddStep}
          className="w-full"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Página
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {steps.map((step, index) => (
          <StepItem
            key={step.id}
            step={step}
            index={index}
            isSelected={selectedStep?.id === step.id}
            onSelect={() => onSelectStep(step)}
            onUpdate={(updates) => onUpdateStep(step.id, updates)}
            onDelete={() => onDeleteStep(step.id)}
          />
        ))}

        {steps.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            Nenhuma página ainda
          </div>
        )}
      </div>
    </div>
  );
}

function StepItem({ step, index, isSelected, onSelect, onUpdate, onDelete }) {
  const config = step.config || {};
  const elementCount = config.elements?.length || 0;

  return (
    <div
      className={`group relative mb-2 rounded-lg border-2 transition-all cursor-pointer ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
      onClick={onSelect}
    >
      <div className="p-3">
        <div className="flex items-start gap-2">
          <div className="cursor-move text-gray-400">
            <GripVertical className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-500">
                {index + 1}
              </span>
              <input
                type="text"
                value={step.name || ''}
                onChange={(e) => onUpdate({ name: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 text-sm font-medium bg-transparent border-none outline-none focus:ring-0 p-0"
                placeholder="Nome da página"
              />
            </div>

            <div className="text-xs text-gray-500">
              {elementCount} {elementCount === 1 ? 'elemento' : 'elementos'}
            </div>
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 text-gray-400 hover:text-red-600 rounded"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

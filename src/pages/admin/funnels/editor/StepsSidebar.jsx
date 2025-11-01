import React, { useState } from 'react';
import {
  GripVertical,
  Edit2,
  Archive,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StepsSidebar({
  steps,
  currentStepIndex,
  onStepSelect,
  onStepsChange
}) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleRename = (step) => {
    setEditingId(step.id);
    setEditName(step.name);
  };

  const saveRename = (stepId) => {
    const updated = steps.map(s =>
      s.id === stepId ? { ...s, name: editName } : s
    );
    onStepsChange(updated);
    setEditingId(null);
  };

  const handleArchive = (stepId) => {
    if (confirm('Deseja arquivar esta etapa?')) {
      const updated = steps.filter(s => s.id !== stepId);
      onStepsChange(updated);
    }
  };

  const handleDelete = (stepId) => {
    if (confirm('Deseja deletar esta etapa permanentemente?')) {
      const updated = steps.filter(s => s.id !== stepId);
      onStepsChange(updated);
    }
  };

  return (
    <div className="w-64 border-r border-slate-200 bg-white overflow-y-auto">
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-900">
          Etapas ({steps.length})
        </h3>
      </div>

      <div className="p-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`
              group p-3 mb-1 rounded-lg cursor-pointer transition-colors
              ${currentStepIndex === index
                ? 'bg-blue-50 border border-blue-200'
                : 'hover:bg-slate-50 border border-transparent'
              }
            `}
            onClick={() => onStepSelect(index)}
          >
            <div className="flex items-center gap-2">
              <GripVertical
                size={14}
                className="text-slate-400 cursor-move flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                {editingId === step.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => saveRename(step.id)}
                    onKeyPress={(e) => e.key === 'Enter' && saveRename(step.id)}
                    className="w-full px-2 py-1 text-sm border rounded"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div>
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {step.name || `Etapa ${index + 1}`}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {step.slug}
                    </p>
                  </div>
                )}
              </div>

              <div
                className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => handleRename(step)}
                  className="p-1 hover:bg-slate-200 rounded"
                  title="Renomear"
                >
                  <Edit2 size={14} className="text-slate-600" />
                </button>

                <button
                  onClick={() => handleArchive(step.id)}
                  className="p-1 hover:bg-slate-200 rounded"
                  title="Arquivar"
                >
                  <Archive size={14} className="text-slate-600" />
                </button>

                <button
                  onClick={() => handleDelete(step.id)}
                  className="p-1 hover:bg-red-100 rounded"
                  title="Deletar"
                >
                  <Trash2 size={14} className="text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Edit2,
  Archive,
  Trash2,
  Check,
  X,
  Eye,
  MoreVertical
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

export default function DraggableStepCard({
  step,
  index,
  onRename,
  onArchive,
  onDelete,
  onPreview
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(step.step_name);
  const [showMenu, setShowMenu] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const handleSaveRename = async () => {
    if (editedName.trim() && editedName !== step.step_name) {
      const result = await onRename(step.id, editedName.trim());
      if (result.success) {
        setIsEditing(false);
      } else {
        alert('Erro ao renomear: ' + result.error);
      }
    } else {
      setIsEditing(false);
      setEditedName(step.step_name);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedName(step.step_name);
  };

  const handleArchive = async () => {
    if (confirm('Tem certeza que deseja arquivar esta etapa? Ela não aparecerá mais no funil ativo.')) {
      const result = await onArchive(step.id);
      if (!result.success) {
        alert('Erro ao arquivar: ' + result.error);
      }
    }
  };

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja DELETAR permanentemente esta etapa? Esta ação não pode ser desfeita!')) {
      const result = await onDelete(step.id);
      if (!result.success) {
        alert('Erro ao deletar: ' + result.error);
      }
    }
    setShowMenu(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 bg-white rounded-lg border-2 transition-all ${
        isDragging
          ? 'border-blue-400 shadow-lg'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <button
        className="cursor-grab active:cursor-grabbing p-2 hover:bg-slate-100 rounded transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={20} className="text-slate-400" />
      </button>

      <div className="flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold">
        {index + 1}
      </div>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSaveRename();
                if (e.key === 'Escape') handleCancelEdit();
              }}
              className="h-9"
              autoFocus
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSaveRename}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <Check size={16} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancelEdit}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium text-slate-900 truncate">
                {step.step_name}
              </p>
              {step.previous_names && step.previous_names.length > 0 && (
                <span
                  className="text-xs text-slate-500 cursor-help"
                  title={`Nomes anteriores: ${step.previous_names.join(', ')}`}
                >
                  (renomeado)
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 truncate">
              {step.component_name}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!isEditing && (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
              title="Renomear etapa"
            >
              <Edit2 size={16} />
            </Button>

            {onPreview && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onPreview(step)}
                className="text-slate-600 hover:text-purple-600 hover:bg-purple-50"
                title="Visualizar etapa"
              >
                <Eye size={16} />
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={handleArchive}
              className="text-slate-600 hover:text-orange-600 hover:bg-orange-50"
              title="Arquivar etapa"
            >
              <Archive size={16} />
            </Button>

            <div className="relative">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowMenu(!showMenu)}
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                title="Mais opções"
              >
                <MoreVertical size={16} />
              </Button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-20">
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 size={14} />
                      Deletar permanentemente
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

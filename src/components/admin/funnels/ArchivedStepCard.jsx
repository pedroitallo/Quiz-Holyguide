import { ArchiveRestore, Trash2, Eye } from 'lucide-react';
import { Button } from '../../ui/button';

export default function ArchivedStepCard({
  step,
  onRestore,
  onDelete,
  onPreview
}) {
  const handleRestore = async () => {
    if (confirm('Deseja restaurar esta etapa? Ela será adicionada ao final do funil.')) {
      const result = await onRestore(step.id);
      if (!result.success) {
        alert('Erro ao restaurar: ' + result.error);
      }
    }
  };

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja DELETAR permanentemente esta etapa arquivada? Esta ação não pode ser desfeita!')) {
      const result = await onDelete(step.id);
      if (!result.success) {
        alert('Erro ao deletar: ' + result.error);
      }
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-slate-200 rounded-lg border-2 border-slate-300 opacity-60">
      <div className="flex items-center justify-center w-8 h-8 bg-slate-300 text-slate-500 rounded-full">
        <ArchiveRestore size={16} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-slate-600 truncate line-through">
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
        <p className="text-sm text-slate-500 truncate line-through">
          {step.component_name}
        </p>
        <p className="text-xs text-slate-600 font-semibold mt-1">
          ARQUIVADO
        </p>
      </div>

      <div className="flex items-center gap-2">
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
          onClick={handleRestore}
          className="text-slate-600 hover:text-green-600 hover:bg-green-50"
          title="Restaurar etapa"
        >
          <ArchiveRestore size={16} />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={handleDelete}
          className="text-slate-600 hover:text-red-600 hover:bg-red-50"
          title="Deletar permanentemente"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}

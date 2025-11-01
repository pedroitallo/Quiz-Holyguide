import React from 'react';
import { Button } from '../ui/button';
import {
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function EditorToolbar({
  isEditorMode,
  onToggleEditor,
  isSaving,
  lastSaved,
  onPublishAll,
  hasUnpublishedChanges
}) {
  const formatLastSaved = () => {
    if (!lastSaved) return 'Nunca';
    const now = new Date();
    const diff = Math.floor((now - lastSaved) / 1000);

    if (diff < 60) return 'Agora mesmo';
    if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`;
    return lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (!isEditorMode) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggleEditor}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg gap-2 px-6 py-6 rounded-full"
        >
          <Edit3 size={20} />
          Modo Edição
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-6 z-50 bg-white shadow-2xl rounded-lg border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Edit3 size={18} />
            <span className="font-semibold">Editor Visual</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggleEditor}
            className="text-white hover:text-white hover:bg-blue-800"
          >
            <X size={18} />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            {isSaving ? (
              <>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Salvo</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock size={12} />
            {formatLastSaved()}
          </div>
        </div>

        {hasUnpublishedChanges && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800 mb-2 font-medium">
              Você tem alterações não publicadas
            </p>
            <Button
              size="sm"
              onClick={onPublishAll}
              className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              <CheckCircle size={14} />
              Publicar Tudo
            </Button>
          </div>
        )}

        <div className="border-t pt-3 space-y-2">
          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-medium">Como usar:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-500">
              <li>Clique em qualquer elemento</li>
              <li>Edite propriedades no painel</li>
              <li>Mudanças são salvas automaticamente</li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-3">
          <Button
            size="sm"
            variant="outline"
            onClick={onToggleEditor}
            className="w-full gap-2"
          >
            <Eye size={14} />
            Visualizar sem Editor
          </Button>
        </div>
      </div>
    </div>
  );
}

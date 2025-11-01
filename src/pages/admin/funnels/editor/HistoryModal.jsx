import React, { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function HistoryModal({ funnelId, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [funnelId]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('funnel_step_history')
        .select('*')
        .eq('funnel_id', funnelId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAction = (action) => {
    const actions = {
      create: 'Criada',
      reorder: 'Reordenada',
      rename: 'Renomeada',
      archive: 'Arquivada',
      restore: 'Restaurada',
      update_config: 'Configuração atualizada',
      delete: 'Deletada'
    };
    return actions[action] || action;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Histórico de Alterações
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Últimas 50 alterações no funil
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-slate-600">Carregando histórico...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Clock size={48} className="mx-auto mb-4 opacity-20" />
              <p>Nenhuma alteração registrada ainda</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">
                        {formatAction(entry.action_type)}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        Etapa: {entry.step_slug || 'N/A'}
                      </p>
                      {entry.old_value && Object.keys(entry.old_value).length > 0 && (
                        <p className="text-xs text-slate-500 mt-2">
                          <strong>De:</strong> {JSON.stringify(entry.old_value)}
                        </p>
                      )}
                      {entry.new_value && Object.keys(entry.new_value).length > 0 && (
                        <p className="text-xs text-slate-500 mt-1">
                          <strong>Para:</strong> {JSON.stringify(entry.new_value)}
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-slate-500">
                        {formatDate(entry.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200">
          <Button
            onClick={onClose}
            className="w-full"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}

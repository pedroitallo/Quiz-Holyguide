import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { History, Eye, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function SessionHistoryDialog({ selectedFunnel, dateRange }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const tableName = selectedFunnel === 'all'
        ? 'step_views_funnel_1'
        : `step_views_${selectedFunnel.replace('-', '_')}`;

      let query = supabase
        .from(tableName)
        .select('*')
        .order('viewed_at', { ascending: false })
        .limit(100);

      if (dateRange?.from) {
        query = query.gte('viewed_at', dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        query = query.lte('viewed_at', dateRange.to.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Erro ao carregar sessões:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen, selectedFunnel, dateRange]);

  const handleDeleteSession = async (sessionId, id) => {
    setDeleting(id);
    try {
      const tableName = selectedFunnel === 'all'
        ? 'step_views_funnel_1'
        : `step_views_${selectedFunnel.replace('-', '_')}`;

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSessions(sessions.filter(s => s.id !== id));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Erro ao deletar sessão:', error);
      alert('Erro ao deletar sessão. Tente novamente.');
    } finally {
      setDeleting(null);
    }
  };

  const getCompletedSteps = (session) => {
    const steps = [];
    if (session.video) steps.push('Vídeo');
    if (session.testimonials) steps.push('Depoimentos');
    if (session.name) steps.push('Nome');
    if (session.birth) steps.push('Data Nasc.');
    if (session.love_situation) steps.push('Amor');
    if (session.palm_reading) steps.push('Leitura');
    if (session.revelation) steps.push('Revelação');
    if (session.paywall) steps.push('Paywall');
    if (session.sales) steps.push('Sales');
    if (session.thank_you) steps.push('Obrigado');
    if (session.checkout) steps.push('Checkout');
    return steps;
  };

  const getTotalSteps = (session) => {
    if (session.funnel_type === 'funnel-vsl') return 3;
    return 11;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <History className="w-4 h-4" />
          Histórico de Sessões
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Histórico de Sessões</DialogTitle>
          <DialogDescription>
            Visualize e gerencie todas as sessões registradas no período selecionado
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <History className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="text-lg">Nenhuma sessão encontrada</p>
            <p className="text-sm mt-2">Tente selecionar um período diferente</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-slate-600">
                {sessions.length} sessões encontradas
              </p>
              <Button
                onClick={loadSessions}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                Atualizar
              </Button>
            </div>

            {selectedSession ? (
              <Card className="border-2 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Detalhes da Sessão
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        ID: {selectedSession.session_id}
                      </p>
                    </div>
                    <Button
                      onClick={() => setSelectedSession(null)}
                      variant="ghost"
                      size="sm"
                    >
                      Fechar Detalhes
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-600">Data/Hora</p>
                      <p className="font-medium text-sm">
                        {format(new Date(selectedSession.viewed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Funil</p>
                      <p className="font-medium text-sm">{selectedSession.funnel_type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Progresso</p>
                      <p className="font-medium text-sm">
                        {getCompletedSteps(selectedSession).length}/{getTotalSteps(selectedSession)} etapas
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Etapas Completadas:</p>
                    <div className="flex flex-wrap gap-2">
                      {getCompletedSteps(selectedSession).map((step, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                        >
                          {step}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedSession.ab_test_id && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs font-semibold text-blue-900">
                        Teste A/B ID: {selectedSession.ab_test_id}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => {
                  const completedSteps = getCompletedSteps(session);
                  const progress = (completedSteps.length / getTotalSteps(session)) * 100;

                  return (
                    <Card
                      key={session.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-mono text-sm text-slate-700 font-medium">
                                {session.session_id.substring(0, 12)}...
                              </p>
                              <span className="text-xs text-slate-500">
                                {format(new Date(session.viewed_at), "dd/MM/yy HH:mm", { locale: ptBR })}
                              </span>
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                                {session.funnel_type}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="flex-1 max-w-xs">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                                    <div
                                      className="bg-green-600 h-2 rounded-full transition-all"
                                      style={{ width: `${progress}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-medium text-slate-600 min-w-[3rem]">
                                    {completedSteps.length}/{getTotalSteps(session)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => setSelectedSession(session)}
                                  variant="ghost"
                                  size="sm"
                                  className="gap-1"
                                >
                                  <Eye className="w-4 h-4" />
                                  Ver Detalhes
                                </Button>

                                {showDeleteConfirm === session.id ? (
                                  <div className="flex gap-1">
                                    <Button
                                      onClick={() => handleDeleteSession(session.session_id, session.id)}
                                      disabled={deleting === session.id}
                                      variant="destructive"
                                      size="sm"
                                      className="gap-1"
                                    >
                                      {deleting === session.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <AlertTriangle className="w-4 h-4" />
                                      )}
                                      Confirmar
                                    </Button>
                                    <Button
                                      onClick={() => setShowDeleteConfirm(null)}
                                      variant="outline"
                                      size="sm"
                                    >
                                      Cancelar
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    onClick={() => setShowDeleteConfirm(session.id)}
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Deletar
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import DraggableStepCard from '../../../components/admin/funnels/DraggableStepCard';
import ArchivedStepCard from '../../../components/admin/funnels/ArchivedStepCard';
import {
  Save,
  ArrowLeft,
  X,
  Plus,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  History,
  Archive as ArchiveIcon
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useFunnelSteps } from '../../../hooks/useFunnelSteps';

export default function FunnelEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [funnel, setFunnel] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [showArchivedSection, setShowArchivedSection] = useState(false);
  const [showHistorySection, setShowHistorySection] = useState(false);

  const {
    steps,
    archivedSteps,
    history,
    loadSteps,
    loadHistory,
    reorderSteps,
    renameStep,
    archiveStep,
    restoreStep,
    deleteStep
  } = useFunnelSteps(id);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (id) {
      loadFunnel();
      loadSteps();
    }
  }, [id, loadSteps]);

  const loadFunnel = async () => {
    try {
      setLoading(true);

      const { data: funnelData, error: funnelError } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (funnelError) throw funnelError;
      setFunnel(funnelData);
    } catch (error) {
      console.error('Error loading funnel:', error);
      alert('Erro ao carregar quiz: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = steps.findIndex((step) => step.id === active.id);
      const newIndex = steps.findIndex((step) => step.id === over.id);

      const newSteps = arrayMove(steps, oldIndex, newIndex);
      const result = await reorderSteps(newSteps);

      if (!result.success) {
        alert('Erro ao reordenar etapas: ' + result.error);
        await loadSteps();
      }
    }
  };

  const handleSave = async () => {
    if (!funnel.name || !funnel.slug) {
      alert('Nome e slug são obrigatórios');
      return;
    }

    setSaving(true);
    try {
      const { error: funnelError } = await supabase
        .from('funnels')
        .update({
          name: funnel.name,
          slug: funnel.slug,
          description: funnel.description,
          status: funnel.status,
          tags: funnel.tags
        })
        .eq('id', id);

      if (funnelError) throw funnelError;

      alert('Quiz salvo com sucesso!');
    } catch (error) {
      console.error('Error saving funnel:', error);
      alert('Erro ao salvar quiz: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (newTag && !funnel.tags.includes(newTag)) {
      setFunnel({
        ...funnel,
        tags: [...funnel.tags, newTag]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFunnel({
      ...funnel,
      tags: funnel.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleLoadHistory = () => {
    setShowHistorySection(!showHistorySection);
    if (!showHistorySection && history.length === 0) {
      loadHistory();
    }
  };

  const formatHistoryAction = (action) => {
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

  const formatHistoryDate = (date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminLayout breadcrumbs={['Quizzes', 'Editor']}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando editor...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!funnel) {
    return (
      <AdminLayout breadcrumbs={['Quizzes', 'Editor']}>
        <div className="text-center py-12">
          <p className="text-slate-600">Quiz não encontrado</p>
          <Button onClick={() => navigate('/admin/funnels')} className="mt-4">
            Voltar para Quizzes
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout breadcrumbs={['Quizzes', funnel.name]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/funnels')}
            >
              <ArrowLeft size={16} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Editar Quiz
              </h1>
              <p className="text-slate-600 mt-1">
                Gerencie informações e etapas do quiz
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href={`/${funnel.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="gap-2">
                <ExternalLink size={16} />
                Visualizar
              </Button>
            </a>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-2"
            >
              <Save size={16} />
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome do Quiz
                </label>
                <Input
                  value={funnel.name}
                  onChange={(e) => setFunnel({ ...funnel, name: e.target.value })}
                  placeholder="Ex: Quiz de Tarot Místico"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Slug (URL)
                </label>
                <Input
                  value={funnel.slug}
                  onChange={(e) => setFunnel({ ...funnel, slug: e.target.value })}
                  placeholder="Ex: funnel-tarot"
                />
                <p className="text-xs text-slate-500 mt-1">
                  URL: /{funnel.slug}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descrição
                </label>
                <Textarea
                  value={funnel.description}
                  onChange={(e) => setFunnel({ ...funnel, description: e.target.value })}
                  placeholder="Descreva o objetivo deste quiz..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <select
                  value={funnel.status}
                  onChange={(e) => setFunnel({ ...funnel, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Rascunho</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Adicionar tag..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button onClick={handleAddTag} size="sm">
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {funnel.tags && funnel.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blue-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Etapas do Quiz ({steps.length} ativas)</CardTitle>
                <div className="flex gap-2">
                  {archivedSteps.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowArchivedSection(!showArchivedSection)}
                      className="gap-2"
                    >
                      <ArchiveIcon size={14} />
                      Arquivadas ({archivedSteps.length})
                      {showArchivedSection ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleLoadHistory}
                    className="gap-2"
                  >
                    <History size={14} />
                    Histórico
                    {showHistorySection ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {steps.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p>Nenhuma etapa configurada</p>
                  <p className="text-sm mt-2">
                    As etapas serão criadas automaticamente pela IA do Bolt
                  </p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={steps.map(s => s.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {steps.map((step, index) => (
                        <DraggableStepCard
                          key={step.id}
                          step={step}
                          index={index}
                          onRename={renameStep}
                          onArchive={archiveStep}
                          onDelete={deleteStep}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}

              {showArchivedSection && archivedSteps.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <ArchiveIcon size={16} />
                    Etapas Arquivadas
                  </h3>
                  <div className="space-y-3">
                    {archivedSteps.map((step) => (
                      <ArchivedStepCard
                        key={step.id}
                        step={step}
                        onRestore={restoreStep}
                        onDelete={deleteStep}
                      />
                    ))}
                  </div>
                </div>
              )}

              {showHistorySection && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <History size={16} />
                    Histórico de Alterações
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {history.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-4">
                        Nenhuma alteração registrada
                      </p>
                    ) : (
                      history.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg text-sm"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">
                              {formatHistoryAction(entry.action_type)}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {formatHistoryDate(entry.created_at)}
                            </p>
                            {entry.old_value && Object.keys(entry.old_value).length > 0 && (
                              <p className="text-xs text-slate-600 mt-1">
                                De: {JSON.stringify(entry.old_value)}
                              </p>
                            )}
                            {entry.new_value && Object.keys(entry.new_value).length > 0 && (
                              <p className="text-xs text-slate-600">
                                Para: {JSON.stringify(entry.new_value)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

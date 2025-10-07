import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import {
  Save,
  ArrowLeft,
  GripVertical,
  Trash2,
  X,
  Plus,
  ExternalLink
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export default function FunnelEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [funnel, setFunnel] = useState(null);
  const [steps, setSteps] = useState([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (id) {
      loadFunnel();
    }
  }, [id]);

  const loadFunnel = async () => {
    try {
      setLoading(true);

      const { data: funnelData, error: funnelError } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', id)
        .single();

      if (funnelError) throw funnelError;

      const { data: stepsData, error: stepsError } = await supabase
        .from('funnel_steps')
        .select('*')
        .eq('funnel_id', id)
        .order('step_order');

      if (stepsError) throw stepsError;

      setFunnel(funnelData);
      setSteps(stepsData || []);
    } catch (error) {
      console.error('Error loading funnel:', error);
      alert('Erro ao carregar quiz: ' + error.message);
    } finally {
      setLoading(false);
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

      await supabase
        .from('funnel_steps')
        .delete()
        .eq('funnel_id', id);

      if (steps.length > 0) {
        const stepsToInsert = steps.map((step, index) => ({
          funnel_id: id,
          step_order: index + 1,
          step_name: step.step_name,
          component_name: step.component_name,
          config: step.config || {}
        }));

        const { error: stepsError } = await supabase
          .from('funnel_steps')
          .insert(stepsToInsert);

        if (stepsError) throw stepsError;
      }

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

  const moveStep = (index, direction) => {
    const newSteps = [...steps];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < steps.length) {
      [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
      setSteps(newSteps);
    }
  };

  const removeStep = (index) => {
    if (confirm('Tem certeza que deseja remover esta etapa?')) {
      setSteps(steps.filter((_, i) => i !== index));
    }
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
              <CardTitle>Etapas do Quiz</CardTitle>
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
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveStep(index, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <GripVertical size={16} className="text-slate-400" />
                        </button>
                        <button
                          onClick={() => moveStep(index, 'down')}
                          disabled={index === steps.length - 1}
                          className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <GripVertical size={16} className="text-slate-400" />
                        </button>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-slate-500">
                            #{index + 1}
                          </span>
                          <p className="font-medium text-slate-900 truncate">
                            {step.step_name}
                          </p>
                        </div>
                        <p className="text-sm text-slate-600 truncate">
                          {step.component_name}
                        </p>
                      </div>

                      <button
                        onClick={() => removeStep(index)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

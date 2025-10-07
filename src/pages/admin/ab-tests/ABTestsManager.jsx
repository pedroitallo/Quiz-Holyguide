import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import ABTestDialog from '../../../components/analytics/ABTestDialog';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { FlaskConical, Trophy, Clock, Archive, Play, Pause, Copy, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export default function ABTestsManager() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    loadTests();
  }, [filter]);

  const loadTests = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('ab_tests')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTests(data || []);
    } catch (error) {
      console.error('Error loading tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSignificance = (variantA, variantB) => {
    return 0;
  };

  const handlePauseTest = async (id) => {
    const { error } = await supabase
      .from('ab_tests')
      .update({ status: 'paused' })
      .eq('id', id);

    if (!error) {
      loadTests();
    }
  };

  const handleResumeTest = async (id) => {
    const { error } = await supabase
      .from('ab_tests')
      .update({ status: 'active' })
      .eq('id', id);

    if (!error) {
      loadTests();
    }
  };

  const handleDeclareWinner = async (id, winner) => {
    const confirmed = confirm(`Declarar ${winner} como vencedor e encerrar o teste?`);
    if (!confirmed) return;

    const { error } = await supabase
      .from('ab_tests')
      .update({
        status: 'completed',
        winner_variant: winner,
        end_date: new Date().toISOString()
      })
      .eq('id', id);

    if (!error) {
      alert('Teste finalizado com sucesso!');
      loadTests();
    }
  };

  const handleDeleteTest = async (id, name) => {
    const confirmed = confirm(`Tem certeza que deseja deletar o teste "${name}"?`);
    if (!confirmed) return;

    const { error } = await supabase
      .from('ab_tests')
      .delete()
      .eq('id', id);

    if (!error) {
      alert('Teste deletado com sucesso!');
      loadTests();
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Ativo' },
      paused: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pausado' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Concluído' }
    };

    const badge = badges[status] || badges.active;

    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout breadcrumbs={['Testes A/B']}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando testes...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout breadcrumbs={['Testes A/B']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gestão de Testes A/B</h1>
            <p className="text-slate-600 mt-1">
              Crie e gerencie testes A/B para otimizar conversão
            </p>
          </div>
          <ABTestDialog onTestChange={loadTests} />
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={filter === 'active' ? 'default' : 'outline'}
                onClick={() => setFilter('active')}
                size="sm"
              >
                Ativos
              </Button>
              <Button
                variant={filter === 'paused' ? 'default' : 'outline'}
                onClick={() => setFilter('paused')}
                size="sm"
              >
                Pausados
              </Button>
              <Button
                variant={filter === 'completed' ? 'default' : 'outline'}
                onClick={() => setFilter('completed')}
                size="sm"
              >
                Concluídos
              </Button>
            </div>
          </CardContent>
        </Card>

        {tests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FlaskConical size={48} className="text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Nenhum teste encontrado
              </h3>
              <p className="text-slate-600 mb-6">
                {filter === 'all'
                  ? 'Crie seu primeiro teste A/B para começar a otimizar suas conversões'
                  : `Nenhum teste ${filter === 'active' ? 'ativo' : filter === 'paused' ? 'pausado' : 'concluído'} no momento`}
              </p>
              <ABTestDialog onTestChange={loadTests} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {tests.map((test) => (
              <Card key={test.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle>{test.name}</CardTitle>
                        {getStatusBadge(test.status)}
                        {test.winner_variant && (
                          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            <Trophy size={14} />
                            Vencedor: {test.winner_variant.toUpperCase()}
                          </span>
                        )}
                      </div>
                      {test.hypothesis && (
                        <p className="text-sm text-slate-600 mb-1">
                          <span className="font-medium">Hipótese:</span> {test.hypothesis}
                        </p>
                      )}
                      {test.notes && (
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Notas:</span> {test.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-slate-400" />
                        <span className="text-slate-600">
                          Início: {new Date(test.start_date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      {test.end_date && (
                        <div className="flex items-center gap-2">
                          <Archive size={16} className="text-slate-400" />
                          <span className="text-slate-600">
                            Fim: {new Date(test.end_date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      )}
                      {test.sample_size_target && (
                        <div className="text-slate-600">
                          Meta de amostra: {test.sample_size_target} sessões
                        </div>
                      )}
                    </div>

                    {test.tags && test.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {test.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                      {test.status === 'active' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePauseTest(test.id)}
                            className="gap-2"
                          >
                            <Pause size={16} />
                            Pausar
                          </Button>
                          <Link to={`/admin/analytics?ab_test=${test.id}`}>
                            <Button size="sm" variant="outline" className="gap-2">
                              <FlaskConical size={16} />
                              Ver Resultados
                            </Button>
                          </Link>
                        </>
                      )}

                      {test.status === 'paused' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResumeTest(test.id)}
                          className="gap-2"
                        >
                          <Play size={16} />
                          Retomar
                        </Button>
                      )}

                      {test.status !== 'completed' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeclareWinner(test.id, 'variant_a')}
                            className="gap-2"
                          >
                            <Trophy size={16} />
                            Declarar Vencedor A
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeclareWinner(test.id, 'variant_b')}
                            className="gap-2"
                          >
                            <Trophy size={16} />
                            Declarar Vencedor B
                          </Button>
                        </>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTest(test.id, test.name)}
                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Deletar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

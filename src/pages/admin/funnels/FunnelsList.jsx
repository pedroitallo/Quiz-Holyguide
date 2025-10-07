import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import EmptyState from '../../../components/admin/ui/EmptyState';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent } from '../../../components/ui/card';
import {
  Layers,
  Search,
  Edit,
  Copy,
  ExternalLink,
  Trash2,
  Plus,
  Eye
} from 'lucide-react';
import { useFunnels } from '../../../hooks/admin/useFunnels';

export default function FunnelsList() {
  const { funnels, loading, deleteFunnel, duplicateFunnel, updateFunnel } = useFunnels();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredFunnels, setFilteredFunnels] = useState([]);

  useEffect(() => {
    let filtered = funnels;

    if (searchTerm) {
      filtered = filtered.filter(
        f =>
          f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(f => f.status === statusFilter);
    }

    setFilteredFunnels(filtered);
  }, [funnels, searchTerm, statusFilter]);

  const handleToggleStatus = async (funnel) => {
    const newStatus = funnel.status === 'active' ? 'inactive' : 'active';
    await updateFunnel(funnel.id, { status: newStatus });
  };

  const handleDuplicate = async (id) => {
    const result = await duplicateFunnel(id);
    if (result.success) {
      alert('Quiz duplicado com sucesso!');
    } else {
      alert('Erro ao duplicar quiz: ' + result.error);
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Tem certeza que deseja deletar o quiz "${name}"?`)) {
      const result = await deleteFunnel(id);
      if (result.success) {
        alert('Quiz deletado com sucesso!');
      } else {
        alert('Erro ao deletar quiz: ' + result.error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-slate-100 text-slate-800 border-slate-200',
      draft: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };

    const labels = {
      active: 'Ativo',
      inactive: 'Inativo',
      draft: 'Rascunho'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout breadcrumbs={['Quizzes']}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando quizzes...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout breadcrumbs={['Quizzes']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gestão de Quizzes</h1>
            <p className="text-slate-600 mt-1">
              Gerencie todos os seus funis e quizzes
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <Input
                  placeholder="Buscar por nome ou slug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos</option>
                  <option value="active">Ativos</option>
                  <option value="inactive">Inativos</option>
                  <option value="draft">Rascunhos</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredFunnels.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <EmptyState
                icon={Layers}
                title="Nenhum quiz encontrado"
                description={
                  searchTerm || statusFilter !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Os quizzes criados via IA do Bolt aparecerão aqui para você gerenciar'
                }
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredFunnels.map((funnel) => (
              <Card key={funnel.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 truncate">
                          {funnel.name}
                        </h3>
                        {getStatusBadge(funnel.status)}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        /{funnel.slug}
                      </p>
                      {funnel.description && (
                        <p className="text-sm text-slate-500 mb-3">
                          {funnel.description}
                        </p>
                      )}
                      {funnel.tags && funnel.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {funnel.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link to={`/admin/funnels/${funnel.id}/edit`}>
                        <Button size="sm" variant="outline" className="gap-2 w-full sm:w-auto">
                          <Edit size={16} />
                          Editar
                        </Button>
                      </Link>

                      <Link to={`/${funnel.slug}`} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="gap-2 w-full sm:w-auto">
                          <ExternalLink size={16} />
                          Ver
                        </Button>
                      </Link>

                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() => handleToggleStatus(funnel)}
                      >
                        <Eye size={16} />
                        {funnel.status === 'active' ? 'Desativar' : 'Ativar'}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() => handleDuplicate(funnel.id)}
                      >
                        <Copy size={16} />
                        Duplicar
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(funnel.id, funnel.name)}
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

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Plus size={24} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">
                  Criar Novo Quiz
                </h3>
                <p className="text-sm text-slate-600">
                  Use o chat da IA do Bolt para criar novos quizzes. Eles aparecerão aqui automaticamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

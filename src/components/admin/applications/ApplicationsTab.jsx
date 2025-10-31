import { useState } from 'react';
import { useApplications } from '../../../hooks/useApplications';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import ApplicationDialog from './ApplicationDialog';
import {
  Plus,
  Edit2,
  Trash2,
  Smartphone,
  Globe,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';

export default function ApplicationsTab() {
  const {
    applications,
    loading,
    error,
    createApplication,
    updateApplication,
    deleteApplication,
    toggleStatus
  } = useApplications();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const handleCreate = () => {
    setEditingApp(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (app) => {
    setEditingApp(app);
    setIsDialogOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      let result;
      if (editingApp) {
        result = await updateApplication(editingApp.id, formData);
      } else {
        result = await createApplication(formData);
      }

      if (result.success) {
        alert(editingApp ? 'Aplicativo atualizado com sucesso!' : 'Aplicativo criado com sucesso!');
        setIsDialogOpen(false);
        setEditingApp(null);
      } else {
        alert(result.error || 'Erro ao salvar aplicativo');
      }
    } catch (err) {
      alert('Erro ao salvar: ' + err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Tem certeza que deseja deletar o aplicativo "${name}"?`)) {
      return;
    }

    const result = await deleteApplication(id);
    if (result.success) {
      alert('Aplicativo deletado com sucesso!');
    } else {
      alert(result.error || 'Erro ao deletar aplicativo');
    }
  };

  const handleToggleStatus = async (id, status) => {
    const result = await toggleStatus(id, status);
    if (!result.success) {
      alert(result.error || 'Erro ao alterar status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-slate-600">Carregando aplicativos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Aplicativos</h2>
          <p className="text-slate-600 mt-1">
            Gerencie os aplicativos da sua plataforma
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2 bg-purple-600 hover:bg-purple-700">
          <Plus size={20} />
          Novo Aplicativo
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app) => (
          <Card key={app.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {app.logo_url ? (
                    <div className="w-12 h-12 rounded-lg border-2 border-slate-200 overflow-hidden bg-white">
                      <img
                        src={app.logo_url}
                        alt={app.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-purple-600" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">{app.name}</CardTitle>
                    <p className="text-xs text-slate-500">/{app.slug}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleStatus(app.id, app.status)}
                  className="p-1 hover:bg-slate-100 rounded transition-colors"
                >
                  {app.status === 'active' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-slate-400" />
                  )}
                </button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {app.description && (
                <p className="text-sm text-slate-600 line-clamp-2">
                  {app.description}
                </p>
              )}

              {app.domain && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 truncate">{app.domain}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    app.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {app.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(app)}
                  className="flex-1 gap-2"
                >
                  <Edit2 size={16} />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(app.id, app.name)}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Deletar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {applications.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Smartphone className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Nenhum aplicativo cadastrado
            </h3>
            <p className="text-slate-600 mb-4">
              Comece criando seu primeiro aplicativo
            </p>
            <Button onClick={handleCreate} className="gap-2 bg-purple-600 hover:bg-purple-700">
              <Plus size={20} />
              Novo Aplicativo
            </Button>
          </CardContent>
        </Card>
      )}

      <ApplicationDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingApp(null);
        }}
        application={editingApp}
        onSave={handleSave}
      />
    </div>
  );
}

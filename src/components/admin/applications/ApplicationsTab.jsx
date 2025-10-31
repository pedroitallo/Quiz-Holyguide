import { useState } from 'react';
import { useApplications } from '../../../hooks/useApplications';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Textarea } from '../../ui/textarea';
import {
  Plus,
  Edit2,
  Trash2,
  Smartphone,
  Globe,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Loader2,
  Upload
} from 'lucide-react';

export default function ApplicationsTab() {
  const {
    applications,
    loading,
    error,
    createApplication,
    updateApplication,
    deleteApplication,
    toggleStatus,
    uploadLogo
  } = useApplications();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    domain: '',
    logo_url: ''
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      domain: '',
      logo_url: ''
    });
    setEditingApp(null);
    setIsFormOpen(false);
  };

  const handleEdit = (app) => {
    setEditingApp(app);
    setFormData({
      name: app.name,
      description: app.description || '',
      domain: app.domain || '',
      logo_url: app.logo_url || ''
    });
    setIsFormOpen(true);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 2MB');
      return;
    }

    try {
      setUploading(true);
      const logoUrl = await uploadLogo(file);
      setFormData({ ...formData, logo_url: logoUrl });
    } catch (err) {
      alert('Erro ao fazer upload da logo: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('O nome do aplicativo é obrigatório');
      return;
    }

    setSubmitting(true);

    try {
      let result;
      if (editingApp) {
        result = await updateApplication(editingApp.id, formData);
      } else {
        result = await createApplication(formData);
      }

      if (result.success) {
        alert(editingApp ? 'Aplicativo atualizado com sucesso!' : 'Aplicativo criado com sucesso!');
        resetForm();
      } else {
        alert(result.error || 'Erro ao salvar aplicativo');
      }
    } catch (err) {
      alert('Erro ao salvar: ' + err.message);
    } finally {
      setSubmitting(false);
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
        {!isFormOpen && (
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus size={16} />
            Novo Aplicativo
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {isFormOpen && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{editingApp ? 'Editar Aplicativo' : 'Novo Aplicativo'}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetForm}
                disabled={submitting}
              >
                Cancelar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nome do Aplicativo *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Quiz Místico"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Domínio
                  </label>
                  <Input
                    type="url"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    placeholder="https://app.exemplo.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descrição
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva seu aplicativo..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Logo
                </label>
                <div className="flex items-center gap-4">
                  {formData.logo_url && (
                    <div className="w-20 h-20 rounded-lg border-2 border-slate-200 overflow-hidden bg-white">
                      <img
                        src={formData.logo_url}
                        alt="Logo preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <label className="cursor-pointer">
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2"
                      disabled={uploading}
                      asChild
                    >
                      <span>
                        {uploading ? (
                          <>
                            <Loader2 className="animate-spin" size={16} />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Upload size={16} />
                            {formData.logo_url ? 'Alterar Logo' : 'Upload Logo'}
                          </>
                        )}
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Formatos: PNG, JPG, SVG. Tamanho máximo: 2MB
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={submitting} className="gap-2">
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      {editingApp ? 'Atualizar' : 'Criar'} Aplicativo
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Smartphone className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Nenhum aplicativo cadastrado
                </h3>
                <p className="text-slate-600 text-center mb-6 max-w-md">
                  Comece criando seu primeiro aplicativo para gerenciar quizzes e funis
                </p>
                <Button onClick={() => setIsFormOpen(true)} className="gap-2">
                  <Plus size={16} />
                  Criar Primeiro Aplicativo
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          applications.map((app) => (
            <Card key={app.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  {app.logo_url ? (
                    <div className="w-12 h-12 rounded-lg border border-slate-200 overflow-hidden bg-white">
                      <img
                        src={app.logo_url}
                        alt={app.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <button
                    onClick={() => handleToggleStatus(app.id, app.status)}
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors"
                    title={app.status === 'active' ? 'Ativo' : 'Inativo'}
                  >
                    {app.status === 'active' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        <span className="text-green-700">Ativo</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-500">Inativo</span>
                      </>
                    )}
                  </button>
                </div>

                <h3 className="font-semibold text-slate-900 text-lg mb-2">
                  {app.name}
                </h3>

                {app.description && (
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {app.description}
                  </p>
                )}

                {app.domain && (
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <Globe className="w-4 h-4" />
                    <span className="truncate">{app.domain}</span>
                  </div>
                )}

                <div className="text-xs text-slate-400 mb-4">
                  Slug: <span className="font-mono">{app.slug}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(app)}
                    className="flex-1 gap-2"
                  >
                    <Edit2 size={14} />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(app.id, app.name)}
                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                    Deletar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

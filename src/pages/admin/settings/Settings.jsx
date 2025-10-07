import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Save, UserPlus, Trash2, Download, Upload } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    brand: {},
    notifications: {},
    seo: {}
  });
  const [adminUsers, setAdminUsers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ email: '', password: '' });

  useEffect(() => {
    loadSettings();
    loadAdminUsers();
    loadActivityLogs();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*');

      if (error) throw error;

      const settingsMap = {};
      data?.forEach(item => {
        settingsMap[item.key] = item.value;
      });

      setSettings({
        brand: settingsMap.brand || {},
        notifications: settingsMap.notifications || {},
        seo: settingsMap.seo || {}
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminUsers = async () => {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setAdminUsers(data || []);
    }
  };

  const loadActivityLogs = async () => {
    const { data, error } = await supabase
      .from('admin_activity_logs')
      .select('*, admin_users(email)')
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error) {
      setActivityLogs(data || []);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const updates = [
        { key: 'brand', value: settings.brand },
        { key: 'notifications', value: settings.notifications },
        { key: 'seo', value: settings.seo }
      ];

      for (const update of updates) {
        await supabase
          .from('platform_settings')
          .upsert({
            key: update.key,
            value: update.value
          });
      }

      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Erro ao salvar configurações: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateAdmin = async () => {
    if (!newAdmin.email || !newAdmin.password) {
      alert('Preencha email e senha');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-admin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify(newAdmin)
        }
      );

      const result = await response.json();

      if (result.success) {
        alert('Admin criado com sucesso!');
        setNewAdmin({ email: '', password: '' });
        loadAdminUsers();
      } else {
        alert('Erro: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      alert('Erro ao criar admin: ' + error.message);
    }
  };

  const handleDeleteAdmin = async (id, email) => {
    if (!confirm(`Deletar admin ${email}?`)) return;

    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', id);

    if (!error) {
      alert('Admin deletado com sucesso!');
      loadAdminUsers();
    }
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `holymind-settings-${Date.now()}.json`;
    link.click();
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        setSettings(imported);
        alert('Configurações importadas! Clique em Salvar para aplicar.');
      } catch (error) {
        alert('Erro ao importar arquivo: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <AdminLayout breadcrumbs={['Configurações']}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando configurações...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout breadcrumbs={['Configurações']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
            <p className="text-slate-600 mt-1">
              Gerencie configurações globais da plataforma
            </p>
          </div>
          <Button onClick={handleSaveSettings} disabled={saving} className="gap-2">
            <Save size={16} />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>

        <Tabs defaultValue="brand" className="space-y-6">
          <TabsList>
            <TabsTrigger value="brand">Marca</TabsTrigger>
            <TabsTrigger value="admins">Usuários Admin</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
            <TabsTrigger value="audit">Auditoria</TabsTrigger>
          </TabsList>

          <TabsContent value="brand">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Marca</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nome da Plataforma
                  </label>
                  <Input
                    value={settings.brand.name || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        brand: { ...settings.brand, name: e.target.value }
                      })
                    }
                    placeholder="Ex: HolyMind"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    URL do Logo
                  </label>
                  <Input
                    value={settings.brand.logo_url || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        brand: { ...settings.brand, logo_url: e.target.value }
                      })
                    }
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Cor Primária
                    </label>
                    <Input
                      type="color"
                      value={settings.brand.primary_color || '#8B5CF6'}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          brand: { ...settings.brand, primary_color: e.target.value }
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Cor Secundária
                    </label>
                    <Input
                      type="color"
                      value={settings.brand.secondary_color || '#EC4899'}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          brand: { ...settings.brand, secondary_color: e.target.value }
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admins">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Novo Admin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    />
                    <Input
                      type="password"
                      placeholder="Senha"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleCreateAdmin} className="gap-2">
                    <UserPlus size={16} />
                    Criar Admin
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Administradores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {adminUsers.map((admin) => (
                      <div
                        key={admin.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-slate-900">{admin.email}</p>
                          <p className="text-sm text-slate-500">
                            Criado em: {new Date(admin.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                          Deletar
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email_alerts || false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          email_alerts: e.target.checked
                        }
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-slate-700">Alertas por Email</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications.performance_alerts || false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          performance_alerts: e.target.checked
                        }
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-slate-700">Alertas de Performance</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications.ab_test_alerts || false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          ab_test_alerts: e.target.checked
                        }
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-slate-700">Alertas de Testes A/B</span>
                </label>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Título Padrão
                  </label>
                  <Input
                    value={settings.seo.default_title || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        seo: { ...settings.seo, default_title: e.target.value }
                      })
                    }
                    placeholder="Ex: HolyMind - Quiz Místico"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descrição Padrão
                  </label>
                  <Input
                    value={settings.seo.default_description || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        seo: { ...settings.seo, default_description: e.target.value }
                      })
                    }
                    placeholder="Ex: Descubra insights místicos sobre seu futuro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    URL do Favicon
                  </label>
                  <Input
                    value={settings.seo.favicon_url || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        seo: { ...settings.seo, favicon_url: e.target.value }
                      })
                    }
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle>Backup e Restore</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-4">
                    Exporte ou importe suas configurações em formato JSON
                  </p>
                  <div className="flex gap-3">
                    <Button onClick={handleExportSettings} variant="outline" className="gap-2">
                      <Download size={16} />
                      Exportar Configurações
                    </Button>

                    <label>
                      <Button variant="outline" className="gap-2" asChild>
                        <span>
                          <Upload size={16} />
                          Importar Configurações
                        </span>
                      </Button>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportSettings}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Log de Auditoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityLogs.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">
                      Nenhuma atividade registrada
                    </p>
                  ) : (
                    activityLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-slate-900">
                              <span className="font-medium">{log.admin_users?.email}</span>
                              {' '}{log.action} {log.resource_type}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {new Date(log.created_at).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

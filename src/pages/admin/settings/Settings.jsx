import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Save, UserPlus, Trash2, Smartphone } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import ApplicationsTab from '../../../components/admin/applications/ApplicationsTab';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({});
  const [adminUsers, setAdminUsers] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ email: '', password: '' });

  useEffect(() => {
    loadAdminUsers();
  }, []);


  const loadAdminUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) {
        setAdminUsers(data || []);
      }
    } catch (error) {
      console.error('Error loading admin users:', error);
    } finally {
      setLoading(false);
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
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
          <p className="text-slate-600 mt-1">
            Gerencie configurações globais da plataforma
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="applications">Aplicativos</TabsTrigger>
            <TabsTrigger value="admins">Usuários Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nome da Plataforma
                  </label>
                  <Input
                    defaultValue="Appyon Quiz Platform"
                    placeholder="Ex: Appyon"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email de Contato
                  </label>
                  <Input
                    type="email"
                    defaultValue="contato@appyon.com"
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fuso Horário
                  </label>
                  <Input
                    defaultValue="America/Sao_Paulo"
                    placeholder="America/Sao_Paulo"
                  />
                </div>

                <Button className="gap-2">
                  <Save size={16} />
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <ApplicationsTab />
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

        </Tabs>
      </div>
    </AdminLayout>
  );
}

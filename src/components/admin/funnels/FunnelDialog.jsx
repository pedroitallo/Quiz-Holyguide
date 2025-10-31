import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';

export default function FunnelDialog({ open, onClose, funnel, applications, offers, onSave }) {
  const [activeTab, setActiveTab] = useState('funnel');
  const [formData, setFormData] = useState({
    name: '',
    application_id: '',
    offer_id: '',
    language: 'pt-BR',
    traffic_source: '',
    slug: '',
    url: '',
    description: '',
    status: 'active'
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (funnel) {
      setFormData({
        name: funnel.name || '',
        application_id: funnel.application_id || '',
        offer_id: funnel.offer_id || '',
        language: funnel.language || 'pt-BR',
        traffic_source: funnel.traffic_source || '',
        slug: funnel.slug || '',
        url: funnel.url || '',
        description: funnel.description || '',
        status: funnel.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        application_id: applications.length > 0 ? applications[0].id : '',
        offer_id: '',
        language: 'pt-BR',
        traffic_source: '',
        slug: '',
        url: '',
        description: '',
        status: 'active'
      });
    }
  }, [funnel, open, applications]);

  const filteredOffers = offers.filter(
    offer => offer.application_id === formData.application_id
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('O nome do funil é obrigatório');
      return;
    }

    if (!formData.application_id) {
      alert('Selecione um aplicativo');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving funnel:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-purple-600">
            {funnel ? 'Editar Funil' : 'Novo Registro'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="funnel">Funil</TabsTrigger>
            <TabsTrigger value="offer">Oferta</TabsTrigger>
            <TabsTrigger value="application">Aplicativo</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-6">
            <TabsContent value="funnel" className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Nome do Funil *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Funil Facebook PT"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Aplicativo *
                  </label>
                  <select
                    value={formData.application_id}
                    onChange={(e) => setFormData({ ...formData, application_id: e.target.value, offer_id: '' })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Selecione</option>
                    {applications.map(app => (
                      <option key={app.id} value={app.id}>{app.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Oferta *
                  </label>
                  <select
                    value={formData.offer_id}
                    onChange={(e) => setFormData({ ...formData, offer_id: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  >
                    <option value="">Selecione</option>
                    {filteredOffers.map(offer => (
                      <option key={offer.id} value={offer.id}>{offer.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Idioma *
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="pt-BR">Português (BR)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Fonte de Tráfego *
                  </label>
                  <select
                    value={formData.traffic_source}
                    onChange={(e) => setFormData({ ...formData, traffic_source: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="facebook">Facebook</option>
                    <option value="google">Google</option>
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="organic">Orgânico</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Slug *
                </label>
                <Input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Ex: facebook-pt-br"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Link do Funil
                </label>
                <Input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Descrição
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do funil..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  required
                >
                  <option value="active">Ativado</option>
                  <option value="paused">Pausado</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </TabsContent>

            <TabsContent value="offer" className="space-y-6">
              <p className="text-slate-600 text-center py-8">
                Selecione um aplicativo na aba "Funil" para ver as ofertas disponíveis.
              </p>
            </TabsContent>

            <TabsContent value="application" className="space-y-6">
              <p className="text-slate-600 text-center py-8">
                Gerencie aplicativos na seção "Aplicativos" do painel.
              </p>
            </TabsContent>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                {saving ? 'Salvando...' : 'Salvar Funil'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={saving}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

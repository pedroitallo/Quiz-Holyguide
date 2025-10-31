import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Trash2 } from 'lucide-react';

export default function FunnelDialog({ open, onClose, funnel, applications, offers, onSave, onSaveOffer }) {
  const [activeTab, setActiveTab] = useState('funnel');

  const [funnelFormData, setFunnelFormData] = useState({
    name: '',
    offer_id: '',
    language: 'pt-BR',
    traffic_source: '',
    slug: '',
    url: '',
    description: '',
    status: 'active'
  });

  const [offerFormData, setOfferFormData] = useState({
    application_id: '',
    name: '',
    description: '',
    price: 0,
    currency: 'BRL',
    checkouts: []
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (funnel) {
      setFunnelFormData({
        name: funnel.name || '',
        offer_id: funnel.offer_id || '',
        language: funnel.language || 'pt-BR',
        traffic_source: funnel.traffic_source || '',
        slug: funnel.slug || '',
        url: funnel.url || '',
        description: funnel.description || '',
        status: funnel.status || 'active'
      });
    } else {
      setFunnelFormData({
        name: '',
        offer_id: '',
        language: 'pt-BR',
        traffic_source: '',
        slug: '',
        url: '',
        description: '',
        status: 'active'
      });
    }

    setOfferFormData({
      application_id: applications.length > 0 ? applications[0].id : '',
      name: '',
      description: '',
      price: 0,
      currency: 'BRL',
      checkouts: []
    });
  }, [funnel, open, applications]);

  const filteredOffers = offers;

  const handleFunnelSubmit = async (e) => {
    e.preventDefault();

    if (!funnelFormData.name.trim()) {
      alert('O nome do funil é obrigatório');
      return;
    }

    setSaving(true);
    try {
      await onSave(funnelFormData);
      onClose();
    } catch (error) {
      console.error('Error saving funnel:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();

    if (!offerFormData.name.trim()) {
      alert('O nome da oferta é obrigatório');
      return;
    }

    if (!offerFormData.application_id) {
      alert('Selecione um aplicativo');
      return;
    }

    setSaving(true);
    try {
      await onSaveOffer(offerFormData);
      setOfferFormData({
        application_id: applications.length > 0 ? applications[0].id : '',
        name: '',
        description: '',
        price: 0,
        currency: 'BRL',
        checkouts: []
      });
      setActiveTab('funnel');
      alert('Oferta criada com sucesso!');
    } catch (error) {
      console.error('Error saving offer:', error);
      alert('Erro ao salvar oferta');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCheckout = () => {
    setOfferFormData({
      ...offerFormData,
      checkouts: [
        ...offerFormData.checkouts,
        {
          name: '',
          url: '',
          platform: 'cartpanda',
          status: 'active',
          language: '',
          traffic_source: ''
        }
      ]
    });
  };

  const handleRemoveCheckout = (index) => {
    const newCheckouts = offerFormData.checkouts.filter((_, i) => i !== index);
    setOfferFormData({ ...offerFormData, checkouts: newCheckouts });
  };

  const handleCheckoutChange = (index, field, value) => {
    const newCheckouts = [...offerFormData.checkouts];
    newCheckouts[index][field] = value;
    setOfferFormData({ ...offerFormData, checkouts: newCheckouts });
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
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="funnel">Funil</TabsTrigger>
            <TabsTrigger value="offer">Oferta</TabsTrigger>
          </TabsList>

          <TabsContent value="funnel" className="space-y-6">
            <form onSubmit={handleFunnelSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Nome do Funil *
                </label>
                <Input
                  type="text"
                  value={funnelFormData.name}
                  onChange={(e) => setFunnelFormData({ ...funnelFormData, name: e.target.value })}
                  placeholder="Ex: Funil Facebook PT"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Oferta
                </label>
                <select
                  value={funnelFormData.offer_id}
                  onChange={(e) => setFunnelFormData({ ...funnelFormData, offer_id: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="">Selecione</option>
                  {filteredOffers.map(offer => (
                    <option key={offer.id} value={offer.id}>{offer.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Idioma *
                  </label>
                  <select
                    value={funnelFormData.language}
                    onChange={(e) => setFunnelFormData({ ...funnelFormData, language: e.target.value })}
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
                    value={funnelFormData.traffic_source}
                    onChange={(e) => setFunnelFormData({ ...funnelFormData, traffic_source: e.target.value })}
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
                  value={funnelFormData.slug}
                  onChange={(e) => setFunnelFormData({ ...funnelFormData, slug: e.target.value })}
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
                  value={funnelFormData.url}
                  onChange={(e) => setFunnelFormData({ ...funnelFormData, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Descrição
                </label>
                <Textarea
                  value={funnelFormData.description}
                  onChange={(e) => setFunnelFormData({ ...funnelFormData, description: e.target.value })}
                  placeholder="Descrição do funil..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Status *
                </label>
                <select
                  value={funnelFormData.status}
                  onChange={(e) => setFunnelFormData({ ...funnelFormData, status: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  required
                >
                  <option value="active">Ativado</option>
                  <option value="paused">Pausado</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>

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
          </TabsContent>

          <TabsContent value="offer" className="space-y-6">
            <form onSubmit={handleOfferSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Nome da Oferta *
                </label>
                <Input
                  type="text"
                  value={offerFormData.name}
                  onChange={(e) => setOfferFormData({ ...offerFormData, name: e.target.value })}
                  placeholder="Ex: Plano Premium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Aplicativo *
                </label>
                <select
                  value={offerFormData.application_id}
                  onChange={(e) => setOfferFormData({ ...offerFormData, application_id: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  required
                >
                  <option value="">Selecione um aplicativo</option>
                  {applications.map(app => (
                    <option key={app.id} value={app.id}>{app.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Descrição
                </label>
                <Textarea
                  value={offerFormData.description}
                  onChange={(e) => setOfferFormData({ ...offerFormData, description: e.target.value })}
                  placeholder="Descrição da oferta..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Preço
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={offerFormData.price}
                    onChange={(e) => setOfferFormData({ ...offerFormData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Moeda
                  </label>
                  <select
                    value={offerFormData.currency}
                    onChange={(e) => setOfferFormData({ ...offerFormData, currency: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  >
                    <option value="BRL">BRL (R$)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-slate-900">
                    Checkouts
                  </label>
                  <button
                    type="button"
                    onClick={handleAddCheckout}
                    className="px-4 py-2 border-2 border-black rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
                  >
                    <span className="text-lg">+</span>
                    Adicionar Checkout
                  </button>
                </div>

                {offerFormData.checkouts.length > 0 && (
                  <div className="space-y-4">
                    {offerFormData.checkouts.map((checkout, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-6 space-y-4 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-slate-900">Checkout {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => handleRemoveCheckout(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-900 mb-2">
                            Nome *
                          </label>
                          <Input
                            type="text"
                            value={checkout.name}
                            onChange={(e) => handleCheckoutChange(index, 'name', e.target.value)}
                            placeholder="Nome do checkout"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-900 mb-2">
                            URL Base do Checkout *
                          </label>
                          <Input
                            type="url"
                            value={checkout.url}
                            onChange={(e) => handleCheckoutChange(index, 'url', e.target.value)}
                            placeholder="https://payments.example.com/checkout/123"
                            required
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            O template da plataforma será adicionado automaticamente
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">
                              Plataforma *
                            </label>
                            <select
                              value={checkout.platform}
                              onChange={(e) => handleCheckoutChange(index, 'platform', e.target.value)}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                              required
                            >
                              <option value="cartpanda">Cartpanda</option>
                              <option value="stripe">Stripe</option>
                              <option value="paypal">PayPal</option>
                              <option value="mercadopago">Mercado Pago</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">
                              Status
                            </label>
                            <select
                              value={checkout.status}
                              onChange={(e) => handleCheckoutChange(index, 'status', e.target.value)}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                            >
                              <option value="active">Ativado</option>
                              <option value="inactive">Inativo</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">
                              Idioma
                            </label>
                            <select
                              value={checkout.language}
                              onChange={(e) => handleCheckoutChange(index, 'language', e.target.value)}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                            >
                              <option value="">Selecione</option>
                              <option value="pt-BR">Português (BR)</option>
                              <option value="en-US">English (US)</option>
                              <option value="es-ES">Español</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">
                              Fonte
                            </label>
                            <select
                              value={checkout.traffic_source}
                              onChange={(e) => handleCheckoutChange(index, 'traffic_source', e.target.value)}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
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
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white h-12"
                >
                  {saving ? 'Salvando...' : 'Salvar Oferta'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={saving}
                  className="h-12"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

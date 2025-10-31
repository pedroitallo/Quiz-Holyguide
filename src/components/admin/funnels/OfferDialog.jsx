import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Plus, X, Trash2 } from 'lucide-react';

export default function OfferDialog({ open, onClose, offer, applications, onSave }) {
  const [formData, setFormData] = useState({
    application_id: '',
    name: '',
    description: '',
    price: 0,
    currency: 'BRL',
    checkouts: []
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (offer) {
      setFormData({
        application_id: offer.application_id || '',
        name: offer.name || '',
        description: offer.description || '',
        price: offer.price || 0,
        currency: offer.currency || 'BRL',
        checkouts: offer.checkouts || []
      });
    } else {
      setFormData({
        application_id: applications.length > 0 ? applications[0].id : '',
        name: '',
        description: '',
        price: 0,
        currency: 'BRL',
        checkouts: []
      });
    }
  }, [offer, open, applications]);

  const handleAddCheckout = () => {
    setFormData({
      ...formData,
      checkouts: [
        ...formData.checkouts,
        {
          name: '',
          url: '',
          platform: 'cartpanda',
          status: 'active',
          language: 'pt-BR',
          traffic_source: ''
        }
      ]
    });
  };

  const handleRemoveCheckout = (index) => {
    const newCheckouts = formData.checkouts.filter((_, i) => i !== index);
    setFormData({ ...formData, checkouts: newCheckouts });
  };

  const handleCheckoutChange = (index, field, value) => {
    const newCheckouts = [...formData.checkouts];
    newCheckouts[index][field] = value;
    setFormData({ ...formData, checkouts: newCheckouts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('O nome da oferta é obrigatório');
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
      console.error('Error saving offer:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-purple-600">
            {offer ? 'Editar Oferta' : 'Nova Oferta'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Nome da Oferta *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Plano Premium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Aplicativo *
            </label>
            <select
              value={formData.application_id}
              onChange={(e) => setFormData({ ...formData, application_id: e.target.value })}
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
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Moeda
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCheckout}
                className="gap-2"
              >
                <Plus size={16} />
                Adicionar Checkout
              </Button>
            </div>

            {formData.checkouts.length > 0 && (
              <div className="space-y-4">
                {formData.checkouts.map((checkout, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-700">Checkout {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCheckout(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
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
                      <label className="block text-xs font-medium text-slate-700 mb-1">
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

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Plataforma *
                        </label>
                        <select
                          value={checkout.platform}
                          onChange={(e) => handleCheckoutChange(index, 'platform', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                          required
                        >
                          <option value="cartpanda">Cartpanda</option>
                          <option value="stripe">Stripe</option>
                          <option value="paypal">PayPal</option>
                          <option value="mercadopago">Mercado Pago</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Status
                        </label>
                        <select
                          value={checkout.status}
                          onChange={(e) => handleCheckoutChange(index, 'status', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        >
                          <option value="active">Ativado</option>
                          <option value="inactive">Inativo</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Idioma
                        </label>
                        <select
                          value={checkout.language}
                          onChange={(e) => handleCheckoutChange(index, 'language', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        >
                          <option value="">Selecione</option>
                          <option value="pt-BR">Português (BR)</option>
                          <option value="en-US">English (US)</option>
                          <option value="es-ES">Español</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Fonte
                        </label>
                        <select
                          value={checkout.traffic_source}
                          onChange={(e) => handleCheckoutChange(index, 'traffic_source', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
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
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {saving ? 'Salvando...' : 'Salvar Oferta'}
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
      </DialogContent>
    </Dialog>
  );
}

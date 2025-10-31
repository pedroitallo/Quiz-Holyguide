import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Plus, X } from 'lucide-react';

export default function ApplicationDialog({ open, onClose, application, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    landing_page_url: '',
    webapp_url: '',
    email: '',
    instagram_url: '',
    description: '',
    custom_links: []
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (application) {
      setFormData({
        name: application.name || '',
        logo_url: application.logo_url || '',
        landing_page_url: application.landing_page_url || '',
        webapp_url: application.webapp_url || '',
        email: application.email || '',
        instagram_url: application.instagram_url || '',
        description: application.description || '',
        custom_links: application.custom_links || []
      });
    } else {
      setFormData({
        name: '',
        logo_url: '',
        landing_page_url: '',
        webapp_url: '',
        email: '',
        instagram_url: '',
        description: '',
        custom_links: []
      });
    }
  }, [application, open]);

  const handleAddCustomLink = () => {
    setFormData({
      ...formData,
      custom_links: [...formData.custom_links, { label: '', url: '' }]
    });
  };

  const handleRemoveCustomLink = (index) => {
    const newLinks = formData.custom_links.filter((_, i) => i !== index);
    setFormData({ ...formData, custom_links: newLinks });
  };

  const handleCustomLinkChange = (index, field, value) => {
    const newLinks = [...formData.custom_links];
    newLinks[index][field] = value;
    setFormData({ ...formData, custom_links: newLinks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('O nome do aplicativo é obrigatório');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving application:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {application ? 'Editar Aplicativo' : 'Novo Aplicativo'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Nome do Aplicativo *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Meu App"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              URL do Logo
            </label>
            <Input
              type="url"
              value={formData.logo_url}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Landing Page URL
            </label>
            <Input
              type="url"
              value={formData.landing_page_url}
              onChange={(e) => setFormData({ ...formData, landing_page_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              WebApp URL
            </label>
            <Input
              type="url"
              value={formData.webapp_url}
              onChange={(e) => setFormData({ ...formData, webapp_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contato@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Instagram URL
            </label>
            <Input
              type="url"
              value={formData.instagram_url}
              onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
              placeholder="https://instagram.com/..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-900">
                Links Personalizados
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCustomLink}
                className="gap-2"
              >
                <Plus size={16} />
                Adicionar Link
              </Button>
            </div>

            {formData.custom_links.length > 0 && (
              <div className="space-y-3">
                {formData.custom_links.map((link, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input
                        type="text"
                        value={link.label}
                        onChange={(e) => handleCustomLinkChange(index, 'label', e.target.value)}
                        placeholder="Nome do link"
                      />
                      <Input
                        type="url"
                        value={link.url}
                        onChange={(e) => handleCustomLinkChange(index, 'url', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveCustomLink(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Descrição
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição do aplicativo..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {saving ? 'Salvando...' : 'Salvar Aplicativo'}
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

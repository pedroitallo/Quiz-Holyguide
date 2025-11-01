import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function SettingsTab({ funnel, onUpdate }) {
  const [settings, setSettings] = useState({
    name: '',
    slug: '',
    description: '',
    language: 'pt-BR',
    traffic_network: '',
    funnel_id_external: '',
    status: 'draft',
    tracking_pixel: '',
    conversion_goal: ''
  });

  useEffect(() => {
    if (funnel) {
      setSettings({
        name: funnel.name || '',
        slug: funnel.slug || '',
        description: funnel.description || '',
        language: funnel.language || 'pt-BR',
        traffic_network: funnel.traffic_network || '',
        funnel_id_external: funnel.funnel_id_external || '',
        status: funnel.status || 'draft',
        tracking_pixel: funnel.tracking_pixel || '',
        conversion_goal: funnel.conversion_goal || ''
      });
    }
  }, [funnel]);

  const handleChange = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    onUpdate({ ...funnel, ...updated });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Configurações do Funil
        </h2>
        <p className="text-slate-600">
          Configure informações gerais e integrações
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nome do Funil</Label>
              <Input
                value={settings.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Quiz Alma Gêmea"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Slug (URL)</Label>
              <Input
                value={settings.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="Ex: funnel-1"
                className="mt-2"
              />
              <p className="text-xs text-slate-500 mt-1">
                URL: /{settings.slug}
              </p>
            </div>

            <div>
              <Label>Descrição</Label>
              <Textarea
                value={settings.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Descreva o objetivo deste funil..."
                rows={3}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Status</Label>
              <select
                value={settings.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg mt-2"
              >
                <option value="draft">Rascunho</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="archived">Arquivado</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Localização e Idioma</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Idioma</Label>
              <select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg mt-2"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
                <option value="fr-FR">Français</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tráfego e Integrações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Rede de Tráfego</Label>
              <Input
                value={settings.traffic_network}
                onChange={(e) => handleChange('traffic_network', e.target.value)}
                placeholder="Ex: Facebook Ads, Google Ads"
                className="mt-2"
              />
            </div>

            <div>
              <Label>ID do Funil (Externo)</Label>
              <Input
                value={settings.funnel_id_external}
                onChange={(e) => handleChange('funnel_id_external', e.target.value)}
                placeholder="ID de integração externa"
                className="mt-2"
              />
              <p className="text-xs text-slate-500 mt-1">
                Use para integrar com plataformas externas
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rastreamento e Conversão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Pixel de Rastreamento</Label>
              <Textarea
                value={settings.tracking_pixel}
                onChange={(e) => handleChange('tracking_pixel', e.target.value)}
                placeholder="Cole aqui o código do pixel (Facebook, Google, etc)"
                rows={4}
                className="mt-2 font-mono text-xs"
              />
            </div>

            <div>
              <Label>Objetivo de Conversão</Label>
              <Input
                value={settings.conversion_goal}
                onChange={(e) => handleChange('conversion_goal', e.target.value)}
                placeholder="Ex: Lead, Compra, Cadastro"
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

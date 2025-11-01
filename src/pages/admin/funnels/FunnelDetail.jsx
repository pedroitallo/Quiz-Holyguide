import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { ArrowLeft, Copy, ExternalLink, Edit, Eye } from 'lucide-react';
import StepPreviewModal from '../../../components/admin/StepPreviewModal';
import { getFunnelSteps } from '../../../config/funnelStepsMapping';

export default function FunnelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [funnel, setFunnel] = useState(null);
  const [application, setApplication] = useState(null);
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewStepIndex, setPreviewStepIndex] = useState(0);

  useEffect(() => {
    loadFunnelDetails();
  }, [id]);

  const loadFunnelDetails = async () => {
    try {
      setLoading(true);

      const { data: funnelData, error: funnelError } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', id)
        .single();

      if (funnelError) throw funnelError;

      setFunnel(funnelData);

      if (funnelData.application_id) {
        const { data: appData } = await supabase
          .from('applications')
          .select('*')
          .eq('id', funnelData.application_id)
          .single();
        setApplication(appData);
      }

      if (funnelData.offer_id) {
        const { data: offerData } = await supabase
          .from('offers')
          .select('*')
          .eq('id', funnelData.offer_id)
          .single();
        setOffer(offerData);
      }
    } catch (err) {
      console.error('Error loading funnel details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLanguageDisplay = (lang) => {
    const languages = {
      'pt-BR': { flag: '🇧🇷', name: 'Português (BR)' },
      'en-US': { flag: '🇺🇸', name: 'English (US)' },
      'es-ES': { flag: '🇪🇸', name: 'Español' }
    };
    return languages[lang] || { flag: '', name: lang };
  };

  const getStatusBadge = (status) => {
    const statuses = {
      active: { label: 'Ativado', class: 'bg-green-100 text-green-700' },
      paused: { label: 'Pausado', class: 'bg-yellow-100 text-yellow-700' },
      inactive: { label: 'Inativo', class: 'bg-slate-100 text-slate-700' }
    };
    const s = statuses[status] || statuses.inactive;
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${s.class}`}>{s.label}</span>;
  };

  if (loading) {
    return (
      <AdminLayout breadcrumbs={['Funis', 'Detalhes']}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando funil...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!funnel) {
    return (
      <AdminLayout breadcrumbs={['Funis', 'Detalhes']}>
        <div className="text-center py-12">
          <p className="text-slate-600">Funil não encontrado</p>
          <Button onClick={() => navigate('/admin/funnels')} className="mt-4">
            Voltar para Funis
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const lang = getLanguageDisplay(funnel.language);
  const getTrafficSourceName = (source) => {
    const names = {
      facebook: 'Facebook',
      google: 'Google',
      tiktok: 'TikTok',
      instagram: 'Instagram',
      organic: 'Orgânico'
    };
    return names[source] || source;
  };

  const funnelIdentifier = `${lang.flag} ${funnel.name} | ${getTrafficSourceName(funnel.traffic_source)} | ${offer?.name || 'N/A'} | ${application?.name || 'N/A'}`;

  const mappedSteps = getFunnelSteps(funnel.slug);

  const handlePreviewStep = (index) => {
    setPreviewStepIndex(index);
    setPreviewOpen(true);
  };

  return (
    <AdminLayout breadcrumbs={['Funis', funnel.name]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/funnels')}
              className="gap-2"
            >
              <ArrowLeft size={16} />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold text-purple-600">{funnel.name}</h1>
          </div>
          <Button
            onClick={() => navigate(`/admin/funnels?edit=${id}`)}
            className="gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <Edit size={16} />
            Editar
          </Button>
        </div>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-8">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
              <p className="text-sm text-slate-600 mb-3">ID do Funil</p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xl font-mono text-slate-900">{funnelIdentifier}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(funnelIdentifier)}
                  className="p-3 hover:bg-purple-100 rounded-lg transition-colors border-2 border-slate-900"
                >
                  <Copy size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-8">
              <div>
                <p className="text-sm text-slate-600 mb-2">Oferta (offer)</p>
                <p className="text-2xl font-bold text-slate-900">{offer?.name || '-'}</p>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-2">Fonte de Tráfego</p>
                <p className="text-2xl font-bold text-slate-900 capitalize">
                  {getTrafficSourceName(funnel.traffic_source) || '-'}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-2">Idioma</p>
                <p className="text-2xl font-bold text-slate-900">
                  {lang.flag} {lang.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-2">Status</p>
                <div className="flex items-center">
                  {getStatusBadge(funnel.status)}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-600 mb-3">URL Completa</p>
              {funnel.url ? (
                <div className="flex items-center gap-3">
                  <a
                    href={funnel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700 text-lg flex-1 truncate"
                  >
                    {funnel.url}
                  </a>
                  <button
                    onClick={() => window.open(funnel.url, '_blank')}
                    className="p-2 hover:bg-slate-100 rounded transition-colors"
                  >
                    <ExternalLink size={18} />
                  </button>
                </div>
              ) : (
                <p className="text-slate-600">URL não configurada</p>
              )}
            </div>

            {funnel.description && (
              <div className="mt-8 pt-8 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-3">Descrição</p>
                <p className="text-slate-900">{funnel.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Etapas do Funil</h3>
            <div className="space-y-3">
              {mappedSteps && mappedSteps.length > 0 ? (
                mappedSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors group">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900">{step.name}</p>
                      {step.description && (
                        <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                      )}
                      <p className="text-xs text-slate-500 mt-1 font-mono">ID: {step.id}</p>
                    </div>
                    <button
                      onClick={() => handlePreviewStep(index)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all opacity-0 group-hover:opacity-100"
                      title="Visualizar etapa"
                    >
                      <Eye size={18} />
                      <span className="text-sm font-medium">Preview</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-600 mb-2">Nenhuma etapa mapeada para este funil</p>
                  <p className="text-sm text-slate-500">As etapas são carregadas automaticamente do código do funil</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {offer && offer.checkouts && offer.checkouts.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Funil Back-end</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Copy size={16} />
                    Copiar de outro funil
                  </Button>
                  <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700">
                    + Adicionar
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {offer.checkouts.map((checkout, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-slate-900">{checkout.name}</p>
                        <p className="text-sm text-slate-600 capitalize">{checkout.platform}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        Deletar
                      </Button>
                    </div>
                    <a
                      href={checkout.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-2"
                    >
                      {checkout.url}
                      <ExternalLink size={14} />
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <StepPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        funnelSlug={funnel?.slug}
        initialStepIndex={previewStepIndex}
      />
    </AdminLayout>
  );
}

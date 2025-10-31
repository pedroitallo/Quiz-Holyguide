import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { ArrowLeft, Copy, ExternalLink, Edit } from 'lucide-react';

export default function FunnelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [funnel, setFunnel] = useState(null);
  const [application, setApplication] = useState(null);
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

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
  const funnelIdentifier = `Funil ${funnel.id.slice(0, 2)} | ${funnel.traffic_source || 'N/A'} | ${offer?.name || 'N/A'} | ${application?.name || 'N/A'}`;

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

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="mb-2">
              <p className="text-sm text-slate-600 mb-1">ID do Funil</p>
              <div className="flex items-center gap-3">
                <p className="text-lg font-mono text-slate-900">{funnelIdentifier}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(funnelIdentifier)}
                  className="gap-2"
                >
                  <Copy size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Oferta (offer)</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Nome</p>
                  <p className="text-2xl font-bold text-slate-900">{offer?.name || '-'}</p>
                </div>
                {offer?.price && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Preço</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {offer.currency} {offer.price}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Fonte de Tráfego</h3>
              <div>
                <p className="text-2xl font-bold text-slate-900 capitalize">
                  {funnel.traffic_source || '-'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Idioma</h3>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {lang.flag} {lang.name}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Status</h3>
              <div>
                {getStatusBadge(funnel.status)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">URL Completa</h3>
            {funnel.url ? (
              <div className="flex items-center gap-3">
                <a
                  href={funnel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 flex-1 truncate"
                >
                  {funnel.url}
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(funnel.url, '_blank')}
                  className="gap-2"
                >
                  <ExternalLink size={16} />
                </Button>
              </div>
            ) : (
              <p className="text-slate-600">URL não configurada</p>
            )}
          </CardContent>
        </Card>

        {funnel.description && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Descrição</h3>
              <p className="text-slate-700">{funnel.description}</p>
            </CardContent>
          </Card>
        )}

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
    </AdminLayout>
  );
}

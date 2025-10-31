import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { ArrowLeft, Copy, ExternalLink, Edit } from 'lucide-react';

export default function OfferDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOfferDetails();
  }, [id]);

  const loadOfferDetails = async () => {
    try {
      setLoading(true);

      const { data: offerData, error: offerError } = await supabase
        .from('offers')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (offerError) throw offerError;

      setOffer(offerData);

      if (offerData?.application_id) {
        const { data: appData } = await supabase
          .from('applications')
          .select('*')
          .eq('id', offerData.application_id)
          .maybeSingle();
        setApplication(appData);
      }
    } catch (err) {
      console.error('Error loading offer details:', err);
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

  const getStatusBadge = (status) => {
    const statuses = {
      active: { label: 'Ativado', class: 'bg-green-100 text-green-700' },
      paused: { label: 'Pausado', class: 'bg-yellow-100 text-yellow-700' },
      inactive: { label: 'Inativo', class: 'bg-slate-100 text-slate-700' }
    };
    const s = statuses[status] || statuses.active;
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${s.class}`}>{s.label}</span>;
  };

  if (loading) {
    return (
      <AdminLayout breadcrumbs={['Offers', 'Detalhes']}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando offer...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!offer) {
    return (
      <AdminLayout breadcrumbs={['Offers', 'Detalhes']}>
        <div className="text-center py-12">
          <p className="text-slate-600">Offer não encontrada</p>
          <Button onClick={() => navigate('/admin/funnels')} className="mt-4">
            Voltar para Funis
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const lang = getLanguageDisplay(offer.language || 'en-US');
  const offerIdentifier = `${lang.flag} ${offer.name} | ${getTrafficSourceName(offer.traffic_source || 'facebook')} | ${application?.name || 'N/A'} [${offer.platform || 'Cartpanda'}]`;

  return (
    <AdminLayout breadcrumbs={['Offers', offer.name]}>
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
            <h1 className="text-3xl font-bold text-purple-600">{offer.name}</h1>
          </div>
          <Button
            onClick={() => navigate(`/admin/funnels?editOffer=${id}`)}
            className="gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <Edit size={16} />
            Editar
          </Button>
        </div>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="mb-2">
              <p className="text-sm text-slate-600 mb-1">ID da Offer</p>
              <div className="flex items-center gap-3">
                <p className="text-lg font-mono text-slate-900">{offerIdentifier}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(offerIdentifier)}
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
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Preço</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-3xl font-bold text-slate-900">
                    {offer.currency || '$'} {offer.price || '0.00'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Plataforma</h3>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {offer.platform || 'Cartpanda'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Fonte de Tráfego</h3>
              <div>
                <p className="text-2xl font-bold text-slate-900 capitalize">
                  {getTrafficSourceName(offer.traffic_source || 'facebook')}
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
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Aplicativo</h3>
              <p className="text-2xl font-bold text-slate-900">{application?.name || '-'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Status</h3>
              <div>
                {getStatusBadge(offer.status || 'active')}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">URL do Checkout</h3>
            {offer.checkout_url ? (
              <div className="flex items-center gap-3">
                <a
                  href={offer.checkout_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 flex-1 truncate"
                >
                  {offer.checkout_url}
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(offer.checkout_url, '_blank')}
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

        {offer.description && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Descrição</h3>
              <p className="text-slate-700">{offer.description}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

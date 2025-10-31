import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import FunnelDialog from '../../../components/admin/funnels/FunnelDialog';
import OfferDialog from '../../../components/admin/funnels/OfferDialog';
import {
  Edit,
  ExternalLink,
  Copy,
  Facebook,
  Globe,
  Smartphone,
  Mail,
  Instagram,
  Plus
} from 'lucide-react';
import { useFunnels } from '../../../hooks/admin/useFunnels';
import { useApplications } from '../../../hooks/useApplications';
import { useOffers } from '../../../hooks/useOffers';

export default function FunnelsList() {
  const navigate = useNavigate();
  const { funnels, loading, createFunnel, updateFunnel, deleteFunnel } = useFunnels();
  const { applications } = useApplications();
  const { offers, createOffer, updateOffer } = useOffers();

  const [viewMode, setViewMode] = useState('lander');
  const [selectedApp, setSelectedApp] = useState('');
  const [selectedOffer, setSelectedOffer] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');

  const [isFunnelDialogOpen, setIsFunnelDialogOpen] = useState(false);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [editingFunnel, setEditingFunnel] = useState(null);
  const [editingOffer, setEditingOffer] = useState(null);

  const [filteredFunnels, setFilteredFunnels] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);

  const currentApp = applications.find(app => app.id === selectedApp) || applications[0] || null;

  useEffect(() => {
    if (applications.length > 0 && !selectedApp) {
      setSelectedApp(applications[0].id);
    }
  }, [applications, selectedApp]);

  useEffect(() => {
    let filtered = funnels;

    if (selectedApp && selectedApp !== 'all') {
      filtered = filtered.filter(f => f.application_id === selectedApp);
    }

    if (selectedOffer && selectedOffer !== 'all') {
      filtered = filtered.filter(f => f.offer_id === selectedOffer);
    }

    if (selectedLanguage && selectedLanguage !== 'all') {
      filtered = filtered.filter(f => f.language === selectedLanguage);
    }

    if (selectedSource && selectedSource !== 'all') {
      filtered = filtered.filter(f => f.traffic_source === selectedSource);
    }

    setFilteredFunnels(filtered);
  }, [funnels, selectedApp, selectedOffer, selectedLanguage, selectedSource]);

  useEffect(() => {
    setFilteredOffers(offers.filter(o => !selectedApp || o.application_id === selectedApp));
  }, [offers, selectedApp]);

  const handleCreateFunnel = () => {
    setEditingFunnel(null);
    setIsFunnelDialogOpen(true);
  };

  const handleEditFunnel = (funnel) => {
    setEditingFunnel(funnel);
    setIsFunnelDialogOpen(true);
  };

  const handleSaveFunnel = async (data) => {
    try {
      let result;
      if (editingFunnel) {
        result = await updateFunnel(editingFunnel.id, data);
      } else {
        result = await createFunnel(data);
      }

      if (result.success) {
        setIsFunnelDialogOpen(false);
      } else {
        alert(result.error || 'Erro ao salvar funil');
      }
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };

  const handleSaveOffer = async (data) => {
    try {
      let result;
      if (editingOffer) {
        result = await updateOffer(editingOffer.id, data);
      } else {
        result = await createOffer(data);
      }

      if (result.success) {
        setIsOfferDialogOpen(false);
      } else {
        alert(result.error || 'Erro ao salvar oferta');
      }
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };

  const getLanguageFlag = (lang) => {
    const flags = {
      'pt-BR': '🇧🇷',
      'en-US': '🇺🇸',
      'es-ES': '🇪🇸'
    };
    return flags[lang] || '';
  };

  const getLanguageName = (lang) => {
    const names = {
      'pt-BR': 'Português (BR)',
      'en-US': 'English (US)',
      'es-ES': 'Español'
    };
    return names[lang] || lang;
  };

  const getTrafficSourceIcon = (source) => {
    if (source === 'facebook') return <Facebook className="w-4 h-4 text-blue-600" />;
    return null;
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
    if (status === 'active') {
      return <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Ativado</span>;
    }
    return <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">Pausado</span>;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <AdminLayout breadcrumbs={['Funis (lander)']}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout breadcrumbs={['Funis (lander)']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">
            {viewMode === 'lander' ? `Funis (lander) (${filteredFunnels.length})` : `Offers (Checkouts) (${filteredOffers.length})`}
          </h1>

          <div className="flex items-center gap-3">
            {viewMode === 'lander' && (
              <Button
                onClick={handleCreateFunnel}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus size={18} className="mr-2" />
                Novo Funil
              </Button>
            )}

            <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('source')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                viewMode === 'source'
                  ? 'bg-black text-white'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              Source (Checkout)
            </button>
            <button
              onClick={() => setViewMode('offer')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                viewMode === 'offer'
                  ? 'bg-black text-white'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              Offer (Ofertas)
            </button>
            <button
              onClick={() => setViewMode('lander')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                viewMode === 'lander'
                  ? 'bg-black text-white'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              Lander (Funis)
            </button>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Aplicativo
                </label>
                <select
                  value={selectedApp}
                  onChange={(e) => {
                    setSelectedApp(e.target.value);
                    setSelectedOffer('all');
                  }}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  {applications.length === 0 ? (
                    <option value="">Nenhum aplicativo cadastrado</option>
                  ) : (
                    applications.map(app => (
                      <option key={app.id} value={app.id}>{app.name}</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Oferta
                </label>
                <select
                  value={selectedOffer}
                  onChange={(e) => setSelectedOffer(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="all">Todas</option>
                  {offers.filter(o => o.application_id === selectedApp).map(offer => (
                    <option key={offer.id} value={offer.id}>{offer.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Idioma
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="all">Todos</option>
                  <option value="pt-BR">🇧🇷 Português (BR)</option>
                  <option value="en-US">🇺🇸 English (US)</option>
                  <option value="es-ES">🇪🇸 Español</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fonte de Tráfego
                </label>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="all">Todas</option>
                  <option value="facebook">Facebook</option>
                  <option value="google">Google</option>
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                  <option value="organic">Orgânico</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {currentApp && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                {currentApp.logo_url ? (
                  <div className="w-12 h-12 rounded-lg border-2 border-slate-200 overflow-hidden bg-white">
                    <img
                      src={currentApp.logo_url}
                      alt={currentApp.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                )}
                <h2 className="text-xl font-semibold text-slate-900">{currentApp.name}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentApp.landing_page_url && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                    <Globe className="w-5 h-5 text-slate-500 mt-0.5" />
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => window.open(currentApp.landing_page_url, '_blank')}
                    >
                      <p className="text-sm font-medium text-slate-700 mb-1">Landing Page</p>
                      <p className="text-sm text-purple-600 hover:text-purple-700 truncate">{currentApp.landing_page_url}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(currentApp.landing_page_url);
                      }}
                      className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                    >
                      <Copy size={16} className="text-slate-500" />
                    </button>
                  </div>
                )}

                {currentApp.webapp_url && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                    <Smartphone className="w-5 h-5 text-slate-500 mt-0.5" />
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => window.open(currentApp.webapp_url, '_blank')}
                    >
                      <p className="text-sm font-medium text-slate-700 mb-1">WebApp</p>
                      <p className="text-sm text-purple-600 hover:text-purple-700 truncate">{currentApp.webapp_url}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(currentApp.webapp_url);
                      }}
                      className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                    >
                      <Copy size={16} className="text-slate-500" />
                    </button>
                  </div>
                )}

                {currentApp.email && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                    <Mail className="w-5 h-5 text-slate-500 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 mb-1">Email</p>
                      <p className="text-sm text-slate-600 truncate">{currentApp.email}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(currentApp.email);
                      }}
                      className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                    >
                      <Copy size={16} className="text-slate-500" />
                    </button>
                  </div>
                )}

                {currentApp.instagram_url && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                    <Instagram className="w-5 h-5 text-slate-500 mt-0.5" />
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => window.open(currentApp.instagram_url, '_blank')}
                    >
                      <p className="text-sm font-medium text-slate-700 mb-1">Instagram</p>
                      <p className="text-sm text-purple-600 hover:text-purple-700 truncate">{currentApp.instagram_url}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(currentApp.instagram_url);
                      }}
                      className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                    >
                      <Copy size={16} className="text-slate-500" />
                    </button>
                  </div>
                )}

                {currentApp.custom_links && currentApp.custom_links.map((link, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                    <Globe className="w-5 h-5 text-slate-500 mt-0.5" />
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => window.open(link.url, '_blank')}
                    >
                      <p className="text-sm font-medium text-slate-700 mb-1">{link.label}</p>
                      <p className="text-sm text-purple-600 hover:text-purple-700 truncate">{link.url}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(link.url);
                      }}
                      className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                    >
                      <Copy size={16} className="text-slate-500" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {viewMode === 'lander' && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Nome do Funil</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Oferta (offer)</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Fonte de Tráfego</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Idioma</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Slug</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Link</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFunnels.map((funnel) => {
                  const offer = offers.find(o => o.id === funnel.offer_id);
                  const fullUrl = funnel.url || `${window.location.origin}/${funnel.slug}`;

                  return (
                    <tr key={funnel.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="text-purple-600 font-medium">{funnel.name}</span>
                      </td>
                      <td className="py-4 px-6">
                        {offer && (
                          <div>
                            <div className="font-medium text-slate-900">{offer.name}</div>
                            <div className="text-xs text-slate-500">quiz.auralyapp.com</div>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {getTrafficSourceIcon(funnel.traffic_source)}
                          <span className="text-slate-900">{getTrafficSourceName(funnel.traffic_source)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span>{getLanguageFlag(funnel.language)}</span>
                          <span className="text-slate-900">{getLanguageName(funnel.language)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <code className="text-sm text-slate-700 bg-slate-100 px-2 py-1 rounded">
                          {funnel.slug}
                        </code>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => window.open(fullUrl, '_blank')}
                            className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 text-slate-600" />
                          </button>
                          <button
                            onClick={() => copyToClipboard(fullUrl)}
                            className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                          >
                            <Copy className="w-4 h-4 text-slate-600" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(funnel.status)}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleEditFunnel(funnel)}
                          className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4 text-slate-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredFunnels.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600">Nenhum funil encontrado</p>
                <Button onClick={handleCreateFunnel} className="mt-4 bg-purple-600 hover:bg-purple-700">
                  Criar Primeiro Funil
                </Button>
              </div>
            )}
          </div>
        )}

        {viewMode === 'offer' && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Nome do Checkout</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Oferta (offer)</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Fonte de Tráfego</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Idioma</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Plataforma</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Link</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOffers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="text-purple-600 font-medium">{offer.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-slate-900">{offer.name}</div>
                        <div className="text-xs text-slate-500">quiz.auralyapp.com</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getTrafficSourceIcon(offer.traffic_source)}
                        <span className="text-slate-900">{getTrafficSourceName(offer.traffic_source || 'facebook')}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span>{getLanguageFlag(offer.language)}</span>
                        <span className="text-slate-900">{getLanguageName(offer.language || 'en-US')}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-slate-900">{offer.platform || 'Cartpanda'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(offer.checkout_url, '_blank')}
                          className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-slate-600" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(offer.checkout_url)}
                          className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                        >
                          <Copy className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(offer.status || 'active')}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => {
                          setEditingOffer(offer);
                          setIsOfferDialogOpen(true);
                        }}
                        className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4 text-slate-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOffers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600">Nenhuma oferta encontrada</p>
                <Button onClick={() => setIsOfferDialogOpen(true)} className="mt-4 bg-purple-600 hover:bg-purple-700">
                  Criar Primeira Oferta
                </Button>
              </div>
            )}
          </div>
        )}

        {viewMode === 'source' && (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <p className="text-slate-600">View Source (Checkout) - Em desenvolvimento</p>
          </div>
        )}
      </div>

      <FunnelDialog
        open={isFunnelDialogOpen}
        onClose={() => {
          setIsFunnelDialogOpen(false);
          setEditingFunnel(null);
        }}
        funnel={editingFunnel}
        applications={applications}
        offers={offers}
        onSave={handleSaveFunnel}
        onSaveOffer={handleSaveOffer}
      />

      <OfferDialog
        open={isOfferDialogOpen}
        onClose={() => {
          setIsOfferDialogOpen(false);
          setEditingOffer(null);
        }}
        offer={editingOffer}
        applications={applications}
        onSave={handleSaveOffer}
      />
    </AdminLayout>
  );
}

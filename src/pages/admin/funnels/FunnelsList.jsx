import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import FunnelDialog from '../../../components/admin/funnels/FunnelDialog';
import OfferDialog from '../../../components/admin/funnels/OfferDialog';
import {
  Plus,
  Edit,
  Copy,
  Globe,
  Smartphone,
  Mail,
  Instagram,
  Trash2
} from 'lucide-react';
import { useFunnels } from '../../../hooks/admin/useFunnels';
import { useApplications } from '../../../hooks/useApplications';
import { useOffers } from '../../../hooks/useOffers';

export default function FunnelsList() {
  const navigate = useNavigate();
  const { funnels, loading, createFunnel, updateFunnel, deleteFunnel } = useFunnels();
  const { applications } = useApplications();
  const { offers, createOffer, updateOffer } = useOffers();

  const [selectedApp, setSelectedApp] = useState('');
  const [selectedOffer, setSelectedOffer] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');

  const [isFunnelDialogOpen, setIsFunnelDialogOpen] = useState(false);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [editingFunnel, setEditingFunnel] = useState(null);
  const [editingOffer, setEditingOffer] = useState(null);

  const [filteredFunnels, setFilteredFunnels] = useState([]);

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

  const filteredOffers = offers.filter(o => o.application_id === selectedApp);

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
        alert(editingFunnel ? 'Funil atualizado!' : 'Funil criado!');
        setIsFunnelDialogOpen(false);
      } else {
        alert(result.error || 'Erro ao salvar funil');
      }
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };

  const handleDeleteFunnel = async (id, name) => {
    if (!confirm(`Deseja deletar o funil "${name}"?`)) return;

    const result = await deleteFunnel(id);
    if (result.success) {
      alert('Funil deletado!');
    } else {
      alert(result.error || 'Erro ao deletar');
    }
  };

  const handleViewFunnel = (funnel) => {
    navigate(`/admin/funnels/${funnel.id}`);
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
        alert(editingOffer ? 'Oferta atualizada!' : 'Oferta criada!');
        setIsOfferDialogOpen(false);
      } else {
        alert(result.error || 'Erro ao salvar oferta');
      }
    } catch (err) {
      alert('Erro: ' + err.message);
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
      <AdminLayout breadcrumbs={['Funis (lander)']}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando funis...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout breadcrumbs={['Funis (lander)']}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-slate-900">Funis (lander)</h1>
          <button
            onClick={handleCreateFunnel}
            className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        <p className="text-slate-600">
          Gerencie os funis de vendas por aplicativo
        </p>

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
                  {filteredOffers.map(offer => (
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
                <button className="ml-auto p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Edit size={18} className="text-slate-600" />
                </button>
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
                        navigator.clipboard.writeText(currentApp.landing_page_url);
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
                        navigator.clipboard.writeText(currentApp.webapp_url);
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
                        navigator.clipboard.writeText(currentApp.email);
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
                        navigator.clipboard.writeText(currentApp.instagram_url);
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
                        navigator.clipboard.writeText(link.url);
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

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Funis ({filteredFunnels.length})
          </h2>

          {filteredFunnels.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-slate-600">Nenhum funil encontrado</p>
                <Button onClick={handleCreateFunnel} className="mt-4 bg-purple-600 hover:bg-purple-700">
                  Criar Primeiro Funil
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredFunnels.map((funnel) => {
                const app = applications.find(a => a.id === funnel.application_id);
                const offer = offers.find(o => o.id === funnel.offer_id);
                const lang = getLanguageDisplay(funnel.language);

                return (
                  <Card
                    key={funnel.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleViewFunnel(funnel)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {funnel.name}
                            </h3>
                            {getStatusBadge(funnel.status)}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-slate-500 mb-1">Aplicativo</p>
                              <p className="font-medium text-slate-900">{app?.name || '-'}</p>
                            </div>
                            <div>
                              <p className="text-slate-500 mb-1">Oferta</p>
                              <p className="font-medium text-slate-900">{offer?.name || '-'}</p>
                            </div>
                            <div>
                              <p className="text-slate-500 mb-1">Idioma</p>
                              <p className="font-medium text-slate-900">
                                {lang.flag} {lang.name}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500 mb-1">Fonte</p>
                              <p className="font-medium text-slate-900 capitalize">
                                {funnel.traffic_source || '-'}
                              </p>
                            </div>
                          </div>

                          {funnel.slug && (
                            <div className="mt-3">
                              <p className="text-xs text-slate-500">Slug: <span className="font-mono text-slate-700">{funnel.slug}</span></p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditFunnel(funnel)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteFunnel(funnel.id, funnel.name)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
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

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import {
  Plus,
  Edit,
  ExternalLink,
  Copy,
  Globe,
  Smartphone,
  Mail,
  Instagram,
  BarChart3
} from 'lucide-react';
import { useFunnels } from '../../../hooks/admin/useFunnels';
import { useApplications } from '../../../hooks/useApplications';

export default function FunnelsList() {
  const { funnels, loading } = useFunnels();
  const { applications } = useApplications();
  const [selectedApp, setSelectedApp] = useState('all');
  const [selectedOffer, setSelectedOffer] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [activeTab, setActiveTab] = useState('lander');
  const [filteredFunnels, setFilteredFunnels] = useState([]);

  const currentApp = applications.find(app => app.slug === selectedApp) ||
    (selectedApp === 'all' && applications.length > 0 ? applications[0] : null);

  useEffect(() => {
    let filtered = funnels;
    setFilteredFunnels(filtered);
  }, [funnels, selectedApp, selectedOffer, selectedLanguage, selectedSource]);

  const getOfferName = (slug) => {
    if (slug.includes('soulmate') || slug.includes('funnel-2') || slug.includes('aff2')) {
      return 'Soulmate Map';
    }
    return 'Palm Reading';
  };

  const getOfferDomain = (slug) => {
    return 'quiz.auralyapp.com';
  };

  const getSourceIcon = (slug) => {
    if (slug.includes('aff')) return { icon: 'Orgânico', color: 'text-green-600' };
    if (slug.includes('tt')) return { icon: 'TikTok', color: 'text-slate-900' };
    return { icon: 'Facebook', color: 'text-blue-600' };
  };

  const getLanguage = (slug) => {
    if (slug.includes('esp')) return { flag: '🇪🇸', name: 'Español' };
    return { flag: '🇺🇸', name: 'English (US)' };
  };

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Ativado</span>;
    }
    return <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">Pausado</span>;
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
          <button className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors">
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
                  onChange={(e) => setSelectedApp(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="all">Auraly App</option>
                  {applications.map(app => (
                    <option key={app.id} value={app.slug}>{app.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Oferta (offer)
                </label>
                <select
                  value={selectedOffer}
                  onChange={(e) => setSelectedOffer(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="all">Todas as ofertas</option>
                  <option value="soulmate">Soulmate Map</option>
                  <option value="palm">Palm Reading</option>
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
                  <option value="all">Todos os idiomas</option>
                  <option value="en">🇺🇸 English (US)</option>
                  <option value="es">🇪🇸 Español</option>
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
                  <option value="all">Todas as fontes</option>
                  <option value="facebook">Facebook</option>
                  <option value="tiktok">TikTok</option>
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
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 mb-1">Landing Page</p>
                      <p className="text-sm text-slate-600 truncate">{currentApp.landing_page_url}</p>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(currentApp.landing_page_url)}
                      className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                    >
                      <Copy size={16} className="text-slate-500" />
                    </button>
                  </div>
                )}

                {currentApp.webapp_url && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                    <Smartphone className="w-5 h-5 text-slate-500 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 mb-1">WebApp</p>
                      <p className="text-sm text-slate-600 truncate">{currentApp.webapp_url}</p>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(currentApp.webapp_url)}
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
                      onClick={() => navigator.clipboard.writeText(currentApp.email)}
                      className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                    >
                      <Copy size={16} className="text-slate-500" />
                    </button>
                  </div>
                )}

                {currentApp.instagram_url && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                    <Instagram className="w-5 h-5 text-slate-500 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 mb-1">Instagram</p>
                      <p className="text-sm text-slate-600 truncate">{currentApp.instagram_url}</p>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(currentApp.instagram_url)}
                      className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                    >
                      <Copy size={16} className="text-slate-500" />
                    </button>
                  </div>
                )}

                {currentApp.custom_links && currentApp.custom_links.map((link, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                    <Globe className="w-5 h-5 text-slate-500 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 mb-1">{link.label}</p>
                      <p className="text-sm text-slate-600 truncate">{link.url}</p>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(link.url)}
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

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            Funis (lander) ({filteredFunnels.length})
          </h2>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('source')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'source'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Source (Checkout)
            </button>
            <button
              onClick={() => setActiveTab('offer')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'offer'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Offer (Ofertas)
            </button>
            <button
              onClick={() => setActiveTab('lander')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'lander'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Lander (Funis)
            </button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Nome do Funil
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Oferta (offer)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Fonte de Tráfego
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Idioma
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Link
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredFunnels.map((funnel) => {
                    const source = getSourceIcon(funnel.slug);
                    const language = getLanguage(funnel.slug);

                    return (
                      <tr key={funnel.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/admin/funnels/${funnel.id}/edit`}
                            className="text-sm font-medium text-purple-600 hover:text-purple-800"
                          >
                            {funnel.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{getOfferName(funnel.slug)}</p>
                            <p className="text-xs text-slate-500">{getOfferDomain(funnel.slug)}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${source.color}`}>
                            {source.icon}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{language.flag}</span>
                            <span className="text-sm text-slate-700">{language.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-700">
                            {funnel.slug}
                          </code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Link
                              to={`/${funnel.slug}`}
                              target="_blank"
                              className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                            >
                              <ExternalLink size={16} className="text-slate-600" />
                            </Link>
                            <button className="p-1.5 hover:bg-slate-100 rounded transition-colors">
                              <Copy size={16} className="text-slate-600" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(funnel.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/admin/funnels/${funnel.id}/edit`}
                            className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
                          >
                            <Edit size={16} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

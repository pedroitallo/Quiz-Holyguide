import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import StatCard from '../../../components/admin/ui/StatCard';
import { Button } from '../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import {
  Layers,
  Eye,
  TrendingUp,
  FlaskConical,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { fetchAllFunnelsAnalytics, getDateFilter } from '../../../utils/analyticsQueries';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalFunnels: 0,
    sessionsToday: 0,
    averageRetention: 0,
    activeABTests: 0
  });
  const [topFunnels, setTopFunnels] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: '7days',
    offer: 'all',
    language: 'all',
    trafficSource: 'all'
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (!loading) {
      loadTopFunnels();
    }
  }, [filters]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadMetrics(),
        loadTopFunnels()
      ]);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async () => {
    const { data: funnelsCount } = await supabase
      .from('funnels')
      .select('id', { count: 'exact', head: true });

    const { data: abTestsCount } = await supabase
      .from('ab_tests')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active');

    const todayFilter = getDateFilter('today');
    const analyticsData = await fetchAllFunnelsAnalytics(todayFilter);

    const allFunnelsRetention = await calculateAverageRetention();

    setMetrics({
      totalFunnels: funnelsCount?.length || 0,
      sessionsToday: analyticsData.totalSessions || 0,
      averageRetention: allFunnelsRetention,
      activeABTests: abTestsCount?.length || 0
    });
  };

  const loadTopFunnels = async () => {
    const dateFilter = getDateFilter(filters.dateRange);

    const { data: funnels } = await supabase
      .from('funnels')
      .select('*')
      .eq('status', 'active');

    if (!funnels) return;

    const tableMap = {
      'funnel-1': 'step_views_funnel_1',
      'funnel-2': 'step_views_funnel_2',
      'funnel-3': 'step_views_funnel_3',
      'funnel-esp': 'step_views_funnel_esp',
      'funnel-aff': 'step_views_funnel_aff',
      'funnel-aff2': 'step_views_funnel_aff2',
      'funnel2-esp': 'step_views_funnel2_esp'
    };

    const funnelsWithStats = await Promise.all(
      funnels.map(async (funnel) => {
        const tableName = tableMap[funnel.slug];

        if (tableName) {
          let query = supabase
            .from(tableName)
            .select('session_id');

          if (dateFilter) {
            query = query.gte('viewed_at', dateFilter);
          }

          const { data: sessions, error } = await query;

          if (!error && sessions) {
            const uniqueSessions = new Set(sessions.map(s => s.session_id)).size;
            return { ...funnel, sessions: uniqueSessions };
          }
        }

        return { ...funnel, sessions: 0 };
      })
    );

    setTopFunnels(funnelsWithStats.sort((a, b) => b.sessions - a.sessions));
  };

  const calculateAverageRetention = async () => {
    try {
      const tables = [
        'step_views_funnel_1',
        'step_views_funnel_2',
        'step_views_funnel_3',
        'step_views_funnel_esp',
        'step_views_funnel_aff',
        'step_views_funnel_aff2',
        'step_views_funnel2_esp'
      ];

      const retentionPromises = tables.map(async (tableName) => {
        const { data: allSessions } = await supabase
          .from(tableName)
          .select('session_id')
          .limit(1000);

        if (!allSessions || allSessions.length === 0) return 0;

        const uniqueSessions = [...new Set(allSessions.map(s => s.session_id))];
        const totalSessions = uniqueSessions.length;

        const completedSessionsPromises = uniqueSessions.map(async (sessionId) => {
          const { data: sessionData } = await supabase
            .from(tableName)
            .select('*')
            .eq('session_id', sessionId)
            .maybeSingle();

          return sessionData?.paywall === true || sessionData?.thank_you === true;
        });

        const completedResults = await Promise.all(completedSessionsPromises);
        const completedCount = completedResults.filter(Boolean).length;

        return totalSessions > 0 ? (completedCount / totalSessions) * 100 : 0;
      });

      const allRetentions = await Promise.all(retentionPromises);
      const validRetentions = allRetentions.filter(r => r > 0);

      if (validRetentions.length === 0) return 0;

      return validRetentions.reduce((sum, r) => sum + r, 0) / validRetentions.length;
    } catch (error) {
      console.error('Error calculating retention:', error);
      return 0;
    }
  };

  if (loading) {
    return (
      <AdminLayout breadcrumbs={['Dashboard']}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout breadcrumbs={['Dashboard']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Visão geral da sua plataforma</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total de Funis"
            value={metrics.totalFunnels}
            icon={Layers}
            iconColor="blue"
            to="/admin/analytics"
          />
          <StatCard
            title="Sessões Hoje"
            value={metrics.sessionsToday}
            icon={Eye}
            iconColor="green"
            to="/admin/analytics"
          />
          <StatCard
            title="Retenção Média"
            value={`${metrics.averageRetention.toFixed(1)}%`}
            icon={TrendingUp}
            iconColor="purple"
            to="/admin/analytics"
          />
          <StatCard
            title="Testes A/B Ativos"
            value={metrics.activeABTests}
            icon={FlaskConical}
            iconColor="orange"
            to="/admin/ab-tests"
          />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sessões por Funis</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ dateRange: '7days', offer: 'all', language: 'all', trafficSource: 'all' })}
            >
              <RefreshCw size={16} className="mr-2" />
              Limpar Filtros
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Data</label>
                <Select value={filters.dateRange} onValueChange={(value) => setFilters({ ...filters, dateRange: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="7days">Últimos 7 dias</SelectItem>
                    <SelectItem value="30days">Últimos 30 dias</SelectItem>
                    <SelectItem value="all">Todo período</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Oferta</label>
                <Select value={filters.offer} onValueChange={(value) => setFilters({ ...filters, offer: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Idioma</label>
                <Select value={filters.language} onValueChange={(value) => setFilters({ ...filters, language: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="en">Inglês</SelectItem>
                    <SelectItem value="es">Espanhol</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Fonte de Tráfego</label>
                <Select value={filters.trafficSource} onValueChange={(value) => setFilters({ ...filters, trafficSource: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="organic">Orgânico</SelectItem>
                    <SelectItem value="paid">Pago</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {topFunnels.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                Nenhum funil encontrado
              </p>
            ) : (
              <div>
                <p className="text-sm text-slate-600 mb-4">
                  Mostrando {topFunnels.length} funis
                </p>
                <div className="space-y-3">
                  {topFunnels.map((funnel) => (
                    <div
                      key={funnel.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{funnel.name}</p>
                        <p className="text-xs text-slate-500">/{funnel.slug}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-slate-900">{funnel.sessions}</p>
                          <p className="text-xs text-slate-500">sessões</p>
                        </div>
                        <Link
                          to={`/${funnel.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" variant="ghost">
                            <ExternalLink size={16} />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

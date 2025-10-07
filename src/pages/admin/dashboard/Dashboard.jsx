import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import StatCard from '../../../components/admin/ui/StatCard';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import {
  Layers,
  Eye,
  TrendingUp,
  FlaskConical,
  Plus,
  BarChart3,
  Upload,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { fetchAllFunnelsAnalytics, getDateFilter } from '../../../utils/analyticsQueries';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalFunnels: 0,
    sessionsToday: 0,
    averageConversion: 0,
    activeABTests: 0
  });
  const [topFunnels, setTopFunnels] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadMetrics(),
        loadTopFunnels(),
        loadRecentActivity(),
        loadAlerts()
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

    setMetrics({
      totalFunnels: funnelsCount?.length || 0,
      sessionsToday: analyticsData.totalSessions || 0,
      averageConversion: analyticsData.retention || 0,
      activeABTests: abTestsCount?.length || 0
    });
  };

  const loadTopFunnels = async () => {
    const last7Days = getDateFilter('7days');

    const { data: funnels } = await supabase
      .from('funnels')
      .select('*')
      .eq('status', 'active')
      .limit(5);

    if (!funnels) return;

    const funnelsWithStats = await Promise.all(
      funnels.map(async (funnel) => {
        const tables = [
          'step_views_funnel01',
          'step_views_funnel_tt',
          'step_views_funnel_vsl',
          'step_views_funnelesp',
          'step_views_funnel_star2',
          'step_views_funnel_star3',
          'step_views_funnel_star4',
          'step_views_funnel_star5'
        ];

        const tableName = tables.find(t => t.includes(funnel.slug.replace('-', '_')));

        if (tableName) {
          const { data: sessions, error } = await supabase
            .from(tableName)
            .select('session_id', { count: 'exact' })
            .gte('viewed_at', last7Days.start)
            .eq('step_name', 'intro');

          if (!error) {
            const uniqueSessions = new Set(sessions?.map(s => s.session_id) || []).size;
            return { ...funnel, sessions: uniqueSessions };
          }
        }

        return { ...funnel, sessions: 0 };
      })
    );

    setTopFunnels(funnelsWithStats.sort((a, b) => b.sessions - a.sessions));
  };

  const loadRecentActivity = async () => {
    const { data } = await supabase
      .from('admin_activity_logs')
      .select('*, admin_users(email)')
      .order('created_at', { ascending: false })
      .limit(5);

    setRecentActivity(data || []);
  };

  const loadAlerts = async () => {
    setAlerts([
      {
        type: 'info',
        message: 'Sistema funcionando normalmente'
      }
    ]);
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
            title="Total de Quizzes"
            value={metrics.totalFunnels}
            icon={Layers}
            iconColor="blue"
          />
          <StatCard
            title="Sessões Hoje"
            value={metrics.sessionsToday}
            icon={Eye}
            iconColor="green"
          />
          <StatCard
            title="Conversão Média"
            value={`${metrics.averageConversion.toFixed(1)}%`}
            icon={TrendingUp}
            iconColor="purple"
          />
          <StatCard
            title="Testes A/B Ativos"
            value={metrics.activeABTests}
            icon={FlaskConical}
            iconColor="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link to="/admin/analytics">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BarChart3 size={18} />
                  Ver Analytics
                </Button>
              </Link>
              <Link to="/admin/funnels">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Layers size={18} />
                  Gerenciar Quizzes
                </Button>
              </Link>
              <Link to="/admin/files">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Upload size={18} />
                  Upload Arquivos
                </Button>
              </Link>
              <Link to="/admin/ab-tests">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FlaskConical size={18} />
                  Testes A/B
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top 5 Quizzes (7 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              {topFunnels.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  Nenhum quiz ativo encontrado
                </p>
              ) : (
                <div className="space-y-3">
                  {topFunnels.map((funnel) => (
                    <div
                      key={funnel.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{funnel.name}</p>
                        <p className="text-xs text-slate-500">/{funnel.slug}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-bold text-slate-900">{funnel.sessions}</p>
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
              )}
            </CardContent>
          </Card>
        </div>

        {alerts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Alertas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700">{alert.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">
                Nenhuma atividade registrada
              </p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">
                        <span className="font-medium">{activity.admin_users?.email}</span>
                        {' '}{activity.action} {activity.resource_type}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(activity.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

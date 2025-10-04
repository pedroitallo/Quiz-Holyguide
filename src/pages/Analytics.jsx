import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowRight, LogOut, TrendingUp } from 'lucide-react';

const FUNNEL_OPTIONS = [
  { value: 'all', label: 'Todos os Funis' },
  { value: 'funnel-1', label: 'Funnel 1' },
  { value: 'funnel-tt', label: 'Funnel TT' },
  { value: 'funnel-vsl', label: 'Funnel VSL' },
  { value: 'funnelesp', label: 'Funnel ESP' },
];

const DATE_RANGES = [
  { value: 'today', label: 'Hoje' },
  { value: '7days', label: 'Últimos 7 dias' },
  { value: '30days', label: 'Últimos 30 dias' },
  { value: 'all', label: 'Todo período' },
];

export default function Analytics() {
  const { admin, logout, loading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [funnelData, setFunnelData] = useState([]);
  const [selectedFunnel, setSelectedFunnel] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('7days');

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate('/admin/login');
    }
  }, [admin, authLoading, navigate]);

  useEffect(() => {
    if (admin) {
      fetchAnalytics();
    }
  }, [admin, selectedFunnel, selectedDateRange]);

  const getDateFilter = () => {
    const now = new Date();
    switch (selectedDateRange) {
      case 'today':
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return today.toISOString();
      case '7days':
        const sevenDays = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return sevenDays.toISOString();
      case '30days':
        const thirtyDays = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return thirtyDays.toISOString();
      default:
        return null;
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('analytics_events')
        .select('*')
        .eq('event_type', 'view');

      if (selectedFunnel !== 'all') {
        query = query.eq('funnel_type', selectedFunnel);
      }

      const dateFilter = getDateFilter();
      if (dateFilter) {
        query = query.gte('created_at', dateFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      const stepStats = processAnalyticsData(data);
      setFunnelData(stepStats);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (events) => {
    const stepMap = new Map();

    events.forEach(event => {
      const key = `${event.funnel_type}:${event.step_name}`;
      if (!stepMap.has(key)) {
        stepMap.set(key, {
          funnel: event.funnel_type,
          stepName: event.step_name,
          userIds: new Set(),
        });
      }
      stepMap.get(key).userIds.add(event.user_id);
    });

    const steps = Array.from(stepMap.values()).map(step => ({
      funnel: step.funnel,
      stepName: step.stepName,
      uniqueViews: step.userIds.size,
    }));

    const funnelGroups = {};
    steps.forEach(step => {
      if (!funnelGroups[step.funnel]) {
        funnelGroups[step.funnel] = [];
      }
      funnelGroups[step.funnel].push(step);
    });

    Object.keys(funnelGroups).forEach(funnel => {
      funnelGroups[funnel].sort((a, b) => {
        const stepOrder = ['welcome', 'video', 'card-selection', 'name', 'birth-data', 'location', 'love-situation', 'loading', 'results', 'paywall', 'thank-you'];
        return stepOrder.indexOf(a.stepName) - stepOrder.indexOf(b.stepName);
      });
    });

    return funnelGroups;
  };

  const calculateConversionRate = (current, next) => {
    if (!current || !next) return 0;
    return ((next / current) * 100).toFixed(1);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
            <p className="text-slate-600 mt-1">Bem-vindo, {admin.name}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Funil
              </label>
              <Select value={selectedFunnel} onValueChange={setSelectedFunnel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FUNNEL_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Período
              </label>
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATE_RANGES.map(range => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {Object.keys(funnelData).length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-500">Nenhum dado disponível para os filtros selecionados</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(funnelData).map(([funnel, steps]) => (
              <div key={funnel}>
                <h2 className="text-xl font-bold text-slate-800 mb-4 capitalize">
                  {FUNNEL_OPTIONS.find(f => f.value === funnel)?.label || funnel}
                </h2>
                <div className="flex flex-wrap items-center gap-4">
                  {steps.map((step, index) => {
                    const nextStep = steps[index + 1];
                    const conversionRate = nextStep
                      ? calculateConversionRate(step.uniqueViews, nextStep.uniqueViews)
                      : null;

                    return (
                      <div key={`${funnel}-${step.stepName}`} className="flex items-center gap-4">
                        <Card className="w-[220px] hover:shadow-lg transition-shadow">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-slate-600 capitalize">
                              {step.stepName.replace(/-/g, ' ')}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-slate-900">
                              {step.uniqueViews}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">visualizações únicas</p>
                          </CardContent>
                        </Card>

                        {nextStep && (
                          <div className="flex flex-col items-center gap-1 text-slate-600">
                            <ArrowRight className="w-8 h-8" />
                            <div className="flex items-center gap-1 text-sm font-semibold">
                              <TrendingUp className="w-3 h-3" />
                              {conversionRate}%
                            </div>
                            <div className="text-xs text-slate-500">
                              {nextStep.uniqueViews} usuários
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

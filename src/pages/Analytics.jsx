import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { LogOut, RefreshCw, Eye, ArrowRight, Calendar } from 'lucide-react';
import { fetchFunnelAnalytics, fetchAllFunnelsAnalytics, getDateFilter } from '../utils/analyticsQueries';
import ABTestDialog from '../components/analytics/ABTestDialog';

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
  { value: 'custom', label: 'Personalizado' },
];

export default function Analytics() {
  const { admin, logout, loading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedFunnel, setSelectedFunnel] = useState('funnel-1');
  const [selectedDateRange, setSelectedDateRange] = useState('today');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [analyticsData, setAnalyticsData] = useState({
    totalSessions: 0,
    startQuiz: 0,
    endQuiz: 0,
    startQuizRate: 0,
    endQuizRate: 0,
    retention: 0,
    steps: [],
  });

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate('/admin/login');
    }
  }, [admin, authLoading, navigate]);

  useEffect(() => {
    if (admin) {
      fetchAnalytics();
    }
  }, [admin, selectedFunnel, selectedDateRange, customStartDate, customEndDate]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      let dateFilter;
      if (selectedDateRange === 'custom') {
        dateFilter = {
          start: customStartDate ? new Date(customStartDate).toISOString() : null,
          end: customEndDate ? new Date(customEndDate + 'T23:59:59').toISOString() : null,
        };
      } else {
        dateFilter = getDateFilter(selectedDateRange);
      }

      let data;
      if (selectedFunnel === 'all') {
        data = await fetchAllFunnelsAnalytics(dateFilter);
      } else {
        data = await fetchFunnelAnalytics(selectedFunnel, dateFilter);
      }

      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
            <h1 className="text-3xl font-bold text-slate-900">Dashboard de Analytics</h1>
            <p className="text-slate-600 mt-1">Acompanhe o desempenho de cada funil</p>
          </div>
          <div className="flex gap-3">
            <ABTestDialog onTestChange={fetchAnalytics} />
            <Button onClick={fetchAnalytics} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </Button>
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="flex gap-4 flex-wrap p-6">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Selecionar Funil
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
            {selectedDateRange === 'custom' && (
              <>
                <div className="flex-1 min-w-[180px]">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Data Início
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Data Fim
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </>
            )}
            <div className="flex flex-col justify-end">
              <div className="text-sm text-slate-600 bg-white px-4 py-2 rounded-md border">
                {getCurrentDate()}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-600">Total de Sessões</span>
              </div>
              <div className="text-3xl font-bold text-blue-600">{analyticsData.totalSessions}</div>
              <div className="text-xs text-slate-500 mt-1">Sessões únicas</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-600">Start Quiz</span>
              </div>
              <div className="text-3xl font-bold text-green-600">{analyticsData.startQuiz}</div>
              <div className="text-xs text-slate-500 mt-1">
                {analyticsData.startQuizRate.toFixed(1)}% das sessões
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-600">End Quiz</span>
              </div>
              <div className="text-3xl font-bold text-blue-600">{analyticsData.endQuiz}</div>
              <div className="text-xs text-slate-500 mt-1">
                {analyticsData.endQuizRate.toFixed(1)}% das sessões
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-600">Retenção</span>
              </div>
              <div className="text-3xl font-bold text-orange-600">{analyticsData.retention.toFixed(1)}%</div>
              <div className="text-xs text-slate-500 mt-1">
                End Quiz / Start Quiz
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Funil de Conversão - {selectedFunnel === 'all' ? 'Todos os Funis' : FUNNEL_OPTIONS.find(f => f.value === selectedFunnel)?.label}
            </CardTitle>
            <p className="text-sm text-slate-600">
              Visualize quantos usuários visualizaram cada etapa do funil
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-3 min-w-min">
                {analyticsData.steps.map((step, index) => (
                  <Card key={step.key} className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 hover:border-blue-300 transition-all flex-shrink-0 w-[240px]">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                          </div>
                          <h3 className="text-sm font-semibold text-slate-900">{step.label}</h3>
                        </div>
                        <Eye className="w-4 h-4 text-blue-500" />
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Total de Views</p>
                          <p className="text-2xl font-bold text-blue-600">{step.views}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-200">
                          <p className="text-xs text-slate-600 mb-1">Taxa de Visualização</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full transition-all"
                                style={{ width: `${Math.min(step.percentage, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-700 min-w-[2.5rem] text-right">
                              {step.percentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        {index < analyticsData.steps.length - 1 && step.views > 0 && (
                          <div className="pt-2">
                            <div className="flex items-center gap-1 text-slate-900">
                              <ArrowRight className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                Próxima: {analyticsData.steps[index + 1]?.views || 0} ({step.nextStepPassage.toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {analyticsData.steps.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <Eye className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-lg">Nenhum dado encontrado para o período selecionado</p>
                <p className="text-sm mt-2">Tente selecionar um período diferente ou outro funil</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { LogOut, TrendingUp, Users, DollarSign, Target, ShoppingCart, Eye, ArrowRight, Trash2, RefreshCw } from 'lucide-react';

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
  const [selectedFunnel, setSelectedFunnel] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('7days');
  const [analyticsData, setAnalyticsData] = useState({
    totalVisitors: 0,
    startQuiz: 0,
    paywall: 0,
    checkout: 0,
    retention: 0,
    passage: 0,
    sales: 0,
    generalConversion: 0,
    funnelSteps: []
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
      let query = supabase.from('Funnel01').select('*');

      if (selectedFunnel !== 'all') {
        query = query.eq('funnel_type', selectedFunnel);
      }

      const dateFilter = getDateFilter();
      if (dateFilter) {
        query = query.gte('created_at', dateFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      const processedData = processAnalyticsData(data || []);
      setAnalyticsData(processedData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (data) => {
    const totalVisitors = data.length;
    
    // Contar etapas específicas
    const videoStepViewed = data.filter(item => item.video_step_viewed).length;
    const nameCollectionViewed = data.filter(item => item.name_collection_step_viewed).length;
    const birthDataViewed = data.filter(item => item.birth_data_collection_step_viewed).length;
    const loveSituationViewed = data.filter(item => item.love_situation_step_viewed).length;
    const palmReadingViewed = data.filter(item => item.palm_reading_results_step_viewed).length;
    const loadingRevelationViewed = data.filter(item => item.loading_revelation_step_viewed).length;
    const paywallViewed = data.filter(item => item.paywall_step_viewed).length;
    const pitchViewed = data.filter(item => item.pitch_step_viewed).length;
    const checkoutClicked = data.filter(item => item.checkout_step_clicked).length;

    // Calcular métricas principais
    const startQuiz = videoStepViewed;
    const paywall = paywallViewed;
    const checkout = checkoutClicked;
    
    // Calcular vendas baseado nos dados reais (assumindo que temos um campo de vendas ou usando uma estimativa)
    // Por enquanto, vamos usar 0 até termos dados reais de vendas
    const sales = 0; // TODO: Implementar quando tivermos dados de vendas reais
    
    // Calcular percentuais
    const startQuizPercent = totalVisitors > 0 ? (startQuiz / totalVisitors * 100) : 0;
    const paywallPercent = startQuiz > 0 ? (paywall / startQuiz * 100) : 0;
    const checkoutPercent = paywall > 0 ? (checkout / paywall * 100) : 0;
    const retentionPercent = totalVisitors > 0 ? (paywall / totalVisitors * 100) : 0;
    const passagePercent = paywall > 0 ? (checkout / paywall * 100) : 0;
    const generalConversion = totalVisitors > 0 ? (sales / totalVisitors * 100) : 0;

    // Dados do funil de conversão
    const funnelSteps = [
      {
        name: 'Amor',
        subtitle: 'love_situation_step_viewed',
        value: loveSituationViewed,
        retention: totalVisitors > 0 ? (loveSituationViewed / totalVisitors * 100) : 0,
        nextRetention: loveSituationViewed > 0 ? (palmReadingViewed / loveSituationViewed * 100) : 0,
        color: 'purple'
      },
      {
        name: 'Leitura Palma',
        subtitle: 'palm_reading_results_step_viewed',
        value: palmReadingViewed,
        retention: totalVisitors > 0 ? (palmReadingViewed / totalVisitors * 100) : 0,
        nextRetention: palmReadingViewed > 0 ? (loadingRevelationViewed / palmReadingViewed * 100) : 0,
        color: 'purple'
      },
      {
        name: 'Revelação',
        subtitle: 'loading_revelation_step_viewed',
        value: loadingRevelationViewed,
        retention: totalVisitors > 0 ? (loadingRevelationViewed / totalVisitors * 100) : 0,
        nextRetention: loadingRevelationViewed > 0 ? (paywallViewed / loadingRevelationViewed * 100) : 0,
        color: 'purple'
      },
      {
        name: 'Paywall',
        subtitle: 'paywall_step_viewed',
        value: paywallViewed,
        retention: totalVisitors > 0 ? (paywallViewed / totalVisitors * 100) : 0,
        nextRetention: paywallViewed > 0 ? (pitchViewed / paywallViewed * 100) : 0,
        color: 'purple'
      },
      {
        name: 'Pitch',
        subtitle: 'pitch_step_viewed',
        value: pitchViewed,
        retention: totalVisitors > 0 ? (pitchViewed / totalVisitors * 100) : 0,
        pitchVsl: paywallViewed > 0 ? (pitchViewed / paywallViewed * 100) : 0,
        nextRetention: pitchViewed > 0 ? (checkoutClicked / pitchViewed * 100) : 0,
        color: 'blue'
      },
      {
        name: 'Checkout',
        subtitle: 'checkout_step_clicked',
        value: checkoutClicked,
        retention: totalVisitors > 0 ? (checkoutClicked / totalVisitors * 100) : 0,
        // CVR será calculado quando tivermos dados de vendas reais
        cvr: 0, // TODO: Implementar quando tivermos dados de vendas
        color: 'purple'
      }
    ];

    return {
      totalVisitors,
      startQuiz,
      paywall,
      checkout,
      retention: retentionPercent,
      passage: passagePercent,
      sales,
      generalConversion,
      startQuizPercent,
      paywallPercent,
      checkoutPercent,
      funnelSteps
    };
  };

  const clearData = async () => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      try {
        const { error } = await supabase.from('Funnel01').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) throw error;
        await fetchAnalytics();
        alert('Dados limpos com sucesso!');
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('Erro ao limpar dados');
      }
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
      year: '2-digit' 
    });
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard de Analytics</h1>
            <p className="text-slate-600 mt-1">Acompanhe o desempenho do seu quiz</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={clearData} variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
              <Trash2 className="w-4 h-4" />
              Limpar Dados
            </Button>
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

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="flex gap-4 flex-wrap p-6">
            <div className="flex-1 min-w-[200px]">
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
            <div className="text-sm text-slate-600 flex items-center">
              {getCurrentDate()}
            </div>
          </CardContent>
        </Card>

        {/* Main Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {/* Total Visitantes */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-600">Total de Visitantes</span>
              </div>
              <div className="text-2xl font-bold">{analyticsData.totalVisitors}</div>
              <div className="text-xs text-slate-500">Visitantes únicos</div>
            </CardContent>
          </Card>

          {/* Start Quiz */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-600">Start Quiz</span>
              </div>
              <div className="text-2xl font-bold">{analyticsData.startQuiz}</div>
              <div className="text-xs text-slate-500">
                {analyticsData.startQuizPercent.toFixed(1)}% dos visitantes
              </div>
            </CardContent>
          </Card>

          {/* Paywall */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-600">Paywall</span>
              </div>
              <div className="text-2xl font-bold">{analyticsData.paywall}</div>
              <div className="text-xs text-slate-500">
                {analyticsData.paywallPercent.toFixed(1)}% dos que iniciaram
              </div>
            </CardContent>
          </Card>

          {/* Checkout */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-slate-600">Checkout</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{analyticsData.checkout}</div>
              <div className="text-xs text-slate-500">Cliques no checkout</div>
            </CardContent>
          </Card>

          {/* Retenção */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-600">Retenção</span>
              </div>
              <div className="text-2xl font-bold">{analyticsData.retention.toFixed(1)}%</div>
              <div className="text-xs text-slate-500">Paywall / Visitantes</div>
            </CardContent>
          </Card>

          {/* Passagem */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-slate-600">Passagem</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{analyticsData.passage.toFixed(1)}%</div>
              <div className="text-xs text-slate-500">Checkout / Paywall</div>
            </CardContent>
          </Card>

          {/* Vendas */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm text-slate-600">Vendas</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{analyticsData.sales}</div>
              <div className="text-xs text-slate-500">Vendas confirmadas</div>
            </CardContent>
          </Card>

          {/* Conversão Geral */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-slate-600">Conversão Geral</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{analyticsData.generalConversion.toFixed(1)}%</div>
              <div className="text-xs text-slate-500">Vendas / Visitantes</div>
            </CardContent>
          </Card>
        </div>

        {/* Funnel Conversion */}
        <Card>
          <CardHeader>
            <CardTitle>Funil de Conversão - {selectedFunnel === 'all' ? 'Todos os Funis' : FUNNEL_OPTIONS.find(f => f.value === selectedFunnel)?.label}</CardTitle>
            <p className="text-sm text-slate-600">Visualize a jornada dos visitantes através de cada etapa do quiz</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4 justify-center">
              {analyticsData.funnelSteps.map((step, index) => (
                <div key={step.name} className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-sm text-slate-600 mb-1">{step.name}</div>
                    <div className="text-xs text-slate-400 mb-2">({step.subtitle})</div>
                    <div className={`text-3xl font-bold ${step.color === 'blue' ? 'text-blue-600' : 'text-purple-600'} mb-2`}>
                      {step.value}
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-green-600 font-medium">
                        Retenção {step.retention.toFixed(1)}%
                      </div>
                      {step.pitchVsl && (
                        <div className="text-xs text-blue-600 font-medium">
                          Pitch VSL {step.pitchVsl.toFixed(1)}%
                        </div>
                      )}
                      {step.cvr !== undefined && (
                        <div className="text-xs text-blue-600 font-medium">
                          CVR {step.cvr.toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>

                  {index < analyticsData.funnelSteps.length - 1 && (
                    <div className="flex flex-col items-center text-slate-600">
                      <ArrowRight className="w-8 h-8" />
                      <div className="text-xs font-semibold mt-1">
                        {step.nextRetention.toFixed(1)}%
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-slate-50 rounded-lg text-sm text-slate-600">
              <p><strong>Como interpretar:</strong> Retenção mostra a % de visitantes em relação ao total. <strong>Percentual nas setas</strong> mostra quantos % da etapa anterior avançaram para a próxima etapa.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
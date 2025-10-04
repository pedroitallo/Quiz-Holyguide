import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import ABTestDialog from '../components/analytics/ABTestDialog';
import { supabase } from '../lib/supabase';
import { QuizResult, Sale, ManualSales, ManualCheckout } from '../api/entities';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React from 'react';

export default function AnalyticsAB() {
  const { admin, loading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTest, setActiveTest] = useState(null);
  const [controlStats, setControlStats] = useState(null);
  const [testStats, setTestStats] = useState(null);

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate('/admin/login');
    }
  }, [admin, authLoading, navigate]);

  useEffect(() => {
    if (admin) {
      loadActiveTest();
    }
  }, [admin]);

  const loadActiveTest = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ab_tests')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setActiveTest(data);
        await loadTestStats(data);
      } else {
        setActiveTest(null);
        setControlStats(null);
        setTestStats(null);
      }
    } catch (error) {
      console.error('Error loading active test:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTestStats = async (test) => {
    try {
      const allResults = await QuizResult.filter(
        { visitor_id: { $exists: true, $ne: null } },
        '-created_date'
      );
      const allSales = await Sale.list('-created_date');

      const controlData = allResults.filter(result => result.funnel_variant === test.control_funnel);
      const testData = allResults.filter(result => result.funnel_variant === test.test_funnel);
      const controlSales = allSales.filter(sale => sale.src && sale.src.includes(test.control_funnel));
      const testSales = allSales.filter(sale => sale.src && sale.src.includes(test.test_funnel));

      const controlManualSales = await loadManualSalesForFunnel(test.control_funnel);
      const testManualSales = await loadManualSalesForFunnel(test.test_funnel);
      const controlManualCheckout = await loadManualCheckoutForFunnel(test.control_funnel);
      const testManualCheckout = await loadManualCheckoutForFunnel(test.test_funnel);

      setControlStats(calculateStats(controlData, controlSales, controlManualSales, controlManualCheckout));
      setTestStats(calculateStats(testData, testSales, testManualSales, testManualCheckout));
    } catch (error) {
      console.error('Error loading test stats:', error);
    }
  };

  const loadManualSalesForFunnel = async (funnelVariant) => {
    try {
      const manualSalesRecords = await ManualSales.filter({ funnel_variant: funnelVariant });
      if (manualSalesRecords.length > 0) {
        return manualSalesRecords.reduce((sum, record) => sum + (record.manual_sales_count || 0), 0);
      }
    } catch (error) {
      console.warn("Erro ao carregar vendas manuais:", error);
    }
    return null;
  };

  const loadManualCheckoutForFunnel = async (funnelVariant) => {
    try {
      const manualCheckoutRecords = await ManualCheckout.filter({ funnel_variant: funnelVariant });
      if (manualCheckoutRecords.length > 0) {
        return manualCheckoutRecords[0].manual_checkout_count;
      }
    } catch (error) {
      console.warn("Erro ao carregar checkout manual:", error);
    }
    return null;
  };

  const calculateStats = (data, sales, manualSales, manualCheckout) => {
    const totalVisitantes = data.length;
    const startQuiz = data.filter(item => item.name_collection_step_viewed).length;
    const paywall = data.filter(item => item.paywall_step_viewed).length;
    const automaticCheckout = data.filter(item => item.checkout_step_clicked).length;
    const checkout = manualCheckout !== null ? manualCheckout : automaticCheckout;
    const vendas = manualSales !== null ? manualSales : sales.length;
    const conversao = totalVisitantes > 0 ? ((vendas / totalVisitantes) * 100).toFixed(1) : '0.0';
    const retencao = startQuiz > 0 ? ((paywall / startQuiz) * 100).toFixed(1) : '0.0';
    const passagem = paywall > 0 ? ((checkout / paywall) * 100).toFixed(1) : '0.0';

    const funnelSteps = [
      { name: 'Início', count: totalVisitantes },
      { name: 'Nome', count: data.filter(item => item.name_collection_step_viewed).length },
      { name: 'Data', count: data.filter(item => item.birth_data_collection_step_viewed).length },
      { name: 'Amor', count: data.filter(item => item.love_situation_step_viewed).length },
      { name: 'Reading', count: data.filter(item => item.palm_reading_results_step_viewed).length },
      { name: 'Revelation', count: data.filter(item => item.loading_revelation_step_viewed).length },
      { name: 'Paywall', count: paywall }
    ];

    const funnelWithMetrics = funnelSteps.map((step, index) => {
      const retentionPercentage = totalVisitantes > 0 ? ((step.count / totalVisitantes) * 100).toFixed(1) : '0.0';
      return { ...step, retentionPercentage };
    });

    return {
      totalVisitantes,
      startQuiz,
      paywall,
      checkout,
      vendas,
      conversao,
      retencao,
      passagem,
      funnelWithMetrics,
    };
  };

  const renderComparison = (controlValue, testValue, label) => {
    if (!controlStats || !testStats) return null;

    const control = parseFloat(controlValue);
    const test = parseFloat(testValue);
    const diff = test - control;
    const percentDiff = control !== 0 ? ((diff / control) * 100) : 0;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="text-center">
              <p className="text-xs text-slate-600 mb-1">Controle</p>
              <p className="text-2xl font-bold text-black">{controlValue}</p>
            </div>
            <div className="text-center">
              <div className={`flex items-center justify-center gap-1 ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-slate-600'}`}>
                {diff !== 0 && (diff > 0 ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />)}
                <div>
                  <p className="text-lg font-bold">{Math.abs(diff).toFixed(1)}</p>
                  <p className="text-xs">({percentDiff > 0 ? '+' : ''}{percentDiff.toFixed(1)}%)</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-600 mb-1">Teste</p>
              <p className="text-2xl font-bold text-black">{testValue}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
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
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/admin')} variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Testes A/B</h1>
              <p className="text-slate-600 mt-1">Gestão e análise completa de testes A/B</p>
            </div>
          </div>
          <ABTestDialog onTestChange={loadActiveTest} />
        </div>

        {!activeTest ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-500 text-lg mb-4">Nenhum teste A/B ativo no momento</p>
              <p className="text-slate-400 text-sm">Clique no botão "Testes A/B" para criar um novo teste</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-900 text-lg">{activeTest.name}</h3>
                    {activeTest.hypothesis && (
                      <p className="text-sm text-blue-700 mt-1"><strong>Hipótese:</strong> {activeTest.hypothesis}</p>
                    )}
                    {activeTest.objective && (
                      <p className="text-sm text-blue-700 mt-1"><strong>Objetivo:</strong> {activeTest.objective}</p>
                    )}
                    <p className="text-sm text-blue-700 mt-1">
                      Iniciado em: {format(new Date(activeTest.start_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-700">
                      <p><strong>Controle:</strong> {activeTest.control_funnel}</p>
                      <p><strong>Teste:</strong> {activeTest.test_funnel}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {renderComparison(controlStats.totalVisitantes, testStats.totalVisitantes, 'Total de Visitantes')}
              {renderComparison(controlStats.startQuiz, testStats.startQuiz, 'Start Quiz')}
              {renderComparison(controlStats.paywall, testStats.paywall, 'Paywall')}
              {renderComparison(controlStats.checkout, testStats.checkout, 'Checkout')}
              {renderComparison(controlStats.vendas, testStats.vendas, 'Vendas')}
              {renderComparison(controlStats.conversao + '%', testStats.conversao + '%', 'Conversão Geral')}
              {renderComparison(controlStats.retencao + '%', testStats.retencao + '%', 'Retenção')}
              {renderComparison(controlStats.passagem + '%', testStats.passagem + '%', 'Passagem')}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Funil Controle ({activeTest.control_funnel})</CardTitle>
                  <CardDescription>Desempenho do grupo de controle</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {controlStats.funnelWithMetrics.map((step, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-slate-700">{step.name}</span>
                            <span className="text-sm font-bold text-black">{step.count}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${step.retentionPercentage}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-600 min-w-[3rem] text-right">
                              {step.retentionPercentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Funil Teste ({activeTest.test_funnel})</CardTitle>
                  <CardDescription>Desempenho do grupo de teste</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {testStats.funnelWithMetrics.map((step, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-slate-700">{step.name}</span>
                            <span className="text-sm font-bold text-black">{step.count}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full transition-all"
                                style={{ width: `${step.retentionPercentage}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-600 min-w-[3rem] text-right">
                              {step.retentionPercentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

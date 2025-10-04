import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import ABTestDialog from '../components/analytics/ABTestDialog';
import { supabase } from '../lib/supabase';
import { fetchFunnelAnalytics } from '../utils/analyticsQueries';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React from 'react';

export default function AnalyticsAB() {
  const { admin, loading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTest, setActiveTest] = useState(null);
  const [variantStats, setVariantStats] = useState({});

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
        setVariantStats({});
      }
    } catch (error) {
      console.error('Error loading active test:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTestStats = async (test) => {
    try {
      console.log('🔍 Loading test stats for:', test.name, 'Test ID:', test.id);

      const dateFilter = {
        start: test.start_date,
        end: test.end_date || new Date().toISOString()
      };

      console.log('📅 Date filter:', dateFilter);

      // Get all active variants
      const variants = [];
      if (test.variant_a) variants.push({ label: 'A', funnel: test.variant_a });
      if (test.variant_b) variants.push({ label: 'B', funnel: test.variant_b });
      if (test.variant_c) variants.push({ label: 'C', funnel: test.variant_c });
      if (test.variant_d) variants.push({ label: 'D', funnel: test.variant_d });
      if (test.variant_e) variants.push({ label: 'E', funnel: test.variant_e });

      // Fallback for old tests
      if (variants.length === 0 && test.control_funnel && test.test_funnel) {
        variants.push({ label: 'A', funnel: test.control_funnel });
        variants.push({ label: 'B', funnel: test.test_funnel });
      }

      const stats = {};
      for (const variant of variants) {
        const analytics = await fetchFunnelAnalytics(variant.funnel, dateFilter, test.id);
        console.log(`📊 Variant ${variant.label} (${variant.funnel}) analytics:`, analytics);

        stats[variant.label] = {
          funnel: variant.funnel,
          totalVisitantes: analytics.totalSessions,
          startQuiz: analytics.startQuiz,
          paywall: analytics.endQuiz,
          checkout: 0,
          vendas: 0,
          conversao: analytics.endQuizRate.toFixed(1),
          retencao: analytics.retention.toFixed(1),
          passagem: '0.0',
          funnelWithMetrics: analytics.steps.map(step => ({
            name: step.label,
            count: step.views,
            retentionPercentage: step.percentage.toFixed(1)
          }))
        };
      }

      setVariantStats(stats);
    } catch (error) {
      console.error('Error loading test stats:', error);
    }
  };


  const renderComparison = (label, metricKey) => {
    if (!variantStats || Object.keys(variantStats).length === 0) return null;

    const variants = Object.keys(variantStats).sort();
    const values = variants.map(v => {
      const value = variantStats[v][metricKey];
      return typeof value === 'string' && value.includes('%') ? parseFloat(value) : value;
    });

    const bestValue = Math.max(...values);
    const baseValue = values[0];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-4 items-center`} style={{ gridTemplateColumns: `repeat(${variants.length}, 1fr)` }}>
            {variants.map((variant, index) => {
              const rawValue = variantStats[variant][metricKey];
              const value = values[index];
              const diff = value - baseValue;
              const percentDiff = baseValue !== 0 ? ((diff / baseValue) * 100) : 0;
              const isBest = value === bestValue && variants.length > 1;

              return (
                <div key={variant} className="text-center">
                  <p className="text-xs text-slate-600 mb-1">Variante {variant}</p>
                  <p className={`text-2xl font-bold ${isBest ? 'text-green-600' : 'text-black'}`}>{rawValue}</p>
                  {index > 0 && (
                    <div className={`text-xs mt-1 ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-slate-600'}`}>
                      {diff !== 0 && (diff > 0 ? '▲' : '▼')} {Math.abs(diff).toFixed(1)} ({percentDiff > 0 ? '+' : ''}{percentDiff.toFixed(1)}%)
                    </div>
                  )}
                </div>
              );
            })}
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
            <Button onClick={() => window.location.href = '/admin'} variant="outline" size="icon">
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
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-blue-900 text-lg">{activeTest.name}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        Dados Isolados
                      </span>
                    </div>
                    {activeTest.hypothesis && (
                      <p className="text-sm text-blue-700 mt-1"><strong>Hipótese:</strong> {activeTest.hypothesis}</p>
                    )}
                    {activeTest.objective && (
                      <p className="text-sm text-blue-700 mt-1"><strong>Objetivo:</strong> {activeTest.objective}</p>
                    )}
                    <p className="text-sm text-blue-700 mt-1">
                      Iniciado em: {format(new Date(activeTest.start_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                    <p className="text-xs text-blue-600 mt-2 italic">
                      Mostrando apenas dados coletados durante este teste específico
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-700">
                      <p className="font-semibold mb-1">Variantes:</p>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {Object.keys(variantStats).sort().map(variant => (
                          <span key={variant} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {variant}: {variantStats[variant].funnel}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {Object.keys(variantStats).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {renderComparison('Total de Visitantes', 'totalVisitantes')}
                {renderComparison('Start Quiz', 'startQuiz')}
                {renderComparison('Paywall', 'paywall')}
                {renderComparison('Checkout', 'checkout')}
                {renderComparison('Vendas', 'vendas')}
                {renderComparison('Conversão Geral (%)', 'conversao')}
                {renderComparison('Retenção (%)', 'retencao')}
                {renderComparison('Passagem (%)', 'passagem')}
              </div>
            )}

            {Object.keys(variantStats).length > 0 && (
              <div className={`grid gap-6 mb-6`} style={{ gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))` }}>
                {Object.keys(variantStats).sort().map((variant, vIndex) => {
                  const colors = ['blue', 'green', 'purple', 'orange', 'pink'];
                  const color = colors[vIndex % colors.length];

                  return (
                    <Card key={variant}>
                      <CardHeader>
                        <CardTitle>Variante {variant} ({variantStats[variant].funnel})</CardTitle>
                        <CardDescription>Desempenho da variante {variant}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {variantStats[variant].funnelWithMetrics.map((step, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-slate-700">{step.name}</span>
                                  <span className="text-sm font-bold text-black">{step.count}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                                    <div
                                      className={`bg-${color}-600 h-2 rounded-full transition-all`}
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
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

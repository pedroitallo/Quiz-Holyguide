import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { GitCompare, CalendarIcon, Loader2, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ComparisonDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFunnel, setSelectedFunnel] = useState('');
  const [periodA, setPeriodA] = useState({ from: null, to: null });
  const [periodB, setPeriodB] = useState({ from: null, to: null });
  const [comparisonData, setComparisonData] = useState(null);

  const funnelOptions = [
    { value: 'funnel-1', label: 'Funil 1' },
    { value: 'funnel-tt', label: 'Funil TT' },
    { value: 'funnel-vsl', label: 'Funil VSL' },
    { value: 'funnelesp', label: 'Funil ESP' },
  ];

  const quickDateRanges = [
    { label: 'Últimos 7 dias', days: 7 },
    { label: 'Últimos 14 dias', days: 14 },
    { label: 'Últimos 30 dias', days: 30 },
  ];

  const getTableName = (funnel) => {
    return `step_views_${funnel.replace('-', '_')}`;
  };

  const getStepFields = (funnel) => {
    if (funnel === 'funnel-vsl') {
      return ['video', 'sales', 'checkout'];
    }
    return ['video', 'testimonials', 'name', 'birth', 'love_situation', 'palm_reading', 'revelation', 'paywall', 'thank_you', 'checkout'];
  };

  const getStepLabel = (field) => {
    const labels = {
      video: 'Vídeo',
      testimonials: 'Depoimentos',
      name: 'Nome',
      birth: 'Data Nasc.',
      love_situation: 'Amor',
      palm_reading: 'Leitura',
      revelation: 'Revelação',
      paywall: 'Paywall',
      sales: 'Sales',
      thank_you: 'Obrigado',
      checkout: 'Checkout',
    };
    return labels[field] || field;
  };

  const fetchPeriodData = async (funnel, dateRange) => {
    try {
      const tableName = getTableName(funnel);
      let query = supabase
        .from(tableName)
        .select('*');

      if (dateRange.from) {
        query = query.gte('viewed_at', dateRange.from.toISOString());
      }
      if (dateRange.to) {
        const endDate = new Date(dateRange.to);
        endDate.setHours(23, 59, 59, 999);
        query = query.lte('viewed_at', endDate.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;

      const totalSessions = data.length;
      const stepFields = getStepFields(funnel);

      const steps = stepFields.map(field => {
        const count = data.filter(session => session[field]).length;
        const percentage = totalSessions > 0 ? (count / totalSessions) * 100 : 0;
        return {
          field,
          label: getStepLabel(field),
          count,
          percentage: percentage.toFixed(1),
        };
      });

      return {
        totalSessions,
        steps,
      };
    } catch (error) {
      console.error('Error fetching period data:', error);
      throw error;
    }
  };

  const handleCompare = async () => {
    if (!selectedFunnel || !periodA.from || !periodB.from) {
      alert('Por favor, selecione o funil e ambos os períodos');
      return;
    }

    setLoading(true);
    try {
      const [dataA, dataB] = await Promise.all([
        fetchPeriodData(selectedFunnel, periodA),
        fetchPeriodData(selectedFunnel, periodB),
      ]);

      setComparisonData({ dataA, dataB });
    } catch (error) {
      console.error('Error comparing periods:', error);
      alert('Erro ao comparar períodos');
    } finally {
      setLoading(false);
    }
  };

  const calculateDifference = (valueA, valueB) => {
    const a = parseFloat(valueA);
    const b = parseFloat(valueB);
    const diff = b - a;
    const percentDiff = a !== 0 ? ((diff / a) * 100) : 0;
    return { diff, percentDiff };
  };

  const renderComparisonIndicator = (valueA, valueB, isPercentage = false) => {
    const { diff, percentDiff } = calculateDifference(valueA, valueB);

    if (diff === 0) {
      return (
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <Minus className="w-3 h-3 mr-1" />
          <span>Sem alteração</span>
        </div>
      );
    }

    const isPositive = diff > 0;
    const color = isPositive ? 'text-green-600' : 'text-red-600';

    return (
      <div className={`flex items-center text-xs mt-1 ${color}`}>
        {isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
        <span>
          {isPositive ? '+' : ''}{isPercentage ? `${Math.abs(diff).toFixed(1)}%` : Math.abs(diff)}
        </span>
        <span className="ml-1">({isPositive ? '+' : ''}{percentDiff.toFixed(1)}%)</span>
      </div>
    );
  };

  const renderPeriodSummary = (data, label, color) => {
    return (
      <Card className={`border-2 ${color}`}>
        <CardHeader>
          <CardTitle className="text-xl">{label}</CardTitle>
          <CardDescription>
            {periodA.from && periodB.from && (
              label === 'Período A'
                ? `${format(periodA.from, 'dd/MM/yyyy', { locale: ptBR })} - ${format(periodA.to || periodA.from, 'dd/MM/yyyy', { locale: ptBR })}`
                : `${format(periodB.from, 'dd/MM/yyyy', { locale: ptBR })} - ${format(periodB.to || periodB.from, 'dd/MM/yyyy', { locale: ptBR })}`
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm text-gray-600 mb-1">Total de Sessões</p>
              <p className="text-3xl font-bold text-black">{data.totalSessions}</p>
              {comparisonData && label === 'Período B' && renderComparisonIndicator(
                comparisonData.dataA.totalSessions,
                comparisonData.dataB.totalSessions
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderFunnelComparison = (dataA, dataB) => {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle>Funil de Conversão - Período A</CardTitle>
            <CardDescription>
              {format(periodA.from, 'dd/MM/yyyy', { locale: ptBR })} - {format(periodA.to || periodA.from, 'dd/MM/yyyy', { locale: ptBR })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {dataA.steps.map((step, index) => (
                <div key={step.field} className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">{step.label}</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 mb-1">{step.count}</p>
                  <p className="text-xs text-gray-600">{step.percentage}% do total</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200">
          <CardHeader>
            <CardTitle>Funil de Conversão - Período B</CardTitle>
            <CardDescription>
              {format(periodB.from, 'dd/MM/yyyy', { locale: ptBR })} - {format(periodB.to || periodB.from, 'dd/MM/yyyy', { locale: ptBR })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {dataB.steps.map((step, index) => {
                const stepA = dataA.steps[index];
                return (
                  <div key={step.field} className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-purple-600">{index + 1}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">{step.label}</h3>
                    </div>
                    <p className="text-2xl font-bold text-purple-600 mb-1">{step.count}</p>
                    <p className="text-xs text-gray-600">{step.percentage}% do total</p>
                    {renderComparisonIndicator(stepA.count, step.count)}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <GitCompare className="w-4 h-4" />
          Comparativo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Comparativo de Períodos</DialogTitle>
          <DialogDescription>
            Compare o desempenho de um funil em dois períodos diferentes
          </DialogDescription>
        </DialogHeader>

        {!comparisonData ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Selecione o Funil</Label>
                <Select value={selectedFunnel} onValueChange={setSelectedFunnel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha um funil" />
                  </SelectTrigger>
                  <SelectContent>
                    {funnelOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Período A</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>Data Início</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {periodA.from ? format(periodA.from, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={periodA.from}
                            onSelect={(date) => setPeriodA({ ...periodA, from: date })}
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Data Fim</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {periodA.to ? format(periodA.to, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={periodA.to}
                            onSelect={(date) => setPeriodA({ ...periodA, to: date })}
                            locale={ptBR}
                            disabled={(date) => periodA.from ? date < periodA.from : false}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-600 mb-2">Atalhos:</p>
                      <div className="flex flex-wrap gap-2">
                        {quickDateRanges.map(range => (
                          <Button
                            key={range.label}
                            size="sm"
                            variant="outline"
                            onClick={() => setPeriodA({
                              from: subDays(new Date(), range.days - 1),
                              to: new Date()
                            })}
                          >
                            {range.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Período B</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>Data Início</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {periodB.from ? format(periodB.from, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={periodB.from}
                            onSelect={(date) => setPeriodB({ ...periodB, from: date })}
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Data Fim</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {periodB.to ? format(periodB.to, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={periodB.to}
                            onSelect={(date) => setPeriodB({ ...periodB, to: date })}
                            locale={ptBR}
                            disabled={(date) => periodB.from ? date < periodB.from : false}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-600 mb-2">Atalhos:</p>
                      <div className="flex flex-wrap gap-2">
                        {quickDateRanges.map(range => (
                          <Button
                            key={range.label}
                            size="sm"
                            variant="outline"
                            onClick={() => setPeriodB({
                              from: subDays(new Date(), range.days - 1),
                              to: new Date()
                            })}
                          >
                            {range.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button
                onClick={handleCompare}
                disabled={loading || !selectedFunnel || !periodA.from || !periodB.from}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Carregando comparação...
                  </>
                ) : (
                  <>
                    <GitCompare className="w-4 h-4 mr-2" />
                    Ver Comparação
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Comparativo: {funnelOptions.find(f => f.value === selectedFunnel)?.label}
              </h3>
              <Button
                variant="outline"
                onClick={() => setComparisonData(null)}
              >
                Nova Comparação
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderPeriodSummary(comparisonData.dataA, 'Período A', 'border-blue-200')}
              {renderPeriodSummary(comparisonData.dataB, 'Período B', 'border-purple-200')}
            </div>

            {renderFunnelComparison(comparisonData.dataA, comparisonData.dataB)}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

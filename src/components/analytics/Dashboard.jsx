
import React, { useState, useEffect } from 'react';
import { QuizResult } from '@/api/entities';
import { Sale } from '@/api/entities';
import { ManualSales } from '@/api/entities';
import { ManualCheckout } from '@/api/entities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Users, Play, CreditCard, TrendingUp, Loader2, Calendar as CalendarIcon, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ABTestDialog from './ABTestDialog';
import SessionHistoryDialog from './SessionHistoryDialog';
import ComparisonDialog from './ComparisonDialog';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
    const [quizData, setQuizData] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedFunnel, setSelectedFunnel] = useState('all');
    const [isEditingVendas, setIsEditingVendas] = useState(false);
    const [tempVendasValue, setTempVendasValue] = useState('');
    const [manualVendas, setManualVendas] = useState(null);
    const [isEditingCheckout, setIsEditingCheckout] = useState(false);
    const [tempCheckoutValue, setTempCheckoutValue] = useState('');
    const [manualCheckout, setManualCheckout] = useState(null);
    const [statistics, setStatistics] = useState({
        totalVisitantes: 0,
        startQuiz: 0,
        paywall: 0,
        vendas: 0,
        receita: 0,
        conversao: '0.0',
        retencao: '0.0',
        passagem: '0.0',
        funnelWithMetrics: [],
    });
    const [date, setDate] = useState({
        from: subDays(new Date(), 6),
        to: new Date(),
    });

    const [upsellData, setUpsellData] = useState([]);
    const [activeABTest, setActiveABTest] = useState(null);
    const [controlStats, setControlStats] = useState(null);
    const [testStats, setTestStats] = useState(null);

    // Definir as etapas reais do quiz: início→nome→data→amor→reading→revelation→paywall
    const getFunnelSteps = (funnelType) => {
        switch (funnelType) {
            case 'funnel-1':
                return [
                    { name: 'Início', field: 'total' },
                    { name: 'Nome', field: 'name_collection_step_viewed' },
                    { name: 'Data', field: 'birth_data_collection_step_viewed' },
                    { name: 'Amor', field: 'love_situation_step_viewed' },
                    { name: 'Reading', field: 'palm_reading_results_step_viewed' },
                    { name: 'Revelation', field: 'loading_revelation_step_viewed' },
                    { name: 'Paywall', field: 'paywall_step_viewed' }
                ];
            case 'funnel-2':
                return [
                    { name: 'Início', field: 'total' },
                    { name: 'Nome', field: 'name_collection_step_viewed' },
                    { name: 'Data', field: 'birth_data_collection_step_viewed' },
                    { name: 'Amor', field: 'love_situation_step_viewed' },
                    { name: 'Reading', field: 'palm_reading_results_step_viewed' },
                    { name: 'Revelation', field: 'loading_revelation_step_viewed' },
                    { name: 'Paywall', field: 'paywall_step_viewed' }
                ];
            case 'funnel-p3':
                return [
                    { name: 'Início', field: 'total' },
                    { name: 'Reading', field: 'palm_reading_results_step_viewed' },
                    { name: 'Paywall', field: 'paywall_step_viewed' }
                ];
            default: // 'all'
                return [
                    { name: 'Início', field: 'total' },
                    { name: 'Nome', field: 'name_collection_step_viewed' },
                    { name: 'Data', field: 'birth_data_collection_step_viewed' },
                    { name: 'Amor', field: 'love_situation_step_viewed' },
                    { name: 'Reading', field: 'palm_reading_results_step_viewed' },
                    { name: 'Revelation', field: 'loading_revelation_step_viewed' },
                    { name: 'Paywall', field: 'paywall_step_viewed' }
                ];
        }
    };


    // Function to load manual sales for the current period and funnel - FIXED VERSION
    const loadManualSales = async () => {
        if (!date?.from) return null;

        try {
            const dateFrom = format(date.from, 'yyyy-MM-dd');
            const dateTo = format(date.to || date.from, 'yyyy-MM-dd');

            // Load manual sales records for the exact period and funnel
            const manualSalesRecords = await ManualSales.filter({
                date_from: dateFrom,
                date_to: dateTo,
                funnel_variant: selectedFunnel
            });

            if (manualSalesRecords.length > 0) {
                // Sum all manual sales for this exact period and funnel
                return manualSalesRecords.reduce((sum, record) => sum + (record.manual_sales_count || 0), 0);
            }
        } catch (error) {
            console.warn("Erro ao carregar vendas manuais:", error);
        }

        return null;
    };

    // Function to save manual sales for the current period and funnel
    const saveManualSales = async (salesCount) => {
        if (!date?.from) return;

        try {
            const dateFrom = format(date.from, 'yyyy-MM-dd');
            const dateTo = format(date.to || date.from, 'yyyy-MM-dd');

            // Check if a record already exists for this exact period and funnel
            const existingRecords = await ManualSales.filter({
                date_from: dateFrom,
                date_to: dateTo,
                funnel_variant: selectedFunnel
            });

            if (existingRecords.length > 0) {
                // Update existing record
                await ManualSales.update(existingRecords[0].id, {
                    manual_sales_count: salesCount
                });
            } else {
                // Create new record
                await ManualSales.create({
                    date_from: dateFrom,
                    date_to: dateTo,
                    funnel_variant: selectedFunnel,
                    manual_sales_count: salesCount
                });
            }
        } catch (error) {
            console.error("Erro ao salvar vendas manuais:", error);
            throw error; // Re-throw to handle in UI
        }
    };

    // Function to load manual checkout for the current period and funnel
    const loadManualCheckout = async () => {
        if (!date?.from) return null;

        try {
            const dateFrom = format(date.from, 'yyyy-MM-dd');
            const dateTo = format(date.to || date.from, 'yyyy-MM-dd');

            const manualCheckoutRecords = await ManualCheckout.filter({
                date_from: dateFrom,
                date_to: dateTo,
                funnel_variant: selectedFunnel
            });

            if (manualCheckoutRecords.length > 0) {
                return manualCheckoutRecords[0].manual_checkout_count;
            }
        } catch (error) {
            console.warn("Erro ao carregar checkout manual:", error);
        }

        return null;
    };

    // Function to save manual checkout for the current period and funnel
    const saveManualCheckout = async (checkoutCount) => {
        if (!date?.from) return;

        try {
            const dateFrom = format(date.from, 'yyyy-MM-dd');
            const dateTo = format(date.to || date.from, 'yyyy-MM-dd');

            const existingRecords = await ManualCheckout.filter({
                date_from: dateFrom,
                date_to: dateTo,
                funnel_variant: selectedFunnel
            });

            if (existingRecords.length > 0) {
                await ManualCheckout.update(existingRecords[0].id, {
                    manual_checkout_count: checkoutCount
                });
            } else {
                await ManualCheckout.create({
                    date_from: dateFrom,
                    date_to: dateTo,
                    funnel_variant: selectedFunnel,
                    manual_checkout_count: checkoutCount
                });
            }
        } catch (error) {
            console.error("Erro ao salvar checkout manual:", error);
            throw error;
        }
    };

    // Function to calculate all statistics from given arrays of quiz results and sales
    const calculateStats = (dataToProcess, salesToProcess, currentManualVendas, currentManualCheckout) => {
        // Contar visitantes reais (sem valor fixo)
        const totalVisitantes = dataToProcess.length;

        // 'Start Quiz' = quem chegou na etapa de Nome
        const startQuiz = dataToProcess.filter(item => item.name_collection_step_viewed).length;

        // Paywall é baseado na visualização da página do paywall
        const paywall = dataToProcess.filter(item => item.paywall_step_viewed).length;
        
        // Pitch é baseado na visualização da seção de sales (após 4:40min)
        const pitch = dataToProcess.filter(item => item.pitch_step_viewed).length;
        
        // Checkout é baseado em quem clicou nos botões de checkout
        const automaticCheckout = dataToProcess.filter(item => item.checkout_step_clicked).length;
        const checkout = currentManualCheckout !== null ? currentManualCheckout : automaticCheckout;
        
        // Usar vendas manuais se definidas, senão usar vendas automáticas
        const vendas = currentManualVendas !== null ? currentManualVendas : salesToProcess.length;
        const receita = salesToProcess.reduce((sum, sale) => sum + (sale.total_price || 0), 0);
        const conversao = totalVisitantes > 0 ? ((vendas / totalVisitantes) * 100).toFixed(1) : '0.0';
        const retencao = startQuiz > 0 ? ((paywall / startQuiz) * 100).toFixed(1) : '0.0';
        const passagem = paywall > 0 ? ((checkout / paywall) * 100).toFixed(1) : '0.0';

        // Data do funil de conversão baseada no funil selecionado
        const funnelSteps = getFunnelSteps(selectedFunnel);

        // Calculate counts for each step first
        const stepsWithCounts = funnelSteps.map((step) => {
            let count = 0;
            if (step.field === 'total') {
                count = totalVisitantes;
            } else if (step.field === 'checkout_step_clicked') {
                count = checkout;
            }
            else {
                // For all *_step_viewed fields
                count = dataToProcess.filter(item => item[step.field]).length;
            }
            return { ...step, count };
        });

        // Calculate retention and metrics
        const funnelWithMetrics = stepsWithCounts.map((step, index) => {
            const retentionPercentage = totalVisitantes > 0 ? ((step.count / totalVisitantes) * 100).toFixed(1) : '0.0';
            
            let interactionPercentage = '0.0';
            const previousStepCount = index > 0 ? (stepsWithCounts[index - 1].count || 0) : totalVisitantes;

            if (index > 0 && previousStepCount > 0) {
                interactionPercentage = ((step.count / previousStepCount) * 100).toFixed(1);
            } else if (index === 0 && totalVisitantes > 0) {
                const nextStep = stepsWithCounts[1];
                const nextStepCount = nextStep ? nextStep.count : 0;
                interactionPercentage = totalVisitantes > 0 ? ((nextStepCount / totalVisitantes) * 100).toFixed(1) : '0.0';
            }

            // Adicionar métricas específicas para Pitch e Checkout
            let additionalMetric = null;
            if (step.field === 'pitch_step_viewed') {
                // Pitch VSL = Pitch / Paywall * 100
                const pitchVSL = paywall > 0 ? ((step.count / paywall) * 100).toFixed(1) : '0.0';
                additionalMetric = {
                    label: 'Pitch VSL',
                    value: `${pitchVSL}%`
                };
            } else if (step.field === 'checkout_step_clicked') {
                // CVR Checkout = Vendas / Checkout * 100
                const cvrCheckout = step.count > 0 ? ((vendas / step.count) * 100).toFixed(1) : '0.0';
                additionalMetric = {
                    label: 'CVR',
                    value: `${cvrCheckout}%`
                };
            }
            
            return { ...step, retentionPercentage, interactionPercentage, additionalMetric };
        });

        return {
            totalVisitantes,
            startQuiz,
            paywall,
            checkout,
            vendas,
            receita,
            conversao,
            retencao,
            passagem,
            funnelWithMetrics,
        };
    };

    const loadQuizData = async () => {
        setIsLoading(true);
        try {
            // Load manual data first
            const [savedManualSales, savedManualCheckout] = await Promise.all([
                loadManualSales(),
                loadManualCheckout()
            ]);

            setManualVendas(savedManualSales);
            setManualCheckout(savedManualCheckout);

            // Filtrar apenas registros que não são de admin (têm visitor_id válido)
            const allNonAdminResults = await QuizResult.filter(
                { visitor_id: { $exists: true, $ne: null } },
                '-created_date'
            );
            
            // Carregar vendas
            const allSales = await Sale.list('-created_date');
            
            let filteredDataByDate = allNonAdminResults;
            let filteredSalesByDate = allSales;
            
            if (date?.from) {
                const start = new Date(date.from);
                const end = date.to ? new Date(date.to) : new Date(date.from);
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                
                filteredDataByDate = allNonAdminResults.filter(result => {
                    const resultDate = new Date(result.created_date);
                    return resultDate >= start && resultDate <= end;
                });

                filteredSalesByDate = allSales.filter(sale => {
                    const saleDate = new Date(sale.created_date);
                    return saleDate >= start && saleDate <= end;
                });
            }

            // Filtrar por funil se não for 'all'
            if (selectedFunnel !== 'all') {
                filteredDataByDate = filteredDataByDate.filter(result => 
                    result.funnel_variant === selectedFunnel
                );
                filteredSalesByDate = filteredSalesByDate.filter(sale => 
                    sale.src && sale.src.includes(selectedFunnel)
                );
            }

            setQuizData(filteredDataByDate);
            setSalesData(filteredSalesByDate);
            
            const stats = calculateStats(filteredDataByDate, filteredSalesByDate, savedManualSales, savedManualCheckout);
            setStatistics(stats);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadUpsellData = async () => {
        try {
            const { UpsellView } = await import('@/api/entities');
            
            let filteredUpsellData = await UpsellView.list('-created_date');
            
            if (date?.from) {
                const start = new Date(date.from);
                const end = date.to ? new Date(date.to) : new Date(date.from);
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                
                filteredUpsellData = filteredUpsellData.filter(view => {
                    const viewDate = new Date(view.created_date);
                    return viewDate >= start && viewDate <= end;
                });
            }

            setUpsellData(filteredUpsellData);
        } catch (error) {
            console.warn('Erro ao carregar dados de upsell:', error);
            setUpsellData([]);
        }
    };

    const handleClearData = async () => {
        if (!confirm('⚠️ ATENÇÃO: Esta ação irá DELETAR PERMANENTEMENTE todos os dados do período selecionado. Esta ação não pode ser desfeita. Tem certeza que deseja continuar?')) {
            return;
        }

        setIsDeleting(true);
        try {
            // Obter dados filtrados pela data selecionada
            const allResults = await QuizResult.filter(
                { visitor_id: { $exists: true, $ne: null } },
                '-created_date'
            );
            
            const allSales = await Sale.list('-created_date');
            
            let filteredResults = allResults;
            let filteredSales = allSales;
            
            if (date?.from) {
                const start = new Date(date.from);
                const end = date.to ? new Date(date.to) : new Date(date.from);
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                
                filteredResults = allResults.filter(result => {
                    const resultDate = new Date(result.created_date);
                    return resultDate >= start && resultDate <= end;
                });

                filteredSales = allSales.filter(sale => {
                    const saleDate = new Date(sale.created_date);
                    return saleDate >= start && saleDate <= end;
                });
            }

            // Filtrar por funil antes de deletar
            if (selectedFunnel !== 'all') {
                filteredResults = filteredResults.filter(result => 
                    result.funnel_variant === selectedFunnel
                );
                filteredSales = filteredSales.filter(sale => 
                    sale.src && sale.src.includes(selectedFunnel)
                );
            }

            // Clear manual sales for this period and funnel
            const dateFromFormatted = date?.from ? format(date.from, 'yyyy-MM-dd') : null;
            const dateToFormatted = date?.to ? format(date.to, 'yyyy-MM-dd') : dateFromFormatted;
            
            if (dateFromFormatted) {
                const manualSalesRecordsToDelete = await ManualSales.filter({
                    date_from: dateFromFormatted,
                    date_to: dateToFormatted,
                    funnel_variant: selectedFunnel
                });
                
                for (const record of manualSalesRecordsToDelete) {
                    await ManualSales.delete(record.id);
                }


                // Clear manual checkout for this period and funnel
                const manualCheckoutRecordsToDelete = await ManualCheckout.filter({
                    date_from: dateFromFormatted,
                    date_to: dateToFormatted,
                    funnel_variant: selectedFunnel
                });

                for (const record of manualCheckoutRecordsToDelete) {
                    await ManualCheckout.delete(record.id);
                }
            }

            // Deletar QuizResults do período
            for (const result of filteredResults) {
                await QuizResult.delete(result.id);
            }

            // Deletar Sales do período
            for (const sale of filteredSales) {
                await Sale.delete(sale.id);
            }

            // Reset manual sales state after clearing, will be reloaded by loadQuizData
            setManualVendas(null);
            setManualCheckout(null);

            // Recarregar dados
            await loadQuizData();
            await loadUpsellData(); // Also reload upsell data
            
            alert(`✅ Dados removidos com sucesso! Foram deletados ${filteredResults.length} resultados de quiz, ${filteredSales.length} vendas e os registros manuais do período.`);
        } catch (error) {
            console.error('Erro ao limpar dados:', error);
            alert('❌ Erro ao limpar dados. Verifique o console para mais detalhes.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEditVendas = () => {
        setIsEditingVendas(true);
        // Use the current manual value if it exists, otherwise use automatic count
        const currentValue = manualVendas !== null ? manualVendas : salesData.length;
        setTempVendasValue(currentValue.toString());
    };

    const handleSaveVendas = async () => {
        try {
            const newValue = parseInt(tempVendasValue) || 0;
            
            // Save to database first
            await saveManualSales(newValue);
            
            // Update local state
            setManualVendas(newValue);
            setIsEditingVendas(false);
            setTempVendasValue('');
            
            // Recalculate statistics with new manual value
            const stats = calculateStats(quizData, salesData, newValue, manualCheckout);
            setStatistics(stats);
            
        } catch (error) {
            console.error("Erro ao salvar vendas manuais:", error);
            alert("Erro ao salvar vendas manuais. Tente novamente.");
        }
    };

    const handleCancelEditVendas = () => {
        setIsEditingVendas(false);
        setTempVendasValue('');
    };

    // Manual checkout editing functions
    const handleEditCheckout = () => {
        setIsEditingCheckout(true);
        const currentValue = manualCheckout !== null ? manualCheckout : quizData.filter(item => item.checkout_step_clicked).length;
        setTempCheckoutValue(currentValue.toString());
    };

    const handleSaveCheckout = async () => {
        try {
            const newValue = parseInt(tempCheckoutValue) || 0;
            
            await saveManualCheckout(newValue);
            
            setManualCheckout(newValue);
            setIsEditingCheckout(false);
            setTempCheckoutValue('');
            
            const stats = calculateStats(quizData, salesData, manualVendas, newValue);
            setStatistics(stats);
            
        } catch (error) {
            console.error("Erro ao salvar checkout manual:", error);
            alert("Erro ao salvar checkout manual. Tente novamente.");
        }
    };

    const handleCancelEditCheckout = () => {
        setIsEditingCheckout(false);
        setTempCheckoutValue('');
    };

    const loadActiveABTest = async () => {
        try {
            const { data, error } = await supabase
                .from('ab_tests')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error) throw error;

            setActiveABTest(data);

            if (data) {
                await loadABTestStats(data);
            } else {
                setControlStats(null);
                setTestStats(null);
            }
        } catch (error) {
            console.error('Error loading active A/B test:', error);
            setActiveABTest(null);
            setControlStats(null);
            setTestStats(null);
        }
    };

    const loadABTestStats = async (test) => {
        try {
            // Get control and test funnels (support both old and new format)
            const controlFunnel = test.variant_a || test.control_funnel;
            const testFunnel = test.variant_b || test.test_funnel;

            if (!controlFunnel || !testFunnel) {
                console.error('Test does not have valid variants');
                return;
            }

            const allResults = await QuizResult.filter(
                { visitor_id: { $exists: true, $ne: null } },
                '-created_date'
            );
            const allSales = await Sale.list('-created_date');

            let controlData = allResults;
            let testData = allResults;
            let controlSales = allSales;
            let testSales = allSales;

            if (date?.from) {
                const start = new Date(date.from);
                const end = date.to ? new Date(date.to) : new Date(date.from);
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);

                controlData = allResults.filter(result => {
                    const resultDate = new Date(result.created_date);
                    return resultDate >= start && resultDate <= end && result.funnel_variant === controlFunnel;
                });

                testData = allResults.filter(result => {
                    const resultDate = new Date(result.created_date);
                    return resultDate >= start && resultDate <= end && result.funnel_variant === testFunnel;
                });

                controlSales = allSales.filter(sale => {
                    const saleDate = new Date(sale.created_date);
                    return saleDate >= start && saleDate <= end && sale.src && sale.src.includes(controlFunnel);
                });

                testSales = allSales.filter(sale => {
                    const saleDate = new Date(sale.created_date);
                    return saleDate >= start && saleDate <= end && sale.src && sale.src.includes(testFunnel);
                });
            } else {
                controlData = allResults.filter(result => result.funnel_variant === controlFunnel);
                testData = allResults.filter(result => result.funnel_variant === testFunnel);
                controlSales = allSales.filter(sale => sale.src && sale.src.includes(controlFunnel));
                testSales = allSales.filter(sale => sale.src && sale.src.includes(testFunnel));
            }

            const controlManualSales = await loadManualSalesForFunnel(controlFunnel);
            const testManualSales = await loadManualSalesForFunnel(testFunnel);
            const controlManualCheckout = await loadManualCheckoutForFunnel(controlFunnel);
            const testManualCheckout = await loadManualCheckoutForFunnel(testFunnel);

            setControlStats(calculateStats(controlData, controlSales, controlManualSales, controlManualCheckout));
            setTestStats(calculateStats(testData, testSales, testManualSales, testManualCheckout));
        } catch (error) {
            console.error('Error loading A/B test stats:', error);
        }
    };

    const loadManualSalesForFunnel = async (funnelVariant) => {
        if (!date?.from) return null;
        try {
            const dateFrom = format(date.from, 'yyyy-MM-dd');
            const dateTo = format(date.to || date.from, 'yyyy-MM-dd');
            const manualSalesRecords = await ManualSales.filter({
                date_from: dateFrom,
                date_to: dateTo,
                funnel_variant: funnelVariant
            });
            if (manualSalesRecords.length > 0) {
                return manualSalesRecords.reduce((sum, record) => sum + (record.manual_sales_count || 0), 0);
            }
        } catch (error) {
            console.warn("Erro ao carregar vendas manuais:", error);
        }
        return null;
    };

    const loadManualCheckoutForFunnel = async (funnelVariant) => {
        if (!date?.from) return null;
        try {
            const dateFrom = format(date.from, 'yyyy-MM-dd');
            const dateTo = format(date.to || date.from, 'yyyy-MM-dd');
            const manualCheckoutRecords = await ManualCheckout.filter({
                date_from: dateFrom,
                date_to: dateTo,
                funnel_variant: funnelVariant
            });
            if (manualCheckoutRecords.length > 0) {
                return manualCheckoutRecords[0].manual_checkout_count;
            }
        } catch (error) {
            console.warn("Erro ao carregar checkout manual:", error);
        }
        return null;
    };

    // Initial load and reload on date/funnel change
    useEffect(() => {
        loadQuizData();
        loadUpsellData();
        loadActiveABTest();
    }, [date, selectedFunnel]);

    // Auto-refresh a cada 30 segundos para métricas em tempo real
    useEffect(() => {
        const interval = setInterval(() => {
            loadQuizData();
            loadUpsellData();
        }, 30000); // 30 segundos
        return () => clearInterval(interval);
    }, [date, selectedFunnel]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    // Destructure statistics for easier access in JSX, including new metrics
    const { totalVisitantes, startQuiz, paywall, checkout, vendas, receita, conversao, retencao, passagem, funnelWithMetrics } = statistics;

    // Calculate upsell metrics
    const upsellMetrics = {
        upJourneyViews: upsellData.filter(view => view.page_name === 'up-journey').length,
        upEnergyViews: upsellData.filter(view => view.page_name === 'up-energy').length,
        upLetterViews: upsellData.filter(view => view.page_name === 'up-letter').length
    };

    const renderComparison = (controlValue, testValue, isPercentage = false) => {
        if (!activeABTest || controlStats === null || testStats === null) return null;

        const control = parseFloat(controlValue);
        const test = parseFloat(testValue);
        const diff = test - control;
        const percentDiff = control !== 0 ? ((diff / control) * 100) : 0;

        if (diff === 0) return null;

        return (
            <div className={`flex items-center text-xs mt-1 ${diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {diff > 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                <span>{isPercentage ? `${Math.abs(diff).toFixed(1)}%` : Math.abs(diff)}</span>
                <span className="ml-1">({percentDiff > 0 ? '+' : ''}{percentDiff.toFixed(1)}%)</span>
            </div>
        );
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Analytics</h1>
                        <p className="text-gray-600 mt-1">Acompanhe o desempenho do seu quiz</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {/* Novo filtro de funil */}
                        <Select value={selectedFunnel} onValueChange={setSelectedFunnel}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Selecione o funil" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os Funis</SelectItem>
                                <SelectItem value="funnel-1">Funil 1</SelectItem>
                                <SelectItem value="funnel-2">Funil 2</SelectItem>
                                <SelectItem value="funnel-p3">Funil P3</SelectItem>
                            </SelectContent>
                        </Select>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-64 justify-start text-left font-normal"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date.from ? (
                                        date.to ? (
                                            `${format(date.from, 'dd/MM/yy', { locale: ptBR })} - ${format(date.to, 'dd/MM/yy', { locale: ptBR })}`
                                        ) : (
                                            format(date.from, 'dd/MM/yy', { locale: ptBR })
                                        )
                                    ) : (
                                        <span>Selecione um período</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 flex" align="end">
                                <div className="flex flex-col space-y-2 border-r p-4">
                                    <Button variant="ghost" className="justify-start" onClick={() => setDate({from: subDays(new Date(), 6), to: new Date()})}>
                                        Últimos 7 dias
                                    </Button>
                                    <Button variant="ghost" className="justify-start" onClick={() => setDate({from: subDays(new Date(), 29), to: new Date()})}>
                                        Últimos 30 dias
                                    </Button>
                                    <Button variant="ghost" className="justify-start" onClick={() => setDate(null)}>
                                        Limpar seleção
                                    </Button>
                                </div>
                                <Calendar
                                    mode="range"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    locale={ptBR}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>

                        <Button
                            onClick={handleClearData}
                            disabled={isDeleting}
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Limpando...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Limpar Dados
                                </>
                            )}
                        </Button>

                        <ABTestDialog onTestChange={loadActiveABTest} />

                        <ComparisonDialog />

                        <SessionHistoryDialog
                            selectedFunnel={selectedFunnel}
                            dateRange={date}
                        />

                        <Button
                            onClick={() => {
                                loadQuizData();
                                loadActiveABTest();
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Atualizar'}
                        </Button>
                    </div>
                </div>

                {/* A/B Test Active Banner */}
                {activeABTest && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-blue-900">Teste A/B Ativo: {activeABTest.name}</h3>
                                <p className="text-sm text-blue-700 mt-1">
                                    Comparando {activeABTest.variant_a || activeABTest.control_funnel} (Variante A) vs {activeABTest.variant_b || activeABTest.test_funnel} (Variante B)
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cards de Métricas */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-8 mb-8">
                    {/* Card de Visitantes - Apenas leitura (dados reais) */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total de Visitantes</CardTitle>
                            <Users className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-black">{totalVisitantes}</div>
                            <p className="text-xs text-gray-500">Leads que iniciaram o quiz</p>
                            {activeABTest && controlStats && testStats && renderComparison(controlStats.totalVisitantes, testStats.totalVisitantes)}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Start Quiz</CardTitle>
                            <Play className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-black">{startQuiz}</div>
                            <p className="text-xs text-gray-500">
                                {totalVisitantes > 0 ? ((startQuiz / totalVisitantes) * 100).toFixed(1) : '0.0'}% dos visitantes
                            </p>
                            {activeABTest && controlStats && testStats && renderComparison(controlStats.startQuiz, testStats.startQuiz)}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Paywall</CardTitle>
                            <CreditCard className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-black">{paywall}</div>
                            <p className="text-xs text-gray-500">
                                {startQuiz > 0 ? ((paywall / startQuiz) * 100).toFixed(1) : '0.0'}% dos que iniciaram
                            </p>
                            {activeABTest && controlStats && testStats && renderComparison(controlStats.paywall, testStats.paywall)}
                        </CardContent>
                    </Card>
                    {/* New Editable Card for Checkout */}
                    <Card className="cursor-pointer" onClick={!isEditingCheckout ? handleEditCheckout : undefined}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Checkout</CardTitle>
                            <CreditCard className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            {isEditingCheckout ? (
                                <div className="space-y-2">
                                    <input
                                        type="number"
                                        min="0"
                                        value={tempCheckoutValue}
                                        onChange={(e) => setTempCheckoutValue(e.target.value)}
                                        className="w-full text-2xl font-bold text-orange-600 bg-transparent border border-orange-300 rounded px-2 py-1 focus:outline-none focus:border-orange-500"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleSaveCheckout();
                                            }
                                            if (e.key === 'Escape') {
                                                e.preventDefault();
                                                handleCancelEditCheckout();
                                            }
                                        }}
                                    />
                                    <div className="flex gap-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSaveCheckout();
                                            }}
                                            className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded transition-colors"
                                        >
                                            ✓ Salvar
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCancelEditCheckout();
                                            }}
                                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded transition-colors"
                                        >
                                            ✕ Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="text-2xl font-bold text-black flex items-center">
                                        {checkout}
                                        <span className="text-xs ml-2 text-gray-400">✎</span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {manualCheckout !== null ? `Manual (${quizData.filter(item => item.checkout_step_clicked).length} automáticos)` : 'Checkouts automáticos'}
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Retenção</CardTitle>
                            <TrendingUp className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-black">{retencao}%</div>
                            <p className="text-xs text-gray-500">Paywall / Start Quiz</p>
                            {activeABTest && controlStats && testStats && renderComparison(controlStats.retencao, testStats.retencao, true)}
                        </CardContent>
                    </Card>
                    {/* New Card for Passagem */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Passagem</CardTitle>
                            <TrendingUp className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-black">{passagem}%</div>
                            <p className="text-xs text-gray-500">Checkout / Paywall</p>
                            {activeABTest && controlStats && testStats && renderComparison(controlStats.passagem, testStats.passagem, true)}
                        </CardContent>
                    </Card>
                    {/* Editable Card for Vendas - IMPROVED VERSION */}
                    <Card className="cursor-pointer" onClick={!isEditingVendas ? handleEditVendas : undefined}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Vendas</CardTitle>
                            <CreditCard className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            {isEditingVendas ? (
                                <div className="space-y-2">
                                    <input
                                        type="number"
                                        min="0"
                                        value={tempVendasValue}
                                        onChange={(e) => setTempVendasValue(e.target.value)}
                                        className="w-full text-2xl font-bold text-green-600 bg-transparent border border-green-300 rounded px-2 py-1 focus:outline-none focus:border-green-500"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleSaveVendas();
                                            }
                                            if (e.key === 'Escape') {
                                                e.preventDefault();
                                                handleCancelEditVendas();
                                            }
                                        }}
                                    />
                                    <div className="flex gap-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSaveVendas();
                                            }}
                                            className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded transition-colors"
                                        >
                                            ✓ Salvar
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCancelEditVendas();
                                            }}
                                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded transition-colors"
                                        >
                                            ✕ Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="text-2xl font-bold text-black flex items-center">
                                        {vendas}
                                        <span className="text-xs ml-2 text-gray-400">✎</span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {manualVendas !== null ? `Manual (${salesData.length} automáticas)` : 'Vendas automáticas'}
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    {/* New Card for Conversão Geral */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Conversão Geral</CardTitle>
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-black">{conversao}%</div>
                            <p className="text-xs text-gray-500">Vendas / Visitantes Totais</p>
                            {activeABTest && controlStats && testStats && renderComparison(controlStats.conversao, testStats.conversao, true)}
                        </CardContent>
                    </Card>
                </div>

                {/* Funil de Conversão */}
                {activeABTest && controlStats && testStats ? (
                    <div className="space-y-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    Funil de Conversão - Variante A ({activeABTest.variant_a || activeABTest.control_funnel})
                                </CardTitle>
                                <CardDescription>Variante A do teste A/B</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between overflow-x-auto p-4 space-x-4">
                                    {controlStats.funnelWithMetrics.map((step, index) => {
                                        const retentionColor = parseFloat(step.retentionPercentage) >= 50 ? 'bg-green-100 text-green-800' : parseFloat(step.retentionPercentage) >= 20 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
                                        const nextStep = controlStats.funnelWithMetrics[index + 1];
                                        let passageRate = null;
                                        if (nextStep && step.count > 0) {
                                            passageRate = ((nextStep.count / step.count) * 100).toFixed(1);
                                        }
                                        return (
                                            <React.Fragment key={step.name}>
                                                <div className="flex flex-col items-center min-w-[120px] text-center">
                                                    <p className="text-sm font-medium text-gray-600 mb-1 whitespace-nowrap">{step.name}</p>
                                                    <p className="text-3xl font-bold text-blue-600 mb-4">{step.count}</p>
                                                    <div className="w-full space-y-2">
                                                        <div className={`flex items-center justify-between text-xs p-1 rounded-md ${retentionColor}`}>
                                                            <span className="font-semibold mr-1">Retenção</span>
                                                            <span>{step.retentionPercentage}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {nextStep && (
                                                    <div className="flex flex-col items-center justify-center min-w-[80px]">
                                                        <div className="text-center mb-2">
                                                            <span className={`text-sm font-bold px-2 py-1 rounded ${parseFloat(passageRate) >= 75 ? 'bg-green-100 text-green-800' : parseFloat(passageRate) >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                                {passageRate}%
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <div className="w-12 h-0.5 bg-gray-400"></div>
                                                            <div className="w-0 h-0 border-l-4 border-l-gray-400 border-y-4 border-y-transparent"></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    Funil de Conversão - Variante B ({activeABTest.variant_b || activeABTest.test_funnel})
                                </CardTitle>
                                <CardDescription>Variante B do teste A/B</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between overflow-x-auto p-4 space-x-4">
                                    {testStats.funnelWithMetrics.map((step, index) => {
                                        const retentionColor = parseFloat(step.retentionPercentage) >= 50 ? 'bg-green-100 text-green-800' : parseFloat(step.retentionPercentage) >= 20 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
                                        const nextStep = testStats.funnelWithMetrics[index + 1];
                                        let passageRate = null;
                                        if (nextStep && step.count > 0) {
                                            passageRate = ((nextStep.count / step.count) * 100).toFixed(1);
                                        }
                                        return (
                                            <React.Fragment key={step.name}>
                                                <div className="flex flex-col items-center min-w-[120px] text-center">
                                                    <p className="text-sm font-medium text-gray-600 mb-1 whitespace-nowrap">{step.name}</p>
                                                    <p className="text-3xl font-bold text-green-600 mb-4">{step.count}</p>
                                                    <div className="w-full space-y-2">
                                                        <div className={`flex items-center justify-between text-xs p-1 rounded-md ${retentionColor}`}>
                                                            <span className="font-semibold mr-1">Retenção</span>
                                                            <span>{step.retentionPercentage}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {nextStep && (
                                                    <div className="flex flex-col items-center justify-center min-w-[80px]">
                                                        <div className="text-center mb-2">
                                                            <span className={`text-sm font-bold px-2 py-1 rounded ${parseFloat(passageRate) >= 75 ? 'bg-green-100 text-green-800' : parseFloat(passageRate) >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                                {passageRate}%
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <div className="w-12 h-0.5 bg-gray-400"></div>
                                                            <div className="w-0 h-0 border-l-4 border-l-gray-400 border-y-4 border-y-transparent"></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>
                                Funil de Conversão - {selectedFunnel === 'all' ? 'Todos os Funis' :
                                selectedFunnel === 'funnel-1' ? 'Funil 1' :
                                selectedFunnel === 'funnel-2' ? 'Funil 2' : 'Funil P3'}
                            </CardTitle>
                            <CardDescription>Visualize a jornada dos visitantes através de cada etapa do quiz</CardDescription>
                        </CardHeader>
                    <CardContent>
                        <div className="flex justify-between overflow-x-auto p-4 space-x-4">
                            {funnelWithMetrics.map((step, index) => {
                                const retentionColor = parseFloat(step.retentionPercentage) >= 50 ? 'bg-green-100 text-green-800' : parseFloat(step.retentionPercentage) >= 20 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
                                
                                // Calcular métrica de passagem para a próxima etapa
                                const nextStep = funnelWithMetrics[index + 1];
                                let passageRate = null;
                                if (nextStep && step.count > 0) {
                                    passageRate = ((nextStep.count / step.count) * 100).toFixed(1);
                                }

                                return (
                                    <React.Fragment key={step.name}>
                                        <div className="flex flex-col items-center min-w-[120px] text-center">
                                            <p className="text-sm font-medium text-gray-600 mb-1 whitespace-nowrap">{step.name}</p>
                                            <p className="text-xs text-gray-400 mb-2 font-mono whitespace-nowrap">({step.field || 'total'})</p>
                                            <p className="text-3xl font-bold text-purple-600 mb-4">{step.count}</p>
                                            
                                            <div className="w-full space-y-2">
                                                <div className={`flex items-center justify-between text-xs p-1 rounded-md ${retentionColor}`}>
                                                    <span className="font-semibold mr-1">Retenção</span>
                                                    <span>{step.retentionPercentage}%</span>
                                                </div>
                                                
                                                {step.additionalMetric && (
                                                    <div className="flex items-center justify-between text-xs p-1 rounded-md bg-blue-100 text-blue-800">
                                                        <span className="font-semibold mr-1">{step.additionalMetric.label}</span>
                                                        <span>{step.additionalMetric.value}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Seta com métrica de passagem */}
                                        {nextStep && (
                                            <div className="flex flex-col items-center justify-center min-w-[80px]">
                                                <div className="text-center mb-2">
                                                    <span className={`text-sm font-bold px-2 py-1 rounded ${
                                                        parseFloat(passageRate) >= 75 ? 'bg-green-100 text-green-800' :
                                                        parseFloat(passageRate) >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {passageRate}%
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="w-12 h-0.5 bg-gray-400"></div>
                                                    <div className="w-0 h-0 border-l-4 border-l-gray-400 border-y-4 border-y-transparent"></div>
                                                </div>
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                        <p className="text-xs text-gray-500 mt-4 text-center">
                            <b>Como interpretar:</b> <b>Retenção</b> mostra a % de visitantes em relação ao total. <b>Percentual nas setas</b> mostra quantos % da etapa anterior avançaram para a próxima etapa.
                        </p>
                    </CardContent>
                    </Card>
                )}

                {/* Funil de Upsell Card */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Funil de Upsell</CardTitle>
                        <CardDescription>Performance das páginas de upsell no período selecionado</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600 mb-2">{upsellMetrics.upJourneyViews}</div>
                                <div className="text-sm text-gray-600">Up-Journey Views</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600 mb-2">{upsellMetrics.upEnergyViews}</div>
                                <div className="text-sm text-gray-600">Up-Energy Views</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600 mb-2">{upsellMetrics.upLetterViews}</div>
                                <div className="text-sm text-gray-600">Up-Letter Views</div>
                            </div>
                        </div>

                        {upsellData.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-md font-semibold mb-3">Detalhamento por Página</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b bg-gray-50">
                                                <th className="text-left p-2">Página</th>
                                                <th className="text-center p-2">Visualizações</th>
                                                <th className="text-center p-2">% do Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { name: 'Up-Journey', count: upsellMetrics.upJourneyViews, key: 'up-journey' },
                                                { name: 'Up-Energy', count: upsellMetrics.upEnergyViews, key: 'up-energy' },
                                                { name: 'Up-Letter', count: upsellMetrics.upLetterViews, key: 'up-letter' }
                                            ].map(page => {
                                                const totalViews = upsellMetrics.upJourneyViews + upsellMetrics.upEnergyViews + upsellMetrics.upLetterViews;
                                                return (
                                                    <tr key={page.key} className="border-b">
                                                        <td className="p-2 font-medium">{page.name}</td>
                                                        <td className="p-2 text-center">{page.count}</td>
                                                        <td className="p-2 text-center">
                                                            {totalViews > 0 
                                                                ? ((page.count / totalViews) * 100).toFixed(1) 
                                                                : '0.0'}%
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {upsellData.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                Nenhuma visualização de upsell encontrada para o período selecionado
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

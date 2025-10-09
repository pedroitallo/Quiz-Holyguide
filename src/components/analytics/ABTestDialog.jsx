import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, FlaskConical, Loader2, Play, Pause, Trash2, Eye, Edit, RotateCcw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ABTestDialog({ onTestChange }) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('configure');
    const [isLoading, setIsLoading] = useState(false);
    const [tests, setTests] = useState([]);
    const [completedTests, setCompletedTests] = useState([]);
    const [editingResult, setEditingResult] = useState(null);
    const [resultText, setResultText] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        hypothesis: '',
        objective: '',
        variant_a: '',
        variant_b: '',
        variant_c: '',
        variant_d: '',
        variant_e: '',
        start_date: new Date(),
    });

    const [variantCount, setVariantCount] = useState(2);

    const [editingTest, setEditingTest] = useState(null);

    const funnelOptions = [
        { value: 'funnel-1', label: 'Funil 1' },
        { value: 'funnel-chat1', label: 'Funil Chat 1' },
        { value: 'funnel-tt', label: 'Funil TT' },
        { value: 'funnel-vsl', label: 'Funil VSL' },
        { value: 'funnelesp', label: 'Funil ESP' },
        { value: 'funnel-star2', label: 'Funil Star 2' },
        { value: 'funnel-star3', label: 'Funil Star 3' },
        { value: 'funnel-star4', label: 'Funil Star 4' },
        { value: 'funnel-star5', label: 'Funil Star 5' },
    ];

    useEffect(() => {
        if (open) {
            loadTests();
        }
    }, [open]);

    const loadTests = async () => {
        try {
            const { data: activeData, error: activeError } = await supabase
                .from('ab_tests')
                .select('*')
                .in('status', ['active', 'paused'])
                .order('created_at', { ascending: false });

            if (activeError) throw activeError;

            const { data: completedData, error: completedError } = await supabase
                .from('ab_tests')
                .select('*')
                .eq('status', 'completed')
                .order('end_date', { ascending: false });

            if (completedError) throw completedError;

            setTests(activeData || []);
            setCompletedTests(completedData || []);
        } catch (error) {
            console.error('Error loading A/B tests:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (editingTest) {
                const { error } = await supabase
                    .from('ab_tests')
                    .update({
                        name: formData.name,
                        hypothesis: formData.hypothesis,
                        objective: formData.objective,
                        variant_a: formData.variant_a,
                        variant_b: formData.variant_b,
                        variant_c: formData.variant_c || null,
                        variant_d: formData.variant_d || null,
                        variant_e: formData.variant_e || null,
                        start_date: formData.start_date.toISOString(),
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', editingTest.id);

                if (error) throw error;
                alert('Teste A/B atualizado com sucesso!');
            } else {
                const { error } = await supabase
                    .from('ab_tests')
                    .insert([{
                        name: formData.name,
                        hypothesis: formData.hypothesis,
                        objective: formData.objective,
                        variant_a: formData.variant_a,
                        variant_b: formData.variant_b,
                        variant_c: formData.variant_c || null,
                        variant_d: formData.variant_d || null,
                        variant_e: formData.variant_e || null,
                        start_date: formData.start_date.toISOString(),
                        status: 'active',
                    }]);

                if (error) throw error;
                alert('Teste A/B criado com sucesso!');
            }

            resetForm();
            await loadTests();
            if (onTestChange) onTestChange();
            setActiveTab('manage');
        } catch (error) {
            console.error('Error saving A/B test:', error);
            alert('Erro ao salvar teste A/B');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            hypothesis: '',
            objective: '',
            variant_a: '',
            variant_b: '',
            variant_c: '',
            variant_d: '',
            variant_e: '',
            start_date: new Date(),
        });
        setVariantCount(2);
        setEditingTest(null);
    };

    const handleEdit = (test) => {
        const activeVariants = [test.variant_a, test.variant_b, test.variant_c, test.variant_d, test.variant_e].filter(v => v);
        setFormData({
            name: test.name,
            hypothesis: test.hypothesis || '',
            objective: test.objective || '',
            variant_a: test.variant_a || test.control_funnel || '',
            variant_b: test.variant_b || test.test_funnel || '',
            variant_c: test.variant_c || '',
            variant_d: test.variant_d || '',
            variant_e: test.variant_e || '',
            start_date: new Date(test.start_date),
        });
        setVariantCount(activeVariants.length);
        setEditingTest(test);
        setActiveTab('configure');
    };

    const handlePause = async (testId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'paused' : 'active';
            const { error } = await supabase
                .from('ab_tests')
                .update({
                    status: newStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', testId);

            if (error) throw error;
            await loadTests();
            if (onTestChange) onTestChange();
        } catch (error) {
            console.error('Error pausing/resuming test:', error);
            alert('Erro ao pausar/retomar teste');
        }
    };

    const handleComplete = async (testId) => {
        if (!confirm('Deseja finalizar este teste A/B? Ele será movido para o histórico.')) return;

        try {
            const { error } = await supabase
                .from('ab_tests')
                .update({
                    status: 'completed',
                    end_date: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', testId);

            if (error) throw error;
            await loadTests();
            if (onTestChange) onTestChange();
            alert('Teste A/B finalizado com sucesso!');
        } catch (error) {
            console.error('Error completing test:', error);
            alert('Erro ao finalizar teste');
        }
    };

    const handleDelete = async (testId) => {
        if (!confirm('Tem certeza que deseja excluir este teste A/B? Esta ação não pode ser desfeita.')) return;

        try {
            const { error } = await supabase
                .from('ab_tests')
                .delete()
                .eq('id', testId);

            if (error) throw error;
            await loadTests();
            if (onTestChange) onTestChange();
            alert('Teste A/B excluído com sucesso!');
        } catch (error) {
            console.error('Error deleting test:', error);
            alert('Erro ao excluir teste');
        }
    };

    const handleSaveResult = async (testId) => {
        try {
            const { error } = await supabase
                .from('ab_tests')
                .update({
                    result: resultText,
                    updated_at: new Date().toISOString()
                })
                .eq('id', testId);

            if (error) throw error;
            await loadTests();
            setEditingResult(null);
            setResultText('');
            alert('Resultado salvo com sucesso!');
        } catch (error) {
            console.error('Error saving result:', error);
            alert('Erro ao salvar resultado');
        }
    };

    const handleEditResult = (test) => {
        setEditingResult(test.id);
        setResultText(test.result || '');
    };

    const handleCancelEditResult = () => {
        setEditingResult(null);
        setResultText('');
    };

    const handleResetData = async (test) => {
        const tablesToReset = [
            'step_views_funnel_1',
            'step_views_funnel_tt',
            'step_views_funnel_vsl',
            'step_views_funnelesp',
            'step_views_funnel_star2',
            'step_views_funnel_star3',
            'step_views_funnel_star4',
            'step_views_funnel_star5'
        ];

        const { data: countData } = await supabase
            .from(tablesToReset[0])
            .select('id', { count: 'exact', head: true })
            .eq('ab_test_id', test.id);

        let totalRecords = 0;
        for (const table of tablesToReset) {
            const { count } = await supabase
                .from(table)
                .select('id', { count: 'exact', head: true })
                .eq('ab_test_id', test.id);
            totalRecords += count || 0;
        }

        if (totalRecords === 0) {
            alert('Não há dados para resetar neste teste.');
            return;
        }

        const variants = getActiveVariants(test);
        const variantNames = variants.map(v => getFunnelLabel(v.value)).join(', ');

        const confirmMessage = `Tem certeza que deseja RESETAR os dados deste teste?\n\n` +
            `Serão removidos ${totalRecords} registros vinculados a este teste específico.\n\n` +
            `Os dados históricos dos funis (${variantNames}) NÃO serão afetados.\n\n` +
            `Esta ação não pode ser desfeita.`;

        if (!confirm(confirmMessage)) return;

        try {
            let deletedCount = 0;
            for (const table of tablesToReset) {
                const { error, count } = await supabase
                    .from(table)
                    .delete({ count: 'exact' })
                    .eq('ab_test_id', test.id);

                if (error) {
                    console.error(`Erro ao resetar ${table}:`, error);
                } else {
                    deletedCount += count || 0;
                }
            }

            await loadTests();
            if (onTestChange) onTestChange();
            alert(`Dados do teste resetados com sucesso!\n${deletedCount} registros foram removidos.`);
        } catch (error) {
            console.error('Error resetting test data:', error);
            alert('Erro ao resetar dados do teste');
        }
    };

    const getFunnelLabel = (funnelValue) => {
        return funnelOptions.find(f => f.value === funnelValue)?.label || funnelValue;
    };

    const getActiveVariants = (test) => {
        const variants = [];
        if (test.variant_a) variants.push({ label: 'A', value: test.variant_a });
        if (test.variant_b) variants.push({ label: 'B', value: test.variant_b });
        if (test.variant_c) variants.push({ label: 'C', value: test.variant_c });
        if (test.variant_d) variants.push({ label: 'D', value: test.variant_d });
        if (test.variant_e) variants.push({ label: 'E', value: test.variant_e });

        // Fallback for old tests
        if (variants.length === 0 && test.control_funnel && test.test_funnel) {
            variants.push({ label: 'A', value: test.control_funnel });
            variants.push({ label: 'B', value: test.test_funnel });
        }

        return variants;
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-white hover:bg-gray-50">
                    <FlaskConical className="w-4 h-4 mr-2" />
                    Testes A/B
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Gestão de Testes A/B</DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="configure">Configurar</TabsTrigger>
                        <TabsTrigger value="manage">Gestão</TabsTrigger>
                        <TabsTrigger value="history">Histórico</TabsTrigger>
                    </TabsList>

                    <TabsContent value="configure" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>{editingTest ? 'Editar Teste A/B' : 'Criar Novo Teste A/B'}</CardTitle>
                                <CardDescription>
                                    Configure um teste para comparar o desempenho entre 2 a 5 variantes de funis
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nome do Teste *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Ex: Teste de Novo Layout"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="hypothesis">Hipótese</Label>
                                        <Textarea
                                            id="hypothesis"
                                            value={formData.hypothesis}
                                            onChange={(e) => setFormData({ ...formData, hypothesis: e.target.value })}
                                            placeholder="Qual é a hipótese que você está testando?"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="objective">Objetivo</Label>
                                        <Textarea
                                            id="objective"
                                            value={formData.objective}
                                            onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                                            placeholder="Qual é o objetivo deste teste?"
                                            rows={2}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <Label>Variantes do Teste (2 a 5)</Label>
                                            <div className="flex gap-2">
                                                {variantCount < 5 && (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setVariantCount(variantCount + 1)}
                                                    >
                                                        + Adicionar Variante
                                                    </Button>
                                                )}
                                                {variantCount > 2 && (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setVariantCount(variantCount - 1);
                                                            const variantKeys = ['variant_c', 'variant_d', 'variant_e'];
                                                            const keyToRemove = variantKeys[variantCount - 3];
                                                            setFormData({ ...formData, [keyToRemove]: '' });
                                                        }}
                                                    >
                                                        - Remover
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Variante A *</Label>
                                                <Select
                                                    value={formData.variant_a}
                                                    onValueChange={(value) => setFormData({ ...formData, variant_a: value })}
                                                    required
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione a variante A" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {funnelOptions.map(option => (
                                                            <SelectItem
                                                                key={option.value}
                                                                value={option.value}
                                                                disabled={[formData.variant_b, formData.variant_c, formData.variant_d, formData.variant_e].includes(option.value)}
                                                            >
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Variante B *</Label>
                                                <Select
                                                    value={formData.variant_b}
                                                    onValueChange={(value) => setFormData({ ...formData, variant_b: value })}
                                                    required
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione a variante B" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {funnelOptions.map(option => (
                                                            <SelectItem
                                                                key={option.value}
                                                                value={option.value}
                                                                disabled={[formData.variant_a, formData.variant_c, formData.variant_d, formData.variant_e].includes(option.value)}
                                                            >
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {variantCount >= 3 && (
                                                <div className="space-y-2">
                                                    <Label>Variante C</Label>
                                                    <Select
                                                        value={formData.variant_c}
                                                        onValueChange={(value) => setFormData({ ...formData, variant_c: value })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione a variante C" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {funnelOptions.map(option => (
                                                                <SelectItem
                                                                    key={option.value}
                                                                    value={option.value}
                                                                    disabled={[formData.variant_a, formData.variant_b, formData.variant_d, formData.variant_e].includes(option.value)}
                                                                >
                                                                    {option.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}

                                            {variantCount >= 4 && (
                                                <div className="space-y-2">
                                                    <Label>Variante D</Label>
                                                    <Select
                                                        value={formData.variant_d}
                                                        onValueChange={(value) => setFormData({ ...formData, variant_d: value })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione a variante D" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {funnelOptions.map(option => (
                                                                <SelectItem
                                                                    key={option.value}
                                                                    value={option.value}
                                                                    disabled={[formData.variant_a, formData.variant_b, formData.variant_c, formData.variant_e].includes(option.value)}
                                                                >
                                                                    {option.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}

                                            {variantCount >= 5 && (
                                                <div className="space-y-2">
                                                    <Label>Variante E</Label>
                                                    <Select
                                                        value={formData.variant_e}
                                                        onValueChange={(value) => setFormData({ ...formData, variant_e: value })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione a variante E" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {funnelOptions.map(option => (
                                                                <SelectItem
                                                                    key={option.value}
                                                                    value={option.value}
                                                                    disabled={[formData.variant_a, formData.variant_b, formData.variant_c, formData.variant_d].includes(option.value)}
                                                                >
                                                                    {option.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Data de Início *</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {formData.start_date ? format(formData.start_date, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione a data'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={formData.start_date}
                                                    onSelect={(date) => setFormData({ ...formData, start_date: date })}
                                                    locale={ptBR}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="flex gap-2 pt-4">
                                        <Button type="submit" disabled={isLoading} className="flex-1">
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Salvando...
                                                </>
                                            ) : (
                                                editingTest ? 'Atualizar Teste' : 'Criar Teste'
                                            )}
                                        </Button>
                                        {editingTest && (
                                            <Button type="button" variant="outline" onClick={resetForm}>
                                                Cancelar
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="manage" className="space-y-4">
                        {tests.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center text-gray-500">
                                    Nenhum teste A/B ativo ou pausado
                                </CardContent>
                            </Card>
                        ) : (
                            tests.map(test => (
                                <Card key={test.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2">
                                                    {test.name}
                                                    <span className={`text-xs px-2 py-1 rounded ${
                                                        test.status === 'active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {test.status === 'active' ? 'Ativo' : 'Pausado'}
                                                    </span>
                                                </CardTitle>
                                                <CardDescription>
                                                    Iniciado em {format(new Date(test.start_date), 'dd/MM/yyyy', { locale: ptBR })}
                                                </CardDescription>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEdit(test)}
                                                    title="Editar teste"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handlePause(test.id, test.status)}
                                                    title={test.status === 'active' ? 'Pausar teste' : 'Retomar teste'}
                                                >
                                                    {test.status === 'active' ? (
                                                        <Pause className="w-4 h-4" />
                                                    ) : (
                                                        <Play className="w-4 h-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleResetData(test)}
                                                    title="Resetar dados do teste"
                                                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                >
                                                    <RotateCcw className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleComplete(test.id)}
                                                    title="Finalizar teste"
                                                >
                                                    Finalizar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(test.id)}
                                                    title="Excluir teste"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {test.hypothesis && (
                                            <div>
                                                <span className="font-semibold text-sm">Hipótese: </span>
                                                <span className="text-sm text-gray-700">{test.hypothesis}</span>
                                            </div>
                                        )}
                                        {test.objective && (
                                            <div>
                                                <span className="font-semibold text-sm">Objetivo: </span>
                                                <span className="text-sm text-gray-700">{test.objective}</span>
                                            </div>
                                        )}
                                        <div>
                                            <span className="font-semibold text-sm">Variantes: </span>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {getActiveVariants(test).map(variant => (
                                                    <span key={variant.label} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                        {variant.label}: {getFunnelLabel(variant.value)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>

                    <TabsContent value="history" className="space-y-4">
                        {completedTests.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center text-gray-500">
                                    Nenhum teste A/B concluído
                                </CardContent>
                            </Card>
                        ) : (
                            completedTests.map(test => (
                                <Card key={test.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2">
                                                    {test.name}
                                                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">
                                                        Concluído
                                                    </span>
                                                </CardTitle>
                                                <CardDescription>
                                                    {format(new Date(test.start_date), 'dd/MM/yyyy', { locale: ptBR })} - {format(new Date(test.end_date), 'dd/MM/yyyy', { locale: ptBR })}
                                                </CardDescription>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(test.id)}
                                                    title="Excluir teste"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {test.hypothesis && (
                                            <div>
                                                <span className="font-semibold text-sm">Hipótese: </span>
                                                <span className="text-sm text-gray-700">{test.hypothesis}</span>
                                            </div>
                                        )}
                                        {test.objective && (
                                            <div>
                                                <span className="font-semibold text-sm">Objetivo: </span>
                                                <span className="text-sm text-gray-700">{test.objective}</span>
                                            </div>
                                        )}
                                        <div>
                                            <span className="font-semibold text-sm">Variantes: </span>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {getActiveVariants(test).map(variant => (
                                                    <span key={variant.label} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                        {variant.label}: {getFunnelLabel(variant.value)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="border-t pt-3 mt-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-sm">Resultado do Teste:</span>
                                                {editingResult !== test.id && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEditResult(test)}
                                                    >
                                                        <Edit className="w-3 h-3 mr-1" />
                                                        {test.result ? 'Editar' : 'Adicionar'}
                                                    </Button>
                                                )}
                                            </div>

                                            {editingResult === test.id ? (
                                                <div className="space-y-2">
                                                    <Textarea
                                                        value={resultText}
                                                        onChange={(e) => setResultText(e.target.value)}
                                                        placeholder="Descreva o resultado e as conclusões do teste..."
                                                        rows={4}
                                                        className="w-full"
                                                    />
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleSaveResult(test.id)}
                                                        >
                                                            Salvar Resultado
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={handleCancelEditResult}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded min-h-[60px]">
                                                    {test.result || 'Nenhum resultado registrado ainda'}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

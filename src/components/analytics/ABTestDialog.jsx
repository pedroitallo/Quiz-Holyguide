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

    const [formData, setFormData] = useState({
        name: '',
        hypothesis: '',
        objective: '',
        control_funnel: '',
        test_funnel: '',
        start_date: new Date(),
    });

    const [editingTest, setEditingTest] = useState(null);

    const funnelOptions = [
        { value: 'funnel-1', label: 'Funil 1' },
        { value: 'funnel-tt', label: 'Funil TT' },
        { value: 'funnel-vsl', label: 'Funil VSL' },
        { value: 'funnelesp', label: 'Funil ESP' },
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
                        control_funnel: formData.control_funnel,
                        test_funnel: formData.test_funnel,
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
                        control_funnel: formData.control_funnel,
                        test_funnel: formData.test_funnel,
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
            control_funnel: '',
            test_funnel: '',
            start_date: new Date(),
        });
        setEditingTest(null);
    };

    const handleEdit = (test) => {
        setFormData({
            name: test.name,
            hypothesis: test.hypothesis || '',
            objective: test.objective || '',
            control_funnel: test.control_funnel,
            test_funnel: test.test_funnel,
            start_date: new Date(test.start_date),
        });
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

    const handleResetData = async (test) => {
        const tablesToReset = [
            'step_views_funnel_1',
            'step_views_funnel_tt',
            'step_views_funnel_vsl',
            'step_views_funnelesp'
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

        const confirmMessage = `Tem certeza que deseja RESETAR os dados deste teste?\n\n` +
            `Serão removidos ${totalRecords} registros vinculados a este teste específico.\n\n` +
            `Os dados históricos dos funis ${test.control_funnel} e ${test.test_funnel} NÃO serão afetados.\n\n` +
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
                                    Configure um teste A/B para comparar o desempenho entre dois funis
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

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Funil Controle *</Label>
                                            <Select
                                                value={formData.control_funnel}
                                                onValueChange={(value) => setFormData({ ...formData, control_funnel: value })}
                                                required
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o controle" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {funnelOptions.map(option => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                            disabled={option.value === formData.test_funnel}
                                                        >
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Funil Teste *</Label>
                                            <Select
                                                value={formData.test_funnel}
                                                onValueChange={(value) => setFormData({ ...formData, test_funnel: value })}
                                                required
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o teste" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {funnelOptions.map(option => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                            disabled={option.value === formData.control_funnel}
                                                        >
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                                        <div className="flex gap-4">
                                            <div>
                                                <span className="font-semibold text-sm">Controle: </span>
                                                <span className="text-sm text-gray-700">{getFunnelLabel(test.control_funnel)}</span>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-sm">Teste: </span>
                                                <span className="text-sm text-gray-700">{getFunnelLabel(test.test_funnel)}</span>
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
                                        <div className="flex gap-4">
                                            <div>
                                                <span className="font-semibold text-sm">Controle: </span>
                                                <span className="text-sm text-gray-700">{getFunnelLabel(test.control_funnel)}</span>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-sm">Teste: </span>
                                                <span className="text-sm text-gray-700">{getFunnelLabel(test.test_funnel)}</span>
                                            </div>
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

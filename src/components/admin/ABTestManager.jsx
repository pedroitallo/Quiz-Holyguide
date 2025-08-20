
import React, { useState, useEffect } from 'react';
import { ABTest } from '@/api/entities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Loader2, PlusCircle, Trash2, Copy, Check, Link as LinkIcon, ExternalLink, GitFork, Edit } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { createPageUrl } from '@/utils';

export default function ABTestManager() {
    const [tests, setTests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingTest, setEditingTest] = useState(null);
    const [newTest, setNewTest] = useState({ name: '', slugA: '', slugB: '', splitA: 50, isActive: true, testSlug: '' });
    const [copiedSlug, setCopiedSlug] = useState(null);

    const customDomain = 'https://quiz.holymind.life';

    useEffect(() => {
        loadTests();
    }, []);

    const loadTests = async () => {
        setIsLoading(true);
        try {
            const allTests = await ABTest.list('-created_date');
            setTests(allTests);
        } catch (error) {
            console.error("Erro ao carregar testes A/B:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const currentData = editingTest || newTest;
        const setter = editingTest ? setEditingTest : setNewTest;
        setter(prev => ({ ...prev, [name]: value }));
    };

    const handleSliderChange = (value) => {
        const currentData = editingTest || newTest;
        const setter = editingTest ? setEditingTest : setNewTest;
        setter(prev => ({ ...prev, splitA: value[0] }));
    };

    const handleActiveToggle = (checked) => {
        const currentData = editingTest || newTest;
        const setter = editingTest ? setEditingTest : setNewTest;
        setter(prev => ({ ...prev, isActive: checked }));
    };

    const handleSaveTest = async () => {
        const currentData = editingTest || newTest;
        
        if (!currentData.name || !currentData.slugA || !currentData.slugB) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {
            if (editingTest) {
                await ABTest.update(editingTest.id, {
                    name: currentData.name,
                    slugA: currentData.slugA,
                    slugB: currentData.slugB,
                    splitA: currentData.splitA,
                    isActive: currentData.isActive
                });
                setEditingTest(null);
            } else {
                let finalTestSlug = currentData.testSlug;
                if (!finalTestSlug) {
                    const uniquePart = Math.random().toString(36).substring(2, 8);
                    finalTestSlug = `test-${uniquePart}`;
                }
                await ABTest.create({ ...currentData, testSlug: finalTestSlug });
                setNewTest({ name: '', slugA: '', slugB: '', splitA: 50, isActive: true, testSlug: '' });
                setIsCreating(false);
            }
            loadTests();
        } catch (error) {
            console.error("Erro ao salvar teste A/B:", error);
            alert("Ocorreu um erro ao salvar o teste.");
        }
    };

    const handleEditTest = (test) => {
        setEditingTest({ ...test });
        setIsCreating(false);
    };

    const handleCancelEdit = () => {
        setEditingTest(null);
        setIsCreating(false);
        setNewTest({ name: '', slugA: '', slugB: '', splitA: 50, isActive: true, testSlug: '' });
    };

    const handleDeleteTest = async (testId) => {
        try {
            await ABTest.delete(testId);
            loadTests();
        } catch (error) {
            console.error("Erro ao deletar teste A/B:", error);
        }
    };

    const getTestUrl = (testSlug) => {
        return createPageUrl(`quiz?test=${testSlug}`);
    };
    
    const getFullTestUrl = (testSlug) => {
        return `${customDomain}${getTestUrl(testSlug)}`;
    };
    
    const handleCopy = (text, slug) => {
        navigator.clipboard.writeText(text);
        setCopiedSlug(slug);
        setTimeout(() => setCopiedSlug(null), 2000);
    }

    const renderTestForm = (data, isEdit = false) => {
        const currentData = data || newTest;
        
        return (
            <div className="p-4 border rounded-lg bg-gray-50/50 space-y-4">
                <h3 className="font-semibold text-lg">{isEdit ? "Editar Teste" : "Criar Novo Teste"}</h3>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nome do Teste</Label>
                        <Input id="name" name="name" value={currentData.name || ''} onChange={handleInputChange} placeholder="Ex: Quiz V1 vs V2" />
                    </div>

                    {!isEdit && (
                        <div>
                            <Label htmlFor="testSlug">Slug do Teste (opcional)</Label>
                            <Input id="testSlug" name="testSlug" value={currentData.testSlug || ''} onChange={handleInputChange} placeholder="Ex: quiz-principal (será gerado se vazio)" />
                            <p className="text-sm text-muted-foreground mt-1">
                                Isso irá compor a URL: <strong>{customDomain}/quiz?test=...</strong>
                            </p>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="slugA">Slug da Página A</Label>
                            <Input id="slugA" name="slugA" value={currentData.slugA || ''} onChange={handleInputChange} placeholder="home-versao-a" />
                        </div>
                        <div>
                            <Label htmlFor="slugB">Slug da Página B</Label>
                            <Input id="slugB" name="slugB" value={currentData.slugB || ''} onChange={handleInputChange} placeholder="home-versao-b" />
                        </div>
                    </div>
                    <div>
                        <Label>Divisão de Tráfego (Split)</Label>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm font-medium text-blue-600">A: {currentData.splitA}%</span>
                            <Slider
                                value={[currentData.splitA]}
                                onValueChange={handleSliderChange}
                                max={100}
                                step={1}
                                className="flex-1"
                            />
                            <span className="text-sm font-medium text-green-600">B: {100 - currentData.splitA}%</span>
                        </div>
                    </div>
                     <div className="flex items-center space-x-2 pt-2">
                        <Switch id="isActive" checked={currentData.isActive} onCheckedChange={handleActiveToggle} />
                        <Label htmlFor="isActive">Teste Ativo</Label>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="ghost" onClick={handleCancelEdit}>Cancelar</Button>
                    <Button onClick={handleSaveTest}>Salvar</Button>
                </div>
            </div>
        );
    }
    
    if (isLoading) {
        return <div className="flex justify-center items-center py-10"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><GitFork /> Gerenciador de Testes A/B</CardTitle>
                <CardDescription>Crie e gerencie seus testes de split de tráfego aqui.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {!isCreating && !editingTest && (
                     <Button onClick={() => setIsCreating(true)}><PlusCircle className="mr-2 h-4 w-4" /> Criar Novo Teste</Button>
                )}

                {(isCreating || editingTest) && renderTestForm(editingTest, !!editingTest)}

                <div className="space-y-4">
                    {tests.map((test) => (
                        <div key={test.id} className={`p-4 border rounded-lg ${test.isActive ? 'bg-white' : 'bg-gray-100 opacity-70'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-lg">{test.name} {!test.isActive && <span className="text-xs text-red-500 font-normal">(Inativo)</span>}</h4>
                                    <p className="text-sm text-gray-600">A: /{test.slugA} ({test.splitA}%)</p>
                                    <p className="text-sm text-gray-600">B: /{test.slugB} ({100 - test.splitA}%)</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" onClick={() => handleEditTest(test)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="icon"><Trash2 className="w-4 h-4" /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Esta ação não pode ser desfeita. Isso excluirá permanentemente o teste A/B.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteTest(test.id)}>Deletar</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                                <LinkIcon className="w-4 h-4 text-purple-600"/>
                                <a href={getFullTestUrl(test.testSlug)} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:underline truncate ...">
                                    {getFullTestUrl(test.testSlug)}
                                </a>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => handleCopy(getFullTestUrl(test.testSlug), test.testSlug)}
                                >
                                    {copiedSlug === test.testSlug ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

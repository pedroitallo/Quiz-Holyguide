import React, { useState, useEffect } from 'react';
import { Funnel } from '@/api/entities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, PlusCircle, Trash2, Edit, ChevronLeft, GitBranch, ExternalLink } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { createPageUrl } from '@/utils';

export default function FunnelManager() {
    const [funnels, setFunnels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentFunnel, setCurrentFunnel] = useState(null);
    const customDomain = 'https://quiz.holymind.life';

    useEffect(() => {
        loadFunnels();
    }, []);

    const loadFunnels = async () => {
        setIsLoading(true);
        try {
            const allFunnels = await Funnel.list('-created_date');
            setFunnels(allFunnels);
        } catch (error) {
            console.error("Erro ao carregar funis:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentFunnel(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!currentFunnel.name || !currentFunnel.slug) {
            alert("Por favor, preencha o nome e a slug do funil.");
            return;
        }

        try {
            if (currentFunnel.id) {
                await Funnel.update(currentFunnel.id, currentFunnel);
            } else {
                await Funnel.create(currentFunnel);
            }
            handleCancel();
            loadFunnels();
        } catch (error) {
            console.error("Erro ao salvar funil:", error);
            alert("Ocorreu um erro ao salvar o funil.");
        }
    };

    const handleDelete = async (funnelId) => {
        try {
            await Funnel.delete(funnelId);
            loadFunnels();
        } catch (error) {
            console.error("Erro ao deletar funil:", error);
        }
    };

    const handleEditFunnel = (funnel) => {
        setCurrentFunnel({ ...funnel });
        setIsEditing(true);
    };

    const handleNewFunnel = () => {
        setCurrentFunnel({ name: '', slug: '', headerScripts: '', checkoutUrl: '' });
        setIsEditing(true);
    };
    
    const handleCancel = () => {
        setIsEditing(false);
        setCurrentFunnel(null);
    };

    const renderFunnelForm = (funnel) => {
        if (!currentFunnel) return null;
        
        return (
            <div className="space-y-6">
                <div>
                    <Button onClick={handleCancel} variant="ghost" className="mb-4">
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Voltar
                    </Button>
                    <h2 className="text-2xl font-semibold">Gerenciar Funil</h2>
                    <p className="text-gray-500">Editando: {funnel.name || 'Novo Funil'}</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Funil</Label>
                        <Input id="name" name="name" value={currentFunnel.name} onChange={handleInputChange} />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="slug">URL do Funil</Label>
                        <Input 
                            id="slug" 
                            name="slug"
                            value={currentFunnel?.slug || ''} 
                            onChange={handleInputChange} 
                            className="font-mono"
                            placeholder="ex: funnel-1"
                        />
                        {currentFunnel?.slug && (
                            <div className="text-sm text-gray-500 bg-gray-100 p-2 rounded-md break-all">
                                <p>URL completa:</p>
                                <a href={`${customDomain}${createPageUrl(currentFunnel.slug)}`} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                                   {customDomain}{createPageUrl(currentFunnel.slug)}
                                   <ExternalLink className="inline-block w-3 h-3 ml-1" />
                                </a>
                            </div>
                        )}
                        <p className="text-xs text-gray-500">A slug deve corresponder exatamente ao nome da página onde o funil está.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="checkoutUrl">URL de Checkout</Label>
                        <Input id="checkoutUrl" name="checkoutUrl" value={currentFunnel.checkoutUrl} onChange={handleInputChange} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="headerScripts">Scripts de Header</Label>
                        <Textarea id="headerScripts" name="headerScripts" value={currentFunnel.headerScripts} onChange={handleInputChange} rows={6} className="font-mono"/>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleSave}>Salvar Funil</Button>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return <div className="flex justify-center items-center py-10"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    if (isEditing) {
        return renderFunnelForm(currentFunnel);
    }
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Gerenciador de Funis</h2>
                    <p className="text-gray-500">Crie e edite seus funis de conversão.</p>
                </div>
                <Button onClick={handleNewFunnel}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Criar Novo Funil
                </Button>
            </div>
            <div className="space-y-4">
                {funnels.map(funnel => (
                    <Card key={funnel.id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-start">
                                <span>{funnel.name}</span>
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => handleEditFunnel(funnel)}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Gerenciar
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Esta ação não pode ser desfeita. Isso irá deletar permanentemente o funil.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(funnel.id)}>Deletar</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardTitle>
                            <CardDescription>Slug: <code className="font-mono bg-gray-100 p-1 rounded-sm">{funnel.slug}</code></CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import Dashboard from '../components/analytics/Dashboard';
import { Loader2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AnalyticsPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await User.me();
                // Acesso permitido apenas para administradores
                if (user && user.role === 'admin') {
                    setIsAuthenticated(true);
                } else {
                    // Se não for admin, ainda mostra a página mas com acesso negado
                    setIsAuthenticated(false);
                }
            } catch (error) {
                // Se User.me() falha, o usuário não está logado
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const handleLogin = async () => {
        try {
            await User.loginWithRedirect(window.location.href);
        } catch (error) {
            console.error('Erro ao fazer login:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Acesso Restrito</h1>
                    <p className="text-gray-600 mb-6">Apenas administradores podem acessar esta página.</p>
                    
                    <Button 
                        onClick={handleLogin}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
                    >
                        <LogIn className="w-4 h-4" />
                        Fazer Login como Admin
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Dashboard />
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Loader2, LogIn, Upload, BarChart3, Settings, Users, GitBranch, GitFork } from 'lucide-react';
import FileUploadManager from '../components/admin/FileUploadManager';
import FunnelManager from '../components/admin/FunnelManager';
import ABTestManager from '../components/admin/ABTestManager';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = await User.me();
                if (userData && userData.role === 'admin') {
                    setIsAuthenticated(true);
                    setUser(userData);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
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
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Panel Access</h1>
                    <p className="text-gray-600 mb-6">Only administrators can access this panel.</p>
                    
                    <Button 
                        onClick={handleLogin}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
                    >
                        <LogIn className="w-4 h-4" />
                        Login as Admin
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
                            <p className="text-gray-600">Welcome back, {user?.full_name || user?.email}</p>
                        </div>
                        <Button 
                            variant="outline" 
                            onClick={() => User.logout()}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            Logout
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="funnels" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:w-fit lg:grid-cols-6 mb-8">
                        <TabsTrigger value="funnels" className="flex items-center gap-2">
                            <GitBranch className="w-4 h-4" />
                            Funnels
                        </TabsTrigger>
                         <TabsTrigger value="ab-tests" className="flex items-center gap-2">
                            <GitFork className="w-4 h-4" />
                            Teste A/B
                        </TabsTrigger>
                        <TabsTrigger value="uploads" className="flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Uploads
                        </TabsTrigger>
                        <TabsTrigger value="metrics" className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Metrics
                        </TabsTrigger>
                        <TabsTrigger value="users" className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Users
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="funnels">
                        <FunnelManager />
                    </TabsContent>

                    <TabsContent value="ab-tests">
                        <ABTestManager />
                    </TabsContent>

                    <TabsContent value="uploads">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Upload className="w-5 h-5" />
                                    File Upload Manager
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FileUploadManager />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="metrics">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5" />
                                    Analytics & Metrics
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <p className="text-gray-600 mb-4">
                                        Access detailed analytics and metrics for your application.
                                    </p>
                                    <Link to={createPageUrl('metrics')}>
                                        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                                            <BarChart3 className="w-4 h-4 mr-2" />
                                            Open Metrics Dashboard
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="users">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    User Management
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <p className="text-gray-600">User management features coming soon...</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="w-5 h-5" />
                                    Application Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <p className="text-gray-600">Settings panel coming soon...</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

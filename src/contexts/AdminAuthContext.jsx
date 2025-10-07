import { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext(null);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const adminData = localStorage.getItem('admin_user');
      if (adminData) {
        setAdmin(JSON.parse(adminData));
      }
    } catch (error) {
      console.error('Error checking admin auth:', error);
      localStorage.removeItem('admin_user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!url || !key) {
        console.error('Environment variables missing:', {
          url: url ? 'SET' : 'MISSING',
          key: key ? 'SET' : 'MISSING'
        });
        throw new Error('Sistema de autenticacao nao configurado. Por favor, contate o administrador.');
      }

      const loginUrl = `${url}/functions/v1/admin-login`;
      console.log('Attempting login for:', email);
      console.log('Login URL:', loginUrl);
      console.log('Environment check:', {
        hasUrl: !!url,
        hasKey: !!key,
        keyLength: key?.length
      });

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const text = await response.text();
        console.error('HTTP Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: text
        });

        let errorMessage = 'Erro ao fazer login';
        try {
          const errorJson = JSON.parse(text);
          errorMessage = errorJson.error || errorMessage;
        } catch (e) {
          errorMessage = `Erro HTTP ${response.status}: ${text.substring(0, 100)}`;
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Servidor retornou resposta invalida: ${text.substring(0, 100)}`);
      }

      const result = await response.json();
      console.log('Login result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Credenciais invalidas');
      }

      const adminData = result.admin;
      setAdmin(adminData);
      localStorage.setItem('admin_user', JSON.stringify(adminData));

      console.log('Login successful for:', adminData.email);
      return { success: true };
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        type: error.name,
        stack: error.stack
      });
      return {
        success: false,
        error: error.message || 'Erro desconhecido ao fazer login'
      };
    }
  };

  const logout = async () => {
    setAdmin(null);
    localStorage.removeItem('admin_user');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

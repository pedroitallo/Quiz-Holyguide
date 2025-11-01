import React, { createContext, useContext, useState, useCallback } from 'react';
import { useVisualEditor } from '../hooks/useVisualEditor';

const VisualEditorContext = createContext(null);

export function VisualEditorProvider({ children, funnelId, stepSlug }) {
  const editorState = useVisualEditor(funnelId, stepSlug);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const checkAdminAuth = useCallback(async () => {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      try {
        const payload = JSON.parse(atob(adminToken.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        setIsAdminAuthenticated(!isExpired);
      } catch (error) {
        setIsAdminAuthenticated(false);
      }
    } else {
      setIsAdminAuthenticated(false);
    }
  }, []);

  React.useEffect(() => {
    checkAdminAuth();
  }, [checkAdminAuth]);

  const value = {
    ...editorState,
    isAdminAuthenticated,
    checkAdminAuth
  };

  return (
    <VisualEditorContext.Provider value={value}>
      {children}
    </VisualEditorContext.Provider>
  );
}

export function useVisualEditorContext() {
  const context = useContext(VisualEditorContext);
  if (!context) {
    throw new Error('useVisualEditorContext must be used within VisualEditorProvider');
  }
  return context;
}

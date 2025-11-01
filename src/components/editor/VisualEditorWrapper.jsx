import React, { useEffect } from 'react';
import { useVisualEditorContext } from '../../contexts/VisualEditorContext';
import EditorToolbar from './EditorToolbar';
import PropertiesPanel from './PropertiesPanel';

export default function VisualEditorWrapper({ children }) {
  const {
    isAdminAuthenticated,
    isEditorMode,
    setIsEditorMode,
    selectedElement,
    setSelectedElement,
    elementConfigs,
    isSaving,
    lastSaved,
    history,
    updateElement,
    publishAllChanges,
    loadHistory
  } = useVisualEditorContext();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedElement) {
        setSelectedElement(null);
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        if (isAdminAuthenticated) {
          setIsEditorMode(!isEditorMode);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminAuthenticated, isEditorMode, selectedElement, setIsEditorMode, setSelectedElement]);

  const handleClickOutside = (e) => {
    if (isEditorMode && !e.target.closest('.visual-editor-element') &&
        !e.target.closest('[data-panel="properties"]') &&
        !e.target.closest('[data-panel="toolbar"]')) {
      setSelectedElement(null);
    }
  };

  useEffect(() => {
    if (isEditorMode) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isEditorMode]);

  const hasUnpublishedChanges = Object.values(elementConfigs).some(
    config => config && !config.is_published
  );

  const handlePublishAll = async () => {
    const result = await publishAllChanges();
    if (result.success) {
      alert('Todas as alterações foram publicadas com sucesso!');
    } else {
      alert('Erro ao publicar alterações: ' + result.error);
    }
  };

  if (!isAdminAuthenticated) {
    return <>{children}</>;
  }

  return (
    <>
      {isEditorMode && (
        <div className="fixed inset-0 pointer-events-none z-40">
          <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[0.5px]" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        </div>
      )}

      <div data-panel="toolbar">
        <EditorToolbar
          isEditorMode={isEditorMode}
          onToggleEditor={() => setIsEditorMode(!isEditorMode)}
          isSaving={isSaving}
          lastSaved={lastSaved}
          onPublishAll={handlePublishAll}
          hasUnpublishedChanges={hasUnpublishedChanges}
        />
      </div>

      {isEditorMode && selectedElement && (
        <div data-panel="properties">
          <PropertiesPanel
            selectedElement={selectedElement}
            onClose={() => setSelectedElement(null)}
            onUpdate={updateElement}
            onLoadHistory={loadHistory}
            history={history}
          />
        </div>
      )}

      {children}
    </>
  );
}

import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export function useVisualEditor(funnelId, stepSlug) {
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [elementConfigs, setElementConfigs] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [history, setHistory] = useState([]);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (funnelId && stepSlug) {
      loadElementConfigs();
    }
  }, [funnelId, stepSlug]);

  const loadElementConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('step_element_configs')
        .select('*')
        .eq('funnel_id', funnelId)
        .eq('step_slug', stepSlug);

      if (error) throw error;

      const configsMap = {};
      data.forEach(config => {
        configsMap[config.element_id] = config;
      });

      setElementConfigs(configsMap);
    } catch (error) {
      console.error('Error loading element configs:', error);
    }
  };

  const loadHistory = async (elementId) => {
    try {
      const config = elementConfigs[elementId];
      if (!config) return;

      const { data, error } = await supabase
        .from('step_element_config_history')
        .select('*')
        .eq('config_id', config.id)
        .order('version', { ascending: false })
        .limit(20);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const autoSave = useCallback(async (elementId, updates) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);

        const existingConfig = elementConfigs[elementId];

        if (existingConfig) {
          const { error } = await supabase
            .from('step_element_configs')
            .update({
              content: updates.content || existingConfig.content,
              css_overrides: updates.css_overrides || existingConfig.css_overrides,
              updated_by: updates.updated_by,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingConfig.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('step_element_configs')
            .insert({
              funnel_id: funnelId,
              step_slug: stepSlug,
              element_id: elementId,
              element_type: updates.element_type,
              content: updates.content,
              css_overrides: updates.css_overrides || {},
              created_by: updates.updated_by,
              updated_by: updates.updated_by,
              is_published: false
            });

          if (error) throw error;
        }

        setLastSaved(new Date());
        await loadElementConfigs();
      } catch (error) {
        console.error('Error auto-saving:', error);
      } finally {
        setIsSaving(false);
      }
    }, 1000);
  }, [funnelId, stepSlug, elementConfigs]);

  const updateElement = useCallback((elementId, updates) => {
    setElementConfigs(prev => ({
      ...prev,
      [elementId]: {
        ...prev[elementId],
        ...updates
      }
    }));

    autoSave(elementId, updates);
  }, [autoSave]);

  const publishChanges = async (elementId) => {
    try {
      const config = elementConfigs[elementId];
      if (!config) return { success: false, error: 'Config not found' };

      const { error } = await supabase
        .from('step_element_configs')
        .update({ is_published: true })
        .eq('id', config.id);

      if (error) throw error;

      await loadElementConfigs();
      return { success: true };
    } catch (error) {
      console.error('Error publishing changes:', error);
      return { success: false, error: error.message };
    }
  };

  const publishAllChanges = async () => {
    try {
      const { error } = await supabase
        .from('step_element_configs')
        .update({ is_published: true })
        .eq('funnel_id', funnelId)
        .eq('step_slug', stepSlug)
        .eq('is_published', false);

      if (error) throw error;

      await loadElementConfigs();
      return { success: true };
    } catch (error) {
      console.error('Error publishing all changes:', error);
      return { success: false, error: error.message };
    }
  };

  const revertToVersion = async (elementId, version) => {
    try {
      const config = elementConfigs[elementId];
      if (!config) return { success: false, error: 'Config not found' };

      const { data, error } = await supabase
        .from('step_element_config_history')
        .select('*')
        .eq('config_id', config.id)
        .eq('version', version)
        .maybeSingle();

      if (error) throw error;
      if (!data) return { success: false, error: 'Version not found' };

      await updateElement(elementId, {
        content: data.content,
        css_overrides: data.css_overrides
      });

      return { success: true };
    } catch (error) {
      console.error('Error reverting to version:', error);
      return { success: false, error: error.message };
    }
  };

  const getElementConfig = useCallback((elementId) => {
    return elementConfigs[elementId] || null;
  }, [elementConfigs]);

  const getPublishedConfig = useCallback((elementId) => {
    const config = elementConfigs[elementId];
    return config && config.is_published ? config : null;
  }, [elementConfigs]);

  return {
    isEditorMode,
    setIsEditorMode,
    selectedElement,
    setSelectedElement,
    elementConfigs,
    isSaving,
    lastSaved,
    history,
    updateElement,
    publishChanges,
    publishAllChanges,
    revertToVersion,
    loadHistory,
    getElementConfig,
    getPublishedConfig,
    reload: loadElementConfigs
  };
}

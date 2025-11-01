import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useFunnelSteps = (funnelId) => {
  const [steps, setSteps] = useState([]);
  const [archivedSteps, setArchivedSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const loadSteps = useCallback(async () => {
    if (!funnelId) return;

    setLoading(true);
    try {
      const { data: activeData, error: activeError } = await supabase
        .from('funnel_steps')
        .select('*')
        .eq('funnel_id', funnelId)
        .eq('archived', false)
        .order('step_order');

      if (activeError) throw activeError;

      const { data: archivedData, error: archivedError } = await supabase
        .from('funnel_steps')
        .select('*')
        .eq('funnel_id', funnelId)
        .eq('archived', true)
        .order('step_order');

      if (archivedError) throw archivedError;

      setSteps(activeData || []);
      setArchivedSteps(archivedData || []);
    } catch (error) {
      console.error('Error loading steps:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [funnelId]);

  const loadHistory = useCallback(async () => {
    if (!funnelId) return;

    try {
      const { data, error } = await supabase
        .from('funnel_step_history')
        .select('*')
        .eq('funnel_id', funnelId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }, [funnelId]);

  const reorderSteps = useCallback(async (newOrder) => {
    try {
      for (let i = 0; i < newOrder.length; i++) {
        const step = newOrder[i];
        const { error } = await supabase
          .from('funnel_steps')
          .update({
            step_order: i + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', step.id);

        if (error) throw error;
      }

      await loadSteps();
      return { success: true };
    } catch (error) {
      console.error('Error reordering steps:', error);
      return { success: false, error: error.message };
    }
  }, [funnelId, loadSteps]);

  const renameStep = useCallback(async (stepId, newName) => {
    try {
      const step = steps.find(s => s.id === stepId) || archivedSteps.find(s => s.id === stepId);
      if (!step) {
        throw new Error('Step not found');
      }

      const oldName = step.step_name;

      const { error } = await supabase
        .from('funnel_steps')
        .update({
          step_name: newName,
          updated_at: new Date().toISOString()
        })
        .eq('id', stepId);

      if (error) throw error;

      const { syncStepNameWithAnalytics } = await import('../utils/analyticsStepSync');
      await syncStepNameWithAnalytics(stepId, oldName, newName, step.funnel_id);

      await loadSteps();
      return { success: true };
    } catch (error) {
      console.error('Error renaming step:', error);
      return { success: false, error: error.message };
    }
  }, [steps, archivedSteps, loadSteps]);

  const archiveStep = useCallback(async (stepId) => {
    try {
      const { error } = await supabase
        .from('funnel_steps')
        .update({
          archived: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', stepId);

      if (error) throw error;

      await loadSteps();
      return { success: true };
    } catch (error) {
      console.error('Error archiving step:', error);
      return { success: false, error: error.message };
    }
  }, [loadSteps]);

  const restoreStep = useCallback(async (stepId) => {
    try {
      const step = archivedSteps.find(s => s.id === stepId);
      if (!step) {
        throw new Error('Step not found');
      }

      const maxOrder = steps.length > 0
        ? Math.max(...steps.map(s => s.step_order))
        : 0;

      const { error } = await supabase
        .from('funnel_steps')
        .update({
          archived: false,
          step_order: maxOrder + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', stepId);

      if (error) throw error;

      await loadSteps();
      return { success: true };
    } catch (error) {
      console.error('Error restoring step:', error);
      return { success: false, error: error.message };
    }
  }, [archivedSteps, steps, loadSteps]);

  const updateStepConfig = useCallback(async (stepId, config) => {
    try {
      const { error } = await supabase
        .from('funnel_steps')
        .update({
          config,
          updated_at: new Date().toISOString()
        })
        .eq('id', stepId);

      if (error) throw error;

      await loadSteps();
      return { success: true };
    } catch (error) {
      console.error('Error updating step config:', error);
      return { success: false, error: error.message };
    }
  }, [loadSteps]);

  const deleteStep = useCallback(async (stepId) => {
    try {
      const { error } = await supabase
        .from('funnel_steps')
        .delete()
        .eq('id', stepId);

      if (error) throw error;

      await loadSteps();
      return { success: true };
    } catch (error) {
      console.error('Error deleting step:', error);
      return { success: false, error: error.message };
    }
  }, [loadSteps]);

  return {
    steps,
    archivedSteps,
    loading,
    history,
    loadSteps,
    loadHistory,
    reorderSteps,
    renameStep,
    archiveStep,
    restoreStep,
    updateStepConfig,
    deleteStep
  };
};

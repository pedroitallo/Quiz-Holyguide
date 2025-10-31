import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export function useFunnels() {
  const [funnels, setFunnels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFunnels();
  }, []);

  const loadFunnels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('funnels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFunnels(data || []);
    } catch (err) {
      console.error('Error loading funnels:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createFunnel = async (funnelData) => {
    try {
      const insertData = {
        name: funnelData.name,
        application_id: funnelData.application_id || null,
        offer_id: funnelData.offer_id || null,
        language: funnelData.language || 'pt-BR',
        traffic_source: funnelData.traffic_source || null,
        slug: funnelData.slug,
        url: funnelData.url || null,
        description: funnelData.description || '',
        status: funnelData.status || 'active'
      };

      const { data, error } = await supabase
        .from('funnels')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      await loadFunnels();
      return { success: true, data };
    } catch (err) {
      console.error('Error creating funnel:', err);
      return { success: false, error: err.message };
    }
  };

  const updateFunnel = async (id, updates) => {
    try {
      const updateData = {
        name: updates.name,
        application_id: updates.application_id || null,
        offer_id: updates.offer_id || null,
        language: updates.language || 'pt-BR',
        traffic_source: updates.traffic_source || null,
        slug: updates.slug,
        url: updates.url || null,
        description: updates.description || '',
        status: updates.status || 'active',
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('funnels')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await loadFunnels();
      return { success: true, data };
    } catch (err) {
      console.error('Error updating funnel:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteFunnel = async (id) => {
    try {
      const { error } = await supabase
        .from('funnels')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFunnels(prev => prev.filter(f => f.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting funnel:', err);
      return { success: false, error: err.message };
    }
  };

  const duplicateFunnel = async (id) => {
    try {
      const original = funnels.find(f => f.id === id);
      if (!original) throw new Error('Funnel not found');

      const { data: steps } = await supabase
        .from('funnel_steps')
        .select('*')
        .eq('funnel_id', id)
        .order('step_order');

      const newFunnel = {
        name: `${original.name} (Cópia)`,
        slug: `${original.slug}-copy-${Date.now()}`,
        description: original.description,
        status: 'draft',
        tags: original.tags,
        config: original.config
      };

      const { data: createdFunnel, error: createError } = await supabase
        .from('funnels')
        .insert([newFunnel])
        .select()
        .single();

      if (createError) throw createError;

      if (steps && steps.length > 0) {
        const newSteps = steps.map(step => ({
          funnel_id: createdFunnel.id,
          step_order: step.step_order,
          step_name: step.step_name,
          component_name: step.component_name,
          config: step.config
        }));

        const { error: stepsError } = await supabase
          .from('funnel_steps')
          .insert(newSteps);

        if (stepsError) throw stepsError;
      }

      setFunnels(prev => [createdFunnel, ...prev]);
      return { success: true, data: createdFunnel };
    } catch (err) {
      console.error('Error duplicating funnel:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    funnels,
    loading,
    error,
    loadFunnels,
    createFunnel,
    updateFunnel,
    deleteFunnel,
    duplicateFunnel
  };
}

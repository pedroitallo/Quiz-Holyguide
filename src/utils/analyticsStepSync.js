import { supabase } from '../lib/supabase';

export const syncStepNameWithAnalytics = async (stepId, oldName, newName, funnelId) => {
  try {
    const { data: step } = await supabase
      .from('funnel_steps')
      .select('*')
      .eq('id', stepId)
      .maybeSingle();

    if (!step) return { success: false, error: 'Step not found' };

    const { data: funnel } = await supabase
      .from('funnels')
      .select('slug')
      .eq('id', funnelId)
      .maybeSingle();

    if (!funnel) return { success: false, error: 'Funnel not found' };

    const funnelSlug = funnel.slug;
    const stepViewsTable = `step_views_${funnelSlug.replace(/-/g, '_')}`;

    const { error: checkTableError } = await supabase
      .from(stepViewsTable)
      .select('step_name')
      .limit(1);

    if (checkTableError) {
      console.log(`Table ${stepViewsTable} does not exist or is not accessible`);
      return { success: true, message: 'No analytics table to update' };
    }

    const { error: updateError } = await supabase
      .from(stepViewsTable)
      .update({ step_name: newName })
      .eq('step_name', oldName);

    if (updateError) {
      console.error('Error updating analytics:', updateError);
      return { success: false, error: updateError.message };
    }

    console.log(`Updated analytics for ${funnelSlug}: ${oldName} -> ${newName}`);
    return { success: true };
  } catch (error) {
    console.error('Error in syncStepNameWithAnalytics:', error);
    return { success: false, error: error.message };
  }
};

export const getStepAnalyticsByAllNames = async (funnelId, stepId) => {
  try {
    const { data: step } = await supabase
      .from('funnel_steps')
      .select('step_name, previous_names')
      .eq('id', stepId)
      .maybeSingle();

    if (!step) return { success: false, error: 'Step not found' };

    const { data: funnel } = await supabase
      .from('funnels')
      .select('slug')
      .eq('id', funnelId)
      .maybeSingle();

    if (!funnel) return { success: false, error: 'Funnel not found' };

    const funnelSlug = funnel.slug;
    const stepViewsTable = `step_views_${funnelSlug.replace(/-/g, '_')}`;

    const allNames = [step.step_name, ...(step.previous_names || [])];

    const { data, error } = await supabase
      .from(stepViewsTable)
      .select('*')
      .in('step_name', allNames);

    if (error) {
      console.error('Error fetching analytics:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data,
      allNames
    };
  } catch (error) {
    console.error('Error in getStepAnalyticsByAllNames:', error);
    return { success: false, error: error.message };
  }
};

export const getConsolidatedStepMetrics = async (funnelId, stepId) => {
  try {
    const result = await getStepAnalyticsByAllNames(funnelId, stepId);

    if (!result.success) {
      return result;
    }

    const views = result.data || [];

    const metrics = {
      totalViews: views.length,
      uniqueSessions: new Set(views.map(v => v.session_id)).size,
      firstView: views.length > 0
        ? views.reduce((earliest, v) =>
            new Date(v.viewed_at) < new Date(earliest.viewed_at) ? v : earliest
          ).viewed_at
        : null,
      lastView: views.length > 0
        ? views.reduce((latest, v) =>
            new Date(v.viewed_at) > new Date(latest.viewed_at) ? v : latest
          ).viewed_at
        : null,
      viewsByName: {}
    };

    result.allNames.forEach(name => {
      const nameViews = views.filter(v => v.step_name === name);
      metrics.viewsByName[name] = nameViews.length;
    });

    return {
      success: true,
      metrics
    };
  } catch (error) {
    console.error('Error in getConsolidatedStepMetrics:', error);
    return { success: false, error: error.message };
  }
};

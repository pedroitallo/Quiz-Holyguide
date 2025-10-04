import { supabase } from '../lib/supabase';

const getSessionId = () => {
  let sessionId = sessionStorage.getItem('quiz_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('quiz_session_id', sessionId);
  }
  return sessionId;
};

const getTableName = (funnelType) => {
  const tableMap = {
    'funnel-1': 'step_views_funnel_1',
    'funnel-tt': 'step_views_funnel_tt',
    'funnel-vsl': 'step_views_funnel_vsl',
    'funnelesp': 'step_views_funnelesp',
  };
  return tableMap[funnelType];
};

export const trackStepView = async (funnelType, stepName) => {
  try {
    const sessionId = getSessionId();
    const tableName = getTableName(funnelType);

    if (!tableName) {
      console.error('Invalid funnel type:', funnelType);
      return;
    }

    if (!stepName) {
      console.error('Step name is required for tracking');
      return;
    }

    const { data: existingData, error: fetchError } = await supabase
      .from(tableName)
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching existing step view:', fetchError);
      return;
    }

    if (existingData) {
      const updateData = {
        [stepName]: true,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('session_id', sessionId);

      if (updateError) {
        console.error('Error updating step view:', updateError);
      } else {
        console.log(`✓ Tracked ${funnelType} - ${stepName}: true`);
      }
    } else {
      const insertData = {
        session_id: sessionId,
        funnel_type: funnelType,
        [stepName]: true,
      };

      const { error: insertError } = await supabase
        .from(tableName)
        .insert([insertData]);

      if (insertError) {
        console.error('Error inserting step view:', insertError);
      } else {
        console.log(`✓ Created tracking for ${funnelType} - ${stepName}: true`);
      }
    }
  } catch (error) {
    console.error('Failed to track step view:', error);
  }
};

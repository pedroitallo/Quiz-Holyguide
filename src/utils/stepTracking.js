import { supabase } from '../lib/supabase';

const getSessionId = () => {
  let sessionId = sessionStorage.getItem('quiz_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('quiz_session_id', sessionId);
  }
  return sessionId;
};

const getActiveABTest = async (funnelType) => {
  const cachedTestId = sessionStorage.getItem('ab_test_id');
  const cachedFunnelType = sessionStorage.getItem('ab_test_funnel_type');

  if (cachedTestId && cachedFunnelType === funnelType) {
    return cachedTestId;
  }

  try {
    const { data, error } = await supabase
      .from('ab_tests')
      .select('id, control_funnel, test_funnel')
      .eq('status', 'active')
      .or(`control_funnel.eq.${funnelType},test_funnel.eq.${funnelType}`)
      .maybeSingle();

    if (error) {
      console.error('Error fetching active A/B test:', error);
      return null;
    }

    if (data) {
      sessionStorage.setItem('ab_test_id', data.id);
      sessionStorage.setItem('ab_test_funnel_type', funnelType);
      console.log(`✅ Active A/B test found for ${funnelType}:`, data.id);
      return data.id;
    }

    sessionStorage.removeItem('ab_test_id');
    sessionStorage.removeItem('ab_test_funnel_type');
    return null;
  } catch (error) {
    console.error('Failed to check for active A/B test:', error);
    return null;
  }
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

    const abTestId = await getActiveABTest(funnelType);

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

      if (abTestId && !existingData.ab_test_id) {
        updateData.ab_test_id = abTestId;
      }

      const { error: updateError } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('session_id', sessionId);

      if (updateError) {
        console.error('Error updating step view:', updateError);
      } else {
        console.log(`✓ Tracked ${funnelType} - ${stepName}: true${abTestId ? ` (Test: ${abTestId})` : ''}`);
      }
    } else {
      const insertData = {
        session_id: sessionId,
        funnel_type: funnelType,
        [stepName]: true,
      };

      if (abTestId) {
        insertData.ab_test_id = abTestId;
      }

      const { error: insertError } = await supabase
        .from(tableName)
        .insert([insertData]);

      if (insertError) {
        console.error('Error inserting step view:', insertError);
      } else {
        console.log(`✓ Created tracking for ${funnelType} - ${stepName}: true${abTestId ? ` (Test: ${abTestId})` : ''}`);
      }
    }
  } catch (error) {
    console.error('Failed to track step view:', error);
  }
};

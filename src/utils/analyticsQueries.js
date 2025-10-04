import { supabase } from '../lib/supabase';

const FUNNEL_TABLE_MAP = {
  'funnel-1': 'step_views_funnel_1',
  'funnel-tt': 'step_views_funnel_tt',
  'funnel-vsl': 'step_views_funnel_vsl',
  'funnelesp': 'step_views_funnelesp',
};

const FUNNEL_STEPS = {
  'funnel-1': [
    { key: 'video', label: 'Video' },
    { key: 'testimonials', label: 'Depoimentos' },
    { key: 'name', label: 'Nome' },
    { key: 'birth', label: 'Nascimento' },
    { key: 'love_situation', label: 'Situação Amorosa' },
    { key: 'palm_reading', label: 'Leitura da Palma' },
    { key: 'revelation', label: 'Revelação' },
    { key: 'paywall', label: 'Paywall' },
    { key: 'thank_you', label: 'Obrigado' },
  ],
  'funnel-tt': [
    { key: 'video', label: 'Video' },
    { key: 'testimonials', label: 'Depoimentos' },
    { key: 'name', label: 'Nome' },
    { key: 'birth', label: 'Nascimento' },
    { key: 'love_situation', label: 'Situação Amorosa' },
    { key: 'palm_reading', label: 'Leitura da Palma' },
    { key: 'revelation', label: 'Revelação' },
    { key: 'paywall', label: 'Paywall' },
    { key: 'thank_you', label: 'Obrigado' },
  ],
  'funnel-vsl': [
    { key: 'video', label: 'Video' },
    { key: 'testimonials', label: 'Depoimentos' },
    { key: 'name', label: 'Nome' },
    { key: 'birth', label: 'Nascimento' },
    { key: 'love_situation', label: 'Situação Amorosa' },
    { key: 'palm_reading', label: 'Leitura da Palma' },
    { key: 'revelation', label: 'Revelação' },
    { key: 'paywall', label: 'Paywall' },
    { key: 'thank_you', label: 'Obrigado' },
  ],
  'funnelesp': [
    { key: 'video', label: 'Video' },
    { key: 'testimonials', label: 'Depoimentos' },
    { key: 'name', label: 'Nome' },
    { key: 'birth', label: 'Nascimento' },
    { key: 'love_situation', label: 'Situação Amorosa' },
    { key: 'palm_reading', label: 'Leitura da Palma' },
    { key: 'revelation', label: 'Revelação' },
    { key: 'paywall', label: 'Paywall' },
    { key: 'thank_you', label: 'Obrigado' },
  ],
};

export const fetchFunnelAnalytics = async (funnelType, dateFilter) => {
  try {
    const tableName = FUNNEL_TABLE_MAP[funnelType];
    if (!tableName) {
      throw new Error(`Invalid funnel type: ${funnelType}`);
    }

    let query = supabase.from(tableName).select('*');

    if (dateFilter) {
      query = query.gte('viewed_at', dateFilter);
    }

    const { data, error } = await query;

    if (error) throw error;

    return processStepData(data || [], funnelType);
  } catch (error) {
    console.error('Error fetching funnel analytics:', error);
    return {
      totalSessions: 0,
      steps: [],
    };
  }
};

export const fetchAllFunnelsAnalytics = async (dateFilter) => {
  try {
    const funnelTypes = Object.keys(FUNNEL_TABLE_MAP);
    const results = await Promise.all(
      funnelTypes.map(funnelType => fetchFunnelAnalytics(funnelType, dateFilter))
    );

    const totalSessions = results.reduce((sum, result) => sum + result.totalSessions, 0);

    const allSteps = {};
    results.forEach((result, index) => {
      const funnelType = funnelTypes[index];
      result.steps.forEach(step => {
        if (!allSteps[step.key]) {
          allSteps[step.key] = {
            key: step.key,
            label: step.label,
            views: 0,
            percentage: 0,
          };
        }
        allSteps[step.key].views += step.views;
      });
    });

    const steps = Object.values(allSteps).map(step => ({
      ...step,
      percentage: totalSessions > 0 ? (step.views / totalSessions) * 100 : 0,
    }));

    return {
      totalSessions,
      steps,
    };
  } catch (error) {
    console.error('Error fetching all funnels analytics:', error);
    return {
      totalSessions: 0,
      steps: [],
    };
  }
};

const processStepData = (data, funnelType) => {
  const totalSessions = data.length;
  const steps = FUNNEL_STEPS[funnelType] || [];

  const processedSteps = steps.map(step => {
    const viewCount = data.filter(session => session[step.key] === true).length;
    const percentage = totalSessions > 0 ? (viewCount / totalSessions) * 100 : 0;

    return {
      key: step.key,
      label: step.label,
      views: viewCount,
      percentage,
    };
  });

  return {
    totalSessions,
    steps: processedSteps,
  };
};

export const getDateFilter = (dateRange) => {
  const now = new Date();
  switch (dateRange) {
    case 'today':
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return today.toISOString();
    case '7days':
      const sevenDays = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return sevenDays.toISOString();
    case '30days':
      const thirtyDays = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return thirtyDays.toISOString();
    default:
      return null;
  }
};

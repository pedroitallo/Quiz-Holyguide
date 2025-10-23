import { supabase } from '../lib/supabase';

const FUNNEL_TABLE_MAP = {
  'funnel-1': 'step_views_funnel_1',
  'funnel-2': 'step_views_funnel_2',
  'funnel-3': 'step_views_funnel_3',
  'funnel-tt': 'step_views_funnel_tt',
  'funnel-esp': 'step_views_funnel_esp',
  'funnel-aff': 'step_views_funnel_aff',
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
  'funnel-2': [
    { key: 'initiate', label: 'Iniciar' },
    { key: 'testimonials', label: 'Depoimentos' },
    { key: 'birth_date', label: 'Data Nascimento' },
    { key: 'love_situation', label: 'Situação Amorosa' },
    { key: 'qualities', label: 'Qualidades' },
    { key: 'preference', label: 'Preferências' },
    { key: 'chart_results', label: 'Mapa Astral' },
    { key: 'challenge', label: 'Desafios' },
    { key: 'desire', label: 'Desejos' },
    { key: 'connection', label: 'Conexão' },
    { key: 'love_language', label: 'Linguagem' },
    { key: 'energy', label: 'Energia' },
    { key: 'future', label: 'Futuro' },
    { key: 'social_proof', label: 'Prova Social' },
    { key: 'loading', label: 'Gerando' },
    { key: 'paywall', label: 'Paywall' },
    { key: 'thank_you', label: 'Obrigado' },
  ],
  'funnel-3': [
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
  'funnel-esp': [
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
  'funnel-aff': [
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

export const fetchFunnelAnalytics = async (funnelType, dateFilter, abTestId = null) => {
  try {
    const tableName = FUNNEL_TABLE_MAP[funnelType];
    if (!tableName) {
      console.error(`❌ Invalid funnel type: ${funnelType}`);
      console.error(`   Available funnels:`, Object.keys(FUNNEL_TABLE_MAP));
      return {
        totalSessions: 0,
        startQuiz: 0,
        endQuiz: 0,
        startQuizRate: 0,
        endQuizRate: 0,
        retention: 0,
        steps: [],
      };
    }

    console.log(`🔎 Fetching analytics for ${funnelType} (table: ${tableName})`);
    console.log(`   AB Test ID: ${abTestId || 'NONE (all data)'}`);
    console.log(`   Date filter:`, dateFilter);

    let allData = [];
    let from = 0;
    const limit = 1000;
    let hasMore = true;

    while (hasMore) {
      let query = supabase.from(tableName).select('*').range(from, from + limit - 1);

      if (abTestId) {
        query = query.eq('ab_test_id', abTestId);
        console.log(`   ✓ Filtering by ab_test_id = ${abTestId}`);
      }

      if (dateFilter) {
        if (typeof dateFilter === 'object' && dateFilter.start && dateFilter.end) {
          query = query.gte('viewed_at', dateFilter.start).lte('viewed_at', dateFilter.end);
        } else if (typeof dateFilter === 'object' && dateFilter.start) {
          query = query.gte('viewed_at', dateFilter.start);
        } else if (typeof dateFilter === 'object' && dateFilter.end) {
          query = query.lte('viewed_at', dateFilter.end);
        } else if (typeof dateFilter === 'string') {
          query = query.gte('viewed_at', dateFilter);
        }
      }

      const { data, error } = await query;

      if (from === 0) {
        console.log(`   📦 First batch returned ${data?.length || 0} records`);
      }

      if (error) throw error;

      if (data && data.length > 0) {
        allData = [...allData, ...data];
        from += limit;
        hasMore = data.length === limit;
      } else {
        hasMore = false;
      }
    }

    console.log(`   ✅ Total records fetched: ${allData.length}`);
    return processStepData(allData, funnelType);
  } catch (error) {
    console.error(`❌ Error fetching funnel analytics for ${funnelType}:`, error);
    console.error(`   Error details:`, error.message);
    return {
      totalSessions: 0,
      startQuiz: 0,
      endQuiz: 0,
      startQuizRate: 0,
      endQuizRate: 0,
      retention: 0,
      steps: [],
    };
  }
};

export const fetchAllFunnelsAnalytics = async (dateFilter, abTestId = null) => {
  try {
    const funnelTypes = Object.keys(FUNNEL_TABLE_MAP);
    const results = await Promise.all(
      funnelTypes.map(funnelType => fetchFunnelAnalytics(funnelType, dateFilter, abTestId))
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
            nextStepPassage: 0,
          };
        }
        allSteps[step.key].views += step.views;
      });
    });

    const stepsArray = Object.values(allSteps);
    const steps = stepsArray.map((step, index) => {
      let nextStepPassage = 0;
      if (index < stepsArray.length - 1 && step.views > 0) {
        const nextStepViews = stepsArray[index + 1].views;
        nextStepPassage = (nextStepViews / step.views) * 100;
      }

      return {
        ...step,
        percentage: totalSessions > 0 ? (step.views / totalSessions) * 100 : 0,
        nextStepPassage,
      };
    });

    const startQuiz = steps[1]?.views || 0;
    const endQuiz = steps.find(step => step.key === 'paywall')?.views || 0;

    const startQuizRate = totalSessions > 0 ? (startQuiz / totalSessions) * 100 : 0;
    const endQuizRate = totalSessions > 0 ? (endQuiz / totalSessions) * 100 : 0;
    const retention = startQuiz > 0 ? (endQuiz / startQuiz) * 100 : 0;

    return {
      totalSessions,
      startQuiz,
      endQuiz,
      startQuizRate,
      endQuizRate,
      retention,
      steps,
    };
  } catch (error) {
    console.error('Error fetching all funnels analytics:', error);
    return {
      totalSessions: 0,
      startQuiz: 0,
      endQuiz: 0,
      startQuizRate: 0,
      endQuizRate: 0,
      retention: 0,
      steps: [],
    };
  }
};

const processStepData = (data, funnelType) => {
  const totalSessions = data.length;
  const steps = FUNNEL_STEPS[funnelType];

  if (!steps) {
    console.warn(`⚠️ No step configuration found for funnel type: ${funnelType}`);
    return {
      totalSessions,
      startQuiz: 0,
      endQuiz: 0,
      startQuizRate: 0,
      endQuizRate: 0,
      retention: 0,
      steps: [],
    };
  }

  const processedSteps = steps.map((step, index) => {
    const viewCount = data.filter(session => session[step.key] === true).length;
    const percentage = totalSessions > 0 ? (viewCount / totalSessions) * 100 : 0;

    let nextStepPassage = 0;
    if (index < steps.length - 1 && viewCount > 0) {
      const nextStepViews = data.filter(session => session[steps[index + 1].key] === true).length;
      nextStepPassage = (nextStepViews / viewCount) * 100;
    }

    return {
      key: step.key,
      label: step.label,
      views: viewCount,
      percentage,
      nextStepPassage,
    };
  });

  const startQuiz = processedSteps[1]?.views || 0;
  const endQuiz = processedSteps.find(step => step.key === 'paywall')?.views || 0;

  const startQuizRate = totalSessions > 0 ? (startQuiz / totalSessions) * 100 : 0;
  const endQuizRate = totalSessions > 0 ? (endQuiz / totalSessions) * 100 : 0;
  const retention = startQuiz > 0 ? (endQuiz / startQuiz) * 100 : 0;

  return {
    totalSessions,
    startQuiz,
    endQuiz,
    startQuizRate,
    endQuizRate,
    retention,
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

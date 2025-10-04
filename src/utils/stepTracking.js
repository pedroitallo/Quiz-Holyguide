import { supabase } from '../lib/supabase';

const getSessionId = () => {
  let sessionId = sessionStorage.getItem('quiz_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('quiz_session_id', sessionId);
  }
  return sessionId;
};

const getUTMParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source') || '',
    utm_medium: urlParams.get('utm_medium') || '',
    utm_campaign: urlParams.get('utm_campaign') || '',
  };
};

export const trackStepView = async (funnelType, stepName, stepOrder = 0) => {
  try {
    const sessionId = getSessionId();
    const utmParams = getUTMParams();

    const metadata = {
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      language: navigator.language,
      referrer: document.referrer,
      pathname: window.location.pathname,
    };

    const { error } = await supabase
      .from('quiz_step_views')
      .insert([{
        session_id: sessionId,
        funnel_type: funnelType,
        step_name: stepName,
        step_order: stepOrder,
        ...utmParams,
        metadata,
      }]);

    if (error) {
      console.error('Error tracking step view:', error);
    }
  } catch (error) {
    console.error('Failed to track step view:', error);
  }
};

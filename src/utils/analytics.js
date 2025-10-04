import { supabase } from '../lib/supabase';

const getUserId = () => {
  let userId = localStorage.getItem('analytics_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('analytics_user_id', userId);
  }
  return userId;
};

export const trackEvent = async (funnelType, stepName, eventType = 'view', metadata = {}) => {
  try {
    const userId = getUserId();

    const { error } = await supabase
      .from('analytics_events')
      .insert([{
        user_id: userId,
        funnel_type: funnelType,
        step_name: stepName,
        event_type: eventType,
        metadata,
      }]);

    if (error) {
      console.error('Error tracking event:', error);
    }
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};

export const trackPageView = (funnelType, stepName) => {
  trackEvent(funnelType, stepName, 'view');
};

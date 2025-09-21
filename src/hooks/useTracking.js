import { useEffect, useCallback } from 'react';

export const useTracking = () => {
  useEffect(() => {
    // Garantir que o script track.js seja carregado
    if (!window.trackingLoaded) {
      const script = document.createElement('script');
      script.src = 'https://tkk.holyguide.online/track.js';
      script.async = true;
      script.onload = () => {
        window.trackingLoaded = true;
        console.log('✅ Script de rastreamento carregado');
      };
      script.onerror = () => {
        console.error('❌ Erro ao carregar script de rastreamento');
      };
      document.head.appendChild(script);
    }
  }, []);

  // Função para obter o clickid (baseada no script original)
  const getClickId = useCallback(() => {
    // Primeiro tenta pegar do parâmetro rtkcid na URL
    const urlParams = new URLSearchParams(window.location.search);
    const rtkcid = urlParams.get("rtkcid");
    if (rtkcid) return rtkcid;

    // Se não encontrar, tenta pegar do cookie
    const cookieMatch = document.cookie.match(/(?:^|;\s*)rtkclickid-store=([^;]+)/);
    return cookieMatch && cookieMatch[1] ? cookieMatch[1] : null;
  }, []);

  // Função para enviar postback (baseada no script original)
  const sendPostback = useCallback((type, clickid) => {
    if (!clickid) {
      console.warn(`⚠️ Não foi possível enviar postback para ${type}: clickid não encontrado`);
      return;
    }

    const img = new Image();
    const url = `https://tkk.holyguide.online/postback?format=img&type=${encodeURIComponent(type)}&clickid=${encodeURIComponent(clickid)}`;
    img.src = url;
    
    console.log(`📊 Postback enviado: ${type} - ClickID: ${clickid}`);
  }, []);

  // Função para rastrear início do quiz
  const trackStartQuiz = useCallback(() => {
    if (window.startQuizFired) {
      console.log('⚠️ StartQuiz já foi disparado anteriormente');
      return;
    }

    const clickid = getClickId();
    if (clickid) {
      sendPostback('StartQuiz', clickid);
      window.startQuizFired = true;
      console.log('✅ StartQuiz rastreado com sucesso');
    } else {
      console.warn('⚠️ StartQuiz não rastreado: clickid não encontrado');
    }
  }, [getClickId, sendPostback]);

  // Função para rastrear fim do quiz
  const trackEndQuiz = useCallback(() => {
    if (window.endQuizFired) {
      console.log('⚠️ EndQuiz já foi disparado anteriormente');
      return;
    }

    const clickid = getClickId();
    if (clickid) {
      sendPostback('EndQuiz', clickid);
      window.endQuizFired = true;
      console.log('✅ EndQuiz rastreado com sucesso');
    } else {
      console.warn('⚠️ EndQuiz não rastreado: clickid não encontrado');
    }
  }, [getClickId, sendPostback]);

  // Função para rastrear eventos do Facebook Pixel
  const trackFacebookEvent = useCallback((eventName, parameters = {}) => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', eventName, parameters);
      console.log(`📘 Facebook Pixel: ${eventName} rastreado`, parameters);
    } else {
      console.warn('⚠️ Facebook Pixel não está disponível');
    }
  }, []);

  return {
    trackStartQuiz,
    trackEndQuiz,
    trackFacebookEvent
  };
};
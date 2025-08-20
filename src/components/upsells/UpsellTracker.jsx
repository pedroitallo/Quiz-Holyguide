import React, { useEffect } from 'react';
import { UpsellView } from '@/api/entities';
import { User } from '@/api/entities';

export default function UpsellTracker({ pageName }) {
  useEffect(() => {
    const trackUpsellView = async () => {
      try {
        // Verificar se é admin ou bot
        const isBot = () => {
          if (typeof window === 'undefined') return false;
          
          const userAgent = window.navigator.userAgent.toLowerCase();
          const botPatterns = [
            'facebookexternalhit',
            'facebookcatalog',
            'facebookcrawler',
            'facebookbot',
            'facebookplatform',
            'twitterbot',
            'linkedinbot',
            'whatsapp',
            'telegrambot',
            'skypeuripreview',
            'slackbot',
            'discordbot',
            'googlebot',
            'bingbot',
            'yandexbot',
            'baiduspider',
            'ia_archiver',
            'crawler',
            'spider',
            'bot/',
            'crawl',
            'preview',
            'scraper'
          ];
          
          return botPatterns.some(pattern => userAgent.includes(pattern));
        };

        if (isBot()) {
          console.log('Bot detectado - não rastreando visualização de upsell');
          return;
        }

        try {
          const user = await User.me();
          if (user && user.role === 'admin') {
            console.log('Admin detectado - não rastreando visualização de upsell');
            return;
          }
        } catch (error) {
          // User not logged in or cannot be checked, continue with tracking
        }

        // Gerar ou recuperar session_id único para esta sessão de navegação
        let sessionId = localStorage.getItem('upsell_session_id');
        if (!sessionId) {
          sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('upsell_session_id', sessionId);
        }

        // Recuperar informações de UTM e quiz da URL ou localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const src = urlParams.get('src') || localStorage.getItem('holymind_src') || null;
        const utm_content = urlParams.get('utm_content') || localStorage.getItem('holymind_utm_content') || null;
        const utm_campaign = urlParams.get('utm_campaign') || localStorage.getItem('holymind_utm_campaign') || null;
        
        // Tentar recuperar dados do quiz (visitor_id e quiz_result_id)
        const quizState = localStorage.getItem('holymind_quiz_state');
        let visitor_id = null;
        let quiz_result_id = null;
        
        if (quizState) {
          try {
            const parsedState = JSON.parse(quizState);
            quiz_result_id = parsedState.id;
          } catch (e) {
            console.warn('Could not parse quiz state for upsell tracking');
          }
        }

        // Criar registro de visualização do upsell
        await UpsellView.create({
          page_name: pageName,
          visitor_id: visitor_id,
          quiz_result_id: quiz_result_id,
          src: src,
          utm_content: utm_content,
          utm_campaign: utm_campaign,
          session_id: sessionId
        });

        console.log(`Upsell view tracked for page: ${pageName}`);
      } catch (error) {
        console.warn('Erro ao rastrear visualização de upsell:', error);
      }
    };

    // Executar tracking com um pequeno delay para garantir que a página foi carregada
    const timer = setTimeout(trackUpsellView, 1000);
    
    return () => clearTimeout(timer);
  }, [pageName]);

  return null; // Este componente não renderiza nada visível
}
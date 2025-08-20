

import React, { useEffect } from 'react';
import { Funnel } from '@/api/entities';

export default function Layout({ children, currentPageName }) {
  useEffect(() => {
    // Páginas que NÃO devem carregar o script HolyMind e outras otimizações
    const excludedPages = ['admin', 'metrics'];

    // Step 1: Always remove any existing HolyMind scripts first to ensure a clean state
    // and proper handling of transitions (e.g., from funnel to admin or admin to funnel).
    const oldHolyMindScripts = document.querySelectorAll('script[src*="sst.holymind.life"]');
    oldHolyMindScripts.forEach(script => script.remove());

    // Initialize variables to store elements for cleanup
    const preconnectElements = [];
    const vTurbElements = [];
    let vTurbPerfScript = null;
    let metaRobotsTag = null;

    // Step 2: Conditional logic for adding scripts and optimizations
    // If the current page is an excluded page, no HolyMind script is added, and the function
    // proceeds directly to the cleanup return, effectively skipping all the following additions.
    if (!excludedPages.includes(currentPageName)) {
      // Script HolyMind deve ser carregado APENAS nos funis de quiz (i.e., not excluded pages)
      const holyMindScript = document.createElement('script');
      holyMindScript.src = 'https://sst.holymind.life/mtrtprxy/tag?id=685d94c5b4f48be86e0eb114';
      holyMindScript.async = true;
      document.head.appendChild(holyMindScript);
      // The holyMindScript is not added to the cleanup list because it should persist across funnel pages
      // and its removal is handled by the `oldHolyMindScripts.forEach` at the beginning of this effect on subsequent runs.

      // Adiciona preconnects para acelerar o carregamento de fontes e scripts
      const preconnectHints = [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
        { rel: 'preconnect', href: 'https://sst.holymind.life' },
        { rel: 'preconnect', href: 'https://scripts.converteai.net' }
      ];

      preconnectHints.forEach(hint => {
        const link = document.createElement('link');
        Object.keys(hint).forEach(key => link[key] = hint[key]);
        document.head.appendChild(link);
        preconnectElements.push(link);
      });

      // Adicionar otimizações VTurb para carregamento mais rápido do vídeo
      const vTurbOptimizations = [
        // DNS Prefetch para domínios do VTurb
        { rel: 'dns-prefetch', href: 'https://cdn.converteai.net' },
        { rel: 'dns-prefetch', href: 'https://scripts.converteai.net' },
        { rel: 'dns-prefetch', href: 'https://images.converteai.net' },
        { rel: 'dns-prefetch', href: 'https://api.vturb.com.br' },
        // Preload dos scripts essenciais do player
        { rel: 'preload', href: 'https://scripts.converteai.net/8f5333fd-fe8a-42cd-9840-10519ad6c7c7/players/6887d876e08b97c1c6617aab/v4/player.js', as: 'script' },
        { rel: 'preload', href: 'https://scripts.converteai.net/lib/js/smartplayer-wc/v4/smartplayer.js', as: 'script' },
        // Preload do manifesto do vídeo
        { rel: 'preload', href: 'https://cdn.converteai.net/8f5333fd-fe8a-42cd-9840-10519ad6c7c7/6887d862bf91caffa4eb9fb8/main.m3u8', as: 'fetch' }
      ];

      vTurbOptimizations.forEach(hint => {
        const link = document.createElement('link');
        Object.keys(hint).forEach(key => {
          if (key === 'crossOrigin') {
            link.crossOrigin = hint[key];
          } else {
            link.setAttribute(key, hint[key]);
          }
        });
        document.head.appendChild(link);
        vTurbElements.push(link);
      });

      // Script inline de otimização de performance do VTurb
      vTurbPerfScript = document.createElement('script');
      vTurbPerfScript.innerHTML = '!function(i,n){i._plt=i._plt||(n&&n.timeOrigin?n.timeOrigin+n.now():Date.now())}(window,performance);';
      document.head.appendChild(vTurbPerfScript);

      metaRobotsTag = document.createElement('meta');
      metaRobotsTag.name = 'robots';
      metaRobotsTag.content = 'noindex, nofollow';
      document.head.appendChild(metaRobotsTag);
    }

    return () => {
      // Cleanup: remove elements added by this effect.
      // This cleanup runs when `currentPageName` changes or the component unmounts.
      // The HolyMind script is handled by the removal logic at the start of the effect's next run.
      preconnectElements.forEach(link => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });

      vTurbElements.forEach(link => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });

      if (vTurbPerfScript && document.head.contains(vTurbPerfScript)) {
        document.head.removeChild(vTurbPerfScript);
      }

      if (metaRobotsTag && document.head.contains(metaRobotsTag)) {
        document.head.removeChild(metaRobotsTag);
      }
      
      // NÃO remover o script HolyMind no cleanup quando navegando entre páginas de funil.
      // Ele só deve ser removido quando saindo dos funis (para admin/metrics), que é tratado
      // pelo `oldHolyMindScripts.forEach(script => script.remove());` ao início da execução do efeito.
    };
  }, [currentPageName]);

  useEffect(() => {
    const applyFunnelScripts = async () => {
        if (!currentPageName) return;
        
        try {
            const [funnel] = await Funnel.filter({ slug: currentPageName });
            if (funnel && funnel.headerScripts) {
                // Defer scripts de terceiros para não bloquear o carregamento inicial
                setTimeout(() => {
                  const tempDiv = document.createElement('div');
                  tempDiv.innerHTML = funnel.headerScripts;
                  
                  const nodes = Array.from(tempDiv.childNodes);

                  nodes.forEach(node => {
                      if (node.tagName === 'SCRIPT') {
                          const script = document.createElement('script');
                          for (const attr of node.attributes) {
                              script.setAttribute(attr.name, attr.value);
                          }
                          // Adiciona async/defer para scripts de terceiros
                          if (node.src && (node.src.includes('facebook') || node.src.includes('stripe') || node.src.includes('analytics'))) {
                              script.async = true;
                              script.defer = true;
                          }
                          if (node.innerHTML) {
                              script.innerHTML = node.innerHTML;
                          }
                          document.head.appendChild(script);
                      } else {
                          document.head.appendChild(node.cloneNode(true));
                      }
                  });
                }, 2000); // Aumentado para 2 segundos para melhor performance inicial
            }
        } catch (e) {
            console.error("Failed to load funnel scripts", e);
        }
    };
    
    applyFunnelScripts();
  }, [currentPageName]);

  useEffect(() => {
    const handleContextmenu = e => e.preventDefault();
    const handleKeydown = e => {
      if ((e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || (e.keyCode === 123)) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('contextmenu', handleContextmenu);
    document.addEventListener('keydown', handleKeydown);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextmenu);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  return (
    <div style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
      <style>{`
        /* Critical CSS inline para melhorar FCP */
        .btn-primary { 
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          border: none;
          border-radius: 9999px;
          color: white;
          font-weight: 700;
          padding: 1rem 2rem;
          font-size: 1rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .btn-primary:hover {
          transform: scale(1.05);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        
        /* Animação de pulsação sutil para frente */
        @keyframes bounce-subtle {
          0%, 100% { 
            transform: translateZ(0) scale(1);
          }
          50% { 
            transform: translateZ(0) scale(1.03);
          }
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        /* Lazy load placeholder */
        .lazy-placeholder {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        /* Preload de recursos críticos */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        /* Otimização de imagens */
        img {
          content-visibility: auto;
          contain-intrinsic-size: 1px 400px;
        }

        /* Otimização para fundos com WEBP */
        /* Use a classe 'webp-background-optimized' para elementos com background-image, por exemplo: */
        /* <div class="webp-background-optimized" style="background-image: image-set(url('/path/to/my-image.webp') type('image/webp'), url('/path/to/my-image.png') type('image/png'));"></div> */
        .webp-background-optimized {
          /* Esta regra é um exemplo para demonstrar o uso de image-set para otimização WEBP em fundos. */
          /* As URLs devem ser substituídas pelas suas imagens reais. */
          background-size: cover; /* Exemplo de propriedade adicional */
          background-position: center; /* Exemplo de propriedade adicional */
        }
        
        /* Otimização de iframe */
        iframe {
          content-visibility: auto;
          contain-intrinsic-size: 1px 250px;
        }
      `}</style>
      {children}
    </div>
  );
}


import React, { useEffect } from 'react';

export default function Layout({ children, currentPageName }) {
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

  // Carregar track.js apenas uma vez por sessão
  useEffect(() => {
    // Verificar se já foi carregado nesta sessão
    if (window.trackScriptLoaded || sessionStorage.getItem('trackScriptLoaded')) {
      console.log('🔄 Track.js já foi carregado nesta sessão');
      return;
    }

    // Verificar se o script já existe no DOM
    const existingScript = document.querySelector('script[src="https://tkk.holyguide.online/track.js"]');
    if (existingScript) {
      console.log('🔄 Track.js já existe no DOM');
      window.trackScriptLoaded = true;
      sessionStorage.setItem('trackScriptLoaded', 'true');
      return;
    }

    console.log('🚀 Carregando track.js pela primeira vez...');
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://tkk.holyguide.online/track.js';
    script.async = true;
    
    script.onload = () => {
      console.log('✅ Track.js carregado com sucesso');
      window.trackScriptLoaded = true;
      sessionStorage.setItem('trackScriptLoaded', 'true');
    };
    
    script.onerror = () => {
      console.error('❌ Erro ao carregar track.js');
      // Não marcar como carregado em caso de erro para permitir retry
    };
    
    document.head.appendChild(script);
  }, []); // Array vazio garante que rode apenas uma vez
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
        
        /* Animação de pulsação suave para botões */
        @keyframes pulse-gentle {
          0%, 100% { 
            transform: scale(1);
          }
          50% { 
            transform: scale(1.02);
          }
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 2s ease-in-out infinite;
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
        .webp-background-optimized {
          background-size: cover;
          background-position: center;
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
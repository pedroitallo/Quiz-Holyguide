import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

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

  return (
    <div style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
      <Helmet>
        <script 
          type="text/javascript" 
          src="https://tkk.holyguide.online/track.js"
        ></script>
        <script 
          dangerouslySetInnerHTML={{
            __html: `document.addEventListener("DOMContentLoaded",function(){var d="tkk.holyguide.online",eventQueue=[],fired={},f=function(){var p=new URLSearchParams(location.search),rtkcid=p.get("rtkcid");if(rtkcid)return rtkcid;var cm=document.cookie.match(/(?:^|;\\s*)rtkclickid-store=([^;]+)/);return cm&&cm[1]?cm[1]:null},s=function(type,clickid){if(!fired[type]){var n=new Image;n.src="https://"+d+"/postback?format=img&type="+encodeURIComponent(type)+"&clickid="+encodeURIComponent(clickid);fired[type]=true}},processQueue=function(){if(eventQueue.length>0){var clickid=f();if(clickid){eventQueue.forEach(function(event){if(!fired[event.type]){s(event.type,clickid)}});eventQueue=[]}}},handleClick=function(type){return function(){if(!fired[type]){var clickid=f();if(clickid){s(type,clickid)}else{var exists=false;for(var i=0;i<eventQueue.length;i++){if(eventQueue[i].type===type){exists=true;break}}if(!exists){eventQueue.push({type:type})}}}}},setupElement=function(selector,eventType){var elements=document.querySelectorAll(selector);elements.forEach(function(el){if(el.tagName==="BUTTON"||el.tagName==="A"){el.addEventListener("click",handleClick(eventType))}})};setInterval(processQueue,1000);setupElement("#btn-startquiz","StartQuiz");setupElement("#btn-vsl","EndQuiz");});`
          }}
        />
      </Helmet>
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
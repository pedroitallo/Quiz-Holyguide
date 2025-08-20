import React, { useEffect } from 'react';

export default function UpsellLayout({ children }) {
    useEffect(() => {
        // Script HolyMind deve ser carregado em TODAS as páginas de upsell
        // Remove any old scripts to ensure only the new one is active
        const oldScripts = document.querySelectorAll('script[src*="sst.holymind.life"]');
        oldScripts.forEach(script => script.remove());
        
        // Add the new HolyMind tracking script
        const holyMindScript = document.createElement('script');
        holyMindScript.src = 'https://sst.holymind.life/mtrtprxy/tag?id=685d94c5b4f48be86e0eb114';
        holyMindScript.async = true;
        document.head.appendChild(holyMindScript);

        return () => {
            // NÃO remover o script HolyMind no cleanup - ele deve permanecer durante toda a navegação
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50" style={{ userSelect: 'none' }}>
            {children}
        </div>
    );
}
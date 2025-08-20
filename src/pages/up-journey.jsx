import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import UpsellTracker from '../components/upsells/UpsellTracker';

export default function UpJourneyPage() {
  const [showOfferCard, setShowOfferCard] = useState(false);

  useEffect(() => {
    // Carregar o script do player do vídeo
    const scriptSrc = "https://scripts.converteai.net/8f5333fd-fe8a-42cd-9840-10519ad6c7c7/players/689ba1499c1ba5538399ec20/v4/player.js";

    // Verificar se o script já existe
    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      document.head.appendChild(script);
    }

    // Mostrar card de oferta e carregar checkout após 5:10 (310 segundos)
    const timer = setTimeout(() => {
      setShowOfferCard(true);
      
      // Carregar script do checkout da Hotmart após aparecer o card
      setTimeout(() => {
        const checkoutScript = document.createElement('script');
        checkoutScript.src = 'https://checkout.hotmart.com/lib/hotmart-checkout-elements.js';
        checkoutScript.async = true;
        checkoutScript.onload = () => {
          if (window.checkoutElements) {
            window.checkoutElements.init('salesFunnel').mount('#hotmart-sales-funnel');
          }
        };
        document.head.appendChild(checkoutScript);
      }, 100);
    }, 310000); // 5:10 = 310 segundos

    return () => {
      clearTimeout(timer);
      // Cleanup dos scripts quando componente for desmontado
      const scriptElements = document.querySelectorAll(`script[src="${scriptSrc}"], script[src="https://checkout.hotmart.com/lib/hotmart-checkout-elements.js"]`);
      scriptElements.forEach((s) => {
        if (document.head.contains(s)) {
          document.head.removeChild(s);
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Componente de tracking para analytics */}
      <UpsellTracker pageName="up-journey" />
      
      {/* Seção vermelha de alerta */}
      <div className="bg-red-600 text-white text-center py-6 px-4">
        <div className="flex items-center justify-center mb-2">
          <AlertTriangle className="w-6 h-6 mr-2" />
          <h1 className="text-yellow-300 text-xl font-bold md:text-2xl">Attention: Do not close this page or click the back button

          </h1>
        </div>
        <p className="text-lg md:text-xl">
          Clicking the "back button" may result in your order being double billed
        </p>
      </div>

      {/* Seção principal */}
      <div className="text-center py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-gray-800 mb-1 text-xl font-bold md:text-4xl">Your Order Is Not Complete Yet

          </h2>
          <p className="text-2xl md:text-3xl mb-8">
            <span className="text-purple-600 font-bold">Please watch this important</span>
            <br />
            <span className="text-gray-800 font-bold">message below</span>
          </p>

          {/* Container do vídeo - formato quadrado, sem barra cinza */}
          <div className="mb-8 max-w-2xl mx-auto w-full">
            <div className="relative rounded-lg overflow-hidden shadow-lg" style={{ aspectRatio: '1/1' }}>
              <vturb-smartplayer
                id="vid-689ba1499c1ba5538399ec20"
                style={{
                  display: 'block',
                  margin: '0 auto',
                  width: '100%',
                  height: '100%'
                }}>
              </vturb-smartplayer>
            </div>
          </div>

          {/* Card de oferta exclusiva - Aparece após 5:10 */}
          {showOfferCard && (
            <>
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-4 max-w-md mx-auto">
                {/* Badge de oferta exclusiva */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold px-6 py-2 rounded-full inline-block mb-6">
                  EXCLUSIVE OFFER • LIMITED TIME
                </div>
                
                {/* Título principal */}
                <h3 className="text-gray-800 mb-4 text-xl font-bold leading-tight">🎁 This opportunity is only available on this page...

                </h3>
                
                {/* Descrição */}
                <p className="text-gray-600 mb-6 text-sm font-semibold leading-relaxed">Activate the Divine Connection Journey right now and accelerate your encounter with your Divine Soul by up to 9x.

                </p>
                
                {/* Lista de benefícios */}
                <div className="space-y-4 mb-6 text-left">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">✨</span>
                    <div>
                      <span className="text-purple-600 font-semibold">🔮 Daily Personalized Signs</span>
                      <span className="text-gray-700"> to help you recognize your Divine Soul quickly.</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-lg">✨</span>
                    <div>
                      <span className="text-purple-600 font-semibold">💬 Direct Access to Madame Aura</span>
                      <span className="text-gray-700"> for spiritual guidance whenever you need it.</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-lg">✨</span>
                    <div>
                      <span className="text-purple-600 font-semibold">👁️ Weekly Guides & Rituals</span>
                      <span className="text-gray-700"> to align your energy for the destined meeting.</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-lg">✨</span>
                    <div>
                      <span className="text-purple-600 font-semibold">🛡️ Exclusive Love Reading</span>
                      <span className="text-gray-700"> (real value $97) — 100% free today.</span>
                    </div>
                  </div>
                </div>
                
                {/* Preço */}
                <div className="text-center mb-4">
                  <div className="text-red-500 line-through text-xl mb-1">$147</div>
                  <div className="text-green-600 font-bold text-3xl">Only $29</div>
                </div>
                
                {/* Call to action */}
                <p className="text-gray-500 text-sm font-medium">
                  CLICK "YES" BELOW TO SECURE YOUR ACCESS
                </p>
              </div>

              {/* Widget de checkout da Hotmart */}
              <div id="hotmart-sales-funnel" className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading exclusive offer...</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>);

}
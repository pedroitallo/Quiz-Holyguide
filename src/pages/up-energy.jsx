import React, { useState, useEffect } from 'react';
import UpsellLayout from '../components/upsells/UpsellLayout';
import UpsellTracker from '../components/upsells/UpsellTracker';

export default function UpEnergyPage() {
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    // Carregar o script do player do vídeo
    const scriptSrc = "https://scripts.converteai.net/8f5333fd-fe8a-42cd-9840-10519ad6c7c7/players/6894f08e89c09669a33ce0b8/v4/player.js";

    // Verificar se o script já existe
    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      document.head.appendChild(script);
    }

    // Mostrar checkout após 5 minutos e 15 segundos (315 segundos)
    const timer = setTimeout(() => {
      setShowCheckout(true);

      // Carregar script do checkout da Hotmart após aparecer
      setTimeout(() => {
        const checkoutScript = document.createElement('script');
        checkoutScript.src = 'https://checkout.hotmart.com/lib/hotmart-checkout-elements.js';
        checkoutScript.async = true;
        checkoutScript.onload = () => {
          // Inicializar o checkout após o script carregar
          if (window.checkoutElements) {
            window.checkoutElements.init('salesFunnel').mount('#hotmart-sales-funnel');
          }
        };
        document.head.appendChild(checkoutScript);
      }, 100);
    }, 315000); // 5:15 = 315 segundos

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <UpsellLayout>
      <UpsellTracker pageName="up-energy" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Headline */}
        <div className="text-center mb-8">
          <h1 className="text-orange-600 mb-2 text-sm font-bold md:text-3xl">IMPORTANT MESSAGE FOR YOU WHILE I WAS VISUALIZING YOUR SOULMATE, I DISCOVERED SOMETHING YOU NEED TO KNOW...

          </h1>
          <p className="text-sm font-extrabold">⚠️ Watch now!


          </p>
        </div>

        {/* Video Container */}
        <div className="mb-12 w-full max-w-3xl mx-auto">
          <div className="shadow-lg rounded-xl overflow-hidden bg-black">
            <vturb-smartplayer
              id="vid-6894f08e89c09669a33ce0b8"
              style={{
                display: 'block',
                margin: '0 auto',
                width: '100%'
              }}>
            </vturb-smartplayer>
          </div>
        </div>

        {/* Checkout Section - Aparece após 5:15 */}
        {showCheckout &&
        <div className="w-full max-w-2xl mx-auto">
            <div id="hotmart-sales-funnel" className="min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading checkout...</p>
              </div>
            </div>
          </div>
        }
      </div>
    </UpsellLayout>);

}
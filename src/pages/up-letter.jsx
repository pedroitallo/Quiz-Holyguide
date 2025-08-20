
import React, { useState, useEffect } from 'react';
import { Lock, Unlock, AlertTriangle, Sparkles } from 'lucide-react';
import UpsellTracker from '../components/upsells/UpsellTracker';

export default function UpLetterPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // Script HolyMind deve ser carregado IMEDIATAMENTE para manter rastreamento
    // Remove any old scripts to ensure only the new one is active
    const oldScripts = document.querySelectorAll('script[src*="sst.holymind.life"]');
    oldScripts.forEach(script => script.remove());
    
    // Add the HolyMind script
    const holyMindScript = document.createElement('script');
    holyMindScript.src = 'https://sst.holymind.life/mtrtprxy/tag?id=685d94c5b4f48be86e0eb114';
    holyMindScript.async = true;
    document.head.appendChild(holyMindScript);

    // Carregar script do checkout da Hotmart imediatamente
    const checkoutScript = document.createElement('script');
    checkoutScript.src = 'https://checkout.hotmart.com/lib/hotmart-checkout-elements.js';
    checkoutScript.async = true;
    checkoutScript.onload = () => {
      if (window.checkoutElements) {
        window.checkoutElements.init('salesFunnel').mount('#hotmart-sales-funnel');
      }
    };
    document.head.appendChild(checkoutScript);
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    
    // Scroll suave para o checkout após um pequeno delay
    setTimeout(() => {
      const checkoutElement = document.getElementById('hotmart-sales-funnel');
      if (checkoutElement) {
        checkoutElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-100 to-pink-100" style={{ userSelect: 'none' }}>
      <UpsellTracker pageName="up-letter" />
      
      <div className="max-w-md mx-auto px-4 py-8">
        
        {/* Header Card */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-3 h-3 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">
                Urgent – I just channeled a message from your soulmate
              </h1>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                Your Soulmate Is Trying to Speak to You...
              </h2>
            </div>
            
            <p className="text-gray-600 text-base leading-relaxed">
              As you read these words, a silent call is echoing through the universe. It's the voice of your Soulmate—charged with feelings that can no longer wait to reach you.
            </p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-900">But there's something you must know now:</span>
                  <span className="text-gray-700"> This message won't be available for long. Energies are shifting and if you don't listen </span>
                  <span className="font-bold text-gray-900">TODAY</span>
                  <span className="text-gray-700">, you could miss a sign that only appears once in a lifetime.</span>
                </div>
              </div>
            </div>
            
            {/* Blurred Content Section */}
            <div className="relative">
              <div className={`transition-all duration-800 ${isUnlocked ? 'filter-none' : 'filter blur-md'}`}>
                <div className="space-y-3 text-gray-600">
                  <p>The connection between souls transcends physical boundaries...</p>
                  <p>Your soulmate's energy is reaching out...</p>
                  <p>A divine message awaits your discovery...</p>
                </div>
              </div>
              
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={handleUnlock}
                    className="bg-white/90 backdrop-blur-sm border-2 border-purple-300 hover:border-purple-500 rounded-full px-6 py-3 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Lock className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold text-purple-600">Locked — unlock to reveal</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Below Card - Now inside the same card */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-gray-800 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-800 font-medium">
                The exact words your Soulmate wants you to hear right now.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-gray-800 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-800 font-medium">
                An urgent warning about the future of you two.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-gray-800 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-800 font-medium">
                A simple gesture that can bring the real-life meeting closer.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              <span className="font-medium">Imagine holding in your hands the most intimate piece of this person's soul...</span>
              <span> feeling each word move through your heart—and realizing this connection is real and alive </span>
              <span className="italic font-medium">right now</span>
              <span>.</span>
            </p>
          </div>
        </div>

        {/* Checkout Section - Outside of any card */}
        <div id="hotmart-sales-funnel" className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your personalized message...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

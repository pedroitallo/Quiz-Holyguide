import React, { useEffect } from 'react';
import UpsellTracker from '../components/upsells/UpsellTracker';

export default function UpComboPage() {
  useEffect(() => {
    // Carregar script do checkout da Hotmart
    const checkoutScript = document.createElement('script');
    checkoutScript.src = 'https://checkout.hotmart.com/lib/hotmart-checkout-elements.js';
    checkoutScript.async = true;
    checkoutScript.onload = () => {
      if (window.checkoutElements) {
        window.checkoutElements.init('salesFunnel').mount('#hotmart-sales-funnel');
      }
    };
    document.head.appendChild(checkoutScript);

    return () => {
      const scriptElements = document.querySelectorAll('script[src="https://checkout.hotmart.com/lib/hotmart-checkout-elements.js"]');
      scriptElements.forEach((s) => {
        if (document.head.contains(s)) {
          document.head.removeChild(s);
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 p-4">
      {/* Componente de tracking para analytics */}
      <UpsellTracker pageName="up-combo" />
      
      <div className="max-w-md mx-auto space-y-6 pt-8">
        {/* Header com foto da Madame Aura */}
        <div className="bg-white rounded-full p-4 shadow-lg max-w-xs mx-auto">
          <div className="flex items-center gap-3">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
              alt="Madame Aura"
              className="w-12 h-12 rounded-full object-cover" />

            <div>
              <span className="text-purple-600 font-semibold text-lg">My special gift for you</span>
              <span className="text-purple-400 ml-1">✨</span>
            </div>
          </div>
        </div>

        {/* Warning Card */}
        <div className="bg-white border-2 border-dashed border-purple-300 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-purple-700 font-semibold">
            <span className="text-yellow-500">⚠️</span>
            <span className="text-red-600">Do not close this page. This offer appears only once.</span>
          </div>
        </div>

        {/* Main Offer Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <div className="text-center space-y-4">
            {/* Lightning bolt and title */}
            <div className="space-y-2">
              <div className="text-4xl text-purple-600">⚡</div>
              <h1 className="text-2xl font-bold text-purple-700">
                FINAL OPPORTUNITY:<br />
                Promotional Combo Offer
              </h1>
            </div>

            {/* Main description */}
            <div className="text-gray-700 leading-relaxed">
              <p>You refused the Divine Connection Journey ($19/m) and the Energy Clearing ($67). To ensure you don't leave without the compass <em>and</em> the protection, I have brought everything together in one final access — with a special gift 🎁.</p>
            </div>
          </div>
        </div>

        {/* What You Get Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            What You Get in This Combo 💜
          </h2>
          
          <div className="space-y-6">
            {/* Item 1 */}
            <div className="flex items-start gap-4">
              <div className="bg-pink-100 p-3 rounded-full flex-shrink-0">
                <span className="text-2xl">💕</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Divine Connection Journey</h3>
                <p className="text-gray-600 text-sm">— daily signs and continuous guidance to accelerate your destined love.</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                <span className="text-2xl">🌟</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Private Energy Clearing</h3>
                <p className="text-gray-600 text-sm">— a personal session to remove envy, traumas, and blocks that hold back your love life.</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-start gap-4">
              <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
                <span className="text-2xl">🎁</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Special Bonus:</h3>
                <p className="text-gray-600 text-sm">A Full Prediction of Your Love Life (normally $97).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <span className="text-yellow-500 text-xl">✨</span>
              <h3 className="text-lg font-semibold text-gray-800">
                But today, only here and now, you will get all of this...
              </h3>
              <p className="text-sm text-gray-700 font-medium">
                Yes, you <em>read that right</em>:<br />
                Instead of spending almost triple, you get the complete combo + surprise gift for less than half the price.
              </p>
            </div>

            {/* Pricing */}
            <div className="py-4">
              <div className="text-red-600 mb-2 text-lg">Normal investment: <span className="line-through">$86+</span></div>
              <div className="text-4xl font-bold text-green-500 mb-1">TODAY: $FREE</div>
              <div className="text-slate-400 font-semibold">free trial for 3 days and then only the price of Journey Divine</div>
            </div>

            {/* Limited spots badge */}
            <div className="bg-purple-100 rounded-2xl p-4">
              <div className="text-purple-600 font-semibold mb-2">Only on this page</div>
              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <span>⏳</span>
                  <span className="font-medium">Limited spots</span>
                </span>
                <span className="text-purple-500 font-medium">Last chance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-amber-600 font-semibold mb-4">
              <span className="text-yellow-500">⚠️</span>
              <span className="text-sm">Attention:</span>
            </div>
            
            <div className="text-gray-700 space-y-3 text-sm leading-relaxed">
              <p>This is the last page where you'll see this opportunity. Once you leave, this condition disappears forever.</p>
              
              <p className="font-medium">Dear one, you've already taken the first step.</p>
              
              <p>Don't let doubts or energetic blocks make you lose the love that was written for you.</p>
              
              <p className="font-semibold text-gray-800">
                Click the green button below and immediately secure access to the Final Combo.
              </p>
            </div>
          </div>
        </div>

        {/* Hotmart Checkout Widget */}
        <div className="w-full max-w-2xl mx-auto mb-8">
          <div id="hotmart-sales-funnel" className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading checkout...</p>
            </div>
          </div>
        </div>
      </div>
    </div>);

}
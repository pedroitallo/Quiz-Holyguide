import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

export default function Checkout() {
  const [timeLeft, setTimeLeft] = useState(10 * 60);

  useEffect(() => {
    if (!document.querySelector('script[src="https://static.samcart.com/checkouts/sc-checkout.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://static.samcart.com/checkouts/sc-checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(p => (p <= 0 ? 0 : p - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <>
      <Helmet>
        <title>Checkout - Auraly App</title>
        <style>{`
          sc-checkout { position: relative; z-index: 1; display:block; }
        `}</style>
      </Helmet>

      <div className="min-h-screen bg-white py-8 relative">

        {/* Mostra apenas em mobile */}
        <div className="block sm:hidden">
          {/* Fundo branco atrás da imagem */}
          <div
            className="
              absolute left-1/2 -translate-x-1/2 z-20
              w-[min(95vw,500px)] h-[150px]
              top-[220px]
              bg-white rounded-xl pointer-events-none
            "
          />
          {/* Imagem lilás centralizada */}
          <div className="absolute top-[230px] left-1/2 -translate-x-1/2 z-30 text-center px-4">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/zPHWyX6816126.png?quality=90#759107"
              alt="Your drawing soulmate"
              className="mx-auto w-full max-w-[820px] h-auto object-contain"
            />
          </div>
        </div>

        {/* Checkout */}
        <sc-checkout product="auraly-app" subdomain="appsappyon" coupon=""></sc-checkout>

        <div className="max-w-2xl mx-auto mt-8 px-4">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            By accepting this offer, you agree to start a 30-day trial on the Auraly App.
            After the trial period ends, your subscription will automatically renew for just $29/month.
            You may cancel anytime by contacting us at contact@auralyapp.com
          </p>
          <p className="text-center text-sm text-gray-800 mt-2">
            Offer expires in {minutes}:{seconds}
          </p>
        </div>
      </div>
    </>
  );
}

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

        {/* Banner visível apenas no mobile */}
        <div className="block sm:hidden relative w-full">
          {/* Fundo branco por trás */}
          <div
            className="
              absolute top-[225px] left-0 w-full h-[160px]
              bg-white pointer-events-none
            "
          />
          {/* Imagem lilás grande e centralizada */}
          <div className="absolute top-[180px] left-1/2 -translate-x-1/2 z-30 flex justify-center w-full">
            <img
              src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/zPHWyX6816126.png?quality=90#759107"
              alt="Your drawing soulmate"
              className="
                w-[95vw] max-w-[520px]
                h-auto object-contain
              "
            />
          </div>
        </div>

        {/* Checkout */}
        <sc-checkout product="auraly-app" subdomain="checkout" coupon=""></sc-checkout>
      </div>
    </>
  );
}

import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

export default function Checkout() {
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds

  useEffect(() => {
    // Evita duplicar o script se já estiver no DOM
    if (!document.querySelector('script[src="https://static.samcart.com/checkouts/sc-checkout.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://static.samcart.com/checkouts/sc-checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <>
      <Helmet>
        <title>Checkout - Auraly App</title>
        <style>{`
          /* Torna o host o referencial do ::after */
          sc-checkout {
            position: relative;
            display: block; /* garante largura total */
          }

          /* Se você quer o overlay no bloco order-summary especificamente: */
          sc-checkout::part(order-summary) {
            position: relative;
          }
          sc-checkout::part(order-summary)::after {
            content: '';
            position: absolute;
            top: 230px;
            left: 5px;
            right: 5px;
            height: 80px;
            background: white;
            z-index: 10;
            pointer-events: none;
          }
        `}</style>
      </Helmet>

      <div className="min-h-screen bg-white py-8 relative">
        <div className="absolute top-[253px] left-1/2 -translate-x-1/2 z-20 text-center px-4">
          <img
            src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/zPHWyX6816126.png?quality=72#759107"
            alt="Your drawing soulmate"
            className="mx-auto w-auto max-w-[300px]"
          />
        </div>

        {/* O componente custom permanece dentro do container principal */}
        <sc-checkout
          product="auraly-app"
          subdomain="appsappyon"
          coupon=""
        ></sc-checkout>

        <div className="max-w-2xl mx-auto mt-8 px-4">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            By accepting this offer, you agree to start a 30-day trial on the Auraly App.
            After the trial period ends, your subscription will automatically renew for just $29/month.
            You may cancel anytime by contacting us at contact@auralyapp.com
          </p>
          {/* Exemplo de uso do timer, se quiser exibir */}
          <p className="text-center text-sm text-gray-800 mt-2">
            Offer expires in {minutes}:{seconds}
          </p>
        </div>
      </div>
    </>
  );
}

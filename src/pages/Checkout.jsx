import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

export default function Checkout() {
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://static.samcart.com/checkouts/sc-checkout.js';
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <>
      <Helmet>
        <title>Checkout - Auraly App</title>
        <style>{`
          sc-checkout::part(order-summary) {
            position: relative;
          }
          sc-checkout::after {
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
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-8 relative">
        <div className="absolute top-[273px] left-1/2 -translate-x-1/2 z-20 text-center px-4">
          <p className="text-sm font-medium text-gray-800 mb-1">Limited offer. Ends in</p>
          <div className="text-2xl font-bold text-red-600">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>

        <sc-checkout
          product="drawing-soulmate-auraly-app"
          subdomain="appyon-app"
          coupon=""
        ></sc-checkout>

        <div className="max-w-2xl mx-auto mt-8 px-4">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            By accepting this offer, you agree to start a 7-day free trial on the Auraly App.
            After the trial period ends, your subscription will automatically renew for just $29/month.
            You may cancel anytime by contacting us at contact@auralyapp.com
          </p>
        </div>
      </div>
    </>
  );
}

import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

export default function Checkout() {
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
            left: 22px;
            right: 22px;
            height: 80px;
            background: white;
            z-index: 10;
            pointer-events: none;
          }
        `}</style>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-8">
        <sc-checkout
          product="drawing-soulmate-auraly-app"
          subdomain="appyon-app"
          coupon=""
        ></sc-checkout>
      </div>
    </>
  );
}

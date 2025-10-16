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

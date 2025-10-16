import { useState } from 'react';
import { Helmet } from 'react-helmet';

export default function Checkout() {
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Checkout - Auraly App</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {isLoading && (
            <div className="flex items-center justify-center min-h-[800px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-purple-600 font-medium">Loading checkout...</p>
              </div>
            </div>
          )}
          <iframe
            src="https://appyon-app.mysamcart.com/products/drawing-soulmate-auraly-app"
            title="Checkout"
            onLoad={handleIframeLoad}
            className={`w-full border-0 rounded-lg shadow-lg ${isLoading ? 'hidden' : 'block'}`}
            style={{
              minHeight: '1000px',
              height: '100vh'
            }}
            allow="payment"
            loading="eager"
          />
        </div>
      </div>
    </>
  );
}

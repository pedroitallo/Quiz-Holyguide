import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Package, Truck, Shield } from 'lucide-react';

export default function CheckoutStep({ userName, funnelType }) {
  useEffect(() => {
    const trackCheckoutView = async () => {
      try {
        const { trackStepView } = await import('../../utils/stepTracking');
        await trackStepView(funnelType, 'checkout');
        console.log(`Checkout step viewed tracked for ${funnelType}`);
      } catch (error) {
        console.warn('Failed to track checkout view:', error);
      }
    };

    trackCheckoutView();
  }, [funnelType]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <Card className="border-green-200 shadow-2xl">
          <CardContent className="p-8 text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </motion.div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-800">
                Payment Successful!
              </h1>
              <p className="text-gray-600">
                Thank you {userName ? userName : 'for your purchase'}!
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3 text-left">
                <Package className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  Your divine soul drawing is being prepared
                </p>
              </div>

              <div className="flex items-center gap-3 text-left">
                <Truck className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  You'll receive it via email within 24-48 hours
                </p>
              </div>

              <div className="flex items-center gap-3 text-left">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  Your purchase is protected by our guarantee
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Check your email for order confirmation and next steps
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

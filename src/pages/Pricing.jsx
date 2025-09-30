import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const plans = [
  {
    id: 'monthly',
    name: 'Monthly Access',
    price: '$29',
    period: '/month',
    originalPrice: '$49',
    savings: 'Save $20',
    description: 'Perfect for exploring your spiritual journey',
    features: [
      'Complete Divine Soul Reading',
      'Personalized Soulmate Drawing',
      'Birth Chart Analysis',
      'Love Compatibility Report',
      'Monthly Spiritual Guidance',
      'Email Support',
      '30-Day Money Back Guarantee'
    ],
    popular: false,
    icon: Star,
    gradient: 'from-purple-500 to-purple-600',
    checkoutUrl: 'https://tkk.holyguide.online/click?plan=monthly'
  },
  {
    id: 'quarterly',
    name: 'Quarterly Access',
    price: '$19',
    period: '/month',
    originalPrice: '$87',
    totalPrice: '$57',
    savings: 'Save $30 (67% OFF)',
    description: 'Most popular choice for deep spiritual connection',
    features: [
      'Everything in Monthly Plan',
      'Advanced Relationship Insights',
      'Quarterly Energy Readings',
      'Priority Email Support',
      'Exclusive Meditation Guides',
      'Chakra Alignment Report',
      'Future Love Predictions',
      'VIP Community Access'
    ],
    popular: true,
    icon: Crown,
    gradient: 'from-pink-500 to-rose-600',
    checkoutUrl: 'https://tkk.holyguide.online/click?plan=quarterly'
  },
  {
    id: 'biannual',
    name: 'Biannual Access',
    price: '$15',
    period: '/month',
    originalPrice: '$174',
    totalPrice: '$90',
    savings: 'Save $84 (69% OFF)',
    description: 'Ultimate spiritual transformation package',
    features: [
      'Everything in Quarterly Plan',
      'Bi-weekly Personal Consultations',
      'Custom Ritual Recommendations',
      'Astrological Transit Alerts',
      'Manifestation Coaching',
      'Sacred Geometry Analysis',
      'Past Life Reading',
      'Direct Access to Madame Aura',
      'Lifetime Reading Archive'
    ],
    popular: false,
    icon: Sparkles,
    gradient: 'from-indigo-500 to-purple-600',
    checkoutUrl: 'https://tkk.holyguide.online/click?plan=biannual'
  }
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState('quarterly');

  const handleCheckout = (plan) => {
    try {
      const url = new URL(plan.checkoutUrl);

      // Use UTMIFY to get all UTM parameters
      let allUtms = {};
      
      if (typeof window !== 'undefined' && window.utmify) {
        try {
          allUtms = window.utmify.getUtms() || {};
          console.log('UTMs from UTMIFY:', allUtms);
        } catch (error) {
          console.warn('Failed to get UTMs from UTMIFY:', error);
        }
      }
      
      // Fallback: get UTMs from URL if UTMIFY is not available
      if (Object.keys(allUtms).length === 0) {
        const currentUrl = new URL(window.location.href);
        const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
        
        utmParams.forEach(param => {
          const value = currentUrl.searchParams.get(param);
          if (value) {
            allUtms[param] = value;
          }
        });
        
        // Also get other tracking parameters
        const otherParams = ['fbclid', 'gclid', 'ttclid', 'src', 'xcod'];
        otherParams.forEach(param => {
          const value = currentUrl.searchParams.get(param);
          if (value) {
            allUtms[param] = value;
          }
        });
      }
      
      // Add all UTM parameters to checkout URL
      Object.keys(allUtms).forEach((key) => {
        if (allUtms[key]) {
          url.searchParams.set(key, allUtms[key]);
        }
      });

      console.log('Redirecting to checkout:', url.toString());
      window.location.href = url.toString();
    } catch (error) {
      console.error("Error building checkout URL:", error);
      window.location.href = plan.checkoutUrl;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
              alt="Madame Aura"
              className="w-20 h-20 rounded-full object-cover border-4 border-purple-200 shadow-lg"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Divine Path</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Unlock the secrets of your soul and discover your divine connection with personalized spiritual guidance from Madame Aura, Hollywood's #1 trusted psychic.
          </p>
          
          <div className="mt-8 flex items-center justify-center gap-2 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-current" />
            ))}
            <span className="ml-2 text-gray-600 font-semibold">Trusted by 10,000+ souls worldwide</span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            const isSelected = selectedPlan === plan.id;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      ⭐ MOST POPULAR
                    </div>
                  </div>
                )}
                
                <Card 
                  className={`relative overflow-hidden transition-all duration-300 cursor-pointer ${
                    plan.popular 
                      ? 'ring-4 ring-pink-400 shadow-2xl scale-105' 
                      : isSelected 
                        ? 'ring-2 ring-purple-400 shadow-xl' 
                        : 'hover:shadow-xl hover:scale-102'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-5`} />
                  
                  <CardHeader className="relative text-center pb-4">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm">{plan.description}</p>
                    
                    <div className="mt-6">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-600">{plan.period}</span>
                      </div>
                      
                      {plan.totalPrice && (
                        <div className="text-sm text-gray-500 mb-2">
                          Billed as {plan.totalPrice} {plan.id === 'quarterly' ? 'quarterly' : 'biannually'}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-gray-400 line-through text-sm">{plan.originalPrice}</span>
                        <span className="text-green-600 font-semibold text-sm">{plan.savings}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      onClick={() => handleCheckout(plan)}
                      className={`w-full py-4 text-lg font-bold rounded-full shadow-lg transition-all duration-300 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white transform hover:scale-105'
                          : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white transform hover:scale-105'
                      }`}
                    >
                      Choose {plan.name}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Guarantee Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto border border-purple-100">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              30-Day Money Back Guarantee
            </h3>
            
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
              We're so confident in the power of your Divine Soul Reading that we offer a full 30-day money-back guarantee. 
              If you're not completely satisfied with your spiritual journey, we'll refund every penny.
            </p>
            
            <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Instant Access</h4>
                <p className="text-sm text-gray-600">Get your reading immediately after purchase</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Crown className="w-6 h-6 text-pink-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Premium Quality</h4>
                <p className="text-sm text-gray-600">Personalized readings from expert psychics</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Satisfaction Guaranteed</h4>
                <p className="text-sm text-gray-600">30-day money back guarantee</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
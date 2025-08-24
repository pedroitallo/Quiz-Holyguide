import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = React.useState(600); // 10 minutes in seconds

  React.useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-red-600 font-bold text-2xl">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
};

const PulsatingButton = ({ children, onClick, className = "" }) => (
  <Button
    onClick={onClick}
    className={`checkout-button w-full max-w-2xl mx-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 px-12 rounded-full text-lg shadow-2xl transform transition-all duration-300 hover:scale-105 leading-tight ${className}`}
    style={{ minHeight: '70px' }}
  >
    <span className="block text-center leading-tight">{children}</span>
  </Button>
);

export default function SalesSection({ userName, birthDate, onCheckout }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center space-y-4 p-4"
    >
      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle { animation: bounce-subtle 1.5s infinite ease-in-out; }
      `}</style>

      {/* Main CTA Section - Moved closer to VSL */}
      <div className="space-y-3 -mt-4">
        <p className="text-gray-700 text-sm font-bold">Click Below To Secure Your Drawing👇🏻</p>
        <PulsatingButton onClick={onCheckout}>
          YES! Claim My Divine<br/>Soul Drawing
        </PulsatingButton>
      </div>

      {/* High Demand Warning with Countdown - Single line format */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-yellow-500 text-xl">⚠️</span>
            <span className="text-red-600 font-bold text-lg">HIGH DEMAND:</span>
          </div>
          
          <div className="space-y-2">
            <div className="text-gray-800 text-base">
              The LAST <span className="text-2xl font-bold">5</span> spots may fill up in
            </div>
            
            <CountdownTimer />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
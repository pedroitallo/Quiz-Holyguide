import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTracking } from '@/hooks/useTracking';

export default function IntroStep({ onContinue }) {
  const { trackStartQuiz } = useTracking();

  const handleContinue = () => {
    trackStartQuiz();
    onContinue();
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center space-y-6">

      <h1 className="text-3xl md:text-4xl font-bold text-purple-600 leading-tight">
        Your Soulmate Awaits
      </h1>

      <p className="text-gray-700 text-lg leading-relaxed max-w-xl mx-auto">
        Through mystical arts and celestial wisdom, I will reveal your true soulmate.
      </p>

      <Card className="max-w-md mx-auto bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6 space-y-4">
          <img
            src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
            alt="Master Aura"
            className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
          />
          <div>
            <h3 className="font-bold text-lg text-purple-700">Master Aura</h3>
            <p className="text-sm text-gray-600">Celebrity Psychic & Love Expert</p>
            <p className="text-xs text-gray-500 mt-2">✨ Over 10,000 successful readings</p>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleContinue}
        className="w-full max-w-md mx-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        Discover My Soulmate
      </Button>
    </motion.div>
  );
}

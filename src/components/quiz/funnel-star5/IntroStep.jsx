import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTracking } from '@/hooks/useTracking';

export default function IntroStep({ onContinue }) {
  const { trackStartQuiz } = useTracking();

  const handleContinue = () => {
    trackStartQuiz();
    onContinue();
  };
  const testimonials = [
    { name: "Sarah M.", text: "She revealed exactly who my soulmate was! We met 3 months later. ⭐⭐⭐⭐⭐" },
    { name: "Michael R.", text: "Absolutely mind-blowing accuracy. Worth every penny! ⭐⭐⭐⭐⭐" },
    { name: "Emma L.", text: "I was skeptical at first, but now I'm a believer! ⭐⭐⭐⭐⭐" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center space-y-6">

      <h1 className="text-3xl md:text-4xl font-bold text-purple-600 leading-tight">
        Meet Your Divine Soulmate
      </h1>

      <p className="text-gray-700 text-lg leading-relaxed max-w-xl mx-auto">
        Get a personalized psychic drawing and discover who the universe has chosen for you.
      </p>

      <div className="py-6">
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
          alt="Madame Aura"
          className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-purple-200 shadow-lg"
        />
        <p className="mt-3 text-purple-700 font-bold">Madame Aura</p>
        <p className="text-sm text-gray-600">Hollywood's #1 Psychic</p>
      </div>

      <div className="space-y-3 max-w-md mx-auto">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.2 }}
            className="bg-white p-3 rounded-lg shadow-sm border border-purple-100 text-left">
            <p className="text-xs text-gray-700 italic">"{testimonial.text}"</p>
            <p className="text-xs text-gray-500 mt-1 font-semibold">- {testimonial.name}</p>
          </motion.div>
        ))}
      </div>

      <Button
        onClick={handleContinue}
        className="w-full max-w-md mx-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 animate-pulse"
      >
        Get My Reading Now
      </Button>
    </motion.div>
  );
}

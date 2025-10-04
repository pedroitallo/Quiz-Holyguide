import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Star, Sparkles } from "lucide-react";

export default function IntroStep({ onContinue }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center space-y-6">

      <div className="flex justify-center gap-4 mb-4">
        <Heart className="w-8 h-8 text-pink-500 animate-pulse" />
        <Star className="w-8 h-8 text-yellow-500 animate-pulse" style={{ animationDelay: '0.3s' }} />
        <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" style={{ animationDelay: '0.6s' }} />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-purple-600 leading-tight">
        Unlock Your Love Destiny
      </h1>

      <p className="text-gray-700 text-lg leading-relaxed max-w-xl mx-auto">
        Let the universe reveal who your perfect soulmate is and when you'll meet them.
      </p>

      <div className="py-8">
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
          alt="Madame Aura"
          className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-purple-200 shadow-lg"
        />
        <p className="mt-4 text-sm text-gray-600 font-semibold">Madame Aura - Spiritual Guide</p>
      </div>

      <Button
        onClick={onContinue}
        className="w-full max-w-md mx-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        Start My Reading
      </Button>
    </motion.div>
  );
}

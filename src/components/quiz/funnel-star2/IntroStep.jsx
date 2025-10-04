import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function IntroStep({ onContinue }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center space-y-6">

      <h1 className="text-3xl md:text-4xl font-bold text-purple-600 leading-tight">
        Welcome to Your Soulmate Journey
      </h1>

      <p className="text-gray-700 text-lg leading-relaxed max-w-xl mx-auto">
        Discover who your true soulmate is through ancient wisdom and psychic guidance.
      </p>

      <div className="py-8">
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/adbb98955_Perfil.webp"
          alt="Madame Aura"
          className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-purple-200 shadow-lg"
        />
      </div>

      <Button
        onClick={onContinue}
        className="w-full max-w-md mx-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        Begin Your Journey
      </Button>
    </motion.div>
  );
}

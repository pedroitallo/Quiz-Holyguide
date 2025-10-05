import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function IntroStep({ onContinue }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center space-y-6 max-w-2xl mx-auto px-4">

      <h1 className="text-3xl md:text-4xl font-bold text-purple-600 leading-tight">
        I Will Use My Psychic Abilities To Reveal Your Soulmate's Face And Name!
      </h1>

      <p className="text-gray-700 text-lg leading-relaxed">
        More Than 10,000 People Have Found Their Soul Mate After This 1-Minute Astral Test.
      </p>

      <div className="py-6">
        <img
          src="https://media.atomicatpages.net/u/Df7JwzgHi4NP3wU9R4rFqEhfypJ2/Pictures/WzQEhs1818943.gif?quality=84#727799"
          alt="Psychic Vision"
          className="w-full max-w-md mx-auto rounded-lg shadow-lg"
        />
      </div>

      <Button
        onClick={onContinue}
        className="w-full max-w-md mx-auto bg-green-500 hover:bg-green-600 text-white font-bold py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-200 animate-pulse"
      >
        Discover My Soulmate →
      </Button>
    </motion.div>
  );
}

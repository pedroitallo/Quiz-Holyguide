import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function IntroStep({ onContinue }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center space-y-6 max-w-4xl mx-auto">

      <h1 className="text-2xl md:text-4xl font-bold text-black leading-tight px-4">
        I Will Use My Psychic Abilities To Reveal Your Soulmate's Face And Name!
      </h1>
      <div className="py-6>
        <img
          src="/Start3.png"
          alt="Discover Your Soulmate"
          className="w-full max-w-3xl mx-auto rounded-lg shadow-lg"
        />
      </div>
  <p className="text-black text-lg md:text-xl leading-relaxed max-w-3xl mx-auto px-3">
        More Than 9,500 People Have Found Their Soul Mate After This 1-Minute Astral Test
      </p>
      <Button
        onClick={onContinue}
        className="w-full max-w-md mx-auto bg-green-600 hover:bg-green-700 text-white font-bold py-6 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        DISCOVER MY SOULMATE→
      </Button>
    </motion.div>
  );
}

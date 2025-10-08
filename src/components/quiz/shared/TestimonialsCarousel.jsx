
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
{
  imageUrl: "https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/14ed61e13_DEP1.webp"
},
{
  imageUrl: "https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/e858f01a6_DEP2.webp"
},
{
  imageUrl: "https://base44.app/api/apps/68850befb229de9dd8e4dc73/files/80e6a766a_DEP3.webp"
}];

// Preload all testimonial images immediately when component loads
const preloadImages = () => {
  testimonials.forEach((testimonial) => {
    const img = new Image();
    img.src = testimonial.imageUrl;
  });
};
const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

export default function TestimonialsCarousel({ onContinue }) {
  const [[page, direction], setPage] = useState([0, 0]);

  // Preload images on component mount
  useEffect(() => {
    preloadImages();
  }, []);
  const paginate = (newDirection) => {
    setPage([(page + newDirection + testimonials.length) % testimonials.length, newDirection]);
  };

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 6000); // Changed to 6 seconds
    return () => clearInterval(timer);
  }, [page]);

  const testimonialIndex = page;

  return (
    <div className="text-center py-8">
      {/* Preload all images invisibly */}
      <div className="hidden">
        {testimonials.map((testimonial, index) => (
          <img
            key={`preload-${index}`}
            src={testimonial.imageUrl}
            alt=""
            loading="eager"
            decoding="async"
          />
        ))}
      </div>

      {/* Mensagem da Master Aura */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8">

        <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl shadow-sm border border-purple-100 max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <img
              src="https://reoszoosrzwlrzkasube.supabase.co/storage/v1/object/public/user-uploads/images/1759890624957-jkxekrn97yd.png"
              alt="Master Aura"
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
              loading="eager"
              decoding="async" />
            <div className="text-left">
              <p className="text-base text-gray-700 leading-relaxed">
                Hello, I'm Master Aura and in a few minutes we'll discover the face of your soulmate!✨ This Year Alone, <strong>I Have Connected With More Than 9,200 Soulmates</strong> Through My Drawings And Revelations👇🏼
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="relative h-[320px] mb-4 flex items-center justify-center">
        {/* Render all images but only show the current one - this keeps them in DOM and cached */}
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={`absolute w-full flex flex-col items-center transition-opacity duration-300 ${
              index === testimonialIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="mb-3">
              <img
                src={testimonial.imageUrl}
                alt="Testimonial couple"
                className="w-64 h-80 object-cover rounded-xl shadow-lg"
                loading="eager"
                decoding="async"
                style={{
                  imageRendering: 'crisp-edges',
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(0)'
                }}
              />
            </div>
          </div>
        ))}

        {/* Navigation buttons */}
        <button
          onClick={() => paginate(-1)}
          className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-10">

          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        
        <button
          onClick={() => paginate(1)}
          className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-10">

          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center space-x-2 mb-8">
        {testimonials.map((_, index) =>
        <button
          key={index}
          onClick={() => setPage([index, index > testimonialIndex ? 1 : -1])}
          className={`w-3 h-3 rounded-full transition-all duration-200 ${
          index === testimonialIndex ? 'bg-purple-600' : 'bg-gray-300'}`
          } />
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-12">

        <p className="text-gray-700 text-lg mb-6 leading-relaxed max-w-md mx-auto font-semibold">
          Are You Ready To Receive The Drawing Of Your Soulmate? 👇🏼
        </p>

        <button
          onClick={onContinue}
          id="btn-vsl" 
          className="btn-primary w-full max-w-sm md:w-auto animate-pulse-gentle">

          Yes, I am ready!
        </button>
        
        <p className="text-sm text-gray-500 mt-4">

        </p>
      </motion.div>
    </div>);

}
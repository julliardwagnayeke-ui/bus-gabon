'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    title: "Réservez votre bus",
    subtitle: "PAYEZ PAR MOBILE MONEY",
    desc: "Simple, rapide et sécurisé",
  },
  {
    title: "100 % garanti",
    subtitle: "0 % D'ATTENTE",
    desc: "Évitez les files d'attente en agence",
  },
  {
    title: "Choississez la simplicité",
    subtitle: "VOYAGEZ L'ESPRIT LÉGER",
    desc: "Toutes vos agences préférées au même endroit",
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[480px] lg:h-[560px] flex items-center justify-center overflow-hidden bg-hero">
      {/* Background with mesh gradient */}
      <div className="absolute inset-0 z-0 gradient-mesh opacity-40"></div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-white/80 font-display font-bold uppercase tracking-[0.2em] text-xs sm:text-sm mb-4">
              {SLIDES[current].title}
            </h2>
            <h1 className="text-white text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight">
              {SLIDES[current].subtitle}
            </h1>
            <p className="text-white/70 text-lg sm:text-xl font-medium max-w-2xl mx-auto">
              {SLIDES[current].desc}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-12">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-500 ${current === i ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Heart } from 'lucide-react';

export default function EndingScreen() {
  const [showSecondText, setShowSecondText] = useState(false);
  const [showThirdText, setShowThirdText] = useState(false);

  useEffect(() => {
    // Stage text reveal timers
    const timer1 = setTimeout(() => setShowSecondText(true), 2500);
    const timer2 = setTimeout(() => setShowThirdText(true), 5000);

    // Continuous fireworks animation
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 25, spread: 360, ticks: 80, zIndex: 100 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 30 * (timeLeft / duration);
      // Fireworks shots!
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 } 
      }));
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 } 
      }));
    }, 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="min-h-screen py-24 px-4 bg-gradient-to-b from-purple-50 to-pink-50 flex flex-col items-center justify-center relative overflow-hidden select-none">
      
      {/* Dynamic background sparks */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-pink-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      <div className="max-w-md w-full glass-card p-10 rounded-3xl border border-pink-100 shadow-2xl text-center relative z-10 flex flex-col items-center">
        {/* Heart Icon at top */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center mb-8 shadow-inner"
        >
          <Heart className="w-6 h-6 text-heart-pink fill-heart-pink" />
        </motion.div>

        {/* Part 1: And that's the end... */}
        <motion.h3
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-gray-500 font-sans text-lg italic mb-6"
        >
          And that's the end...
        </motion.h3>

        {/* Part 2: Actually, no. */}
        {showSecondText && (
          <motion.h3
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-2xl font-cute font-bold text-gray-800 mb-8"
          >
            Actually, no. 💗
          </motion.h3>
        )}

        {/* Part 3: There are still a lot of memories left to make. */}
        {showThirdText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className="flex flex-col items-center"
          >
            <p className="font-handwritten text-3xl text-pink-600 leading-relaxed mb-4">
              There are still a lot of memories left to make. ✨
            </p>
            <p className="text-gray-600 font-cute font-bold text-lg">
              Thank you for being part of mine.
            </p>
            
            <span className="text-4xl mt-6 heart-pulse select-none">💖</span>
          </motion.div>
        )}
      </div>
    </section>
  );
}

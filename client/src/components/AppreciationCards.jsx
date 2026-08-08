import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ChevronRight, RotateCcw } from 'lucide-react';

export default function AppreciationCards({ appreciations }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const list = appreciations && appreciations.length > 0 ? appreciations : [
    "Your kindness 💗",
    "The way you make people laugh 😂",
    "Your determination 🌟",
    "The random conversations we have 😭",
    "The memories we've made 📸"
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % list.length);
  };

  const handleReset = () => {
    setCurrentIndex(0);
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-purple-50 to-pink-50 flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-md w-full text-center">
        <h2 className="text-4xl md:text-5xl font-cute font-bold text-gray-800 mb-2 select-none">
          ✨ Things I Appreciate
        </h2>
        <p className="text-gray-600 text-lg mb-12">
          Just a few of the million things that make you so special. Click to read!
        </p>

        {/* Card Stack Container */}
        <div className="relative h-72 w-full flex items-center justify-center mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ scale: 0.9, opacity: 0, rotate: -3, y: 10 }}
              animate={{ scale: 1, opacity: 1, rotate: currentIndex % 2 === 0 ? 2 : -2, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, rotate: 5, y: -20 }}
              transition={{ type: 'spring', damping: 15, stiffness: 100 }}
              className="absolute w-72 md:w-80 aspect-[1.4/1] bg-white border border-pink-100 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center text-center select-none"
            >
              {/* Tape Effect */}
              <div className="tape-effect"></div>

              {/* Heart icon */}
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-heart-pink fill-heart-pink/30 animate-pulse" />
              </div>

              {/* Text */}
              <p className="font-cute font-semibold text-lg md:text-xl text-gray-700 leading-relaxed px-4">
                {list[currentIndex]}
              </p>

              {/* Badge indicating index */}
              <div className="absolute bottom-4 text-xs font-bold text-gray-400">
                Reason {currentIndex + 1} of {list.length}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Control Button */}
        <div className="flex justify-center">
          {currentIndex < list.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-cute font-bold rounded-full shadow-md cursor-pointer transition-transform"
            >
              Next Reason <ChevronRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-pink-100 text-pink-600 hover:bg-pink-200 font-cute font-bold rounded-full shadow-md cursor-pointer transition-transform"
            >
              Read Again <RotateCcw className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </section>
  );
}

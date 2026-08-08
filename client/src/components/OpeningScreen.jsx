import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

export default function OpeningScreen({ partnerName, onOpen }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate floating hearts/stars
    const items = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      size: `${Math.random() * 20 + 10}px`,
      duration: Math.random() * 10 + 8,
      type: Math.random() > 0.5 ? 'heart' : 'star',
    }));
    setParticles(items);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-tr from-pink-100 via-purple-50 to-pink-50 overflow-hidden">
      {/* Floating particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="floating-particle text-heart-pink opacity-40 select-none"
          style={{
            '--x': p.x,
            '--delay': `${p.delay}s`,
            '--size': p.size,
            '--speed': `${p.duration}s`,
          }}
        >
          {p.type === 'heart' ? '❤️' : '⭐'}
        </span>
      ))}

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, y: -50 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="glass-card max-w-md w-[90%] p-8 rounded-3xl text-center shadow-xl border border-pink-200/50 flex flex-col items-center relative"
      >
        {/* Soft pink glow effect */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-pink-300 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-purple-300 rounded-full blur-3xl opacity-30"></div>

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6 shadow-inner"
        >
          <Heart className="w-8 h-8 text-heart-pink fill-heart-pink" />
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-cute font-bold text-gray-800 mb-4 select-none">
          Hey {partnerName} <span className="text-heart-pink heart-pulse inline-block">💗</span>
        </h1>

        <p className="text-gray-600 text-lg mb-8 leading-relaxed font-sans">
          I made a tiny corner of the internet just for you. Ready to explore?
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpen}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-cute font-bold text-lg rounded-full shadow-lg shadow-pink-300/40 hover:from-pink-500 hover:to-purple-500 transition-colors cursor-pointer"
        >
          Open Your Surprise <Sparkles className="w-5 h-5 animate-pulse" />
        </motion.button>
      </motion.div>
    </div>
  );
}

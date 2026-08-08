import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { getMediaUrl } from '../utils/api';
import { Gift, Sparkles, Heart } from 'lucide-react';

export default function MysteryGift({ giftData }) {
  const [isOpened, setIsOpened] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleBoxClick = () => {
    if (isOpened) return;
    
    // Shake box first
    setIsShaking(true);
    
    setTimeout(() => {
      setIsShaking(false);
      setIsOpened(true);
      
      // Fire confetti!
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, animate a bit higher than random
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
    }, 800);
  };

  const imageUrl = giftData?.image ? getMediaUrl(giftData.image) : '/valentine-couple.jpg';

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-pink-50 to-purple-50 flex flex-col items-center justify-center overflow-hidden min-h-screen relative">
      <div className="max-w-xl w-full text-center z-10">
        <h2 className="text-4xl md:text-5xl font-cute font-bold text-gray-800 mb-4 select-none">
          🎁 Mystery Gift Box
        </h2>
        <p className="text-gray-600 text-lg mb-12">
          {!isOpened ? "I have something special for you... Tap the box to open it!" : "A little gift from my heart to yours! 💗"}
        </p>

        <div className="flex justify-center items-center h-80 relative mb-8">
          <AnimatePresence mode="wait">
            {!isOpened ? (
              <motion.div
                key="closed-box"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  rotate: isShaking ? [0, -8, 8, -6, 6, -3, 3, 0] : 0,
                  y: isShaking ? [0, -10, 0, -5, 0] : 0
                }}
                exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
                transition={{ duration: isShaking ? 0.8 : 0.3 }}
                onClick={handleBoxClick}
                className="cursor-pointer shake-hover relative flex flex-col items-center"
              >
                {/* 3D Gift Box SVG/CSS */}
                <div className="w-48 h-48 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl shadow-2xl relative flex items-center justify-center border-4 border-pink-300">
                  {/* Ribbon cross vertical */}
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-yellow-300 border-x-2 border-yellow-400"></div>
                  {/* Ribbon cross horizontal */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 bg-yellow-300 border-y-2 border-yellow-400"></div>
                  {/* Ribbon bow */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-8 flex justify-between">
                    <div className="w-8 h-8 rounded-full border-4 border-yellow-300 bg-yellow-400 -rotate-45 -mr-2"></div>
                    <div className="w-8 h-8 rounded-full border-4 border-yellow-300 bg-yellow-400 rotate-45 -ml-2"></div>
                  </div>
                  
                  <Gift className="w-16 h-16 text-white z-10 animate-pulse" />
                </div>
                
                <span className="mt-6 text-pink-500 font-cute font-bold text-lg tracking-wider animate-bounce flex items-center gap-1">
                  TAP ME ✨
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="opened-content"
                initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 80 }}
                className="w-full"
              >
                <div className="polaroid-card max-w-sm mx-auto">
                  <div className="tape-effect"></div>
                  
                  {imageUrl ? (
                    <div className="w-full h-72 bg-pink-50/20 rounded-md mb-4 overflow-hidden flex items-center justify-center border border-pink-100/50">
                      <img
                        src={imageUrl}
                        alt="Surprise Collage"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-56 bg-pink-100 flex flex-col items-center justify-center rounded-sm mb-4 border border-pink-200">
                      <div className="flex gap-2">
                        <Heart className="w-8 h-8 text-heart-pink fill-heart-pink animate-ping" />
                        <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-200" />
                      </div>
                      <span className="font-handwritten text-xl text-pink-600 mt-4">Surprise 💗</span>
                    </div>
                  )}

                  <h3 className="font-cute font-bold text-xl text-gray-800 mb-2">
                    {giftData?.title || "A Special Surprise"}
                  </h3>
                  <p className="font-handwritten text-2xl text-gray-700 leading-relaxed mb-2">
                    {giftData?.message || "You are the best thing that ever happened to me. Here is a little collection of thoughts I carry with me every day."}
                  </p>
                  
                  <button 
                    onClick={() => setIsOpened(false)}
                    className="mt-4 px-4 py-2 bg-pink-50 text-pink-500 hover:bg-pink-100 text-xs font-bold rounded-full transition-colors cursor-pointer"
                  >
                    Close & Box Again 🎁
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

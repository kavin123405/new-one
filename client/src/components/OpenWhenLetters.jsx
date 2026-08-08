import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MailOpen, X } from 'lucide-react';

const letterTypes = [
  { key: 'happy', title: "You're happy 😊", color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  { key: 'difficult', title: "You're having a difficult day 🌧️", color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { key: 'motivation', title: "You need motivation 🌟", color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { key: 'laugh', title: "You want to laugh 😂", color: 'bg-orange-50 border-orange-200 text-orange-700' },
  { key: 'miss', title: "You miss our conversations 💗", color: 'bg-pink-50 border-pink-200 text-pink-700' },
  { key: 'sleep', title: "You can't sleep 🌙", color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
];

export default function OpenWhenLetters({ letters }) {
  const [activeLetter, setActiveLetter] = useState(null);

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-purple-55 to-pink-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-cute font-bold text-gray-800 mb-4 select-none">
            💌 \"Open When...\" Letters
          </h2>
          <p className="text-gray-600 text-lg">
            A small collection of letters for whatever mood you might be in. Click an envelope to read.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {letterTypes.map((letter) => {
            const isOpened = activeLetter === letter.key;
            return (
              <motion.div
                key={letter.key}
                whileHover={{ y: -5 }}
                className="glass-card p-6 rounded-2xl border border-pink-100 flex flex-col items-center justify-between text-center relative overflow-hidden cursor-pointer"
                onClick={() => setActiveLetter(letter.key)}
              >
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4 text-heart-pink">
                  <Mail className="w-8 h-8 text-heart-pink" />
                </div>
                
                <h3 className="font-cute font-bold text-lg text-gray-700 mb-2">
                  Open when...
                </h3>
                <p className="font-sans text-gray-600 font-semibold text-sm">
                  {letter.title}
                </p>

                <div className="mt-4 text-xs font-bold text-heart-pink uppercase tracking-widest animate-pulse">
                  Read Letter ✨
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Backdrop & Letter Modal */}
      <AnimatePresence>
        {activeLetter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark blur background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLetter(null)}
              className="absolute inset-0 bg-pink-900/20 backdrop-blur-md"
            ></motion.div>

            {/* Letter Paper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="bg-[#FFFDF6] border-2 border-pink-200 w-full max-w-xl p-8 md:p-12 rounded-3xl shadow-2xl relative select-none max-h-[85vh] overflow-y-auto"
              style={{
                backgroundImage: 'radial-gradient(#fbcfe8 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveLetter(null)}
                className="absolute top-4 right-4 p-2 bg-pink-50 text-pink-500 rounded-full hover:bg-pink-100 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Cute letter stamp or heart top */}
              <div className="flex justify-center mb-6">
                <span className="text-3xl">💌</span>
              </div>

              {/* Subject */}
              <h4 className="font-cute font-bold text-xl md:text-2xl text-pink-600 text-center mb-8 border-b-2 border-pink-100 pb-4">
                Open When {letterTypes.find((l) => l.key === activeLetter)?.title}
              </h4>

              {/* Letter content */}
              <p className="font-handwritten text-2xl md:text-3xl text-gray-700 leading-relaxed whitespace-pre-line text-left px-2">
                {letters?.[activeLetter] || "My dearest, I will always be here for you. Love you! 💗"}
              </p>

              {/* Signature */}
              <div className="mt-12 text-right font-handwritten text-3xl text-pink-500 border-t-2 border-pink-100 pt-6">
                With all my love, 💗
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

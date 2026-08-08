import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMediaUrl } from '../utils/api';
import { Heart, X } from 'lucide-react';

export default function SecretHeart({ secretData }) {
  const [isOpen, setIsOpen] = useState(false);
  const imageUrl = secretData?.image ? getMediaUrl(secretData.image) : null;

  return (
    <>
      {/* Tiny Hidden Heart floating in the page corner/footer area */}
      <div className="py-8 bg-pink-100/10 flex justify-center items-center relative overflow-hidden select-none border-t border-pink-100/50">
        <p className="text-gray-400 text-xs font-sans">
          Made with 💗 for you.
        </p>

        {/* The hidden clickable heart */}
        <button
          onClick={() => setIsOpen(true)}
          className="ml-2 w-4 h-4 text-pink-300/30 hover:text-heart-pink hover:scale-125 transition-all duration-300 cursor-pointer focus:outline-none"
          title="What is this?"
        >
          <Heart className="w-full h-full fill-current" />
        </button>
      </div>

      {/* Secret Message Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-pink-950/20 backdrop-blur-md"
            ></motion.div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white border-2 border-pink-200 w-full max-w-sm p-6 rounded-3xl shadow-2xl relative select-none text-center"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 p-1.5 bg-pink-50 text-pink-500 rounded-full hover:bg-pink-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-4xl mb-2 animate-bounce">💖</div>
              
              <h3 className="font-cute font-bold text-xl text-gray-800 mb-2">
                YOU FOUND THE SECRET ❤️
              </h3>

              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Secret Photo"
                  className="w-full h-44 object-cover rounded-xl border border-pink-100 mb-4"
                />
              ) : (
                <div className="w-full h-12 bg-pink-50 rounded-xl flex items-center justify-center border border-pink-100 mb-4 select-none">
                  <span className="font-handwritten text-pink-500 text-lg">Special Inside Joke 🤫</span>
                </div>
              )}

              <p className="font-handwritten text-2xl text-gray-700 leading-relaxed px-2">
                {secretData?.message || "I love you more than words can say. You're my favorite person!"}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

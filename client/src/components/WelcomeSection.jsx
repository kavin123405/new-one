import React from 'react';
import { motion } from 'framer-motion';
import { getMediaUrl } from '../utils/api';

export default function WelcomeSection({ welcomeData }) {
  const imageUrl = welcomeData?.image ? getMediaUrl(welcomeData.image) : null;

  return (
    <section className="min-h-screen py-16 px-4 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Dynamic background accents */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>

      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-center gap-12 z-10">
        {/* Left Side: Polaroid Card */}
        <motion.div
          initial={{ opacity: 0, x: -50, rotate: -6 }}
          whileInView={{ opacity: 1, x: 0, rotate: -3 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Tape on Polaroid */}
          <div className="tape-effect"></div>
          
          <div className="polaroid-card w-72 md:w-80">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Our Moment"
                className="w-full h-72 md:h-80 object-cover rounded-sm mb-4"
              />
            ) : (
              // Beautiful SVG Illustration of love when no photo is uploaded
              <div className="w-full h-72 md:h-80 bg-pink-100 flex flex-col items-center justify-center rounded-sm mb-4 border border-pink-200">
                <svg
                  className="w-24 h-24 text-heart-pink fill-heart-pink/20 animate-bounce"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
                <span className="font-handwritten text-xl text-pink-500 mt-2">Our Cute Memory</span>
              </div>
            )}
            <div className="text-center font-handwritten text-2xl text-gray-700 mt-2 select-none">
              Together 💗
            </div>
          </div>
        </motion.div>

        {/* Right Side: Message text */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 text-center md:text-left"
        >
          <h2 className="text-3xl md:text-5xl font-cute font-bold text-gray-800 mb-6 leading-tight">
            {welcomeData?.title || "Of all the people I could have met, I'm really happy I met you."}
          </h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-6 font-sans">
            {welcomeData?.text || "I made a tiny corner of the internet just for you. Take your time and explore all the little secrets hidden here. 💗"}
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <span className="px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-semibold select-none">✨ Interactive</span>
            <span className="px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold select-none">🌸 Personalized</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

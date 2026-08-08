import React from 'react';
import { motion } from 'framer-motion';
import { getMediaUrl } from '../utils/api';

export default function MemoriesTimeline({ memories }) {
  if (!memories || memories.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-pink-50 to-purple-50 relative overflow-hidden">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-cute font-bold text-gray-800 mb-3 select-none">
            📸 Our Memories
          </h2>
          <p className="text-gray-500 text-base">
            A little timeline of our beautiful journey together 💗
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-pink-200 z-0" />

          <div className="flex flex-col gap-10">
            {memories.map((memory, index) => {
              const imageUrl = memory.image ? getMediaUrl(memory.image) : null;

              return (
                <motion.div
                  key={memory.id || index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="relative pl-12"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-[9px] top-5 w-4 h-4 rounded-full bg-heart-pink border-4 border-white shadow-md z-10" />

                  {/* Card */}
                  <div className="bg-white rounded-2xl shadow-md border border-pink-100 overflow-hidden">

                    {/* Image area */}
                    {imageUrl ? (
                      <div className="w-full h-64 bg-pink-50 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={memory.title}
                          className="w-full h-full object-cover object-center"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                        <span className="text-5xl">📷</span>
                      </div>
                    )}

                    {/* Text content */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-pink-400 tracking-wide">
                          {memory.date}
                        </span>
                        <span className="text-xs text-gray-300 font-bold">#{index + 1}</span>
                      </div>
                      <h3 className="font-cute font-bold text-lg text-gray-800 mb-1">
                        {memory.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {memory.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

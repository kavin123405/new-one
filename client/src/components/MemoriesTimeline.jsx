import React from 'react';
import { motion } from 'framer-motion';
import { getMediaUrl } from '../utils/api';
import { Calendar, Image, Laugh, Heart, Sparkles } from 'lucide-react';

// Help helper icon selector for placeholders
const getTimelineIcon = (index) => {
  switch (index) {
    case 0: return <Calendar className="w-8 h-8 text-pink-500" />;
    case 1: return <Image className="w-8 h-8 text-purple-500" />;
    case 2: return <Laugh className="w-8 h-8 text-yellow-500" />;
    case 3: return <Heart className="w-8 h-8 text-red-500" />;
    default: return <Sparkles className="w-8 h-8 text-pink-500" />;
  }
};

export default function MemoriesTimeline({ memories }) {
  if (!memories || memories.length === 0) return null;

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-pink-50 to-purple-50 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-cute font-bold text-gray-800 mb-4 select-none">
            📸 Our Memories
          </h2>
          <p className="text-gray-600 text-lg">
            A small timeline of our beautiful journey together. Scroll through our history!
          </p>
        </div>

        <div className="relative border-l-2 border-pink-200 ml-4 md:ml-0 md:left-1/2 md:-translate-x-1/2">
          {memories.map((memory, index) => {
            const isLeft = index % 2 === 0;
            const imageUrl = memory.image ? getMediaUrl(memory.image) : null;
            
            // Rotation styling
            const rotation = `${(index % 2 === 0 ? -2 : 2) * (1 + (index % 3) * 0.5)}deg`;

            return (
              <div
                key={memory.id || index}
                className="mb-16 md:mb-24 relative flex flex-col md:flex-row items-start md:items-center justify-between"
              >
                {/* Timeline node circle */}
                <div className="absolute -left-[9px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-heart-pink rounded-full border-4 border-white shadow-md z-20"></div>

                {/* Timeline content container */}
                <div
                  className={`w-[90%] md:w-[45%] ml-8 md:ml-0 ${
                    isLeft ? 'md:mr-auto md:text-right' : 'md:ml-auto md:text-left'
                  }`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="inline-block text-left w-full"
                  >
                    <div 
                      className="polaroid-card mx-auto md:mx-0 cursor-pointer"
                      style={{ '--rotation': rotation }}
                    >
                      {/* Tape effect */}
                      <div className="tape-effect"></div>

                      {imageUrl ? (
                        <div className="w-full aspect-[3/4] overflow-hidden rounded-sm mb-4 bg-pink-50/20 border border-pink-100/10 flex items-center justify-center">
                          <img
                            src={imageUrl}
                            alt={memory.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-full aspect-[3/4] bg-pink-50 flex flex-col items-center justify-center rounded-sm mb-4 border border-pink-100/50">
                          {getTimelineIcon(index)}
                          <span className="font-handwritten text-lg text-pink-400 mt-2">Memory #{index + 1}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                        <span className="font-bold">{memory.date}</span>
                        <span>#{index + 1}</span>
                      </div>
                      
                      <h3 className="font-cute font-bold text-lg text-gray-800 mb-2">
                        {memory.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {memory.description}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

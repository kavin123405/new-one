import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getMediaUrl } from '../utils/api';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2 } from 'lucide-react';

export default function PlaylistPlayer({ playlist }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 240; // Simulated track duration (4 minutes)

  const tracks = playlist && playlist.length > 0 ? playlist : [
    {
      id: "1",
      title: "Perfect",
      artist: "Ed Sheeran",
      url: "https://youtu.be/2Vv-BfVoq4g?si=O7-tHfHjytmGK50_"
    }
  ];

  const currentTrack = tracks[currentTrackIndex];

  // Simulated progress bar updates
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime >= duration) {
            return 0;
          }
          return prevTime + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Toggle play state locally when clicking play button
  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  // Next Track
  const handleNext = () => {
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIdx);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  // Previous Track
  const handlePrev = () => {
    const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIdx);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  // Handle simulated progress change
  const handleProgressChange = (e) => {
    setCurrentTime(parseFloat(e.target.value));
  };

  // Format time (MM:SS)
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-pink-50 to-purple-50 flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-md w-full glass-card p-6 rounded-3xl border border-pink-100 shadow-xl flex flex-col items-center relative overflow-hidden">
        
        <div className="text-center mb-6">
          <h2 className="text-3xl font-cute font-bold text-gray-800 mb-1 select-none flex items-center justify-center gap-2">
            🎧 Our Playlist
          </h2>
          <p className="text-gray-500 text-sm">
            Songs that always remind me of you.
          </p>
        </div>

        {/* Cassette Graphic Container */}
        <div className="w-full bg-[#fca5a5]/10 rounded-2xl p-4 border border-red-200/50 mb-6 flex flex-col items-center">
          {/* Cassette Card */}
          <div className="w-full aspect-[1.6/1] bg-gradient-to-tr from-gray-700 to-gray-800 rounded-xl p-4 shadow-xl border border-gray-600 relative overflow-hidden flex flex-col justify-between">
            {/* Cassette Label sticker - native link */}
            <a 
              href={currentTrack?.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsPlaying(true)}
              className="w-full h-1/2 bg-pink-100 rounded-md border-b-4 border-purple-200 p-2 flex flex-col justify-between relative cursor-pointer hover:bg-pink-200/70 transition-colors block decoration-none"
              title="Click to play on YouTube"
            >
              <div className="absolute top-1 left-2 text-[8px] font-bold text-gray-400 select-none">SIDE A</div>
              <div className="text-center text-xs font-cute font-bold text-pink-600 truncate px-4 mt-2">
                {currentTrack?.title}
              </div>
              <div className="text-center text-[10px] font-sans text-purple-500 truncate px-4">
                {currentTrack?.artist}
              </div>
            </a>

            {/* Tape Wheels - native link */}
            <a 
              href={currentTrack?.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsPlaying(true)}
              className="w-full flex justify-around items-center px-8 h-10 mt-2 relative cursor-pointer block"
              title="Click to play on YouTube"
            >
              {/* Wheel 1 */}
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                className="w-10 h-10 rounded-full border-4 border-gray-500 bg-gray-900 flex items-center justify-center relative"
              >
                <div className="w-4 h-4 rounded-full border-2 border-white/20"></div>
                <div className="absolute w-1 h-3 bg-gray-500 top-0"></div>
                <div className="absolute w-1 h-3 bg-gray-500 bottom-0"></div>
              </motion.div>

              {/* Window */}
              <div className="w-16 h-6 bg-gray-900/80 rounded border border-gray-600 flex items-center justify-center text-[8px] text-yellow-400 font-mono select-none">
                {formatTime(currentTime)}
              </div>

              {/* Wheel 2 */}
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                className="w-10 h-10 rounded-full border-4 border-gray-500 bg-gray-900 flex items-center justify-center relative"
              >
                <div className="w-4 h-4 rounded-full border-2 border-white/20"></div>
                <div className="absolute w-1 h-3 bg-gray-500 top-0"></div>
                <div className="absolute w-1 h-3 bg-gray-500 bottom-0"></div>
              </motion.div>
            </a>

            {/* Bottom details */}
            <div className="text-[6px] text-gray-500 text-center font-sans tracking-widest mt-1 select-none">
              MICRO CASSETTE TAPE MC-60
            </div>
          </div>
        </div>

        {/* Custom audio controls */}
        <div className="w-full px-2 mb-6">
          {/* Progress bar */}
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full accent-pink-400 h-1.5 bg-pink-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-gray-400 mt-1 select-none">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center items-center gap-6 mb-6">
          <button
            onClick={handlePrev}
            className="p-3 bg-pink-50 hover:bg-pink-100 text-pink-500 rounded-full shadow-xs cursor-pointer transition-transform hover:scale-105"
            title="Previous track"
          >
            <SkipBack className="w-5 h-5 fill-pink-500/20" />
          </button>
          
          {/* Play button - native link */}
          <a
            href={currentTrack?.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handlePlayToggle}
            className="p-5 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-50 hover:to-purple-50 text-white rounded-full shadow-md cursor-pointer transition-transform hover:scale-105 flex items-center justify-center"
            title="Play on YouTube"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
          </a>
          
          <button
            onClick={handleNext}
            className="p-3 bg-pink-50 hover:bg-pink-100 text-pink-500 rounded-full shadow-xs cursor-pointer transition-transform hover:scale-105"
            title="Next track"
          >
            <SkipForward className="w-5 h-5 fill-pink-500/20" />
          </button>
        </div>

        {/* Track List */}
        <div className="w-full border-t border-pink-100/50 pt-4 flex flex-col gap-2 max-h-40 overflow-y-auto font-sans">
          {tracks.map((track, idx) => (
            <a
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(idx);
                setIsPlaying(true);
                setCurrentTime(0);
              }}
              className={`flex items-center justify-between p-2 rounded-xl text-sm cursor-pointer transition-colors decoration-none ${
                currentTrackIndex === idx
                  ? 'bg-pink-100/60 text-pink-600 font-semibold'
                  : 'hover:bg-pink-50/40 text-gray-600'
              }`}
              title="Click to play on YouTube"
            >
              <div className="flex items-center gap-2 truncate">
                <Music className="w-4 h-4 shrink-0 text-pink-400" />
                <span className="truncate">{track.title}</span>
              </div>
              <span className="text-[10px] text-gray-400 shrink-0 font-sans italic">{track.artist}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getConfig } from './utils/api';
import ValentineScreen from './components/ValentineScreen';
import OpeningScreen from './components/OpeningScreen';
import WelcomeSection from './components/WelcomeSection';
import MemoriesTimeline from './components/MemoriesTimeline';
import OpenWhenLetters from './components/OpenWhenLetters';
import MysteryGift from './components/MysteryGift';
import HeartGame from './components/HeartGame';
import PlaylistPlayer from './components/PlaylistPlayer';
import AppreciationCards from './components/AppreciationCards';
import StarrySky from './components/StarrySky';
import EndingScreen from './components/EndingScreen';
import SecretHeart from './components/SecretHeart';
import AdminDashboard from './admin/AdminDashboard';
import { Heart } from 'lucide-react';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [acceptedValentine, setAcceptedValentine] = useState(false);

  // Check route on mount & location change
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  // Fetch configuration
  useEffect(() => {
    async function loadConfig() {
      try {
        const data = await getConfig();
        setConfig(data);
      } catch (err) {
        console.error("Failed to load config details", err);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-50 via-purple-50 to-pink-100">
        <div className="text-center font-sans text-gray-500">
          <Heart className="w-12 h-12 text-heart-pink fill-heart-pink/30 animate-bounce mx-auto mb-4" />
          <p className="font-semibold text-pink-600">Unfolding Your surprise...</p>
        </div>
      </div>
    );
  }

  // If URL path is /admin, render Admin Panel
  if (isAdmin) {
    return <AdminDashboard />;
  }

  // Render client surprise site
  return (
    <div className="min-h-screen relative bg-gradient-to-b from-[#FFFDF9] via-pink-50/20 to-[#FFFDF9] overflow-x-hidden">
      
      {/* 1. Opening screen overlay */}
      <AnimatePresence mode="wait">
        {!acceptedValentine ? (
          <ValentineScreen 
            partnerName={config?.partnerName || "Sweetheart"} 
            onAccept={() => setAcceptedValentine(true)} 
          />
        ) : !isOpen ? (
          <OpeningScreen 
            partnerName={config?.partnerName || "Sweetheart"} 
            onOpen={() => setIsOpen(true)} 
          />
        ) : null}
      </AnimatePresence>

      {/* 2. Main content pages */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full flex flex-col"
        >
          {/* Welcome section */}
          <WelcomeSection welcomeData={config?.welcome} />

          {/* Memories Timeline */}
          <MemoriesTimeline memories={config?.memories} />

          {/* Open When Letters */}
          <OpenWhenLetters letters={config?.letters} />

          {/* Mystery Gift Box */}
          <MysteryGift giftData={config?.mysteryGift} />

          {/* Catch Hearts Mini Game */}
          <HeartGame />

          {/* Cassette / Vinyl Playlist */}
          <PlaylistPlayer playlist={config?.playlist} />

          {/* Appreciation swipe cards */}
          <AppreciationCards appreciations={config?.appreciations} />

          {/* Starry Night interactive canvas */}
          <StarrySky stars={config?.stars} />

          {/* Fireworks / Confetti conclusion */}
          <EndingScreen />

          {/* Secret heart in the footer */}
          <SecretHeart secretData={config?.secret} />
        </motion.div>
      )}
    </div>
  );
}

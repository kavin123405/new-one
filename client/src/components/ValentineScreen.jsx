import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ValentineScreen({ partnerName, onAccept }) {
  const [particles, setParticles] = useState([]);
  const [escapeCount, setEscapeCount] = useState(0);
  const [noButtonText, setNoButtonText] = useState('No 💔');
  const [position, setPosition] = useState({ isFixed: false, x: 0, y: 0 });
  const [isAccepted, setIsAccepted] = useState(false);
  const [isSad, setIsSad] = useState(false);
  const [sadMessage, setSadMessage] = useState('Choose wisely... (There is only one correct answer! 💕)');
  const [floatingSads, setFloatingSads] = useState([]);
  const [toastText, setToastText] = useState(null);
  const [toastTimeoutId, setToastTimeoutId] = useState(null);
  
  const noButtonRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    // Generate floating hearts/stars background
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

  // Clean up toast timeout on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutId) clearTimeout(toastTimeoutId);
    };
  }, [toastTimeoutId]);

  // Helper to get a random position relative to the card container
  const getSafeRandomPosition = (cursorX, cursorY) => {
    if (!cardRef.current) return { x: 0, y: 0 };

    const cardRect = cardRef.current.getBoundingClientRect();
    const btnWidth = noButtonRef.current ? noButtonRef.current.offsetWidth : 100;
    const btnHeight = noButtonRef.current ? noButtonRef.current.offsetHeight : 40;
    const padding = 20; // Safe distance from card edges

    // Max X & Y coordinates inside the card container
    const maxX = cardRect.width - btnWidth - padding;
    const maxY = cardRect.height - btnHeight - padding;

    let newX = 0;
    let newY = 0;
    let distance = 0;
    let attempts = 0;

    // Cursor position relative to the card
    const refX = cursorX ? (cursorX - cardRect.left) : cardRect.width / 2;
    const refY = cursorY ? (cursorY - cardRect.top) : cardRect.height / 2;

    // Minimum distance from cursor (relative to card dimensions)
    const minDistance = Math.min(100, Math.min(cardRect.width, cardRect.height) * 0.3);

    do {
      newX = padding + Math.random() * (maxX - padding);
      newY = padding + Math.random() * (maxY - padding);
      
      const dx = newX + btnWidth / 2 - refX;
      const dy = newY + btnHeight / 2 - refY;
      distance = Math.hypot(dx, dy);
      attempts++;
    } while (distance < minDistance && attempts < 50);

    return { x: newX, y: newY };
  };

  const triggerJump = (cursorX, cursorY) => {
    let spawnX = cursorX ?? window.innerWidth / 2;
    let spawnY = cursorY ?? window.innerHeight / 2;

    if (noButtonRef.current) {
      const rect = noButtonRef.current.getBoundingClientRect();
      spawnX = rect.left + rect.width / 2 - 12; 
      spawnY = rect.top;
    }

    // Spawn floating sad particle
    const sadEmojis = ['💔', '😢', '😭', '🥺', '😿'];
    const newSad = {
      id: Date.now() + Math.random(),
      x: spawnX,
      y: spawnY,
      emoji: sadEmojis[Math.floor(Math.random() * sadEmojis.length)]
    };
    
    setFloatingSads((prev) => [...prev, newSad]);
    setTimeout(() => {
      setFloatingSads((prev) => prev.filter((p) => p.id !== newSad.id));
    }, 1200);

    // Calculate new position strictly inside the card
    const nextPos = getSafeRandomPosition(cursorX, cursorY);
    setPosition({ isFixed: true, x: nextPos.x, y: nextPos.y });
    setEscapeCount((prev) => prev + 1);
    setIsSad(true);

    // Set sad card message
    const sadPleas = [
      "Don't break my heart... 💔",
      "Why not? 🥺",
      "Please say yes... 😢",
      "Is that your final answer? 😭",
      "But we make such a good team! 🧸",
      "My heart is crying... 💔",
      "Pretty please? 👉👈",
      "No is not allowed! 😭",
      "You're breaking my heart... 🥀",
      "I'll be so sad... 😿"
    ];
    const pleaIndex = Math.min(escapeCount, sadPleas.length - 1);
    setSadMessage(sadPleas[pleaIndex]);

    // Show temporary screen toast message
    const toastMessages = [
      "Why are you trying to click No? 😭",
      "That button is broken, try the YES button! 😉",
      "Error: 'No' is not a valid choice! ❌",
      "Access Denied: Clicking No is strictly prohibited! 🔒",
      "My heart says please click YES! 🥺",
      "Rejection is not in the system code! 💔",
      "Come on, click YES already! 💕",
      "Nice try, but No is off limits! 😂"
    ];
    const randomToast = toastMessages[Math.floor(Math.random() * toastMessages.length)];
    setToastText(randomToast);

    // Reset/Set timeout to clear toast
    if (toastTimeoutId) clearTimeout(toastTimeoutId);
    const newTimeoutId = setTimeout(() => setToastText(null), 2000);
    setToastTimeoutId(newTimeoutId);

    // Update No button text funny messages
    const messages = [
      "No 💔",
      "Are you sure? 🥺",
      "Think again! 💖",
      "Try clicking YES! 👉",
      "Nice try! 😂",
      "Error: Option disabled 🚫",
      "Nope! 💅",
      "Pretty please? 🧸",
      "You can't catch me! 🏃‍♂️",
      "No is not an option! ❤️",
      "Just click Yes already! 😘",
      "Give up! 😉"
    ];
    const textIndex = Math.min(escapeCount + 1, messages.length - 1);
    setNoButtonText(messages[textIndex]);
  };

  // Mouse proximity tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!noButtonRef.current) return;
      const rect = noButtonRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

      // Trigger jump if cursor gets within 100px of the button
      if (distance < 100) {
        triggerJump(e.clientX, e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [position, escapeCount]);

  const handleYesClick = () => {
    setIsAccepted(true);
    
    // Confetti shower effects
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;
    
    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff85a2', '#ffccd5', '#ff4d6d', '#ff0a54', '#f3e8ff']
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff85a2', '#ffccd5', '#ff4d6d', '#ff0a54', '#f3e8ff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff85a2', '#ffccd5', '#ff4d6d', '#ff0a54', '#f3e8ff']
    });

    setTimeout(() => {
      onAccept();
    }, 2000);
  };

  // Resets the sad state back to happy when user hovers over YES button
  const handleYesMouseEnter = () => {
    setIsSad(false);
    setSadMessage("Yes! That's the correct answer! 💕");
  };

  const yesScale = Math.min(1 + escapeCount * 0.2, 3.5);

  // Position is absolute relative to card container
  const noBtnStyle = position.isFixed
    ? {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 20,
        margin: 0,
      }
    : {};

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-tr from-pink-100 via-purple-50 to-pink-50 overflow-hidden select-none">
      {/* Floating background particles */}
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

      {/* Floating sad particles when user hovers or taps No */}
      <AnimatePresence>
        {floatingSads.map((sad) => (
          <motion.span
            key={sad.id}
            initial={{ opacity: 1, scale: 0.8, x: sad.x, y: sad.y }}
            animate={{ opacity: 0, y: sad.y - 120, scale: 1.4, rotate: Math.random() * 40 - 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="fixed text-3xl pointer-events-none z-[1001] select-none"
          >
            {sad.emoji}
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Toast notifications for sad alerts */}
      <AnimatePresence>
        {toastText && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="fixed bottom-8 bg-zinc-900/90 text-white px-6 py-3 rounded-full shadow-lg z-50 text-sm md:text-base font-cute flex items-center gap-2 border border-zinc-700/50 backdrop-blur-md"
          >
            <span>🥺</span> {toastText}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isAccepted ? (
          <motion.div
            ref={cardRef}
            key="question-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -50 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="glass-card max-w-md w-[90%] p-8 rounded-3xl text-center shadow-xl border border-pink-200/50 flex flex-col items-center relative overflow-hidden"
          >
            {/* Ambient glows */}
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-pink-300 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-purple-300 rounded-full blur-3xl opacity-30"></div>

            {/* Top Icon stateful transitions */}
            <AnimatePresence mode="wait">
              {!isSad ? (
                <motion.div
                  key="happy-heart"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: [1, 1.15, 1], rotate: 0 }}
                  exit={{ scale: 0, rotate: 30 }}
                  transition={{ 
                    scale: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
                    default: { duration: 0.3 }
                  }}
                  className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6 shadow-inner"
                >
                  <Heart className="w-8 h-8 text-heart-pink fill-heart-pink" />
                </motion.div>
              ) : (
                <motion.div
                  key="sad-face"
                  initial={{ scale: 0, rotate: 30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -30 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 shadow-inner"
                >
                  <span className="text-3xl">🥺</span>
                </motion.div>
              )}
            </AnimatePresence>

            <h1 className="text-3xl md:text-4xl font-cute font-bold text-gray-800 mb-4 px-2 leading-tight">
              YOU WILL BE MY VALENTINE? 💖🥺👉👈
            </h1>

            <p className="text-gray-600 text-base mb-10 leading-relaxed font-sans min-h-[48px] px-4">
              {sadMessage}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full relative min-h-[85px] px-2">
              {/* YES Button */}
              <motion.button
                style={{ scale: yesScale }}
                whileHover={{ scale: yesScale * 1.05 }}
                whileTap={{ scale: yesScale * 0.95 }}
                onClick={handleYesClick}
                onMouseEnter={handleYesMouseEnter}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-cute font-bold text-lg rounded-full shadow-lg shadow-pink-300/40 hover:from-pink-500 hover:to-purple-500 transition-all cursor-pointer z-10"
              >
                Yes! 💖 <Sparkles className="w-5 h-5 animate-pulse" />
              </motion.button>

              {/* NO Button */}
              <motion.button
                ref={noButtonRef}
                style={noBtnStyle}
                animate={position.isFixed ? { x: 0, y: 0 } : {}}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                onMouseEnter={(e) => triggerJump(e.clientX, e.clientY)}
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  triggerJump(touch.clientX, touch.clientY);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  triggerJump(e.clientX, e.clientY);
                }}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-cute font-bold text-base rounded-full border border-gray-200 shadow-md transition-colors cursor-pointer select-none"
              >
                {noButtonText}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center text-center p-8 z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
              className="text-8xl mb-6 select-none"
            >
              💖
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-cute font-bold text-pink-600 mb-4 animate-bounce">
              YAY! 🎉
            </h2>
            <p className="text-gray-700 text-xl font-handwritten font-bold max-w-sm">
              I knew you would say yes! Let's see what else I've prepared for you... 💕
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

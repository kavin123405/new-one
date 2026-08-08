import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Sparkles, X, Heart, Plus, Paintbrush, 
  Trash2, Compass, Check, Volume2, VolumeX, AlertCircle 
} from 'lucide-react';

export default function StarrySky({ stars }) {
  const [activeStarIdx, setActiveStarIdx] = useState(null);
  const [activeCustomStar, setActiveCustomStar] = useState(null);
  const [customStars, setCustomStars] = useState([]);
  const [isPlacingStar, setIsPlacingStar] = useState(false);
  const [showWishInput, setShowWishInput] = useState(false);
  const [newStarCoords, setNewStarCoords] = useState(null);
  const [wishText, setWishText] = useState("");
  
  // Constellation mode states
  const [constellationMode, setConstellationMode] = useState(false);
  const [constellationProgress, setConstellationProgress] = useState(0);
  const [constellationComplete, setConstellationComplete] = useState(false);
  const [showConstellationModal, setShowConstellationModal] = useState(false);

  // Sound effects & particle states
  const [soundOn, setSoundOn] = useState(true);
  const [enableTrails, setEnableTrails] = useState(true);
  const [activeFortune, setActiveFortune] = useState(null);

  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const shootingStarRef = useRef(null);

  const starMessages = stars && stars.length > 0 ? stars : [
    "One thing I admire about you... Your boundless empathy and how deeply you care for everyone around you.",
    "A memory that still makes me smile... The time we got caught in the rain and ended up laughing instead of running.",
    "Something I hope you achieve... All your big dreams in your career, because you deserve it more than anyone.",
    "Something I never want you to forget... That you are loved exactly for who you are, every single day."
  ];

  // Default hardcoded stars
  const clickableStars = [
    { id: 0, top: '22%', left: '20%', delay: 0 },
    { id: 1, top: '38%', left: '78%', delay: 0.5 },
    { id: 2, top: '65%', left: '18%', delay: 1.0 },
    { id: 3, top: '76%', left: '74%', delay: 1.5 },
  ];

  // Constellation nodes (forming a beautiful heart shape)
  const constellationStars = [
    { id: 0, top: '42%', left: '50%', note: 261.63, name: 'Core' },       // C4 (Dip)
    { id: 1, top: '33%', left: '42%', note: 293.66, name: 'L-Shoulder' }, // D4
    { id: 2, top: '44%', left: '32%', note: 329.63, name: 'L-Wing' },     // E4
    { id: 3, top: '56%', left: '33%', note: 349.23, name: 'L-Base' },     // F4
    { id: 4, top: '74%', left: '50%', note: 392.00, name: 'Tip' },        // G4 (Bottom point)
    { id: 5, top: '56%', left: '67%', note: 440.00, name: 'R-Base' },     // A4
    { id: 6, top: '44%', left: '68%', note: 493.88, name: 'R-Wing' },     // B4
    { id: 7, top: '33%', left: '58%', note: 523.25, name: 'R-Shoulder' }, // C5
  ];

  // Love Fortunes for shooting stars
  const fortunes = [
    "Make a wish! Your dreams are valid, beautiful, and within reach. ✨",
    "A day with you is always full of warmth, laughter, and magic. 💖",
    "Your smile is brighter than any star in this vast dark galaxy. 😊⭐",
    "Remember that you are deeply loved, cherished, and appreciated, every single day.",
    "The universe is aligned to bring you happiness, comfort, and peace today. 🌌",
    "You are a rare and precious spark in this night sky. Never stop shining! 💫",
    "A wonderful surprise is heading your way. Keep your heart and eyes open. 💗"
  ];

  // Load custom stars from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('my_starry_sky_wishes');
      if (saved) {
        setCustomStars(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load wishes from localStorage", e);
    }
  }, []);

  // Web Audio API Synthesizer
  const playChime = (freq, type = 'sine', duration = 1.2) => {
    if (!soundOn) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      // Harmonic frequency for a rich, celestial chime feel
      const osc2 = ctx.createOscillator();
      const gainNode2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 1.5, ctx.currentTime); // Perfect fifth
      
      // Envelope configs
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      
      gainNode2.gain.setValueAtTime(0.07, ctx.currentTime);
      gainNode2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration * 0.7);
      
      osc.connect(gainNode);
      osc2.connect(gainNode2);
      
      gainNode.connect(ctx.destination);
      gainNode2.connect(ctx.destination);
      
      osc.start();
      osc2.start();
      osc.stop(ctx.currentTime + duration);
      osc2.stop(ctx.currentTime + duration);
    } catch (e) {
      console.error("Web Audio API failed", e);
    }
  };

  const playSuccessArpeggio = () => {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => playChime(freq, 'sine', 1.6), idx * 120);
    });
  };

  // Canvas drawing effect (Nebula backdrop, stars drifting, particle trails, shooting star)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize 80 drifting stars
    const starsArray = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * 600,
      radius: Math.random() * 1.6 + 0.4,
      alpha: Math.random(),
      speed: Math.random() * 0.015 + 0.005,
    }));

    const drawHeartShape = (ctx, x, y, size) => {
      ctx.beginPath();
      const topY = y - size / 2;
      ctx.moveTo(x, topY + size / 4);
      ctx.quadraticCurveTo(x - size / 2, topY, x - size / 2, topY + size / 3);
      ctx.quadraticCurveTo(x - size / 2, topY + size * 2/3, x, y + size / 2);
      ctx.quadraticCurveTo(x + size / 2, topY + size * 2/3, x + size / 2, topY + size / 3);
      ctx.quadraticCurveTo(x + size / 2, topY, x, topY + size / 4);
      ctx.closePath();
      ctx.fill();
    };

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      // 1. Draw core space black backdrop
      ctx.fillStyle = '#0b0f19';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw shifting colorful cosmic nebula clouds
      const time = Date.now() * 0.00015;
      
      // Purple nebula
      const nebula1X = width * (0.3 + Math.sin(time) * 0.08);
      const nebula1Y = height * (0.45 + Math.cos(time * 0.9) * 0.06);
      const radius1 = Math.max(width, height) * 0.5;
      const g1 = ctx.createRadialGradient(nebula1X, nebula1Y, 0, nebula1X, nebula1Y, radius1);
      g1.addColorStop(0, 'rgba(88, 28, 135, 0.22)'); // purple-900
      g1.addColorStop(0.5, 'rgba(67, 56, 202, 0.08)'); // indigo-700
      g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      // Dark Pink/Rose nebula
      const nebula2X = width * (0.7 + Math.cos(time * 0.7) * 0.08);
      const nebula2Y = height * (0.55 + Math.sin(time * 0.8) * 0.07);
      const radius2 = Math.max(width, height) * 0.45;
      const g2 = ctx.createRadialGradient(nebula2X, nebula2Y, 0, nebula2X, nebula2Y, radius2);
      g2.addColorStop(0, 'rgba(190, 24, 74, 0.14)'); // rose-700
      g2.addColorStop(0.5, 'rgba(124, 58, 237, 0.05)'); // violet-600
      g2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      // 3. Draw drifting background stars (dimmed during active constellation drawing)
      const starDimmer = constellationMode ? 0.35 : 1.0;
      starsArray.forEach((s) => {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) {
          s.speed = -s.speed;
        }

        // Subtly track mouse position for interactive parallax drift
        let parallaxX = 0;
        let parallaxY = 0;
        if (mouseRef.current.active) {
          parallaxX = (mouseRef.current.x - width / 2) * (s.radius * 0.012);
          parallaxY = (mouseRef.current.y - height / 2) * (s.radius * 0.012);
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, s.alpha)) * starDimmer})`;
        ctx.beginPath();
        ctx.arc(s.x + parallaxX, s.y + parallaxY, s.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Update and draw shooting star
      if (!shootingStarRef.current && Math.random() < 0.003) {
        shootingStarRef.current = {
          x: Math.random() * (width * 0.6),
          y: Math.random() * (height * 0.2),
          length: Math.random() * 60 + 50,
          speed: Math.random() * 4 + 5,
          angle: Math.PI / 6 + Math.random() * (Math.PI / 12), // 30-45 degrees
          alpha: 1.0,
        };
      }

      if (shootingStarRef.current) {
        const ss = shootingStarRef.current;
        const dx = Math.cos(ss.angle) * ss.speed;
        const dy = Math.sin(ss.angle) * ss.speed;
        ss.x += dx;
        ss.y += dy;

        // Draw tail
        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const grad = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
        grad.addColorStop(0, `rgba(253, 224, 71, ${ss.alpha})`);
        grad.addColorStop(0.3, `rgba(251, 113, 133, ${ss.alpha * 0.8})`);
        grad.addColorStop(1, 'rgba(253, 224, 71, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Clear when it drifts offscreen
        if (ss.x > width + 100 || ss.y > height + 100) {
          shootingStarRef.current = null;
        }
      }

      // 5. Draw Constellation lines (if constellation mode is enabled)
      if (constellationMode) {
        // Faint guide outlines
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(244, 114, 182, 0.18)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        constellationStars.forEach((star, idx) => {
          const x = (parseFloat(star.left) / 100) * width;
          const y = (parseFloat(star.top) / 100) * height;
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        const closeX = (parseFloat(constellationStars[0].left) / 100) * width;
        const closeY = (parseFloat(constellationStars[0].top) / 100) * height;
        ctx.lineTo(closeX, closeY);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash

        // Solid, glowing completed connections
        if (constellationProgress > 0) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(244, 114, 182, 0.7)';
          ctx.strokeStyle = 'rgba(244, 114, 182, 0.8)';
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();

          // How far to draw
          const limit = constellationComplete ? constellationStars.length : constellationProgress;
          for (let i = 0; i <= limit; i++) {
            const idx = i === constellationStars.length ? 0 : i;
            const star = constellationStars[idx];
            const x = (parseFloat(star.left) / 100) * width;
            const y = (parseFloat(star.top) / 100) * height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.shadowBlur = 0; // Reset canvas shadows
        }
      }

      // 6. Draw mouse interactive stardust sparkles
      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(idx, 1);
        } else {
          ctx.fillStyle = `${p.color}${p.alpha})`;
          if (p.isHeart) {
            drawHeartShape(ctx, p.x, p.y, p.size * 2);
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [constellationMode, constellationProgress, constellationComplete]);

  // Click Canvas handler (Detect shooting star clicks or star placement clicks)
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // 1. Check if shooting star clicked
    if (shootingStarRef.current) {
      const ss = shootingStarRef.current;
      const distance = Math.hypot(clickX - ss.x, clickY - ss.y);
      if (distance < 50) { // Catch click area
        triggerBurstEffect(ss.x, ss.y);
        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        setActiveFortune(randomFortune);
        shootingStarRef.current = null;
        return;
      }
    }

    // 2. Place Custom Star Mode
    if (isPlacingStar) {
      const pctX = ((clickX / canvas.width) * 100).toFixed(1) + '%';
      const pctY = ((clickY / canvas.height) * 100).toFixed(1) + '%';
      setNewStarCoords({ top: pctY, left: pctX });
      setShowWishInput(true);
      setIsPlacingStar(false);
      playChime(880.00, 'sine', 0.6); // A5 placement note
    }
  };

  const triggerBurstEffect = (x, y) => {
    playSuccessArpeggio();
    // Burst stardust hearts
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.3,
        alpha: 1.0,
        decay: Math.random() * 0.015 + 0.008,
        size: Math.random() * 3 + 2.5,
        isHeart: Math.random() < 0.6,
        color: Math.random() < 0.5 ? 'rgba(253, 224, 71, ' : 'rgba(244, 114, 182, '
      });
    }
  };

  // Mouse move handlers
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current = { x, y, active: true };

    if (enableTrails && Math.random() < 0.25) {
      // Spawn stardust trails
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: Math.random() * 0.6 + 0.2, // float downwards
        alpha: 0.9,
        decay: Math.random() * 0.015 + 0.01,
        size: Math.random() * 1.5 + 0.8,
        isHeart: false,
        color: Math.random() < 0.6 ? 'rgba(253, 224, 71, ' : 'rgba(165, 180, 252, ' // yellow/lavender
      });
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  // Plant custom star
  const handleAddWish = () => {
    if (!wishText.trim() || !newStarCoords) return;

    const newStar = {
      id: Date.now(),
      top: newStarCoords.top,
      left: newStarCoords.left,
      message: wishText
    };

    const updated = [...customStars, newStar];
    setCustomStars(updated);
    localStorage.setItem('my_starry_sky_wishes', JSON.stringify(updated));

    // Twinkle trigger at placement spot
    const canvas = canvasRef.current;
    if (canvas) {
      const x = (parseFloat(newStar.left) / 100) * canvas.width;
      const y = (parseFloat(newStar.top) / 100) * canvas.height;
      triggerBurstEffect(x, y);
    }

    setWishText("");
    setNewStarCoords(null);
    setShowWishInput(false);
  };

  // Delete custom star wish
  const handleDeleteCustomStar = (id) => {
    const updated = customStars.filter(s => s.id !== id);
    setCustomStars(updated);
    localStorage.setItem('my_starry_sky_wishes', JSON.stringify(updated));
    setActiveCustomStar(null);
    // Play falling star note
    playChime(329.63, 'sawtooth', 0.6); // low chime
  };

  // Constellation game logic
  const handleConstellationClick = (idx) => {
    if (constellationComplete) return;

    // Check if clicking in sequence
    if (idx === constellationProgress) {
      const star = constellationStars[idx];
      playChime(star.note, 'sine', 1.0);

      // Light up next or complete
      if (idx === constellationStars.length - 1) {
        // Complete!
        setConstellationComplete(true);
        setConstellationProgress(constellationStars.length);
        
        // Success animation
        const canvas = canvasRef.current;
        if (canvas) {
          triggerBurstEffect(canvas.width / 2, canvas.height * 0.5);
        }
        setTimeout(() => {
          setShowConstellationModal(true);
        }, 1000);
      } else {
        setConstellationProgress(idx + 1);
      }
    } else {
      // Wrong note warning
      playChime(150, 'triangle', 0.3);
    }
  };

  const resetConstellation = () => {
    setConstellationProgress(0);
    setConstellationComplete(false);
    playChime(440, 'sine', 0.5);
  };

  const handleToggleConstellation = () => {
    setConstellationMode(!constellationMode);
    // Reset state when toggling
    setConstellationProgress(0);
    setConstellationComplete(false);
    playChime(587.33, 'sine', 0.6); // D5 mode transition chime
  };

  return (
    <section className="relative w-full h-[620px] overflow-hidden select-none bg-slate-900 border-t border-b border-purple-950/20">
      {/* Top ambient cover lighting */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none z-10" />

      {/* Main Canvas */}
      <canvas 
        ref={canvasRef} 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleCanvasClick}
        className={`absolute inset-0 w-full h-full block z-0 ${isPlacingStar ? 'cursor-cell' : 'cursor-default'}`} 
      />

      {/* Floating Instructions/Notifications */}
      <AnimatePresence>
        {isPlacingStar && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-32 left-1/2 -translate-x-1/2 z-20 bg-cyan-950/90 border border-cyan-400/40 text-cyan-200 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs font-semibold backdrop-blur-md"
          >
            <AlertCircle className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span>Click anywhere in the sky to plant your twinkling star</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Header */}
      <div className="absolute top-8 left-0 right-0 text-center z-10 px-4 pointer-events-none">
        <h2 className="text-3xl md:text-4xl font-cute font-bold text-white mb-2 flex items-center justify-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          🌌 Starry Night Sky
        </h2>
        <p className="text-purple-200 text-xs md:text-sm font-sans font-medium drop-shadow-md">
          {constellationMode 
            ? "Connect the constellation stars in order to draw the link..." 
            : "Click the big glowing stars to reveal messages. Catch any shooting star that streaks past!"}
        </p>
      </div>

      {/* 1. Default Glowing Stars (Hidden in Constellation mode) */}
      {!constellationMode && clickableStars.map((star) => (
        <motion.button
          key={star.id}
          style={{ top: star.top, left: star.left }}
          className="absolute z-20 cursor-pointer focus:outline-none -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: [1, 1.25, 1] }}
          viewport={{ once: true }}
          transition={{
            opacity: { duration: 1, delay: star.delay },
            scale: { repeat: Infinity, duration: 4, ease: 'easeInOut', delay: star.delay }
          }}
          onClick={() => {
            setActiveStarIdx(star.id);
            playChime(523.25, 'sine', 1.0); // C5 chime
          }}
        >
          <div className="relative flex items-center justify-center group">
            <Star className="w-7 h-7 text-yellow-200 fill-yellow-200 filter drop-shadow-[0_0_12px_rgba(253,224,71,0.9)] transition-transform group-hover:scale-125" />
            <span className="absolute w-12 h-12 rounded-full bg-yellow-300/15 blur-sm animate-ping"></span>
          </div>
        </motion.button>
      ))}

      {/* 2. Custom Wishes Stars (Hidden in Constellation mode) */}
      {!constellationMode && customStars.map((star) => (
        <motion.button
          key={star.id}
          style={{ top: star.top, left: star.left }}
          className="absolute z-20 cursor-pointer focus:outline-none -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: [1, 1.15, 1] }}
          transition={{
            scale: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }
          }}
          onClick={() => {
            setActiveCustomStar(star);
            playChime(587.33, 'sine', 0.9); // D5 chime
          }}
        >
          <div className="relative flex items-center justify-center group">
            <Star className="w-5 h-5 text-cyan-200 fill-cyan-200 filter drop-shadow-[0_0_10px_rgba(34,211,238,0.9)] transition-transform group-hover:scale-125" />
            <span className="absolute w-10 h-10 rounded-full bg-cyan-300/20 blur-xs animate-pulse"></span>
          </div>
        </motion.button>
      ))}

      {/* 3. Constellation Nodes (Only shown in Constellation mode) */}
      {constellationMode && constellationStars.map((star, idx) => {
        const isConnected = idx < constellationProgress || constellationComplete;
        const isTarget = idx === constellationProgress && !constellationComplete;

        return (
          <motion.button
            key={star.id}
            style={{ top: star.top, left: star.left }}
            className="absolute z-20 cursor-pointer focus:outline-none -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: isTarget ? [1, 1.3, 1] : 1,
            }}
            transition={isTarget ? {
              scale: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' }
            } : {}}
            onClick={() => handleConstellationClick(idx)}
            disabled={isConnected && !constellationComplete}
          >
            <div className="relative flex items-center justify-center group">
              {isConnected ? (
                <Heart className="w-6 h-6 text-rose-400 fill-rose-400 filter drop-shadow-[0_0_10px_rgba(244,63,94,0.95)]" />
              ) : isTarget ? (
                <Sparkles className="w-6 h-6 text-yellow-300 fill-yellow-200 filter drop-shadow-[0_0_12px_rgba(253,224,71,0.9)] animate-pulse" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-indigo-950/80 border-2 border-indigo-400/40 group-hover:border-indigo-300/80 transition-colors" />
              )}
              {isTarget && (
                <span className="absolute -top-7 text-[10px] bg-rose-500 font-sans text-white font-bold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap animate-bounce">
                  Connect
                </span>
              )}
            </div>
          </motion.button>
        );
      })}

      {/* Glassmorphic Control Board */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-950/65 backdrop-blur-lg border border-white/10 px-4 py-2.5 rounded-full shadow-2xl">
        <button
          onClick={handleToggleConstellation}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            constellationMode 
              ? 'bg-rose-500/90 text-white shadow-md border border-rose-400/30' 
              : 'text-purple-200 hover:text-white hover:bg-white/5'
          }`}
          title="Toggle Constellation Mode"
        >
          <Compass className="w-4 h-4" />
          <span className="hidden sm:inline">Constellation</span>
        </button>

        <div className="h-4 w-[1px] bg-white/15" />

        <button
          onClick={() => {
            setIsPlacingStar(!isPlacingStar);
            playChime(698.46, 'sine', 0.5); // F5
          }}
          disabled={constellationMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            isPlacingStar 
              ? 'bg-cyan-500/90 text-white shadow-md border border-cyan-400/30 animate-pulse' 
              : constellationMode 
                ? 'opacity-40 cursor-not-allowed text-slate-500' 
                : 'text-purple-200 hover:text-white hover:bg-white/5'
          }`}
          title="Make a Wish (Plant Star)"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Plant Thought</span>
        </button>

        <div className="h-4 w-[1px] bg-white/15" />

        {/* Toggle Sound */}
        <button
          onClick={() => setSoundOn(!soundOn)}
          className="p-2 text-purple-200 hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer"
          title={soundOn ? "Mute Cosmic Chimes" : "Enable Cosmic Chimes"}
        >
          {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Toggle Mouse Trails */}
        <button
          onClick={() => setEnableTrails(!enableTrails)}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            enableTrails ? 'text-yellow-300 hover:bg-white/5' : 'text-slate-400 hover:bg-white/5'
          }`}
          title={enableTrails ? "Disable Stardust Trail" : "Enable Stardust Trail"}
        >
          <Paintbrush className="w-4 h-4" />
        </button>

        {/* Reset / Clear */}
        {constellationMode && (constellationProgress > 0 || constellationComplete) && (
          <>
            <div className="h-4 w-[1px] bg-white/15" />
            <button
              onClick={resetConstellation}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-rose-300 hover:text-rose-100 hover:bg-red-950/20 rounded-full transition-colors cursor-pointer"
              title="Reset Drawing"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </>
        )}
      </div>

      {/* MODAL 1: Default Star Message Card */}
      <AnimatePresence>
        {activeStarIdx !== null && (
          <div className="absolute inset-0 flex items-center justify-center p-4 z-30">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveStarIdx(null)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              className="bg-slate-900/95 border border-yellow-400/40 w-full max-w-md p-6 rounded-2xl shadow-2xl relative text-center text-white backdrop-blur-md"
            >
              <button
                onClick={() => setActiveStarIdx(null)}
                className="absolute top-3 right-3 p-1.5 bg-slate-800 text-purple-300 rounded-full hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex justify-center mb-4 text-yellow-300">
                <Sparkles className="w-8 h-8 animate-pulse text-yellow-300 fill-yellow-300/30" />
              </div>

              <p className="font-handwritten text-2xl md:text-3xl text-yellow-50 leading-relaxed px-4">
                "{starMessages[activeStarIdx]}"
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Custom Wish Input Form */}
      <AnimatePresence>
        {showWishInput && (
          <div className="absolute inset-0 flex items-center justify-center p-4 z-35">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWishInput(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-cyan-400/30 w-full max-w-sm p-6 rounded-2xl shadow-2xl relative text-white backdrop-blur-md z-40"
            >
              <h3 className="text-lg font-cute font-bold text-center text-cyan-200 mb-3 flex items-center justify-center gap-1.5">
                🌟 Plant a Twinkling Thought
              </h3>
              
              <p className="text-slate-300 text-xs text-center mb-4 font-sans">
                Write a sweet wish, note, or memory, and plant it in the night sky. It will twinkle here forever.
              </p>

              <textarea
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                maxLength={120}
                placeholder="Write your cosmic thought here... (max 120 chars)"
                className="w-full h-24 p-3 bg-slate-950/60 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-cyan-400 text-slate-100 resize-none font-sans"
              />

              <div className="flex justify-between items-center mt-3 text-[10px] text-slate-400 font-sans">
                <span>{120 - wishText.length} characters left</span>
              </div>

              <div className="flex gap-2.5 mt-5">
                <button
                  onClick={() => setShowWishInput(false)}
                  className="flex-1 py-2.5 border border-slate-700 rounded-full text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddWish}
                  disabled={!wishText.trim()}
                  className="flex-1 py-2.5 bg-gradient-to-r from-cyan-400 to-indigo-400 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-bold rounded-full text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Plant Star
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Custom Star Message View */}
      <AnimatePresence>
        {activeCustomStar && (
          <div className="absolute inset-0 flex items-center justify-center p-4 z-30">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCustomStar(null)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-cyan-400/40 w-full max-w-sm p-6 rounded-2xl shadow-2xl relative text-center text-white backdrop-blur-md"
            >
              <button
                onClick={() => setActiveCustomStar(null)}
                className="absolute top-3 right-3 p-1.5 bg-slate-800 text-cyan-300 rounded-full hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex justify-center mb-3 text-cyan-300">
                <Star className="w-8 h-8 animate-spin-slow fill-cyan-300/30" />
              </div>

              <span className="text-[9px] uppercase tracking-widest font-bold text-cyan-400/60 font-sans block mb-2">
                Your Twinkling Thought
              </span>

              <p className="font-handwritten text-2xl md:text-3xl text-cyan-50 leading-relaxed px-2 mb-6">
                "{activeCustomStar.message}"
              </p>

              <button
                onClick={() => handleDeleteCustomStar(activeCustomStar.id)}
                className="inline-flex items-center gap-1 text-[10px] text-rose-300 hover:text-rose-100 hover:bg-red-950/30 px-3 py-1.5 rounded-full transition-all cursor-pointer border border-rose-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Return to Cosmos</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: Catch Shooting Star Fortune Card */}
      <AnimatePresence>
        {activeFortune && (
          <div className="absolute inset-0 flex items-center justify-center p-4 z-30">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveFortune(null)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-gradient-to-tr from-slate-900 to-indigo-950/95 border border-rose-300/40 w-full max-w-sm p-6 rounded-2xl shadow-2xl relative text-center text-white backdrop-blur-md"
            >
              <button
                onClick={() => setActiveFortune(null)}
                className="absolute top-3 right-3 p-1.5 bg-slate-800 text-rose-300 rounded-full hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex justify-center mb-3 text-rose-400">
                <Sparkles className="w-10 h-10 animate-bounce" />
              </div>

              <h4 className="text-md font-cute font-bold text-rose-300 mb-2">
                🌠 You Caught a Cosmic Wish!
              </h4>

              <p className="font-handwritten text-xl md:text-2xl text-rose-100 leading-relaxed px-4 py-2 border-t border-b border-indigo-400/20 my-3">
                {activeFortune}
              </p>

              <button
                onClick={() => setActiveFortune(null)}
                className="mt-4 px-5 py-2 bg-gradient-to-r from-rose-400 to-purple-400 hover:brightness-110 text-white font-bold rounded-full text-xs shadow-md transition-all cursor-pointer font-sans"
              >
                Release wish back to sky
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 5: Constellation Complete Success Modal */}
      <AnimatePresence>
        {showConstellationModal && (
          <div className="absolute inset-0 flex items-center justify-center p-4 z-40">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConstellationModal(false)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm animate-pulse"
            />

            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              className="bg-gradient-to-b from-slate-900 to-rose-950/90 border-2 border-rose-400/40 w-full max-w-md p-6 rounded-2xl shadow-2xl relative text-center text-white backdrop-blur-md"
            >
              <button
                onClick={() => setShowConstellationModal(false)}
                className="absolute top-3 right-3 p-1.5 bg-slate-800 text-rose-300 rounded-full hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex justify-center mb-3">
                <Heart className="w-12 h-12 text-rose-400 fill-rose-500 animate-pulse drop-shadow-[0_0_12px_rgba(244,63,94,0.85)]" />
              </div>

              <h3 className="text-xl md:text-2xl font-cute font-bold text-rose-300 mb-2">
                Constellation of Love Completed! 💖
              </h3>

              <p className="text-slate-300 text-xs font-sans mb-4 uppercase tracking-widest font-semibold">
                Our Sky is Linked
              </p>

              <div className="bg-slate-950/45 p-4 rounded-xl border border-rose-500/20 text-rose-100 font-handwritten text-2xl leading-relaxed text-left max-h-[160px] overflow-y-auto font-sans">
                Under the same night sky, our hearts are forever linked. No matter the distance or how busy life gets, we share the same stars and the same dreams. Happy thoughts are always heading your way, and you're never truly far apart from those who love you. 💗✨
              </div>

              <button
                onClick={() => setShowConstellationModal(false)}
                className="mt-5 px-6 py-2.5 bg-gradient-to-r from-rose-400 to-indigo-400 hover:brightness-110 text-white font-bold rounded-full text-xs shadow-lg transition-all cursor-pointer font-sans"
              >
                Keep Shining
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

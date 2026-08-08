import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Heart } from 'lucide-react';

export default function HeartGame() {
  const [gameState, setGameState] = useState('idle'); // idle, playing, ended
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const canvasRef = useRef(null);
  const basketRef = useRef({ x: 150, width: 70, height: 20 });
  const heartsRef = useRef([]);
  const animationFrameId = useRef(null);
  const gameTimerId = useRef(null);

  // Start the game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(20);
    heartsRef.current = [];
    basketRef.current.x = 150;

    // Start timer interval
    if (gameTimerId.current) clearInterval(gameTimerId.current);
    gameTimerId.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(gameTimerId.current);
          setGameState('ended');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Stop game loop
  useEffect(() => {
    return () => {
      if (gameTimerId.current) clearInterval(gameTimerId.current);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  // Handle Game Loop (Drawing & Collision)
  useEffect(() => {
    if (gameState !== 'playing') {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Spawn hearts
    let spawnCounter = 0;

    const gameLoop = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background sky
      ctx.fillStyle = '#fff5f7'; // soft pink
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw basket
      ctx.fillStyle = '#ff85a2'; // heart pink
      // Draw rounded basket
      ctx.beginPath();
      ctx.roundRect(basketRef.current.x, canvas.height - 40, basketRef.current.width, basketRef.current.height, 10);
      ctx.fill();
      
      // Draw basket label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "Outfit"';
      ctx.textAlign = 'center';
      ctx.fillText('Catcher 💗', basketRef.current.x + basketRef.current.width / 2, canvas.height - 26);

      // Spawn new hearts
      spawnCounter++;
      if (spawnCounter % 30 === 0) {
        heartsRef.current.push({
          x: Math.random() * (canvas.width - 20) + 10,
          y: -10,
          speed: Math.random() * 2 + 2,
          radius: 12,
          color: Math.random() > 0.3 ? '#ff85a2' : '#d8b4fe', // pink or purple
        });
      }

      // Draw and move hearts
      for (let i = heartsRef.current.length - 1; i >= 0; i--) {
        const heart = heartsRef.current[i];
        heart.y += heart.speed;

        // Draw Heart Shape on Canvas
        ctx.fillStyle = heart.color;
        ctx.beginPath();
        const topCurveHeight = heart.radius * 0.3;
        ctx.moveTo(heart.x, heart.y + topCurveHeight);
        
        // Left curve
        ctx.bezierCurveTo(
          heart.x - heart.radius / 2, heart.y - heart.radius / 2, 
          heart.x - heart.radius, heart.y + topCurveHeight, 
          heart.x, heart.y + heart.radius
        );
        
        // Right curve
        ctx.bezierCurveTo(
          heart.x + heart.radius, heart.y + topCurveHeight, 
          heart.x + heart.radius / 2, heart.y - heart.radius / 2, 
          heart.x, heart.y + topCurveHeight
        );
        ctx.fill();

        // Check basket collision
        const basketY = canvas.height - 40;
        const basketX1 = basketRef.current.x;
        const basketX2 = basketRef.current.x + basketRef.current.width;

        if (
          heart.y + heart.radius >= basketY &&
          heart.y - heart.radius <= basketY + basketRef.current.height &&
          heart.x >= basketX1 &&
          heart.x <= basketX2
        ) {
          // Catch heart!
          setScore((s) => s + 1);
          heartsRef.current.splice(i, 1);
          continue;
        }

        // Remove if offscreen
        if (heart.y - heart.radius > canvas.height) {
          heartsRef.current.splice(i, 1);
        }
      }

      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [gameState]);

  // Handle Touch/Mouse inputs
  const handlePointerMove = (e) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let clientX;
    
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const x = clientX - rect.left;
    // Keep basket inside canvas boundaries
    const newX = Math.max(0, Math.min(canvas.width - basketRef.current.width, x - basketRef.current.width / 2));
    basketRef.current.x = newX;
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-purple-50 to-pink-50 flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-md w-full glass-card p-6 rounded-3xl border border-pink-100 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
        <h2 className="text-3xl font-cute font-bold text-gray-800 mb-2 select-none">
          🎮 Catch the Hearts
        </h2>
        
        {gameState === 'playing' && (
          <div className="flex justify-between w-full px-4 mb-4 text-sm font-bold text-gray-600">
            <span>Score: <span className="text-pink-500 font-cute text-lg">{score}</span></span>
            <span>Time Left: <span className="text-purple-600 font-cute text-lg">{timeLeft}s</span></span>
          </div>
        )}

        <div className="relative w-full max-w-sm aspect-[4/5] bg-pink-50 rounded-2xl overflow-hidden border-2 border-pink-200/50 shadow-inner">
          {gameState === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-pink-100/40 backdrop-blur-xs">
              <Heart className="w-16 h-16 text-heart-pink fill-heart-pink mb-4 animate-bounce" />
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Catch the falling hearts into your basket! Move the catcher using your mouse, trackpad, or finger.
              </p>
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-cute font-bold text-sm rounded-full shadow-md cursor-pointer hover:scale-105 transition-transform"
              >
                Start Game <Play className="w-4 h-4" />
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <canvas
              ref={canvasRef}
              width={350}
              height={437}
              onMouseMove={handlePointerMove}
              onTouchMove={handlePointerMove}
              className="w-full h-full block touch-none cursor-ew-resize"
            />
          )}

          {gameState === 'ended' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-pink-50/95">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className="text-5xl mb-2">🏆</div>
                <h3 className="font-cute font-bold text-2xl text-gray-800 mb-2">
                  Congratulations!
                </h3>
                <p className="text-gray-600 font-sans text-md mb-4">
                  You collected <span className="text-pink-500 font-bold text-lg">{score}</span> hearts!
                </p>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-white/80 p-4 rounded-2xl border border-pink-100 shadow-xs max-w-[280px]"
                >
                  <p className="text-gray-500 text-sm italic mb-2">But there's one more...</p>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-4xl text-heart-pink select-none cursor-pointer"
                  >
                    ❤️
                  </motion.div>
                  <p className="font-cute font-bold text-pink-600 text-lg mt-2">Mine.</p>
                </motion.div>

                <button
                  onClick={startGame}
                  className="mt-6 flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-600 hover:bg-pink-200 text-xs font-bold rounded-full transition-colors cursor-pointer"
                >
                  Play Again <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RefreshCw, Zap, Sliders, Shield } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  life: number;
  maxLife: number;
  type: 'particle' | 'enemy' | 'spark';
}

export default function GraphicsSandbox({ isJapaneseInkMode = false }: { isJapaneseInkMode?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  // Simulation parameters
  const [isPlaying, setIsPlaying] = useState(true);
  const [renderMode, setRenderMode] = useState<'wireframe' | 'ar_glow' | 'vector'>('ar_glow');
  const [gravity, setGravity] = useState(0.05);
  const [spawnRate, setSpawnRate] = useState(2); // particles per click/tick
  const [fps, setFps] = useState(60);
  const [activeCount, setActiveCount] = useState(0);

  // Keep state in refs for the animation loop
  const particlesRef = useRef<Particle[]>([]);
  const renderModeRef = useRef(renderMode);
  const gravityRef = useRef(gravity);
  const spawnRateRef = useRef(spawnRate);
  const isPlayingRef = useRef(isPlaying);

  // Sync refs
  useEffect(() => { renderModeRef.current = renderMode; }, [renderMode]);
  useEffect(() => { gravityRef.current = gravity; }, [gravity]);
  useEffect(() => { spawnRateRef.current = spawnRate; }, [spawnRate]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  // Resize canvas safely using ResizeObserver
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        // set display size
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        // set actual drawing dimensions based on device pixel ratio
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(dpr, dpr);
        }
      }
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Spawn random particle
  const spawnParticle = (x: number, y: number, type: 'particle' | 'enemy' | 'spark' = 'particle') => {
    const angle = Math.random() * Math.PI * 2;
    const speed = type === 'enemy' ? 1 + Math.random() * 1.5 : 2 + Math.random() * 3;
    const maxLife = type === 'enemy' ? 180 : 60 + Math.random() * 40;

    const colors = {
      particle: isJapaneseInkMode 
        ? ['#1c1917', '#292524', '#44403c', '#78716c'] 
        : ['#06b6d4', '#22d3ee', '#38bdf8', '#818cf8'], // Charcoal ink or Cyber cyan
      enemy: isJapaneseInkMode 
        ? ['#b91c1c', '#dc2626', '#ef4444'] 
        : ['#ef4444', '#f87171', '#fca5a5'], // Vermilion stamp ink or Cyber red
      spark: isJapaneseInkMode 
        ? ['#78716c', '#a8a29e', '#d6d3d1'] 
        : ['#34d399', '#6ee7b7', '#a7f3d0'] // Soft gray wash or Cyber emerald
    };

    const typeColors = colors[type];
    const color = typeColors[Math.floor(Math.random() * typeColors.length)];

    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (type === 'spark' ? 2 : 0),
      radius: type === 'enemy' ? 6 + Math.random() * 4 : 2 + Math.random() * 2,
      color,
      life: maxLife,
      maxLife,
      type
    };
  };

  // Canvas click to spawn explosion
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newParticles: Particle[] = [];
    // Spawn a mix of enemies and sparks
    for (let i = 0; i < 8; i++) {
      newParticles.push(spawnParticle(x, y, 'spark'));
    }
    for (let i = 0; i < 3; i++) {
      newParticles.push(spawnParticle(x, y, 'enemy'));
    }
    particlesRef.current = [...particlesRef.current, ...newParticles].slice(-150); // limit count
  };

  // Main simulation loop
  useEffect(() => {
    let frameId: number;
    let fpsInterval = 0;
    let lastFpsUpdate = 0;
    let framesThisSecond = 0;

    const loop = (timestamp: number) => {
      if (!previousTimeRef.current) previousTimeRef.current = timestamp;
      const elapsed = timestamp - previousTimeRef.current;
      previousTimeRef.current = timestamp;

      // Track FPS
      framesThisSecond++;
      if (timestamp > lastFpsUpdate + 1000) {
        setFps(Math.round((framesThisSecond * 1000) / (timestamp - lastFpsUpdate)));
        framesThisSecond = 0;
        lastFpsUpdate = timestamp;
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width / (window.devicePixelRatio || 1);
        const height = canvas.height / (window.devicePixelRatio || 1);

        if (ctx) {
          // Clear
          ctx.fillStyle = isJapaneseInkMode ? '#f2efe9' : '#0b1329';
          ctx.fillRect(0, 0, width, height);

          // Render Grid Background (AR grid look)
          ctx.strokeStyle = isJapaneseInkMode ? 'rgba(68, 64, 60, 0.05)' : 'rgba(51, 65, 85, 0.15)';
          ctx.lineWidth = 1;
          const gridSize = 40;
          for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
          }
          for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }

          if (isPlayingRef.current) {
            // Auto spawn enemy occasionaly to showcase game loop enemy spawn algorithm
            if (Math.random() < 0.03 && particlesRef.current.length < 100) {
              // Spawn from top/sides
              const sx = Math.random() * width;
              const sy = 20;
              particlesRef.current.push(spawnParticle(sx, sy, 'enemy'));
            }

            // Update particles
            particlesRef.current = particlesRef.current
              .map(p => {
                const nextY = p.y + p.vy;
                const nextX = p.x + p.vx;

                // Bounce on walls
                let vx = p.vx;
                let vy = p.vy + gravityRef.current; // apply gravity

                if (nextX < 0 || nextX > width) vx = -vx * 0.8;
                if (nextY < 0 || nextY > height) vy = -vy * 0.8;

                return {
                  ...p,
                  x: Math.max(0, Math.min(width, nextX)),
                  y: Math.max(0, Math.min(height, nextY)),
                  vx,
                  vy,
                  life: p.life - 1
                };
              })
              .filter(p => p.life > 0);
          }

          setActiveCount(particlesRef.current.length);

          // Render particles
          particlesRef.current.forEach(p => {
            const lifeRatio = p.life / p.maxLife;

            ctx.save();
            ctx.beginPath();

            if (renderModeRef.current === 'wireframe') {
              // Vector wireframe look
              ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
              ctx.strokeStyle = p.color;
              ctx.lineWidth = 1;
              ctx.stroke();

              // Vector velocity line
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p.x + p.vx * 3, p.y + p.vy * 3);
              ctx.strokeStyle = isJapaneseInkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.4)';
              ctx.stroke();
            } else if (renderModeRef.current === 'ar_glow') {
              // Glowing tech look / Bleeding ink wash look
              ctx.shadowBlur = isJapaneseInkMode ? 6 : 10;
              ctx.shadowColor = p.color;
              ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
              ctx.fillStyle = p.color;
              ctx.globalAlpha = isJapaneseInkMode ? lifeRatio * 0.85 : lifeRatio;
              ctx.fill();
            } else {
              // Solid vector styling
              ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
              ctx.fillStyle = p.color;
              ctx.fill();

              // Draw bonding lines to nearby particles
              particlesRef.current.forEach(other => {
                if (other !== p && p.type === 'enemy' && other.type === 'enemy') {
                  const dist = Math.hypot(p.x - other.x, p.y - other.y);
                  if (dist < 80) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle = isJapaneseInkMode 
                      ? `rgba(185, 28, 28, ${0.1 * (1 - dist / 80)})` 
                      : `rgba(239, 68, 68, ${0.15 * (1 - dist / 80)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                  }
                }
              });
            }
            ctx.restore();
          });

          // Draw HUD overlay matching a game design dashboard
          ctx.fillStyle = isJapaneseInkMode ? 'rgba(245, 244, 240, 0.92)' : 'rgba(15, 23, 42, 0.75)';
          ctx.strokeStyle = isJapaneseInkMode ? '#d6d3d1' : '#334155';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(10, 10, 150, 65, 6);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isJapaneseInkMode ? '#44403c' : '#94a3b8';
          ctx.font = '10px monospace';
          ctx.fillText(`ENGINE: ACTIVE`, 18, 25);
          ctx.fillStyle = isJapaneseInkMode ? '#b91c1c' : '#22d3ee';
          ctx.fillText(`FPS: ${fps}`, 18, 40);
          ctx.fillStyle = isJapaneseInkMode ? '#57534e' : '#a7f3d0';
          ctx.fillText(`NODES: ${particlesRef.current.length}`, 18, 52);
          ctx.fillStyle = isJapaneseInkMode ? '#b91c1c' : '#ef4444';
          ctx.fillText(`GRAVITY: ${gravityRef.current.toFixed(3)}`, 18, 64);
        }
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [fps, isJapaneseInkMode]);

  const triggerShockwave = () => {
    if (!canvasRef.current) return;
    const width = canvasRef.current.width / (window.devicePixelRatio || 1);
    const height = canvasRef.current.height / (window.devicePixelRatio || 1);

    const midX = width / 2;
    const midY = height / 2;

    const newParticles: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      newParticles.push(spawnParticle(midX, midY, 'particle'));
    }
    particlesRef.current = [...particlesRef.current, ...newParticles].slice(-150);
  };

  const clearSimulation = () => {
    particlesRef.current = [];
  };

  return (
    <div id="graphics-sandbox" className={`flex flex-col h-full rounded-2xl border overflow-hidden transition-all duration-500 ${
      isJapaneseInkMode
        ? 'border-stone-300/80 bg-[#f5f4f0]/65 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_32px_rgba(41,37,36,0.05)]'
        : 'border-white/[0.08] bg-slate-950/45 backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_12px_40px_rgba(0,0,0,0.4)]'
    }`}>
      {/* Header Panel */}
      <div className={`flex items-center justify-between border-b px-4 py-3 transition-colors duration-500 ${
        isJapaneseInkMode ? 'border-stone-300/80 bg-[#f5f4f0]/40' : 'border-white/[0.06] bg-slate-950/40'
      }`}>
        <div className="flex items-center gap-2">
          <div className="flex h-2.5 w-2.5 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isJapaneseInkMode ? 'bg-red-400' : 'bg-cyan-400'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              isJapaneseInkMode ? 'bg-red-500' : 'bg-cyan-500'
            }`}></span>
          </div>
          <span className={`font-mono text-xs font-semibold uppercase tracking-wider transition-colors duration-500 ${
            isJapaneseInkMode ? 'text-stone-750' : 'text-slate-300'
          }`}>
            Interactive Graphics & Game Loop Sandbox
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className={`h-4 w-4 animate-pulse ${isJapaneseInkMode ? 'text-red-700' : 'text-rose-500'}`} />
          <span className={`text-[10px] font-mono uppercase tracking-widest hidden sm:inline ${
            isJapaneseInkMode ? 'text-stone-600 font-bold' : 'text-slate-400'
          }`}>
            {isJapaneseInkMode ? 'SUMI_E_LOOP.exe' : 'Guardian-TD.exe'}
          </span>
        </div>
      </div>

      {/* Render Area */}
      <div ref={containerRef} className={`relative flex-1 min-h-[220px] transition-colors duration-500 ${
        isJapaneseInkMode ? 'bg-[#f2efe9]' : 'bg-[#0b1329]'
      }`}>
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="absolute inset-0 cursor-crosshair block"
        />
        <div className={`absolute bottom-3 right-3 pointer-events-none select-none px-2 py-1 rounded text-[10px] font-mono border transition-all duration-500 ${
          isJapaneseInkMode 
            ? 'bg-stone-100/80 text-stone-600 border-stone-250' 
            : 'bg-slate-950/80 text-slate-400 border-slate-800/80'
        }`}>
          Click stage to spawn objects
        </div>
      </div>

      {/* Controls Footer */}
      <div className={`border-t p-4 transition-colors duration-500 ${
        isJapaneseInkMode ? 'border-stone-300/80 bg-[#f5f4f0]/40' : 'border-slate-800 bg-slate-950/90'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Simulation variables */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono transition-colors duration-500">
              <span className={`flex items-center gap-1 ${isJapaneseInkMode ? 'text-stone-600' : 'text-slate-400'}`}>
                <Sliders className={`h-3 w-3 ${isJapaneseInkMode ? 'text-red-700' : 'text-cyan-400'}`} /> GRAVITY VECTOR
              </span>
              <span className={`font-semibold ${isJapaneseInkMode ? 'text-red-700' : 'text-cyan-400'}`}>{gravity.toFixed(3)} G</span>
            </div>
            <input
              type="range"
              min="0.000"
              max="0.200"
              step="0.005"
              value={gravity}
              onChange={(e) => setGravity(parseFloat(e.target.value))}
              className={`w-full h-1 rounded-lg appearance-none cursor-pointer ${
                isJapaneseInkMode ? 'bg-stone-300 accent-red-700' : 'bg-slate-800 accent-cyan-400'
              }`}
            />

            <div className="flex gap-2 mt-1 items-center">
              <span className="text-[10px] font-mono text-slate-500">RENDER PROTOCOL:</span>
              <div className="flex gap-1.5">
                {(['wireframe', 'ar_glow', 'vector'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setRenderMode(mode)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                      renderMode === mode
                        ? (isJapaneseInkMode 
                            ? 'border-red-600 bg-red-100/60 text-red-700 font-semibold' 
                            : 'border-cyan-500 bg-cyan-950/50 text-cyan-400')
                        : (isJapaneseInkMode 
                            ? 'border-stone-300 bg-stone-100 text-stone-600 hover:text-stone-900' 
                            : 'border-slate-850 bg-slate-900 text-slate-500 hover:text-slate-200')
                    }`}
                  >
                    {mode.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Core Controls Buttons */}
          <div className="flex items-center justify-end gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={triggerShockwave}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-mono font-medium transition-all duration-200 w-full sm:w-auto justify-center cursor-pointer border ${
                isJapaneseInkMode
                  ? 'border-red-600/30 bg-red-100/40 text-red-700 hover:bg-red-100/70 hover:border-red-600/50'
                  : 'border-cyan-500/30 bg-cyan-950/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400/50'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              SHOCKWAVE
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-mono font-medium border transition-all duration-200 w-full sm:w-auto justify-center cursor-pointer ${
                isPlaying
                  ? (isJapaneseInkMode 
                      ? 'border-amber-600/30 bg-amber-50 text-amber-800 hover:bg-amber-100' 
                      : 'border-amber-500/30 bg-amber-950/20 text-amber-400 hover:bg-amber-500/20')
                  : (isJapaneseInkMode 
                      ? 'border-red-600/30 bg-red-50 text-red-700 hover:bg-red-100' 
                      : 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-500/20')
              }`}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {isPlaying ? 'PAUSE' : 'RESUME'}
            </button>

            <button
              onClick={clearSimulation}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-mono font-medium border transition-all duration-200 w-full sm:w-auto justify-center cursor-pointer ${
                isJapaneseInkMode
                  ? 'border-stone-300 bg-stone-100 text-stone-750 hover:border-stone-400 hover:bg-stone-200 hover:text-stone-900'
                  : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:border-slate-500 hover:bg-slate-700 hover:text-white'
              }`}
              title="Clear Particles"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              CLEAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

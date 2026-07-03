import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Sparkles, Trophy } from 'lucide-react';

interface Segment {
  x: number;
  y: number;
  angle: number;
  size: number;
}

interface Bird {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  flapPhase: number;
  color: string;
  isAlive: boolean;
}

interface Whale {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  swimPhase: number;
  color: string;
}

interface Jellyfish {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  pulsePhase: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
  life: number;
  type?: 'feather' | 'ember' | 'fire' | 'wing' | 'petal';
}

interface Ripple {
  type: 'bubble' | 'stream' | 'vortex';
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  alpha: number;
  color: string;
  wobble?: number;
  wobbleSpeed?: number;
  angle?: number;
  spin?: number;
  inkTimer?: number;
}

export default function WesternDragon({ isJapaneseInkMode = false }: { isJapaneseInkMode?: boolean }) {
  const [isLoading, setIsLoading] = useState(true);
  const [birdsEaten, setBirdsEaten] = useState(0);
  const [dragonType, setDragonType] = useState<'mantaray' | 'eagle' | 'serpent'>('eagle');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isJapaneseInkModeRef = useRef(isJapaneseInkMode);
  useEffect(() => {
    isJapaneseInkModeRef.current = isJapaneseInkMode;
  }, [isJapaneseInkMode]);

  // References for rendering and update loop
  const segmentsRef = useRef<Segment[]>([]);
  const birdsRef = useRef<Bird[]>([]);
  const whalesRef = useRef<Whale[]>([]);
  const jellyfishRef = useRef<Jellyfish[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const headTargetRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: -1000, y: -1000, active: false, isDown: false });
  const orbitAngleRef = useRef(0);
  const isLoadedRef = useRef(false);
  const mouthOpenRef = useRef(0); // 0 = closed, higher = frame countdown for snapping open
  const dragonTypeRef = useRef<'mantaray' | 'eagle' | 'serpent'>('eagle');
  const lastMouseActiveTimeRef = useRef(performance.now());
  const scrollYRef = useRef(0);

  const numSegments = 22; // Strong, powerful Western Dragon body
  const segmentSpacing = 13; // Tighter spacing for interlocking rigid armored scale plating
  const numBirds = 12; // Majestic flock density (reduced to prevent overcrowding)

  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Elegant asset compiling simulation
    const timer = setTimeout(() => {
      setIsLoading(false);
      isLoadedRef.current = true;
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  // Initialize all elements
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // 1. Initialize Dragon segments
    const segments: Segment[] = [];
    const startX = w / 2;
    const startY = h / 2;

    for (let i = 0; i < numSegments; i++) {
      let size = 16;
      if (i === 0) size = 26; // Big sturdy Western skull
      else if (i < 4) size = 20; // Thick muscular neck
      else if (i < 10) size = 24; // Bulkier chest/body torso (wing region)
      else if (i < 17) size = 16; // Tapering midsection
      else size = 8; // Tail taper

      segments.push({
        x: startX + i * segmentSpacing,
        y: startY,
        angle: 0,
        size
      });
    }
    segmentsRef.current = segments;

    // 2. Initialize Birds Flock (Fishes)
    const colors = [
      'rgba(34, 211, 238, 0.75)',  // Cyan fish
      'rgba(56, 189, 248, 0.75)',  // Sky fish
      'rgba(129, 140, 248, 0.75)', // Indigo fish
      'rgba(16, 185, 129, 0.75)',  // Emerald fish
      'rgba(245, 158, 11, 0.75)'   // Gold fish
    ];

    const birds: Bird[] = [];
    for (let i = 0; i < numBirds; i++) {
      birds.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 2.2 + 1.5, // General swimming direction
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 5 + 7, // Larger body size for the fishes
        flapPhase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        isAlive: true
      });
    }
    birdsRef.current = birds;

    // 3. Initialize Whales
    const whales: Whale[] = [];
    const numWhales = 3;
    for (let i = 0; i < numWhales; i++) {
      whales.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.8 + (Math.random() > 0.5 ? 0.5 : -0.5),
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 8 + 24, // Much larger than fishes
        swimPhase: Math.random() * Math.PI * 2,
        color: '' // dynamically colored in render loop
      });
    }
    whalesRef.current = whales;

    // 4. Initialize Jellyfish
    const jellyfish: Jellyfish[] = [];
    const numJellyfish = 7;
    for (let i = 0; i < numJellyfish; i++) {
      jellyfish.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 15 + 20,
        pulsePhase: Math.random() * Math.PI * 2,
        color: 'rgba(236, 72, 153, 0.4)' // Initial color
      });
    }
    jellyfishRef.current = jellyfish;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    let lastWidth = 0;
    let lastHeight = 0;

    const resizeCanvas = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      // Prevent resizing on mobile when only the address bar hides/shows
      if (w === lastWidth && Math.abs(h - lastHeight) < 120) {
        return;
      }
      
      lastWidth = w;
      lastHeight = h;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };

    const spawnWaterSplash = (clickX: number, clickY: number) => {
      const activeType = dragonTypeRef.current;
      let splashColor = 'rgba(34, 211, 238, 0.5)'; // default cyber cyan
      if (activeType === 'eagle') {
        splashColor = 'rgba(255, 255, 255, 0.65)'; // Bright white/silver splashes
      } else if (activeType === 'serpent') {
        splashColor = 'rgba(16, 185, 129, 0.55)';
      }

      // 1. Spawn radiating bubbles
      const bubbleCount = 10 + Math.floor(Math.random() * 6);
      for (let i = 0; i < bubbleCount; i++) {
        const angle = (i / bubbleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 5.0 + 2.5;
        ripplesRef.current.push({
          type: 'bubble',
          x: clickX,
          y: clickY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2, // extra buoyancy
          size: Math.random() * 2.5 + 1.5,
          maxSize: Math.random() * 8.0 + 9.0,
          alpha: Math.random() * 0.5 + 0.45,
          color: splashColor,
          wobble: Math.random() * 3.0 + 1.5,
          wobbleSpeed: Math.random() * 5 + 3
        });
      }

      // 2. Spawn a beautiful swirling vortex on click
      ripplesRef.current.push({
        type: 'vortex',
        x: clickX,
        y: clickY,
        vx: 0,
        vy: 0,
        size: 3,
        maxSize: Math.random() * 35 + 30,
        alpha: 0.7,
        color: splashColor,
        spin: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.08 + 0.06)
      });

      // 3. Spawn multiple outward streamlined waves
      const waveCount = 3;
      for (let i = 0; i < waveCount; i++) {
        const angle = (i / waveCount) * Math.PI * 2 + Math.random() * 0.5;
        ripplesRef.current.push({
          type: 'stream',
          x: clickX,
          y: clickY,
          vx: Math.cos(angle) * 1.5,
          vy: Math.sin(angle) * 1.5,
          size: Math.random() * 15 + 15,
          maxSize: Math.random() * 55 + 50,
          alpha: 0.6,
          color: splashColor,
          angle: angle
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
      lastMouseActiveTimeRef.current = performance.now();
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isDown = true;
      spawnWaterSplash(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      mouseRef.current.isDown = true;
      lastMouseActiveTimeRef.current = performance.now();
      if (e.touches[0]) {
        const tX = e.touches[0].clientX;
        const tY = e.touches[0].clientY;
        mouseRef.current.x = tX;
        mouseRef.current.y = tY;
        mouseRef.current.active = true;
        spawnWaterSplash(tX, tY);
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.isDown = false;
    };

    const handleDblClick = () => {
      let nextType: 'mantaray' | 'eagle' | 'serpent' = 'mantaray';
      if (dragonTypeRef.current === 'mantaray') {
        nextType = 'eagle';
      } else if (dragonTypeRef.current === 'eagle') {
        nextType = 'serpent';
      } else {
        nextType = 'mantaray';
      }
      dragonTypeRef.current = nextType;
      setDragonType(nextType);

      // Trigger spectacular particle shockwave around dragon head
      const headSeg = segmentsRef.current[0];
      if (headSeg) {
        const color = nextType === 'eagle'
          ? 'rgba(239, 68, 68, 0.95)' // Fire/Crimson
          : nextType === 'serpent'
          ? 'rgba(52, 211, 153, 0.95)' // Emerald green
          : 'rgba(34, 211, 238, 0.95)'; // Cyan/Blue

        for (let k = 0; k < 45; k++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = Math.random() * 8 + 3.5;
          particlesRef.current.push({
            x: headSeg.x,
            y: headSeg.y,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            color,
            alpha: 1.0,
            size: Math.random() * 4.5 + 2.0,
            life: Math.random() * 0.7 + 0.6,
            type: 'ember'
          });
        }
      }
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('dblclick', handleDblClick);

    resizeCanvas();

    // Spawn bird particles on eating
    const triggerFeatherExplosion = (x: number, y: number, color: string) => {
      const pCount = 18;
      for (let i = 0; i < pCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 1.5;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          alpha: 1,
          size: Math.random() * 3 + 1.5,
          life: 1.0
        });
      }
    };

    // Helper to draw beautiful sumi-e style cherry blossom trees
    const drawSumiETree = (context: CanvasRenderingContext2D, width: number, height: number) => {
      context.save();
      context.strokeStyle = '#292524'; // Charcoal trunk
      context.lineCap = 'round';
      context.lineJoin = 'round';
      
      // Top-Right Branch
      context.beginPath();
      context.lineWidth = 10;
      context.moveTo(width, 0);
      context.bezierCurveTo(width - 80, 40, width - 160, 30, width - 260, 120);
      context.stroke();

      // Sub-branch 1
      context.beginPath();
      context.lineWidth = 4.5;
      context.moveTo(width - 150, 35);
      context.bezierCurveTo(width - 200, 65, width - 220, 85, width - 280, 75);
      context.stroke();

      // Sub-branch 2
      context.beginPath();
      context.lineWidth = 3;
      context.moveTo(width - 200, 65);
      context.bezierCurveTo(width - 230, 95, width - 250, 110, width - 290, 125);
      context.stroke();

      // Draw cherry blossom clusters
      context.fillStyle = '#fca5a5'; // Soft pink
      const blossoms = [
        {x: width - 80, y: 20, r: 7}, {x: width - 100, y: 25, r: 9}, {x: width - 75, y: 30, r: 5},
        {x: width - 120, y: 30, r: 8}, {x: width - 140, y: 36, r: 7}, {x: width - 130, y: 26, r: 6},
        {x: width - 170, y: 45, r: 10}, {x: width - 190, y: 55, r: 8}, {x: width - 160, y: 50, r: 6},
        {x: width - 210, y: 70, r: 10}, {x: width - 230, y: 85, r: 7}, {x: width - 200, y: 80, r: 8},
        {x: width - 240, y: 100, r: 9}, {x: width - 265, y: 110, r: 10}, {x: width - 280, y: 115, r: 8}
      ];
      blossoms.forEach(bc => {
        context.beginPath();
        context.arc(bc.x, bc.y, bc.r, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = '#f43f5e'; // Darker pink core
        context.beginPath();
        context.arc(bc.x, bc.y, bc.r * 0.4, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = '#fca5a5';
      });

      // Bottom-Left Branch
      context.strokeStyle = '#292524';
      context.beginPath();
      context.lineWidth = 12;
      context.moveTo(0, height);
      context.bezierCurveTo(90, height - 60, 140, height - 110, 190, height - 170);
      context.stroke();

      // Sub-branch
      context.beginPath();
      context.lineWidth = 5;
      context.moveTo(80, height - 53);
      context.bezierCurveTo(120, height - 90, 170, height - 100, 200, height - 85);
      context.stroke();

      // Bottom-Left blossoms
      context.fillStyle = '#fca5a5';
      const blBlossoms = [
        {x: 50, y: height - 30, r: 9}, {x: 65, y: height - 42, r: 7}, {x: 40, y: height - 25, r: 5},
        {x: 90, y: height - 60, r: 10}, {x: 105, y: height - 70, r: 8}, {x: 80, y: height - 78, r: 6},
        {x: 130, y: height - 85, r: 11}, {x: 145, y: height - 100, r: 9}, {x: 120, y: height - 96, r: 7},
        {x: 165, y: height - 130, r: 10}, {x: 180, y: height - 145, r: 8}, {x: 195, y: height - 160, r: 7},
        {x: 185, y: height - 115, r: 6}, {x: 198, y: height - 96, r: 8}
      ];
      blBlossoms.forEach(bc => {
        context.beginPath();
        context.arc(bc.x, bc.y, bc.r, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = '#f43f5e';
        context.beginPath();
        context.arc(bc.x, bc.y, bc.r * 0.4, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = '#fca5a5';
      });

      context.restore();
    };

    // Main render loop
    const render = () => {
      time += 0.02;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isJapaneseInkMode = isJapaneseInkModeRef.current;

      ctx.clearRect(0, 0, w, h);

      // Draw background branches if in Japanese mode, fading away when scrolling
      if (isJapaneseInkMode) {
        const scrollY = scrollYRef.current;
        const treeOpacity = Math.max(0, 1 - scrollY / 50); // fades away completely within 50px of scrolling
        if (treeOpacity > 0) {
          ctx.save();
          ctx.globalAlpha = treeOpacity;
          drawSumiETree(ctx, w, h);
          ctx.restore();
        }
      }

      const segments = segmentsRef.current;
      const birds = birdsRef.current;
      const particles = particlesRef.current;

      // Spawn falling cherry blossom petals in Japanese mode, scaled by scroll-fade
      const scrollY = scrollYRef.current;
      const treeOpacity = Math.max(0, 1 - scrollY / 50);
      if (isJapaneseInkMode && treeOpacity > 0 && Math.random() < 0.15 * treeOpacity) {
        particles.push({
          x: Math.random() * w,
          y: -20,
          vx: (Math.random() - 0.2) * 1.5 + 1.0, // gentle breeze to the right
          vy: Math.random() * 1.0 + 0.8, // steady fall
          color: Math.random() < 0.35 ? '#f43f5e' : '#fca5a5', // pink shades
          alpha: (Math.random() * 0.4 + 0.6) * treeOpacity,
          size: Math.random() * 3.5 + 2.5,
          life: 1.0,
          type: 'petal'
        });
      }

      if (segments.length === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // --- 1. DRAGON TARGET MATH ---
      const isMouseIdle = !mouseRef.current.active || (performance.now() - lastMouseActiveTimeRef.current > 2000);

      if (!isLoadedRef.current || isMouseIdle) {
        // Find the closest alive bird to chase it actively
        const aliveBirds = birds.filter((b) => b.isAlive);
        let closestBird: Bird | null = null;
        let minDistance = Infinity;

        aliveBirds.forEach((b) => {
          const dist = Math.hypot(b.x - segments[0].x, b.y - segments[0].y);
          if (dist < minDistance) {
            minDistance = dist;
            closestBird = b;
          }
        });

        if (closestBird) {
          // Guide target seamlessly to prevent abrupt teleports
          const lerpFactor = isLoadedRef.current ? 0.08 : 0.05;
          headTargetRef.current.x = headTargetRef.current.x * (1 - lerpFactor) + (closestBird as Bird).x * lerpFactor;
          headTargetRef.current.y = headTargetRef.current.y * (1 - lerpFactor) + (closestBird as Bird).y * lerpFactor;
        } else {
          // Autonomous fluid serpentine sweep when no birds are around
          const cx = w / 2;
          const cy = h / 2;
          const rx = w * 0.22;
          const ry = h * 0.18;
          headTargetRef.current.x = cx + Math.cos(time * 0.4) * rx + Math.sin(time * 0.15) * 45;
          headTargetRef.current.y = cy + Math.sin(time * 0.3) * ry + Math.cos(time * 0.25) * 35;
        }
      } else {
        // Mouse follow/cruise logic
        const dx = mouseRef.current.x - headTargetRef.current.x;
        const dy = mouseRef.current.y - headTargetRef.current.y;
        const dist = Math.hypot(dx, dy);
        
        // Adaptive speed: speeds up when far, settles elegantly when close
        const adaptiveFactor = Math.min(0.12, 0.04 + (dist * 0.00015));
        headTargetRef.current.x += dx * adaptiveFactor;
        headTargetRef.current.y += dy * adaptiveFactor;
      }

      // --- 2. UPDATE DRAGON POSITION ---
      const head = segments[0];
      const dxHead = headTargetRef.current.x - head.x;
      const dyHead = headTargetRef.current.y - head.y;
      const headDist = Math.hypot(dxHead, dyHead);
      
      const targetAngle = Math.atan2(dyHead, dxHead);
      let headAngleDiff = targetAngle - head.angle;
      while (headAngleDiff < -Math.PI) headAngleDiff += Math.PI * 2;
      while (headAngleDiff > Math.PI) headAngleDiff -= Math.PI * 2;
      head.angle += headAngleDiff * 0.2; // Smooth rotation

      const speedFactor = isLoadedRef.current 
        ? Math.min(0.16, 0.06 + (headDist * 0.00035))
        : 0.14; // Adaptive speed factor
      head.x += dxHead * speedFactor;
      head.y += dyHead * speedFactor;

      // Calculate head movement speed to feed the sinuous slithering engine
      const dragonSpeed = Math.min(12, headDist);
      
      // Adapt slither physics based on dragon breed for extreme realism
      const currentBeastType = dragonTypeRef.current;
      let calculatedWiggleAmplitude = dragonSpeed * 0.22;
      let wiggleFreq = isLoadedRef.current ? 4.0 : 5.8;

      if (currentBeastType === 'eagle') {
        // High frequency, more expressive wave-slither for Chinese Lóng
        calculatedWiggleAmplitude = dragonSpeed * 0.27;
        wiggleFreq = isLoadedRef.current ? 5.4 : 6.6;
      } else if (currentBeastType === 'serpent') {
        // Broad, heavy, low-frequency serpentine slither for Indian Naga
        calculatedWiggleAmplitude = dragonSpeed * 0.32;
        wiggleFreq = isLoadedRef.current ? 3.2 : 4.4;
      }

      const wiggleAmplitude = Math.max(0.3, Math.min(3.2, calculatedWiggleAmplitude));

      // Update following segments with dynamic bone constraint & sinuous wiggle
      for (let i = 1; i < segments.length; i++) {
        const prev = segments[i - 1];
        const curr = segments[i];

        const dx = prev.x - curr.x;
        const dy = prev.y - curr.y;
        
        const segTargetAngle = Math.atan2(dy, dx);
        let segAngleDiff = segTargetAngle - curr.angle;
        while (segAngleDiff < -Math.PI) segAngleDiff += Math.PI * 2;
        while (segAngleDiff > Math.PI) segAngleDiff -= Math.PI * 2;
        curr.angle += segAngleDiff * 0.28; // Tighter angular alignment

        // Base structural target
        let targetX = prev.x - Math.cos(curr.angle) * segmentSpacing;
        let targetY = prev.y - Math.sin(curr.angle) * segmentSpacing;

        // Apply dynamic perpendicular serpentine wiggle (swimming motion)
        const wiggleValue = Math.sin(time * wiggleFreq - i * 0.45) * wiggleAmplitude;
        const perpAngle = curr.angle + Math.PI / 2;
        targetX += Math.cos(perpAngle) * wiggleValue;
        targetY += Math.sin(perpAngle) * wiggleValue;

        // Smooth fluid physics - lower multiplier down the spine creates an exquisite wave-like lag of a creature moving through thick water
        const waterLag = 0.38 + (i / segments.length) * 0.22;
        curr.x += (targetX - curr.x) * waterLag;
        curr.y += (targetY - curr.y) * waterLag;
      }

      // --- WATER FLUID WAKE SYSTEM SPAWNING ---
      const activeType = dragonTypeRef.current;
      const isBreathing = mouseRef.current.isDown;
      const hSpeed = Math.hypot(head.x - (segments[1]?.x || head.x), head.y - (segments[1]?.y || head.y));

      // 1. Spawning water bubbles from the snout / mouth area (ink splatters in Sumi-e mode)
      const spawnBubbleChance = isJapaneseInkMode ? 0.55 : (isBreathing ? 0.45 : (hSpeed > 2 ? 0.35 : 0.15));
      if (Math.random() < spawnBubbleChance) {
        let bColor = 'rgba(34, 211, 238, 0.45)'; // Cyber cyan bubble
        if (activeType === 'eagle') {
          bColor = 'rgba(255, 255, 255, 0.45)'; // White bubble
        } else if (activeType === 'serpent') {
          bColor = 'rgba(16, 185, 129, 0.45)'; // Emerald
        }

        ripplesRef.current.push({
          type: 'bubble',
          x: head.x + (Math.random() - 0.5) * 20,
          y: head.y + (Math.random() - 0.5) * 20,
          vx: -Math.cos(head.angle) * (hSpeed * 0.4 + 1.2) + (Math.random() - 0.5) * 1.8,
          vy: -Math.sin(head.angle) * (hSpeed * 0.4 + 1.2) + (Math.random() - 0.5) * 1.8 - (isJapaneseInkMode ? 0.25 : 0.6), // slower upward drift for ink
          size: (Math.random() * 3.5 + 2.0) * (isJapaneseInkMode ? 1.6 : 1.0),
          maxSize: (Math.random() * 8.0 + 7.0) * (isJapaneseInkMode ? 1.8 : 1.0),
          alpha: Math.random() * 0.4 + 0.45,
          color: bColor,
          wobble: Math.random() * 2.0 + 1.0,
          wobbleSpeed: Math.random() * 4 + 4
        });
      }

      // 2. Spawn streamlined fluid current vector trails behind moving segments (rich brush strokes in Sumi-e mode)
      const spawnStreamChance = isJapaneseInkMode ? 0.65 : (isBreathing ? 0.35 : (hSpeed > 1.5 ? 0.28 : 0.12));
      if (Math.random() < spawnStreamChance) {
        const segIndex = Math.floor(Math.random() * (segments.length - 1));
        const seg = segments[segIndex];
        const nextSeg = segments[segIndex + 1] || seg;
        
        let sColor = 'rgba(34, 211, 238, 0.32)';
        if (activeType === 'eagle') {
          sColor = 'rgba(255, 255, 255, 0.35)'; // White mist
        } else if (activeType === 'serpent') {
          sColor = 'rgba(52, 211, 153, 0.35)'; // Mint Green
        }

        const sizeMultiplier = isJapaneseInkMode ? 1.5 : 1.0;
        ripplesRef.current.push({
          type: 'stream',
          x: seg.x,
          y: seg.y,
          vx: (seg.x - nextSeg.x) * (isJapaneseInkMode ? 0.08 : 0.16) + (Math.random() - 0.5) * 0.6,
          vy: (seg.y - nextSeg.y) * (isJapaneseInkMode ? 0.08 : 0.16) + (Math.random() - 0.5) * 0.6,
          size: (Math.random() * 22 + 25) * sizeMultiplier, // Initial trace length
          maxSize: (Math.random() * 45 + 50) * sizeMultiplier,
          alpha: isJapaneseInkMode ? 0.75 : 0.48,
          color: sColor,
          angle: seg.angle + (Math.random() - 0.5) * 0.25
        });
      }

      // 3. Spawn swirling vortex eddies when turning fast
      if (hSpeed > 3.2 && Math.random() < 0.15) {
        const tail = segments[segments.length - 1];
        let vColor = 'rgba(6, 182, 212, 0.3)';
        if (activeType === 'eagle') {
          vColor = 'rgba(255, 255, 255, 0.3)'; // White vortex
        } else if (activeType === 'serpent') {
          vColor = 'rgba(16, 185, 129, 0.3)';
        }
        ripplesRef.current.push({
          type: 'vortex',
          x: tail.x,
          y: tail.y,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: 4,
          maxSize: Math.random() * 22 + 18,
          alpha: 0.52,
          color: vColor,
          spin: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.06 + 0.04)
        });
      }

      // --- CONTINUOUS CYBER ENERGY PARTICLES ---
      // Spawn tiny flowing energy spark embers from different parts of the dragon body
      if (Math.random() < 0.45) {
        // Ember/spark blowing backwards from head
        particles.push({
          x: head.x + (Math.random() - 0.5) * 12,
          y: head.y + (Math.random() - 0.5) * 12,
          vx: -Math.cos(head.angle) * (Math.random() * 2 + 1) + (Math.random() - 0.5) * 1.2,
          vy: -Math.sin(head.angle) * (Math.random() * 2 + 1) + (Math.random() - 0.5) * 1.2,
          color: 'rgba(34, 211, 238, 0.85)', // Cyan ember
          alpha: 1.0,
          size: Math.random() * 2.5 + 1.2,
          life: Math.random() * 0.4 + 0.6
        });
      }

      // --- INTERACTIVE FIRE BREATHING ---
      if (mouseRef.current.isDown) {
        // Open the mouth fully
        mouthOpenRef.current = 15;

        // Spawn blazing physical flames
        const flameCount = 6;
        for (let k = 0; k < flameCount; k++) {
          const spreadAngle = head.angle + (Math.random() - 0.5) * 0.65;
          const flameSpeed = Math.random() * 8.5 + 3.8;
          
          // Flame colors: white hot center, yellow flare, orange and deep red tails
          const roll = Math.random();
          let flameColor = 'rgba(239, 68, 68, 0.9)'; // Red
          if (roll < 0.22) {
            flameColor = 'rgba(255, 255, 255, 0.95)'; // White hot
          } else if (roll < 0.55) {
            flameColor = 'rgba(253, 224, 71, 0.9)'; // Yellow
          } else if (roll < 0.85) {
            flameColor = 'rgba(249, 115, 22, 0.9)'; // Orange
          }

          particles.push({
            x: head.x + Math.cos(head.angle) * 16,
            y: head.y + Math.sin(head.angle) * 16,
            vx: Math.cos(spreadAngle) * flameSpeed + (Math.random() - 0.5) * 1.5,
            vy: Math.sin(spreadAngle) * flameSpeed + (Math.random() - 0.5) * 1.5,
            color: flameColor,
            alpha: 1.0,
            size: Math.random() * 5.5 + 3.5,
            life: 1.0,
            type: 'fire'
          });
        }
      }

      // Emerald tail spark
      const tailSeg = segments[segments.length - 1];
      if (Math.random() < 0.5) {
        particles.push({
          x: tailSeg.x,
          y: tailSeg.y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5, // float up
          color: 'rgba(16, 185, 129, 0.85)', // Emerald sparks
          alpha: 1.0,
          size: Math.random() * 3 + 1,
          life: Math.random() * 0.5 + 0.5
        });
      }

      // Ambient wing stardust from wing tips
      if (Math.random() < 0.3) {
        const wingSeg = segments[4];
        const side = Math.random() < 0.5 ? 1 : -1;
        const wingAngle = wingSeg.angle + (Math.PI / 2) * side;
        const tipX = wingSeg.x + Math.cos(wingAngle) * 75;
        const tipY = wingSeg.y + Math.sin(wingAngle) * 75;
        particles.push({
          x: tipX,
          y: tipY,
          vx: (Math.random() - 0.5) * 1.0,
          vy: -Math.random() * 0.6 - 0.2, // float upwards gracefully
          color: 'rgba(56, 189, 248, 0.75)', // Sky blue wing dust
          alpha: 0.8,
          size: Math.random() * 2 + 1,
          life: Math.random() * 0.6 + 0.4
        });
      }

      // --- 3. FISH FLOCK SIMULATION ---
      birds.forEach((bird) => {
        if (!bird.isAlive) return;

        // Swimming/wiggling speed
        bird.flapPhase += 0.18;

        // Gravitational orbit around loading rings during loading screen
        if (!isLoadedRef.current) {
          const cx = w / 2;
          const cy = h / 2;
          const dx = cx - bird.x;
          const dy = cy - bird.y;
          const dist = Math.hypot(dx, dy);

          // Target orbit radius around 130px
          const targetRadius = 130;
          const force = (dist - targetRadius) * 0.015;
          bird.vx += (dx / (dist || 1)) * force;
          bird.vy += (dy / (dist || 1)) * force;

          // Add a circular tangential velocity
          const tangentX = -dy / (dist || 1);
          const tangentY = dx / (dist || 1);
          bird.vx += tangentX * 0.06;
          bird.vy += tangentY * 0.06;
        }

        // Boids-style simple steering and boundary wrap
        bird.x += bird.vx;
        bird.y += bird.vy;

        // Tiny cruise perturbations
        bird.vy += Math.sin(time + bird.flapPhase) * 0.04;

        // Avoid dragon head (scatter behavior)
        const dToHead = Math.hypot(bird.x - head.x, bird.y - head.y);
        if (dToHead < 180) {
          // Push bird away with acceleration, slightly less scatter during loading to make catching possible
          const scatterForce = isLoadedRef.current ? 0.35 : 0.12;
          const angle = Math.atan2(bird.y - head.y, bird.x - head.x);
          bird.vx += Math.cos(angle) * scatterForce;
          bird.vy += Math.sin(angle) * scatterForce;
        }

        // Limit speeds to remain graceful
        const speed = Math.hypot(bird.vx, bird.vy);
        if (speed > 4.5) {
          bird.vx = (bird.vx / speed) * 4.5;
          bird.vy = (bird.vy / speed) * 4.5;
        } else if (speed < 0.8) {
          bird.vx += 0.2;
        }

        // Wrap around screen boundaries nicely
        if (bird.x < -40) bird.x = w + 40;
        if (bird.x > w + 40) bird.x = -40;
        if (bird.y < -40) bird.y = h + 40;
        if (bird.y > h + 40) bird.y = -40;

        // --- COLLISION CHECK: Dragon Eats Fishes ---
        if (dToHead < 45) {
          // Eat fish!
          bird.isAlive = false;
          mouthOpenRef.current = 15; // Set snap counter active

          // Particle burst
          triggerFeatherExplosion(bird.x, bird.y, bird.color);

          // Increment state and local score
          setBirdsEaten((prev) => prev + 1);

          // Respawn fish on the screen perimeter after a delay
          setTimeout(() => {
            if (!isLoadedRef.current) {
              // Spawn on the outer perimeter of the loading ring
              const angle = Math.random() * Math.PI * 2;
              bird.x = w / 2 + Math.cos(angle) * 160;
              bird.y = h / 2 + Math.sin(angle) * 160;
              bird.vx = (Math.random() - 0.5) * 2;
              bird.vy = (Math.random() - 0.5) * 2;
            } else {
              const side = Math.floor(Math.random() * 4);
              let rx = 0, ry = 0;
              if (side === 0) { rx = -20; ry = Math.random() * h; }
              else if (side === 1) { rx = w + 20; ry = Math.random() * h; }
              else if (side === 2) { rx = Math.random() * w; ry = -20; }
              else { rx = Math.random() * w; ry = h + 20; }

              bird.x = rx;
              bird.y = ry;
              bird.vx = (Math.random() - 0.5) * 2 + 1.2;
              bird.vy = (Math.random() - 0.5) * 1.5;
            }
            bird.isAlive = true;
          }, 1500);
        }

        // Render elegant swimming fish with a wiggling body, eye, pectoral fins and wiggling tail fin
        ctx.save();
        ctx.translate(bird.x, bird.y);
        ctx.rotate(Math.atan2(bird.vy, bird.vx));

        ctx.fillStyle = bird.color;
        ctx.strokeStyle = bird.color;

        // Fish Body (elongated ellipse / teardrop)
        ctx.beginPath();
        const fLength = bird.size * 1.8; // body length
        const fWidth = bird.size * 0.7;  // body width
        ctx.ellipse(0, 0, fLength, fWidth, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eye
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(fLength * 0.6, -fWidth * 0.35, fWidth * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(fLength * 0.6, -fWidth * 0.35, fWidth * 0.12, 0, Math.PI * 2);
        ctx.fill();

        // Pectoral Fins wiggling
        const finWag = Math.sin(bird.flapPhase) * 0.35;
        ctx.fillStyle = bird.color;
        ctx.beginPath();
        // Left fin
        ctx.moveTo(0, -fWidth * 0.5);
        ctx.quadraticCurveTo(-fLength * 0.2, -fWidth * 1.5 + finWag * 3, -fLength * 0.6, -fWidth * 1.2);
        ctx.lineTo(-fLength * 0.2, -fWidth * 0.5);
        // Right fin
        ctx.moveTo(0, fWidth * 0.5);
        ctx.quadraticCurveTo(-fLength * 0.2, fWidth * 1.5 - finWag * 3, -fLength * 0.6, fWidth * 1.2);
        ctx.lineTo(-fLength * 0.2, fWidth * 0.5);
        ctx.fill();

        // Wiggling Tail Fin
        const tailWag = Math.sin(bird.flapPhase * 1.2) * (bird.size * 0.8);
        ctx.beginPath();
        ctx.moveTo(-fLength * 0.8, 0);
        ctx.quadraticCurveTo(-fLength * 1.3, tailWag, -fLength * 1.6, tailWag - bird.size * 0.7);
        ctx.lineTo(-fLength * 1.45, tailWag);
        ctx.lineTo(-fLength * 1.6, tailWag + bird.size * 0.7);
        ctx.quadraticCurveTo(-fLength * 1.3, tailWag, -fLength * 0.8, 0);
        ctx.fill();

        ctx.restore();
      });

      // --- 3.5 WHALES SIMULATION (UNEATABLE BY DRAGON) ---
      const whales = whalesRef.current;
      whales.forEach((whale) => {
        // Majestic slow swimming motion
        whale.swimPhase += 0.05; // slower tail wag

        whale.x += whale.vx;
        whale.y += whale.vy;

        // Tiny cruise perturbations
        whale.vy += Math.sin(time * 0.5 + whale.swimPhase) * 0.015;

        // Whales also avoid the dragon head slightly to feel alive, but slower response
        const dToHead = Math.hypot(whale.x - head.x, whale.y - head.y);
        if (dToHead < 250) {
          const avoidForce = 0.05;
          const angle = Math.atan2(whale.y - head.y, whale.x - head.x);
          whale.vx += Math.cos(angle) * avoidForce;
          whale.vy += Math.sin(angle) * avoidForce;
        }

        // Limit speed to keep it majestic and slow
        const speed = Math.hypot(whale.vx, whale.vy);
        if (speed > 1.8) {
          whale.vx = (whale.vx / speed) * 1.8;
          whale.vy = (whale.vy / speed) * 1.8;
        } else if (speed < 0.3) {
          whale.vx += whale.vx > 0 ? 0.1 : -0.1;
        }

        // Wrap around boundaries
        if (whale.x < -80) whale.x = w + 80;
        if (whale.x > w + 80) whale.x = -80;
        if (whale.y < -80) whale.y = h + 80;
        if (whale.y > h + 80) whale.y = -80;

        // Draw Whale (cannot be eaten!)
        ctx.save();
        ctx.translate(whale.x, whale.y);
        ctx.rotate(Math.atan2(whale.vy, whale.vx));

        // Determine color based on Japanese Ink Mode
        const wColor = isJapaneseInkMode 
          ? 'rgba(41, 37, 36, 0.28)' // elegant washed charcoal
          : 'rgba(56, 189, 248, 0.25)'; // cyber semi-trans blue

        ctx.fillStyle = wColor;
        ctx.strokeStyle = isJapaneseInkMode ? 'rgba(28, 25, 23, 0.4)' : 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 1.5;

        // Huge majestic whale body (elongated teardrop)
        ctx.beginPath();
        const wLength = whale.size * 2.0;
        const wWidth = whale.size * 0.85;
        ctx.ellipse(0, 0, wLength, wWidth, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Whale Eye
        ctx.fillStyle = isJapaneseInkMode ? 'rgba(28, 25, 23, 0.6)' : 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(wLength * 0.6, -wWidth * 0.25, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Side Flippers (slow movement)
        const flipperWag = Math.sin(whale.swimPhase) * 0.15;
        ctx.fillStyle = wColor;
        ctx.beginPath();
        // Left flipper
        ctx.moveTo(0, -wWidth * 0.4);
        ctx.quadraticCurveTo(-wLength * 0.1, -wWidth * 1.6 + flipperWag * 10, -wLength * 0.5, -wWidth * 1.3);
        ctx.lineTo(-wLength * 0.2, -wWidth * 0.4);
        // Right flipper
        ctx.moveTo(0, wWidth * 0.4);
        ctx.quadraticCurveTo(-wLength * 0.1, wWidth * 1.6 - flipperWag * 10, -wLength * 0.5, wWidth * 1.3);
        ctx.lineTo(-wLength * 0.2, wWidth * 0.4);
        ctx.fill();
        ctx.stroke();

        // Majestic Whale Tail Fin wiggling
        const tailWag = Math.sin(whale.swimPhase) * (whale.size * 0.4);
        ctx.beginPath();
        ctx.moveTo(-wLength * 0.8, 0);
        ctx.quadraticCurveTo(-wLength * 1.3, tailWag, -wLength * 1.6, tailWag - whale.size * 0.8);
        ctx.lineTo(-wLength * 1.45, tailWag);
        ctx.lineTo(-wLength * 1.6, tailWag + whale.size * 0.8);
        ctx.quadraticCurveTo(-wLength * 1.3, tailWag, -wLength * 0.8, 0);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      });

      // --- 3.6 JELLYFISH SIMULATION ---
      const jellyfishList = jellyfishRef.current;
      jellyfishList.forEach((jelly) => {
        jelly.pulsePhase += 0.03; // ethereal slow pulsing
        const pulse = Math.sin(jelly.pulsePhase);
        
        jelly.x += jelly.vx * (1 + pulse * 0.5);
        jelly.y += jelly.vy * (1 + pulse * 0.5);

        // Drift slowly upwards naturally
        jelly.vy -= 0.001;
        jelly.vx += Math.sin(time * 0.2) * 0.005;

        // Speed limit
        const speed = Math.hypot(jelly.vx, jelly.vy);
        if (speed > 0.8) {
          jelly.vx = (jelly.vx / speed) * 0.8;
          jelly.vy = (jelly.vy / speed) * 0.8;
        }

        // Avoid dragon head
        const dToHead = Math.hypot(jelly.x - head.x, jelly.y - head.y);
        if (dToHead < 300) {
          const avoidForce = 0.01;
          const angle = Math.atan2(jelly.y - head.y, jelly.x - head.x);
          jelly.vx += Math.cos(angle) * avoidForce;
          jelly.vy += Math.sin(angle) * avoidForce;
        }

        // Wrap around
        if (jelly.x < -100) jelly.x = w + 100;
        if (jelly.x > w + 100) jelly.x = -100;
        if (jelly.y < -100) jelly.y = h + 100;
        if (jelly.y > h + 100) jelly.y = -100;

        ctx.save();
        ctx.translate(jelly.x, jelly.y);
        ctx.rotate(Math.atan2(jelly.vy, jelly.vx) + Math.PI/2); // Dome faces direction of travel

        const jColor = isJapaneseInkMode 
          ? `rgba(214, 211, 209, ${0.15 + pulse * 0.05})` // Soft warm white/stone
          : `rgba(236, 72, 153, ${0.15 + pulse * 0.05})`; // Pink ethereal

        const jStroke = isJapaneseInkMode
          ? `rgba(168, 162, 158, 0.3)`
          : `rgba(244, 114, 182, 0.4)`;

        ctx.fillStyle = jColor;
        ctx.strokeStyle = jStroke;
        ctx.lineWidth = 1.0;
        
        if (!isJapaneseInkMode) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = 'rgba(236, 72, 153, 0.4)';
        }

        // Draw Jellyfish Bell
        ctx.beginPath();
        const bellWidth = jelly.size;
        const bellHeight = jelly.size * (0.8 + pulse * 0.2); // Expands and contracts
        
        ctx.moveTo(-bellWidth, 0);
        ctx.bezierCurveTo(-bellWidth, -bellHeight * 1.5, bellWidth, -bellHeight * 1.5, bellWidth, 0);
        ctx.quadraticCurveTo(0, -bellHeight * 0.2, -bellWidth, 0);
        ctx.fill();
        ctx.stroke();

        // Draw trailing tentacles
        ctx.beginPath();
        for (let i = -1; i <= 1; i += 0.5) {
          const startX = bellWidth * 0.8 * i;
          const length = jelly.size * (2.5 + Math.sin(jelly.pulsePhase * 2 + i) * 0.5);
          
          ctx.moveTo(startX, 0);
          ctx.quadraticCurveTo(
            startX + Math.sin(time + i) * 15, length * 0.5,
            startX + Math.sin(time * 0.8 + i) * 20, length
          );
        }
        ctx.strokeStyle = jStroke;
        ctx.stroke();

        ctx.restore();
      });

      // --- 4. RENDER DRAGON PARTICLES/SPARKS ---
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.type === 'fire') {
          p.size += 0.28; // Rapid flame expansion
          p.vy -= 0.14; // Hot flames rise rapidly
          p.vx *= 0.95;
          p.vy *= 0.95;
          p.life -= 0.032; // Fast flame decay
        } else {
          p.vy -= 0.015; // float upward gracefully like embers/magic dust
          p.vx *= 0.97;
          p.vy *= 0.97;
          p.life -= 0.016; // slightly longer life for trailing ambiance
        }

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life * (p.alpha || 1.0);

        if (p.type === 'petal') {
          ctx.save();
          ctx.fillStyle = p.color;
          ctx.translate(p.x, p.y);
          // Fluttering rotation
          ctx.rotate(time * 2.5 + p.x * 0.01);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (p.type === 'fire') {
          // Flame outer soft glow halo
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color.replace('0.9', '0.15'); // transparent halo glow
          ctx.fill();

          // Hot inner core
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else {
          // Render larger particles as starbursts (+ shapes) for a premium sparkling feel
          if (p.size > 2.2) {
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 1.0 * p.life;
            ctx.beginPath();
            ctx.moveTo(p.x - p.size * 2.2 * p.life, p.y);
            ctx.lineTo(p.x + p.size * 2.2 * p.life, p.y);
            ctx.moveTo(p.x, p.y - p.size * 2.2 * p.life);
            ctx.lineTo(p.x, p.y + p.size * 2.2 * p.life);
            ctx.stroke();
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1.0; // reset transparency

      // --- 4.5 DRAW & UPDATE WATER FLUID WAKES (BUBBLES & STREAM CURRENTS) ---
      ctx.save();
      const waterWakes = ripplesRef.current;
      for (let i = waterWakes.length - 1; i >= 0; i--) {
        const w = waterWakes[i];
        
        // Update positions
        w.x += w.vx;
        w.y += w.vy;
        
        // Liquid friction / drag
        w.vx *= 0.96;
        w.vy *= 0.96;
        
        if (w.type === 'bubble') {
          // Bubbles wobble horizontally and drift upwards gently
          w.vy -= isJapaneseInkMode ? 0.05 : 0.14; // slower drift for thick ink
          w.size += isJapaneseInkMode ? 0.08 : 0.04; // bleed expansion
          
          if (isJapaneseInkMode) {
            if (w.inkTimer === undefined) w.inkTimer = 35; // ~0.6s at 60fps
            if (w.inkTimer > 0) {
              w.inkTimer--;
            } else {
              w.alpha -= 0.06; // Fade out quickly (within ~0.25s)
            }
          } else {
            w.alpha -= 0.012; // slow ink dry fade
          }
          
          if (w.alpha <= 0 || w.size >= w.maxSize) {
            waterWakes.splice(i, 1);
            continue;
          }
          
          // Wobble math
          const wX = w.x + Math.sin(time * (w.wobbleSpeed || 5)) * (w.wobble || 1);
          
          if (isJapaneseInkMode) {
            // Sumi-e ink splatters
            ctx.fillStyle = `rgba(28, 25, 23, ${w.alpha * 0.45})`;
            ctx.shadowBlur = 6 * w.alpha;
            ctx.shadowColor = 'rgba(28, 25, 23, 0.4)';
            ctx.beginPath();
            ctx.arc(wX, w.y, w.size * 0.8, 0, Math.PI * 2);
            ctx.fill();

            // Satellite droplets for realistic splattering
            ctx.fillStyle = `rgba(28, 25, 23, ${w.alpha * 0.25})`;
            ctx.beginPath();
            ctx.arc(wX + w.size * 0.7, w.y - w.size * 0.4, w.size * 0.22, 0, Math.PI * 2);
            ctx.arc(wX - w.size * 0.6, w.y + w.size * 0.5, w.size * 0.16, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          } else {
            // Outer bubble ring
            ctx.strokeStyle = w.color.replace(/[\d\.]+\)$/, `${w.alpha * 0.8})`);
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.arc(wX, w.y, w.size, 0, Math.PI * 2);
            ctx.stroke();
            
            // Tiny glassy reflection highlight on top-left of bubble
            ctx.fillStyle = `rgba(255, 255, 255, ${w.alpha * 0.75})`;
            ctx.beginPath();
            ctx.arc(wX - w.size * 0.35, w.y - w.size * 0.35, w.size * 0.22, 0, Math.PI * 2);
            ctx.fill();
          }
          
        } else if (w.type === 'stream') {
          // Streamlines slowly stretch and dissolve
          w.size += isJapaneseInkMode ? 1.0 : 1.3;
          
          if (isJapaneseInkMode) {
            if (w.inkTimer === undefined) w.inkTimer = 35; // ~0.6s at 60fps
            if (w.inkTimer > 0) {
              w.inkTimer--;
            } else {
              w.alpha -= 0.06; // Fade out quickly (within ~0.25s)
            }
          } else {
            w.alpha -= 0.016;
          }
          
          if (w.alpha <= 0 || w.size >= w.maxSize) {
            waterWakes.splice(i, 1);
            continue;
          }
          
          if (isJapaneseInkMode) {
            // Bleeding brushed ink wash trails
            ctx.strokeStyle = `rgba(28, 25, 23, ${w.alpha * 0.4})`;
            ctx.lineWidth = 8.5 * (1 - w.size / w.maxSize);
            ctx.shadowBlur = 5 * (1 - w.size / w.maxSize);
            ctx.shadowColor = 'rgba(28, 25, 23, 0.45)';
          } else {
            // Draw a sleek curved streamlined water thread
            ctx.strokeStyle = w.color.replace(/[\d\.]+\)$/, `${w.alpha * 0.6})`);
            ctx.lineWidth = 2.0 * (1 - w.size / w.maxSize);
          }
          ctx.lineCap = 'round';
          
          ctx.beginPath();
          ctx.moveTo(w.x, w.y);
          const angle = w.angle || 0;
          const endX = w.x - Math.cos(angle) * w.size;
          const endY = w.y - Math.sin(angle) * w.size;
          
          // Add a subtle waves/curls to the streamline
          const ctrlX = w.x - Math.cos(angle) * (w.size * 0.5) + Math.sin(angle) * 8 * Math.sin(time * 3);
          const ctrlY = w.y - Math.sin(angle) * (w.size * 0.5) - Math.cos(angle) * 8 * Math.sin(time * 3);
          
          ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
          ctx.stroke();
          ctx.shadowBlur = 0; // reset
          
        } else if (w.type === 'vortex') {
          // Swirling vortex eddies
          w.size += 0.85;
          w.angle = (w.angle || 0) + (w.spin || 0.04);
          
          if (isJapaneseInkMode) {
            if (w.inkTimer === undefined) w.inkTimer = 35; // ~0.6s at 60fps
            if (w.inkTimer > 0) {
              w.inkTimer--;
            } else {
              w.alpha -= 0.06; // Fade out quickly (within ~0.25s)
            }
          } else {
            w.alpha -= 0.016;
          }
          
          if (w.alpha <= 0 || w.size >= w.maxSize) {
            waterWakes.splice(i, 1);
            continue;
          }
          
          if (isJapaneseInkMode) {
            // Soft swirling sumi-e circle brush washes
            ctx.strokeStyle = `rgba(28, 25, 23, ${w.alpha * 0.35})`;
            ctx.lineWidth = 4.2 * (1 - w.size / w.maxSize);
            ctx.shadowBlur = 4 * w.alpha;
            ctx.shadowColor = 'rgba(28, 25, 23, 0.3)';
          } else {
            // Draw a beautiful vortex spiral indicating water suction/swirl
            ctx.strokeStyle = w.color.replace(/[\d\.]+\)$/, `${w.alpha * 0.45})`);
            ctx.lineWidth = 1.6 * (1 - w.size / w.maxSize);
          }
          
          ctx.beginPath();
          const swirlRadius = w.size;
          for (let theta = 0; theta < Math.PI * 2.8; theta += 0.2) {
            const rCur = (theta / (Math.PI * 2.8)) * swirlRadius;
            const sX = w.x + Math.cos(theta + (w.angle || 0)) * rCur;
            const sY = w.y + Math.sin(theta + (w.angle || 0)) * rCur;
            if (theta === 0) {
               ctx.moveTo(sX, sY);
            } else {
               ctx.lineTo(sX, sY);
            }
          }
          ctx.stroke();
          ctx.shadowBlur = 0; // reset
        }
      }
      ctx.restore();

      // --- 5. DRAW DRAGON BODY BACKBONE GLOW ---
      if (isJapaneseInkMode) {
        ctx.globalAlpha = 0.85; // slightly denser opacity for rich black ink
      } else {
        ctx.globalAlpha = 0.58; // Reduce opacity to make it flow like thick liquid and show water trails/bubbles beneath
      }
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Draw curved, organic flowing backbone instead of sharp linear joints
      ctx.beginPath();
      if (segments.length > 2) {
        ctx.moveTo(segments[0].x, segments[0].y);
        for (let i = 1; i < segments.length - 1; i++) {
          const xc = (segments[i].x + segments[i + 1].x) / 2;
          const yc = (segments[i].y + segments[i + 1].y) / 2;
          ctx.quadraticCurveTo(segments[i].x, segments[i].y, xc, yc);
        }
        ctx.lineTo(segments[segments.length - 1].x, segments[segments.length - 1].y);
      } else {
        ctx.moveTo(segments[0].x, segments[0].y);
        for (let i = 1; i < segments.length; i++) {
          ctx.lineTo(segments[i].x, segments[i].y);
        }
      }

      if (isJapaneseInkMode) {
        // Japanese Sumi-e brush stroke effect
        // 1. Soft wide outer bleeding ink wash
        ctx.strokeStyle = 'rgba(41, 37, 36, 0.08)';
        ctx.lineWidth = 26;
        ctx.stroke();

        // 2. Middle ink bleed
        ctx.strokeStyle = 'rgba(28, 25, 23, 0.35)';
        ctx.lineWidth = 10;
        ctx.stroke();

        // 3. Dense solid center charcoal stroke
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      } else {
        // Dynamically select aura colors based on the current active beast
        let outerGlow = 'rgba(6, 182, 212, 0.12)';
        let middleGlow = 'rgba(34, 211, 238, 0.4)';
        let innerGlow = '#ffffff';

        if (dragonTypeRef.current === 'eagle') {
          outerGlow = 'rgba(255, 255, 255, 0.15)'; // Pale white/silver aura
          middleGlow = 'rgba(226, 232, 240, 0.45)'; // Silver core
        } else if (dragonTypeRef.current === 'serpent') {
          outerGlow = 'rgba(16, 185, 129, 0.16)'; // Emerald aura
          middleGlow = 'rgba(250, 204, 21, 0.4)'; // Warm Gold core
        }

        // Outer Neon Aura
        ctx.strokeStyle = outerGlow;
        ctx.lineWidth = 26;
        ctx.stroke();

        // Middle Energy Core
        ctx.strokeStyle = middleGlow;
        ctx.lineWidth = 10;
        ctx.stroke();

        // Inner Hot Core
        ctx.strokeStyle = innerGlow;
        ctx.lineWidth = 2.2;
        ctx.stroke();
      }

      // Render segments tail-to-head so overlay order is correct
      for (let i = segments.length - 1; i >= 0; i--) {
        const seg = segments[i];
        ctx.save();
        ctx.translate(seg.x, seg.y);
        ctx.rotate(seg.angle);

        const isHead = (i === 0);
        const isTailTip = (i === segments.length - 1);

        if (isHead) {
          // --- HEAD RENDERING CORE ---
          const isSnapping = mouthOpenRef.current > 0;
          if (isSnapping && !mouseRef.current.isDown) mouthOpenRef.current--;

          const type = dragonTypeRef.current;

          if (type === 'eagle') {
            // --- GRIFFIN HEAD FEATURES ---
            // 1. Feathered crest/mane (Eagle neck feathers)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'; // White feathers
            ctx.beginPath();
            ctx.moveTo(10, 8);
            ctx.lineTo(-20, 22);
            ctx.lineTo(-10, 10);
            ctx.lineTo(-28, 14);
            ctx.lineTo(-14, 0);
            ctx.lineTo(-28, -14);
            ctx.lineTo(-10, -10);
            ctx.lineTo(-20, -22);
            ctx.lineTo(10, -8);
            ctx.closePath();
            ctx.fill();
            
            // Outer feather strokes
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // 2. Eagle Skull Plate (Sleeker, aerodynamic white/silver head)
            ctx.fillStyle = 'rgba(248, 250, 252, 0.9)';
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2.0;

            ctx.beginPath();
            ctx.moveTo(15, 0); // Beak base
            ctx.lineTo(5, -12); // Forehead
            ctx.lineTo(-12, -14); // Back top
            ctx.lineTo(-16, 0); // Back middle
            ctx.lineTo(-12, 14); // Back bottom
            ctx.lineTo(5, 12); // Jaw base
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // 3. Sharp Hooked Eagle Beak (Golden)
            ctx.fillStyle = 'rgba(250, 204, 21, 0.95)'; // Yellow Gold
            ctx.strokeStyle = '#ca8a04';
            ctx.lineWidth = 1.5;
            
            ctx.beginPath();
            ctx.moveTo(12, -6); // Top base of beak
            ctx.quadraticCurveTo(35, -2, 40, 10); // Hooked tip
            ctx.quadraticCurveTo(25, 6, 12, 6); // Bottom base
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // 4. Feathery Tufts (ears)
            ctx.strokeStyle = '#f8fafc';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-5, -10);
            ctx.quadraticCurveTo(-15, -25, -25, -20);
            ctx.moveTo(-5, 10);
            ctx.quadraticCurveTo(-15, 25, -25, 20);
            ctx.stroke();

          } else if (type === 'serpent') {
            // --- INDIAN DRAGON / SERPENT (NĀGA) HEAD FEATURES ---
            // 1. Flared cobra-style energy hood pulsing behind the head
            const hoodPulse = 1.0 + Math.sin(time * 3.5) * 0.08;
            ctx.fillStyle = 'rgba(6, 95, 70, 0.45)'; // Semi-trans emerald
            ctx.strokeStyle = '#10b981'; // Bright emerald neon
            ctx.lineWidth = 2.4;
            
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.quadraticCurveTo(-15 * hoodPulse, -44 * hoodPulse, -32, -30);
            ctx.quadraticCurveTo(-18, -8, -15, 0);
            ctx.quadraticCurveTo(-18, 8, -32, 30);
            ctx.quadraticCurveTo(-15 * hoodPulse, 44 * hoodPulse, 10, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Internal decorative golden loops on the hood
            ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(-5, -18);
            ctx.quadraticCurveTo(-18, -12, -24, -3);
            ctx.moveTo(-5, 18);
            ctx.quadraticCurveTo(-18, 12, -24, 3);
            ctx.stroke();

            // 2. Ornate royal Indian crown (Mukut)
            ctx.fillStyle = 'rgba(250, 204, 21, 0.9)'; // Brilliant Gold
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-4, -6);
            ctx.lineTo(-22, -16); // Left peak
            ctx.lineTo(-14, -2);
            ctx.lineTo(-30, 0);   // Center tall peak
            ctx.lineTo(-14, 2);
            ctx.lineTo(-22, 16);  // Right peak
            ctx.lineTo(-4, 6);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // 3. Skull base plate (Semi-transparent deep green)
            ctx.fillStyle = 'rgba(6, 78, 59, 0.75)';
            ctx.strokeStyle = '#34d399';
            ctx.lineWidth = 2.5;

            ctx.beginPath();
            ctx.moveTo(25, 0);
            ctx.lineTo(12, -14);
            ctx.lineTo(-8, -16);
            ctx.lineTo(-24, -8);
            ctx.lineTo(-24, 8);
            ctx.lineTo(-8, 16);
            ctx.lineTo(12, 14);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // 4. Emerald vertex nodes
            ctx.fillStyle = '#34d399';
            const points = [
              {x: 25, y: 0}, {x: 12, y: -14}, {x: -8, y: -16},
              {x: -24, y: -8}, {x: -24, y: 8}, {x: -8, y: 16}, {x: 12, y: 14}
            ];
            points.forEach(pt => {
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
              ctx.fill();
            });

            // 5. Glowing Third Eye (Ajna Chakra)
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 14;
            ctx.shadowColor = '#a855f7'; // Spiritual violet aura
            ctx.beginPath();
            ctx.arc(8, 0, 3.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0; // reset

          } else {
            // --- MANTARAY HEAD FEATURES ---
            // Wide sweeping cephalic fins (horns) projecting forward
            ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
            ctx.strokeStyle = '#22d3ee'; // Sky Neon
            ctx.lineWidth = 2.0;

            // Left cephalic fin
            ctx.beginPath();
            ctx.moveTo(15, -12);
            ctx.quadraticCurveTo(35, -25, 45, -12);
            ctx.quadraticCurveTo(30, -5, 20, -6);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Right cephalic fin
            ctx.beginPath();
            ctx.moveTo(15, 12);
            ctx.quadraticCurveTo(35, 25, 45, 12);
            ctx.quadraticCurveTo(30, 5, 20, 6);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Flat streamlined ray head plate
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.strokeStyle = '#22d3ee'; // Cyan
            ctx.lineWidth = 2.5;

            ctx.beginPath();
            ctx.moveTo(28, 0); // Snout tip
            ctx.lineTo(20, -14);
            ctx.quadraticCurveTo(0, -22, -20, -18);
            ctx.lineTo(-30, 0); // Back of head
            ctx.quadraticCurveTo(0, 22, -20, 18);
            ctx.lineTo(20, 14);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Holographic white vertex nodes
            ctx.fillStyle = '#ffffff';
            const points = [
              {x: 25, y: 0}, {x: 12, y: -14}, {x: -8, y: -16},
              {x: -24, y: -8}, {x: -24, y: 8}, {x: -8, y: 16}, {x: 12, y: 14}
            ];
            points.forEach(pt => {
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
              ctx.fill();
            });

            // Crown spikes
            ctx.fillStyle = '#06b6d4';
            ctx.beginPath();
            ctx.moveTo(-16, -10);
            ctx.lineTo(-28, -18);
            ctx.lineTo(-20, -4);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(-16, 10);
            ctx.lineTo(-28, 18);
            ctx.lineTo(-20, 4);
            ctx.closePath();
            ctx.fill();
          }

          // --- SHARED DYNAMIC SNAP JAW ---
          ctx.save();
          if (isSnapping) {
            ctx.rotate(0.28);
          }
          
          let jawFill = 'rgba(30, 41, 59, 0.8)';
          let jawStroke = '#22d3ee';
          if (type === 'eagle') {
            jawFill = 'rgba(250, 204, 21, 0.9)'; // Golden lower beak
            jawStroke = '#ca8a04';
          } else if (type === 'serpent') {
            jawFill = 'rgba(6, 78, 59, 0.8)';
            jawStroke = '#34d399';
          }

          ctx.fillStyle = jawFill;
          ctx.strokeStyle = jawStroke;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          if (type === 'eagle') {
            ctx.moveTo(10, 6);
            ctx.lineTo(25, 8); // Lower beak
            ctx.lineTo(12, 12);
          } else {
            ctx.moveTo(10, 2);
            ctx.lineTo(24, 1);
            ctx.lineTo(15, 12);
            ctx.lineTo(2, 6);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          if (type !== 'eagle') {
            // Small fangs inside (Griffin doesn't need fangs)
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(18, 1);
            ctx.lineTo(15, 5);
            ctx.lineTo(13, 1);
            ctx.fill();
          }
          ctx.restore();

          // Glowing elemental eyes (different colors!)
          let eyeColor = '#ef4444'; // default hot red for Western
          let eyeShadow = '#f43f5e';
          if (type === 'eagle') {
            eyeColor = '#f59e0b'; // golden fierce eyes
            eyeShadow = '#facc15';
          } else if (type === 'serpent') {
            eyeColor = '#fb7185'; // glowing ruby rose eyes
            eyeShadow = '#e11d48';
          }

          ctx.fillStyle = eyeColor;
          ctx.shadowBlur = 12;
          ctx.shadowColor = eyeShadow;
          ctx.beginPath();
          ctx.arc(6, -6, 4, 0, Math.PI * 2);
          ctx.arc(6, 6, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset

        } else if (isTailTip) {
          // --- BREED SPECIFIC TAIL TIPS ---
          const type = dragonTypeRef.current;
          if (type === 'eagle') {
            // Eagle Feather Tail
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; // White feathers
            ctx.strokeStyle = '#e2e8f0'; // Light grey edge
            ctx.lineWidth = 1.5;

            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(-20, -15);
            ctx.lineTo(-40, -5);
            ctx.lineTo(-45, 0);
            ctx.lineTo(-40, 5);
            ctx.lineTo(-20, 15);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Feather details
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-38, 0);
            ctx.moveTo(-5, -5);
            ctx.lineTo(-35, -5);
            ctx.moveTo(-5, 5);
            ctx.lineTo(-35, 5);
            ctx.stroke();

          } else if (type === 'serpent') {
            // Elegant trident-like spearhead (Trishula) representing Naga divinity
            ctx.fillStyle = 'rgba(250, 204, 21, 0.8)'; // Golden shine
            ctx.strokeStyle = '#10b981'; // Emerald edge
            ctx.lineWidth = 2.2;

            ctx.beginPath();
            ctx.moveTo(12, 0);
            ctx.lineTo(-8, -12);
            ctx.lineTo(-4, -4);
            ctx.lineTo(-44, 0); // tall spear tip
            ctx.lineTo(-4, 4);
            ctx.lineTo(-8, 12);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Tiny outer trident prongs
            ctx.beginPath();
            ctx.moveTo(-8, -12);
            ctx.quadraticCurveTo(-24, -18, -26, -10);
            ctx.moveTo(-8, 12);
            ctx.quadraticCurveTo(-24, 18, -26, 10);
            ctx.stroke();

            // Glowing white vertex sparks
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(-44, 0, 2.5, 0, Math.PI * 2);
            ctx.arc(12, 0, 2.5, 0, Math.PI * 2);
            ctx.fill();

          } else {
            // --- MANTARAY STINGER TAIL ---
            ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 1.5;

            ctx.beginPath();
            ctx.moveTo(10, -2);
            ctx.lineTo(-45, 0); // Long thin stinger spike
            ctx.lineTo(10, 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Vertex dots for a magical constellation feel
            ctx.fillStyle = '#ffffff';
            const tailPoints = [
              {x: 10, y: 0},
              {x: -25, y: -15},
              {x: -12, y: -4},
              {x: -35, y: 0},
              {x: -12, y: 4},
              {x: -25, y: 15}
            ];
            tailPoints.forEach(pt => {
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
              ctx.fill();
            });
          }

        } else {
          // --- HIGH-END PARTICLE CONSTELLATION BODY AND DORSAL PLATES ---
          const isEven = (i % 2 === 0);
          const type = dragonTypeRef.current;

          let colorMain = isEven ? '#06b6d4' : '#10b981';
          let colorCore = isEven ? '#22d3ee' : '#34d399';
          let colorGlow = isEven ? 'rgba(6, 182, 212, 0.45)' : 'rgba(16, 185, 129, 0.45)';
          let colorSpine = colorMain;

          if (type === 'eagle') {
            colorMain = isEven ? '#fcd34d' : '#fbbf24'; // Lion Gold / Tan
            colorCore = isEven ? '#fde68a' : '#f59e0b'; // Light Gold / Deep Gold
            colorGlow = isEven ? 'rgba(251, 191, 36, 0.6)' : 'rgba(245, 158, 11, 0.4)';
            colorSpine = isEven ? '#ffffff' : '#e2e8f0'; // White feathered back ridge
          } else if (type === 'serpent') {
            colorMain = isEven ? '#10b981' : '#047857'; // Emerald / Deep Green
            colorCore = isEven ? '#facc15' : '#34d399'; // Bright Gold / Mint
            colorGlow = isEven ? 'rgba(16, 185, 129, 0.45)' : 'rgba(52, 211, 153, 0.45)';
            colorSpine = colorMain;
          }

          if (isJapaneseInkMode) {
            // 1. Draw outer dashed orbit ring in charcoal ink
            ctx.strokeStyle = '#44403c';
            ctx.lineWidth = 1.0;
            ctx.setLineDash([2, 3]);
            ctx.beginPath();
            ctx.arc(0, 0, seg.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]); // Reset dash

            // 2. Draw inner glowing solid ring in soft wash
            ctx.strokeStyle = 'rgba(28, 25, 23, 0.25)';
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.arc(0, 0, seg.size * 0.72, 0, Math.PI * 2);
            ctx.stroke();

            // 3. Inner core node - vermilion red stamp-like accent
            ctx.fillStyle = '#b91c1c';
            ctx.beginPath();
            ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
            ctx.fill();

            // 4. Delicate cross starburst in charcoal
            ctx.strokeStyle = 'rgba(28, 25, 23, 0.3)';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(-seg.size * 0.5, 0);
            ctx.lineTo(seg.size * 0.5, 0);
            ctx.moveTo(0, -seg.size * 0.5);
            ctx.lineTo(0, seg.size * 0.5);
            ctx.stroke();

            // Back Spine Scales (Charcoal/Vermilion tipped Pointy Plating)
            ctx.fillStyle = isEven ? '#1c1917' : '#b91c1c';
            ctx.beginPath();
            ctx.moveTo(0, -seg.size);
            ctx.lineTo(4, -seg.size - 6);
            ctx.lineTo(-2, -seg.size - 3);
            ctx.closePath();
            ctx.fill();
          } else {
            // 1. Draw outer dashed orbit ring
            ctx.strokeStyle = colorMain;
            ctx.lineWidth = 1.2;
            ctx.setLineDash([3, 4]);
            ctx.beginPath();
            ctx.arc(0, 0, seg.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]); // Reset dash

            // 2. Draw inner glowing solid ring
            ctx.strokeStyle = colorGlow;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(0, 0, seg.size * 0.72, 0, Math.PI * 2);
            ctx.stroke();

            // 3. Inner core star node
            ctx.fillStyle = colorCore;
            ctx.beginPath();
            ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
            ctx.fill();

            // 4. Delicate cross starburst glow in each node center
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.lineWidth = 0.85;
            ctx.beginPath();
            ctx.moveTo(-seg.size * 0.5, 0);
            ctx.lineTo(seg.size * 0.5, 0);
            ctx.moveTo(0, -seg.size * 0.5);
            ctx.lineTo(0, seg.size * 0.5);
            ctx.stroke();

            // Back Spine Scales (Glowing Neon Pointy Plating)
            ctx.fillStyle = colorSpine;
            ctx.beginPath();
            ctx.moveTo(0, -seg.size);
            ctx.lineTo(5, -seg.size - 8);
            ctx.lineTo(-2, -seg.size - 4);
            ctx.closePath();
            ctx.fill();
          }

          // --- 6. DRAGON WINGS ATTACHMENT (WESTERN ONLY, AND GRIFFIN) ---
          if ((type === 'mantaray' || type === 'eagle') && i === 4) {
            const wingSideFactor = type === 'eagle' ? 0.7 : 2.0; // Mantaray has huge wings
            
            // Speed-responsive fin flapping frequency and amplitude for hyper-fluid wingbeats
            const velocity = Math.hypot(headTargetRef.current.x - segments[0].x, headTargetRef.current.y - segments[0].y);
            
            let wingPhase = 0;
            let flapAngle = 0;
            
            if (type === 'eagle') {
              // Griffin: Glides when slow, powerful flaps when fast
              const glideMode = velocity < 6;
              const flapAmp = 0.05 + Math.min(0.35, velocity * 0.015);
              wingPhase = time * (1.0 + Math.min(4.5, velocity * 0.12));
              flapAngle = Math.sin(wingPhase) * flapAmp + (glideMode ? -0.1 : 0.15);
            } else {
              // Mantaray: majestic slow undulating flaps
              const glideMode = velocity < 4;
              const flapAmp = glideMode ? 0.1 : 0.2 + Math.min(0.2, velocity * 0.01);
              wingPhase = time * (1.2 + Math.min(2.0, velocity * 0.05));
              flapAngle = Math.sin(wingPhase) * flapAmp + 0.1;
            }

            // Draw Left Wing
            ctx.save();
            ctx.rotate(-Math.PI / 2 - flapAngle); // Rotate wing out and flap it
            if (type === 'eagle') {
              drawFeatherWing(ctx, seg.size, wingSideFactor, wingPhase, velocity);
            } else {
              drawFin(ctx, seg.size, wingSideFactor, wingPhase);
            }
            ctx.restore();

            // Draw Right Wing
            ctx.save();
            ctx.rotate(Math.PI / 2 + flapAngle); // Opposite direction
            if (type === 'eagle') {
              drawFeatherWing(ctx, seg.size, wingSideFactor, wingPhase, velocity);
            } else {
              drawFin(ctx, seg.size, wingSideFactor, wingPhase);
            }
            ctx.restore();
          }

          // --- 7. EAGLE LEGS ---
          if (type === 'eagle') {
            const velocity = Math.hypot(headTargetRef.current.x - segments[0].x, headTargetRef.current.y - segments[0].y);
            const legSpeed = 3.0 + Math.min(6.0, velocity * 0.2);
            const legSwing = Math.sin(time * legSpeed) * (0.15 + Math.min(0.3, velocity * 0.01)); // more swing when moving fast
            
            if (i === 8) { // Legs (eagle talons)
              ctx.save();
              ctx.fillStyle = '#facc15';
              ctx.strokeStyle = '#ca8a04';
              ctx.lineWidth = 2;
              
              // Left leg
              ctx.save();
              ctx.rotate(-Math.PI / 2.5 + legSwing);
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.quadraticCurveTo(10, -5, 20, -5); // Thigh
              ctx.lineTo(25, -2); // Talon base
              ctx.lineTo(15, 2);
              ctx.fill(); ctx.stroke();
              ctx.restore();

              // Right leg
              ctx.save();
              ctx.rotate(Math.PI / 2.5 - legSwing);
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.quadraticCurveTo(10, 5, 20, 5);
              ctx.lineTo(25, 2);
              ctx.lineTo(15, -2);
              ctx.fill(); ctx.stroke();
              ctx.restore();
              ctx.restore();
            }
          }
        }

        ctx.restore();
      }

      ctx.globalAlpha = 1.0; // Reset transparency back to full strength
      animationFrameId = requestAnimationFrame(render);
    };

    // Helper to draw realistic eagle-like feathered wings for the Griffin
    const drawFeatherWing = (context: CanvasRenderingContext2D, baseSize: number, scale: number, wingPhase: number, velocity: number = 0) => {
      const wingLength = 110 * scale;
      const isJapaneseInkMode = isJapaneseInkModeRef.current;
      
      const wingFlex = Math.sin(wingPhase) * (0.1 + Math.min(0.2, velocity * 0.02));
      
      context.save();
      
      // Main wing arm (bone)
      context.beginPath();
      context.moveTo(0, 0);
      context.quadraticCurveTo(wingLength * 0.4, wingLength * -0.2, wingLength, wingLength * 0.1 + wingFlex * 30);
      context.lineWidth = 4 * scale;
      context.strokeStyle = isJapaneseInkMode ? '#292524' : '#fbbf24'; // Golden bone/edge
      context.stroke();

      // Draw primary feathers (long outer feathers)
      const numPrimaries = 7;
      context.fillStyle = isJapaneseInkMode ? 'rgba(68, 64, 60, 0.9)' : 'rgba(255, 255, 255, 0.95)';
      context.strokeStyle = isJapaneseInkMode ? '#1c1917' : '#e2e8f0';
      context.lineWidth = 1.5;

      for (let i = 0; i < numPrimaries; i++) {
        const t = i / (numPrimaries - 1);
        const startX = wingLength * (0.6 + t * 0.4);
        const startY = (wingLength * -0.05 * (1-t) + (wingLength * 0.1 + wingFlex * 30) * t);
        
        const angle = -0.2 + t * 0.8;
        const featherLen = wingLength * (0.8 - t * 0.3);
        
        const endX = startX + Math.cos(angle) * featherLen;
        const endY = startY + Math.sin(angle) * featherLen;
        
        context.beginPath();
        context.moveTo(startX, startY);
        context.quadraticCurveTo(startX + 10, startY + featherLen/2, endX, endY);
        context.quadraticCurveTo(startX - 10, startY + featherLen/2, startX, startY);
        context.fill();
        context.stroke();
      }

      // Draw secondary feathers (shorter inner feathers)
      const numSecondaries = 8;
      context.fillStyle = isJapaneseInkMode ? 'rgba(120, 113, 108, 0.9)' : 'rgba(241, 245, 249, 0.95)';
      
      for (let i = 0; i < numSecondaries; i++) {
        const t = i / numSecondaries;
        const startX = wingLength * (0.1 + t * 0.5);
        const startY = (wingLength * -0.15 * (1-t) + wingLength * -0.05 * t);
        
        const angle = 0.5 + t * 0.4;
        const featherLen = wingLength * 0.5;
        
        const endX = startX + Math.cos(angle) * featherLen;
        const endY = startY + Math.sin(angle) * featherLen;
        
        context.beginPath();
        context.moveTo(startX, startY);
        context.quadraticCurveTo(startX + 8, startY + featherLen/2, endX, endY);
        context.quadraticCurveTo(startX - 8, startY + featherLen/2, startX, startY);
        context.fill();
        context.stroke();
      }
      
      context.restore();
    };

    // Helper to draw realistic, aquatic fins for a leviathan/dragon
    const drawFin = (context: CanvasRenderingContext2D, baseSize: number, scale: number, wingPhase: number) => {
      const finLength = 110 * scale;
      const isJapaneseInkMode = isJapaneseInkModeRef.current;
      
      // Fin undulation (wave)
      const finFlex = Math.sin(wingPhase) * 0.15;
      const finWave = Math.cos(wingPhase * 1.5) * 0.12;
      
      // Main fin points (like a fish's pectoral fin)
      const fStartX = 0;
      const fStartY = 0;
      
      // The leading edge curves back
      const leadCtrlX = finLength * 0.4;
      const leadCtrlY = finLength * -0.3 + finFlex * 15;
      const fTipX = finLength * 0.95;
      const fTipY = finLength * 0.15 + finFlex * 30;
      
      // The trailing edge is scalloped or curves back inwards
      const trailCtrlX = finLength * 0.6;
      const trailCtrlY = finLength * 0.6 + finWave * 20;
      
      const fBottomX = finLength * 0.15;
      const fBottomY = finLength * 0.45;
      
      // Draw fin membrane
      context.beginPath();
      context.moveTo(fStartX, fStartY);
      context.quadraticCurveTo(leadCtrlX, leadCtrlY, fTipX, fTipY);
      context.quadraticCurveTo(trailCtrlX, trailCtrlY, fBottomX, fBottomY);
      context.lineTo(fStartX, fStartY);
      
      if (isJapaneseInkMode) {
        const grad = context.createLinearGradient(0, 0, fTipX, fTipY);
        grad.addColorStop(0, 'rgba(41, 37, 36, 0.95)');
        grad.addColorStop(0.5, 'rgba(68, 64, 60, 0.65)');
        grad.addColorStop(1, 'rgba(120, 113, 108, 0.15)');
        context.fillStyle = grad;
        context.fill();
        
        context.lineWidth = 1.8;
        context.strokeStyle = 'rgba(28, 25, 23, 0.85)';
        context.stroke();
      } else {
        const grad = context.createLinearGradient(0, 0, fTipX, fTipY);
        grad.addColorStop(0, 'rgba(14, 165, 233, 0.85)');   // Deep water blue
        grad.addColorStop(0.4, 'rgba(45, 212, 191, 0.65)'); // Teal mid
        grad.addColorStop(0.8, 'rgba(167, 243, 208, 0.35)'); // Light seafoam outer
        grad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');  // Soft edge
        
        context.fillStyle = grad;
        context.shadowColor = 'rgba(45, 212, 191, 0.6)';
        context.shadowBlur = 12 * scale;
        context.fill();
        
        // Edge glow
        context.lineWidth = 2.0 * scale;
        context.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        context.stroke();
      }

      // Fin rays (spines)
      context.save();
      if (isJapaneseInkMode) {
        context.strokeStyle = 'rgba(41, 37, 36, 0.55)';
        context.lineWidth = 1.4 * scale;
      } else {
        context.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        context.lineWidth = 1.6 * scale;
        context.shadowBlur = 0;
      }
      
      // Draw 6 radiating spines
      for (let i = 1; i <= 6; i++) {
        const t = i / 7;
        
        // End points curve along the edge
        const endX = fTipX * (1 - t) + fBottomX * t + (Math.sin(t * Math.PI) * 10 * scale);
        const endY = fTipY * (1 - t) + fBottomY * t + (Math.cos(t * Math.PI) * 10 * scale);
        
        const ctrlX = leadCtrlX * (1 - t) + trailCtrlX * t;
        const ctrlY = leadCtrlY * (1 - t) + trailCtrlY * t;
        
        context.beginPath();
        context.moveTo(fStartX, fStartY);
        context.quadraticCurveTo(ctrlX * 0.6, ctrlY * 0.6, endX, endY);
        context.stroke();
      }
      context.restore();
      
      // Bioluminescent glowing nodes/bubbles along the fin base/spines
      if (!isJapaneseInkMode) {
        for (let i = 1; i <= 4; i++) {
          const t = i / 5;
          const px = fTipX * (1 - t) + fBottomX * t;
          const py = fTipY * (1 - t) + fBottomY * t;
          
          context.beginPath();
          context.arc(px * 0.7, py * 0.7, 2.0 * scale, 0, Math.PI * 2);
          context.fillStyle = 'rgba(255, 255, 255, 0.9)';
          context.shadowColor = 'rgba(255, 255, 255, 1)';
          context.shadowBlur = 8 * scale;
          context.fill();

          context.beginPath();
          context.arc(px * 0.7, py * 0.7, 1.0 * scale, 0, Math.PI * 2);
          context.fillStyle = 'rgba(14, 165, 233, 1)';
          context.fill();
        }
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('dblclick', handleDblClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Immersive high-end loader showing a Western style dragon orbiting gracefully */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="western-dragon-loader-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-500 ${
              isJapaneseInkMode ? 'bg-[#f5f4f0] text-stone-900 washi-paper' : 'bg-[#020617]'
            }`}
          >
            {/* Ambient vignette shield */}
            <div className={`absolute inset-0 opacity-90 pointer-events-none ${
              isJapaneseInkMode ? 'bg-radial-gradient from-transparent to-[#f0efe9]/60' : 'bg-radial-gradient from-transparent to-[#020617]'
            }`} />

            <div className="relative flex flex-col items-center">
              {/* Decorative HUD orbital rings */}
              <div className={`w-[320px] h-[320px] rounded-full border border-dashed flex items-center justify-center relative ${
                isJapaneseInkMode ? 'border-red-500/20' : 'border-cyan-500/15'
              }`}>
                <div className={`absolute top-4 left-4 font-mono text-[9px] tracking-widest uppercase ${
                  isJapaneseInkMode ? 'text-red-700/30' : 'text-cyan-400/10'
                }`}>
                  ORBITAL CODES ACTIVE
                </div>
                <div className={`absolute bottom-4 right-4 font-mono text-[9px] tracking-widest uppercase ${
                  isJapaneseInkMode ? 'text-stone-700/30' : 'text-emerald-400/10'
                }`}>
                  WESTERN DRAGON ENGAGED
                </div>
              </div>

              {/* Loader typography elements */}
              <div className="mt-8 text-center max-w-sm px-4">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`font-display text-xl font-extrabold tracking-tight ${
                    isJapaneseInkMode ? 'text-stone-900' : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400'
                  }`}
                >
                  Sandeep Singh Portfolio
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className={`font-mono text-[10px] uppercase tracking-widest mt-2 flex items-center justify-center gap-2 ${
                    isJapaneseInkMode ? 'text-red-700' : 'text-cyan-400/80'
                  }`}
                >
                  <Loader2 className={`h-3 w-3 animate-spin ${isJapaneseInkMode ? 'text-red-700' : 'text-cyan-400'}`} />
                  Calibrating Wyvern Flight Models...
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isJapaneseInkMode ? 0.75 : 0.25 }}
                  transition={{ delay: 0.7 }}
                  className={`mt-4 p-2.5 rounded border text-[10px] leading-normal font-mono transition-all duration-500 ${
                    isJapaneseInkMode ? 'border-stone-300 bg-stone-100 text-stone-600' : 'border-slate-900 bg-slate-950 text-slate-500'
                  }`}
                >
                  {isJapaneseInkMode ? 'SPLATTER RATIO ACTIVE. BLACK INK TRAILS READY. WASU PAPYRUS LOADED.' : 'DRAGON TAIL SPADE MOUNTED. BAT-WING MEMBRANES READY.'}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Western Dragon layer sits in background of the portfolio sections or on top during load */}
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 w-full h-full pointer-events-none transition-all duration-700 ${
          isJapaneseInkMode ? 'z-10 opacity-[0.82]' : 'z-10 opacity-[0.55]'
        } ${
          isLoading ? 'z-55 opacity-[0.85]' : ''
        }`}
        id="western-dragon-interactive-layer"
      />

      {/* Subtle floating HUD counter showing how many birds have been eaten */}
      {isLoadedRef.current && (
        <div className="fixed bottom-4 right-4 z-40 flex flex-col sm:flex-row gap-3">
          {/* Active Beast Breed Controller HUD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            id="dragon-breed-hud"
            className={`flex items-center gap-3.5 rounded-xl border p-2.5 px-3.5 shadow-xl backdrop-blur-md transition-all duration-500 ${
              isJapaneseInkMode ? 'border-stone-300 bg-stone-100/90' : 'border-slate-800 bg-slate-950/85'
            }`}
          >
            <div className={`h-2.5 w-2.5 rounded-full animate-pulse transition-all duration-500 ${
              isJapaneseInkMode ? 'bg-red-600 shadow-[0_0_8px_#dc2626]' :
              dragonType === 'eagle' ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24]' :
              dragonType === 'serpent' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' :
              'bg-cyan-400 shadow-[0_0_10px_#22d3ee]'
            }`} />
            <div className="flex flex-col">
              <span className={`text-[8px] font-mono font-bold uppercase tracking-wider ${
                isJapaneseInkMode ? 'text-stone-500' : 'text-slate-500'
              }`}>
                ACTIVE BREED
              </span>
              <span className={`text-xs font-mono font-extrabold uppercase tracking-tight ${
                isJapaneseInkMode ? 'text-stone-800' : 'text-slate-100'
              }`}>
                {isJapaneseInkMode ? (
                  <span className="text-red-700">Sumi-e Dragon</span>
                ) : (
                  <>
                    {dragonType === 'eagle' && <span className="text-amber-400">Golden Eagle</span>}
                    {dragonType === 'serpent' && <span className="text-emerald-400">Emerald Serpent</span>}
                    {dragonType === 'mantaray' && <span className="text-cyan-400">Cosmic Mantaray</span>}
                  </>
                )}
              </span>
            </div>
            <div className={`border-l pl-3 text-[9px] font-mono max-w-[130px] leading-tight ${
              isJapaneseInkMode ? 'border-stone-300 text-stone-600 font-bold' : 'border-slate-800 text-slate-400/80'
            }`}>
              {isJapaneseInkMode ? 'Double Click to Ink' : 'Double Click to Morph'}
            </div>
          </motion.div>

          {/* Predator Ratio HUD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            id="dragon-eat-score-hud"
            className={`flex items-center gap-2 rounded-xl border p-2.5 px-3.5 shadow-xl backdrop-blur-md transition-all duration-500 ${
              isJapaneseInkMode ? 'border-stone-300 bg-stone-100/90' : 'border-slate-800 bg-slate-950/85'
            }`}
          >
            <Trophy className={`h-4 w-4 animate-bounce ${isJapaneseInkMode ? 'text-red-700' : 'text-amber-400'}`} />
            <div className="flex flex-col">
              <span className={`text-[8px] font-mono font-bold uppercase tracking-wider ${
                isJapaneseInkMode ? 'text-stone-500' : 'text-slate-500'
              }`}>
                PREDATOR RATIO
              </span>
              <span className={`text-xs font-mono font-extrabold flex items-center gap-1.5 ${
                isJapaneseInkMode ? 'text-stone-800' : 'text-slate-100'
              }`}>
                <span>Eaten:</span>
                <span className={`transition-colors duration-500 ${
                  isJapaneseInkMode ? 'text-red-700 font-extrabold text-sm' :
                  dragonType === 'eagle' ? 'text-amber-400' :
                  dragonType === 'serpent' ? 'text-emerald-400' :
                  'text-cyan-400'
                }`}>{birdsEaten}</span>
                <span className={`text-[10px] ${isJapaneseInkMode ? 'text-stone-500 font-medium' : 'text-slate-400'}`}>birds</span>
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';

const LOGO_URL =
  'https://xnpqbgmqbjxgvhsojlft.supabase.co/storage/v1/object/public/brand-kit/1779740982135_newBrandAsset.png';

// ─── Particle data ──────────────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  color: string;
  shape: 'circle' | 'diamond' | 'line';
  rotation: number;
  rotationSpeed: number;
}

function makeParticles(count: number): Particle[] {
  const colors = ['#00FF88', '#00CC6A', '#BBFF00', '#39FF14', '#ffffff', '#00ffaa'];
  const shapes: Particle['shape'][] = ['circle', 'diamond', 'line'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    opacity: Math.random() * 0.7 + 0.3,
    speedX: (Math.random() - 0.5) * 0.4,
    speedY: (Math.random() - 0.5) * 0.4,
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 3,
  }));
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function OpeningLoader({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [glitch, setGlitch] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const startTimeRef = useRef<number>(0);

  // ── Build particles once ────────────────────────────────────────────────
  useEffect(() => {
    const p = makeParticles(55);
    particlesRef.current = p;
    setParticles(p);
  }, []);

  // ── Animate particles via RAF ───────────────────────────────────────────
  useEffect(() => {
    if (phase === 'out') return;
    function tick() {
      particlesRef.current = particlesRef.current.map((p) => {
        let nx = p.x + p.speedX;
        let ny = p.y + p.speedY;
        if (nx < 0) nx = 100;
        if (nx > 100) nx = 0;
        if (ny < 0) ny = 100;
        if (ny > 100) ny = 0;
        return { ...p, x: nx, y: ny, rotation: p.rotation + p.rotationSpeed };
      });
      setParticles([...particlesRef.current]);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase]);

  // ── Progress bar animation ──────────────────────────────────────────────
  useEffect(() => {
    startTimeRef.current = performance.now();
    const DURATION = 2200; // ms to fill bar
    function animateBar(now: number) {
      const elapsed = now - startTimeRef.current;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgressWidth(pct);
      if (pct < 100) requestAnimationFrame(animateBar);
    }
    requestAnimationFrame(animateBar);
  }, []);

  // ── Phase sequencing ───────────────────────────────────────────────────
  useEffect(() => {
    // in  → 400ms  → hold
    const t1 = setTimeout(() => setPhase('hold'), 400);
    // hold → 2600ms → out
    const t2 = setTimeout(() => setPhase('out'), 3000);
    // out  → 700ms  → done
    const t3 = setTimeout(() => onFinish(), 3700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);

  // ── Random glitch flicker ──────────────────────────────────────────────
  useEffect(() => {
    const scheduleGlitch = () => {
      const delay = Math.random() * 1200 + 400;
      return setTimeout(() => {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 80 + Math.random() * 80);
        scheduleGlitch();
      }, delay);
    };
    const t = scheduleGlitch();
    return () => clearTimeout(t);
  }, []);

  // ── Computed styles ────────────────────────────────────────────────────
  const wrapStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 99999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#030f08',
    overflow: 'hidden',
    // exit wipe: clip from top
    clipPath: phase === 'out' ? 'inset(0 0 100% 0)' : 'inset(0 0 0% 0)',
    transition: phase === 'out' ? 'clip-path 0.65s cubic-bezier(0.76,0,0.24,1)' : 'none',
  };

  const logoStyle: React.CSSProperties = {
    width: 'clamp(160px, 28vw, 280px)',
    height: 'auto',
    objectFit: 'contain',
    transform: phase === 'in'
      ? 'scale(0.4) translateY(30px)'
      : glitch
        ? `scale(1) translateX(${(Math.random() - 0.5) * 8}px)`
        : 'scale(1) translateY(0)',
    opacity: phase === 'in' ? 0 : 1,
    transition: phase === 'in'
      ? 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease'
      : 'transform 0.05s linear',
    filter: glitch
      ? 'drop-shadow(0 0 20px #00FF88) drop-shadow(3px 0 0 #BBFF00) drop-shadow(-3px 0 0 #00ffaa)'
      : 'drop-shadow(0 0 32px rgba(0,255,136,0.6)) drop-shadow(0 0 80px rgba(0,255,136,0.2))',
  };

  return (
    <div style={wrapStyle}>

      {/* ── Background gradient pulses ─────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'
      }}>
        {/* Radial glow center */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '80vw', height: '80vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,136,0.12) 0%, rgba(0,255,136,0.04) 40%, transparent 70%)',
          animation: 'loader-pulse 1.8s ease-in-out infinite',
        }} />

        {/* Corner glows */}
        <div style={{
          position: 'absolute', top: '-10%', left: '-10%',
          width: '50vw', height: '50vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 60%)',
          animation: 'loader-float 4s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', right: '-15%',
          width: '60vw', height: '60vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(187,255,0,0.05) 0%, transparent 60%)',
          animation: 'loader-float 5s ease-in-out infinite reverse',
        }} />
      </div>

      {/* ── Scan lines overlay ────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)',
        zIndex: 2,
        animation: 'scanline-scroll 8s linear infinite',
      }} />

      {/* ── Particles ─────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.shape === 'line' ? `${p.size * 4}px` : `${p.size}px`,
              height: p.shape === 'line' ? '1.5px' : `${p.size}px`,
              background: p.shape === 'diamond'
                ? 'transparent'
                : p.color,
              border: p.shape === 'diamond' ? `1.5px solid ${p.color}` : 'none',
              borderRadius: p.shape === 'circle' ? '50%' : '0',
              opacity: p.opacity * (phase === 'in' ? 0.3 : 1),
              transform: `rotate(${p.rotation}deg) ${p.shape === 'diamond' ? 'rotate(45deg)' : ''}`,
              transition: 'opacity 0.4s ease',
              boxShadow: p.shape === 'circle' ? `0 0 ${p.size * 2}px ${p.color}40` : 'none',
            }}
          />
        ))}
      </div>

      {/* ── Grid lines (cyberpunk aesthetic) ─────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        backgroundImage: `
          linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%)',
      }} />

      {/* ── Main content ──────────────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '2rem',
      }}>

        {/* Logo */}
        <div style={{ position: 'relative' }}>
          {/* Ring spin around logo */}
          <div style={{
            position: 'absolute',
            inset: '-24px',
            borderRadius: '50%',
            border: '1.5px solid rgba(0,255,136,0.2)',
            borderTopColor: '#00FF88',
            animation: 'loader-ring-spin 1.2s linear infinite',
          }} />
          <div style={{
            position: 'absolute',
            inset: '-40px',
            borderRadius: '50%',
            border: '1px dashed rgba(0,255,136,0.1)',
            animation: 'loader-ring-spin 2.5s linear infinite reverse',
          }} />

          <img
            src={LOGO_URL}
            alt="Gloopo"
            style={logoStyle}
            draggable={false}
          />
        </div>


        {/* Progress bar */}
        <div style={{
          width: 'clamp(180px, 28vw, 300px)',
          opacity: phase === 'in' ? 0 : 1,
          transition: 'opacity 0.4s ease 0.35s',
        }}>
          <div style={{
            height: '2px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '100px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progressWidth}%`,
              background: 'linear-gradient(90deg, #00CC6A, #00FF88, #BBFF00)',
              borderRadius: '100px',
              boxShadow: '0 0 12px rgba(0,255,136,0.8)',
              transition: 'width 0.08s linear',
            }} />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginTop: '0.5rem',
          }}>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '0.65rem',
              color: 'rgba(0,255,136,0.5)',
              letterSpacing: '0.08em',
            }}>
              INITIALIZING
            </span>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '0.65rem',
              color: 'rgba(0,255,136,0.7)',
              letterSpacing: '0.04em',
            }}>
              {Math.round(progressWidth)}%
            </span>
          </div>
        </div>

      </div>

      {/* ── Corner decorations ────────────────────────────────────── */}
      {['top-left','top-right','bottom-left','bottom-right'].map((corner) => (
        <div key={corner} style={{
          position: 'absolute',
          top: corner.includes('top') ? '1.5rem' : 'auto',
          bottom: corner.includes('bottom') ? '1.5rem' : 'auto',
          left: corner.includes('left') ? '1.5rem' : 'auto',
          right: corner.includes('right') ? '1.5rem' : 'auto',
          width: '28px', height: '28px',
          borderTop: corner.includes('top') ? '2px solid rgba(0,255,136,0.4)' : 'none',
          borderBottom: corner.includes('bottom') ? '2px solid rgba(0,255,136,0.4)' : 'none',
          borderLeft: corner.includes('left') ? '2px solid rgba(0,255,136,0.4)' : 'none',
          borderRight: corner.includes('right') ? '2px solid rgba(0,255,136,0.4)' : 'none',
          opacity: phase === 'in' ? 0 : 1,
          transition: 'opacity 0.5s ease 0.3s',
        }} />
      ))}

      {/* ── Keyframe styles ───────────────────────────────────────── */}
      <style>{`
        @keyframes loader-pulse {
          0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 1; }
          50%       { transform: translate(-50%,-50%) scale(1.15); opacity: 0.6; }
        }
        @keyframes loader-float {
          0%, 100% { transform: translate(0,0); }
          50%       { transform: translate(4%, 3%); }
        }
        @keyframes loader-ring-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes scanline-scroll {
          0%   { background-position: 0 0; }
          100% { background-position: 0 100px; }
        }
      `}</style>
    </div>
  );
}

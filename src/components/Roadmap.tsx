"use client";
import React, { useRef, useState, useEffect, MouseEvent } from 'react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/utils/supabase';

const INITIAL_PHASES = [
  { idx: '0', title: 'Preparation', items: ['Token Studio creation', '75% pre-buy execution', 'Crystara NFT collection'] },
  { idx: '1', title: 'Activation', items: ['G/$S pool deployment', 'LLIM Activation', 'Liquidity top-ups'] },
  { idx: '2', title: 'Dominance', items: ['Gen 1 NFT Launch', 'Social dominance campaign', 'Community expansion'] },
  { idx: '3', title: 'Governance', items: ['Lore expansion', 'Website integration', 'Gloopo DAO Launch'] },
  { idx: '4', title: 'Expansion', items: ['Final LLIM Deployment', 'Cross-chain reach', 'Supra Bridging'] }
];

const Roadmap = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [phases, setPhases] = useState(INITIAL_PHASES);

  useEffect(() => {
    const loadRoadmapSettings = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('website_settings')
            .select('value')
            .eq('key', 'roadmap')
            .single();
          if (data && Array.isArray(data.value)) {
            const mapped = data.value.map((p: any) => {
              const phaseNum = p.phase.replace(/\D/g, '') || '0';
              return {
                idx: phaseNum,
                title: p.title,
                items: p.items || []
              };
            });
            setPhases(mapped);
          }
        } catch (err) {
          console.error('Failed to load dynamic Roadmap settings:', err);
        }
      } else {
        const val = localStorage.getItem('gloopo_mock_setting_roadmap');
        if (val) {
          try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) {
              const mapped = parsed.map((p: any) => {
                const phaseNum = p.phase.replace(/\D/g, '') || '0';
                return {
                  idx: phaseNum,
                  title: p.title,
                  items: p.items || []
                };
              });
              setPhases(mapped);
            }
          } catch (e) {}
        }
      }
    };
    loadRoadmapSettings();
  }, []);

  const handleMouseDown = (e: MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="roadmap" className="roadmap-section">
      <div className="container">
        <span className="tagline">The Evolution</span>
        <h2 className="section-title">Roadmap</h2>
        
        <div className="roadmap-slider-container">
          <button className="nav-btn prev-btn" onClick={() => scroll('left')}>
            <ChevronLeft size={24} />
          </button>
          
          <div 
            className={`scroll-wrapper ${isDragging ? 'dragging' : ''}`}
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <div className="roadmap-track">
              {phases.map((phase, i) => (
              <div className="roadmap-card" key={i}>
                <div className="timeline-dot"></div>
                <div className="timeline-content glass-card">
                  <div className="phase-badge">Phase {phase.idx}</div>
                  <h3>{phase.title}</h3>
                  <ul className="phase-list">
                    {phase.items.map((item, j) => (
                      <li key={j}>
                        <span className="check-icon">
                          <Sparkles size={16} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            </div>
          </div>
          <button className="nav-btn next-btn" onClick={() => scroll('right')}>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .roadmap-section {
          padding: 120px 0;
          background: #030806;
          position: relative;
        }
        
        .roadmap-slider-container {
          position: relative;
          width: 100%;
          margin-top: 3rem;
        }

        .nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid rgba(0, 255, 136, 0.3);
          color: var(--primary);
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          backdrop-filter: blur(5px);
          transition: all 0.3s ease;
        }
        .nav-btn:hover {
          background: var(--primary);
          color: #000;
          box-shadow: 0 0 20px var(--primary);
        }
        .prev-btn { left: -25px; }
        .next-btn { right: -25px; }

        .scroll-wrapper {
          width: 100%;
          overflow-x: auto;
          padding: 2rem 0 4rem 0;
          cursor: grab;
          /* Hide scrollbar for a clean look but allow scrolling */
          scrollbar-width: none;
          -ms-overflow-style: none;
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
        .scroll-wrapper.dragging {
          cursor: grabbing;
        }
        .scroll-wrapper.dragging .timeline-content {
          pointer-events: none;
          user-select: none;
        }
        .scroll-wrapper::-webkit-scrollbar {
          display: none;
        }

        .roadmap-track {
          display: flex;
          gap: 2.5rem;
          padding: 0 4rem; /* Padding for the gradient mask */
          width: max-content;
          position: relative;
        }

        /* The continuous horizontal line */
        .roadmap-track::before {
          content: '';
          position: absolute;
          top: 24px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, rgba(0, 255, 136, 0) 0%, rgba(0, 255, 136, 0.4) 10%, rgba(0, 255, 136, 0.4) 90%, rgba(0, 255, 136, 0) 100%);
          z-index: 1;
        }

        .roadmap-card {
          width: 360px;
          position: relative;
          display: flex;
          flex-direction: column;
          padding-top: 5rem;
        }

        /* Vertical connector from the track to the card */
        .roadmap-card::before {
          content: '';
          position: absolute;
          top: 24px;
          left: 40px;
          width: 2px;
          height: calc(5rem - 24px);
          background: linear-gradient(to bottom, rgba(0, 255, 136, 0.8), rgba(0, 255, 136, 0.1));
          z-index: 1;
        }

        /* The glowing dot on the track */
        .timeline-dot {
          position: absolute;
          top: 18px; /* 24px (line) - 6px (half dot height) */
          left: 34px; /* 40px (vert line) - 6px (half dot width) */
          width: 14px;
          height: 14px;
          background: #030806;
          border: 3px solid var(--primary);
          border-radius: 50%;
          z-index: 2;
          box-shadow: 0 0 15px var(--primary);
          transition: all 0.3s ease;
        }

        .roadmap-card:hover .timeline-dot {
          background: var(--primary);
          transform: scale(1.3);
          box-shadow: 0 0 25px var(--primary);
        }

        .timeline-content {
          flex: 1;
          padding: 2.5rem;
          border-radius: var(--radius-lg);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease;
          position: relative;
          background: rgba(0, 255, 136, 0.02);
          border: 1px solid rgba(255, 255, 136, 0.05);
        }
        
        .roadmap-card:hover .timeline-content {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(0, 255, 136, 0.15);
          border-color: rgba(0, 255, 136, 0.4);
        }

        .phase-badge {
          display: inline-block;
          background: rgba(0, 255, 136, 0.08);
          color: var(--primary);
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          font-weight: 800;
          font-size: 0.85rem;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(0, 255, 136, 0.2);
          letter-spacing: 0.05em;
        }
        
        .timeline-content h3 {
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          color: #fff;
        }
        
        .phase-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .phase-list li {
          color: var(--text-muted);
          margin-bottom: 1.2rem;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 1rem;
          font-weight: 500;
        }
        
        .check-icon {
          color: var(--primary);
          font-size: 1.2rem;
          filter: drop-shadow(0 0 8px var(--primary));
          margin-top: -2px;
        }

        @media (max-width: 768px) {
          .roadmap-card { width: 300px; }
          .timeline-content { padding: 2rem; }
          .nav-btn { display: none; }
          .scroll-wrapper { padding: 2rem 0; }
        }
      `}</style>
    </section>
  );
};

export default Roadmap;

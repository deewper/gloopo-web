"use client";
import React, { useEffect, useRef, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/utils/supabase';

const INITIAL_ALLOCATION = [
  { cat: 'Public Pool', amount: '200M', perc: '20%', color: '#00FF88' },
  { cat: 'LLIM Treasury', amount: '200M', perc: '20%', color: '#10F090' },
  { cat: 'Ecosystem', amount: '200M', perc: '20%', color: '#20E198' },
  { cat: 'Core Team', amount: '100M', perc: '10%', color: '#30D2A0' },
  { cat: 'Airdrop', amount: '100M', perc: '10%', color: '#40C3A8' },
  { cat: 'NFT Holders', amount: '100M', perc: '10%', color: '#50B4B0' },
  { cat: 'Treasury', amount: '50M', perc: '5%', color: '#60A5B8' },
  { cat: 'Strategic', amount: '50M', perc: '5%', color: '#7096C0' },
];

const Tokenomics = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const [ticker, setTicker] = useState('GLOOPO');
  const [totalSupply, setTotalSupply] = useState('1,000,000,000');
  const [allocation, setAllocation] = useState(INITIAL_ALLOCATION);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const loadTokenomicsSettings = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('website_settings')
            .select('value')
            .eq('key', 'tokenomics')
            .single();
          if (data && data.value) {
            const val = data.value;
            setTicker(val.ticker || 'GLOOPO');
            setTotalSupply(val.totalSupply || '1,000,000,000');
            if (val.chartData && val.chartData.length > 0) {
              const rawSupply = parseFloat((val.totalSupply || '1,000,000,000').replace(/,/g, '')) || 1000000000;
              const formatted = val.chartData.map((item: any) => {
                const valInMillions = (rawSupply * (item.percentage / 100)) / 1000000;
                const formattedAmount = valInMillions >= 1 ? `${valInMillions}M` : `${valInMillions * 1000}K`;
                return {
                  cat: item.label,
                  amount: formattedAmount,
                  perc: `${item.percentage}%`,
                  color: item.color
                };
              });
              setAllocation(formatted);
            }
          }
        } catch (err) {
          console.error('Failed to load dynamic Tokenomics settings:', err);
        }
      } else {
        const val = localStorage.getItem('gloopo_mock_setting_tokenomics');
        if (val) {
          try {
            const parsed = JSON.parse(val);
            setTicker(parsed.ticker || 'GLOOPO');
            setTotalSupply(parsed.totalSupply || '1,000,000,000');
            if (parsed.chartData && parsed.chartData.length > 0) {
              const rawSupply = parseFloat((parsed.totalSupply || '1,000,000,000').replace(/,/g, '')) || 1000000000;
              const formatted = parsed.chartData.map((item: any) => {
                const valInMillions = (rawSupply * (item.percentage / 100)) / 1000000;
                const formattedAmount = valInMillions >= 1 ? `${valInMillions}M` : `${valInMillions * 1000}K`;
                return {
                  cat: item.label,
                  amount: formattedAmount,
                  perc: `${item.percentage}%`,
                  color: item.color
                };
              });
              setAllocation(formatted);
            }
          } catch (e) {}
        }
      }
    };
    loadTokenomicsSettings();
  }, []);

  const getConicGradient = () => {
    let currentPct = 0;
    const gradientParts = allocation.map((item) => {
      const start = currentPct;
      const itemPerc = parseFloat(item.perc);
      currentPct += itemPerc;
      return `${item.color} ${start}% ${currentPct}%`;
    });
    return gradientParts.join(', ');
  };

  const calloutData = allocation.map((item, index, array) => {
    let acc = 0;
    for (let i = 0; i < index; i++) acc += parseFloat(array[i].perc);
    const middle = acc + (parseFloat(item.perc) / 2);
    return { ...item, angle: (middle / 100) * 360 };
  });

  return (
    <section id="tokenomics" className={`token-section ${isVisible ? 'is-visible' : ''}`} ref={sectionRef}>
      <div className="container">
        <div className="header-box">
          <span className="tagline">Tokenomics</span>
          <h2 className="section-title">Token Distribution</h2>
          <div className="total-supply-pill">
            Total Supply: <span>{totalSupply} ${ticker}</span>
          </div>
        </div>

        <div className="tokenomics-layout">
          <div className="viz-col">
            <div className="graph-container">
              <div className="donut-wrapper">
                <div className="donut-hole">
                  <div className="hole-content">
                    <span className="label">SYMBOL</span>
                    <span className="value">${ticker}</span>
                  </div>
                </div>
                <div className="conic-chart" style={{ background: `conic-gradient(${getConicGradient()})` }}></div>

                {calloutData.map((item, i) => {
                  const rotation = item.angle - 90;
                  const delayLine = 0.8 + (i * 0.1);
                  const delayText = delayLine + 0.1;
                  return (
                    <div 
                      key={`callout-${i}`} 
                      className="chart-callout"
                      style={{ transform: `rotate(${rotation}deg)` }}
                    >
                      <div 
                        className="callout-line" 
                        style={{ 
                          backgroundColor: item.color, 
                          color: item.color,
                          animationDelay: `${delayLine}s`
                        }}
                      ></div>
                      <div 
                        className="callout-content-wrapper" 
                        style={{ 
                          '--counter-rot': `${-rotation}deg`,
                          animationDelay: `${delayText}s`
                        } as React.CSSProperties}
                      >
                        <div className="callout-content">
                          <span className="callout-perc" style={{ color: item.color }}>{item.perc}</span>
                          <span className="callout-cat">{item.cat}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="char-wrapper">
                <img src="/images/token-char.png" alt="Gloopo Character" className="token-char-img" />
              </div>
            </div>
          </div>

          <div className="info-col">
            <div className="stat-grid">
              {allocation.map((item, i) => (
                <div key={i} className="stat-card glass-card" style={{ '--accent': item.color, animationDelay: `${0.2 + (i * 0.1)}s` } as React.CSSProperties}>
                  <div className="card-top">
                    <div className="dot" style={{ background: item.color }}></div>
                    <span className="perc" style={{ color: item.color }}>{item.perc}</span>
                  </div>
                  <h4 className="name">{item.cat}</h4>
                  <div className="progress-bg">
                    <div className="progress-fill" style={{ width: item.perc, background: item.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        .token-section {
          padding: 120px 0 60px;
          background-color: var(--background);
          background-image: radial-gradient(circle at 90% 90%, rgba(0, 255, 136, 0.03), transparent 400px);
        }
        .header-box { text-align: center; margin-bottom: 80px; }
        .total-supply-pill {
          display: inline-block;
          background: rgba(0, 255, 136, 0.05);
          border: 1px solid var(--glass-border);
          padding: 0.8rem 2.5rem;
          border-radius: 100px;
          font-weight: 700;
          color: var(--text-muted);
        }
        .total-supply-pill span { color: var(--primary); font-weight: 800; }

        .tokenomics-layout {
          display: flex;
          flex-direction: column;
          gap: 4rem;
          align-items: center;
          margin-bottom: 0;
        }
        .info-col {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Initial States for Animation */
        .donut-wrapper {
          opacity: 0;
          transform: scale(0.8) rotate(-45deg);
        }
        .callout-line {
          width: 0;
          opacity: 0;
        }
        .callout-content-wrapper {
          opacity: 0;
          transform: rotate(var(--counter-rot)) translateX(-20px);
        }
        .stat-card {
          opacity: 0;
          transform: translateY(30px);
        }

        /* Animated States */
        .is-visible .donut-wrapper {
          animation: popSpin 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .is-visible .callout-line {
          animation: expandLine 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .is-visible .callout-content-wrapper {
          animation: slideInText 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .is-visible .stat-card {
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Keyframes */
        @keyframes popSpin {
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes expandLine {
          to { width: 75px; opacity: 1; }
        }
        @keyframes slideInText {
          to { opacity: 1; transform: rotate(var(--counter-rot)) translateX(0); }
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .donut-wrapper {
          position: relative;
          width: 350px;
          height: 350px;
          margin: 40px 0 60px 0;
          filter: drop-shadow(0 0 30px rgba(0, 255, 136, 0.1));
        }

        .graph-container {
          display: flex;
          align-items: center;
          gap: 100px;
          position: relative;
        }

        .char-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .token-char-img {
          height: 580px;
          width: auto;
          filter: drop-shadow(0 0 50px rgba(0, 255, 136, 0.2));
          transform: translateY(40px);
        }

        @media (max-width: 1200px) {
          .graph-container {
            flex-direction: column;
            gap: 2rem;
          }
          .token-char-img {
            height: 300px;
          }
          .donut-wrapper {
            margin: 40px auto 60px auto;
          }
        }

        .chart-callout {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 250px;
          height: 2px;
          transform-origin: 0 50%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          z-index: 3;
          margin-top: -1px;
        }
        .callout-line {
          height: 2px;
          border-radius: 2px;
          box-shadow: 0 0 10px currentColor;
        }
        .callout-content-wrapper {
          position: absolute;
          right: -60px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 120px;
        }
        .callout-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(0,0,0,0.7);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-sm);
          backdrop-filter: blur(5px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        .callout-perc { font-weight: 800; font-size: 0.9rem; font-family: 'Space Grotesk', sans-serif; }
        .callout-cat { font-size: 0.7rem; font-weight: 700; color: #ccc; white-space: nowrap; }

        .conic-chart {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: conic-gradient(
            #00FF88 0% 20%, 
            #10F090 20% 40%, 
            #20E198 40% 60%, 
            #30D2A0 60% 70%, 
            #40C3A8 70% 80%, 
            #50B4B0 80% 90%, 
            #60A5B8 90% 95%, 
            #7096C0 95% 100%
          );
        }
        .donut-hole {
          position: absolute;
          width: 75%;
          height: 75%;
          background: var(--background);
          border-radius: 50%;
          top: 12.5%;
          left: 12.5%;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 0 40px rgba(0,0,0,0.8);
        }
        .hole-content { text-align: center; }
        .hole-content .label { display: block; font-size: 0.8rem; color: var(--text-muted); letter-spacing: 0.2em; font-weight: 800; }
        .hole-content .value { font-size: 2rem; font-weight: 900; color: var(--primary); font-family: 'Space Grotesk', sans-serif; }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 0.8rem;
        }
        .stat-card {
          padding: 0.8rem;
          border-radius: var(--radius-md);
        }
        .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; }
        .dot { width: 6px; height: 6px; border-radius: 50%; box-shadow: 0 0 8px currentColor; }
        .perc { font-weight: 800; font-size: 0.9rem; font-family: 'Space Grotesk', sans-serif; }
        .name { font-size: 0.75rem; line-height: 1.2; margin-bottom: 0.5rem; font-weight: 700; color: #fff; min-height: 1.8rem; display: flex; align-items: center; }
        .progress-bg { width: 100%; height: 3px; background: rgba(255,255,255,0.05); border-radius: 5px; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 5px; }

        @media (max-width: 1200px) {
          .stat-grid { grid-template-columns: repeat(4, 1fr); }
          .chart-callout { display: none; }
          .donut-wrapper { margin: 0 auto; }
        }
        @media (max-width: 992px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .char-wrapper {
            display: none;
          }
          .donut-wrapper {
            width: 220px;
            height: 220px;
            margin: 30px auto;
          }
          .donut-hole {
            width: 70%;
            height: 70%;
            top: 15%;
            left: 15%;
          }
          .hole-content .value {
            font-size: 1.3rem;
          }
          .hole-content .label {
            font-size: 0.6rem;
          }
          
          /* Show callouts dynamically adjusted on mobile screen */
          .chart-callout {
            display: flex !important;
            width: 130px;
          }
          .is-visible .callout-line {
            animation: expandLineMobile 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .callout-content-wrapper {
            right: -45px;
            width: 90px;
          }
          .callout-content {
            padding: 0.2rem 0.4rem;
            border-radius: 6px;
            background: rgba(3, 8, 6, 0.85);
          }
          .callout-perc {
            font-size: 0.75rem;
          }
          .callout-cat {
            font-size: 0.55rem;
            max-width: 70px;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          @keyframes expandLineMobile {
            to { width: 30px; opacity: 1; }
          }
        }
        @media (max-width: 576px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .stat-card {
            padding: 0.6rem;
          }
          .name {
            font-size: 0.7rem;
            min-height: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Tokenomics;

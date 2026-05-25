"use client";
import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  RefreshCcw, 
  GraduationCap,
  Cpu,
  Shield,
  Activity,
  Globe,
  Terminal,
  Lock,
  Settings
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/utils/supabase';

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Zap,
  RefreshCcw,
  GraduationCap,
  Cpu,
  Shield,
  Activity,
  Globe,
  Terminal,
  Lock,
  Settings
};

const About = () => {
  const [headline, setHeadline] = useState("Who is Gloopo?");
  const [subheadline, setSubheadline] = useState("Origin Story");
  const [description, setDescription] = useState("Born natively on the Supra L1 blockchain, Gloopo is a unique entity that represents the evolution of digital exploration. More than just an asset, Gloopo is a narrative journey that transforms holders into explorers of the Supra ecosystem.");

  // Tech Cards States
  const [techCard1Icon, setTechCard1Icon] = useState("Zap");
  const [techCard1Title, setTechCard1Title] = useState("High Throughput");
  const [techCard1Desc, setTechCard1Desc] = useState("Low-latency consensus for a seamless experience.");

  const [techCard2Icon, setTechCard2Icon] = useState("RefreshCcw");
  const [techCard2Title, setTechCard2Title] = useState("Bridgeless");
  const [techCard2Desc, setTechCard2Desc] = useState("Strategic alignment with Supra's interoperability stack.");

  const [techCard3Icon, setTechCard3Icon] = useState("GraduationCap");
  const [techCard3Title, setTechCard3Title] = useState("Maturity");
  const [techCard3Desc, setTechCard3Desc] = useState("Proven graduation from the Atmos Protocol process.");

  useEffect(() => {
    const loadAboutSettings = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('website_settings')
            .select('value')
            .eq('key', 'about')
            .single();
          if (data && data.value) {
            setHeadline(data.value.headline || "Who is Gloopo?");
            setSubheadline(data.value.subheadline || "Origin Story");
            setDescription(data.value.description || "");
            
            // Tech Cards
            setTechCard1Icon(data.value.techCard1Icon || "Zap");
            setTechCard1Title(data.value.techCard1Title || "High Throughput");
            setTechCard1Desc(data.value.techCard1Desc || "Low-latency consensus for a seamless experience.");
            setTechCard2Icon(data.value.techCard2Icon || "RefreshCcw");
            setTechCard2Title(data.value.techCard2Title || "Bridgeless");
            setTechCard2Desc(data.value.techCard2Desc || "Strategic alignment with Supra's interoperability stack.");
            setTechCard3Icon(data.value.techCard3Icon || "GraduationCap");
            setTechCard3Title(data.value.techCard3Title || "Maturity");
            setTechCard3Desc(data.value.techCard3Desc || "Proven graduation from the Atmos Protocol process.");
          }
        } catch (err) {
          console.error('Failed to load dynamic About settings:', err);
        }
      } else {
        const val = localStorage.getItem('gloopo_mock_setting_about');
        if (val) {
          try {
            const parsed = JSON.parse(val);
            setHeadline(parsed.headline || "Who is Gloopo?");
            setSubheadline(parsed.subheadline || "Origin Story");
            setDescription(parsed.description || "");

            // Tech Cards
            setTechCard1Icon(parsed.techCard1Icon || "Zap");
            setTechCard1Title(parsed.techCard1Title || "High Throughput");
            setTechCard1Desc(parsed.techCard1Desc || "Low-latency consensus for a seamless experience.");
            setTechCard2Icon(parsed.techCard2Icon || "RefreshCcw");
            setTechCard2Title(parsed.techCard2Title || "Bridgeless");
            setTechCard2Desc(parsed.techCard2Desc || "Strategic alignment with Supra's interoperability stack.");
            setTechCard3Icon(parsed.techCard3Icon || "GraduationCap");
            setTechCard3Title(parsed.techCard3Title || "Maturity");
            setTechCard3Desc(parsed.techCard3Desc || "Proven graduation from the Atmos Protocol process.");
          } catch (e) {}
        }
      }
    };
    loadAboutSettings();
  }, []);

  return (
    <section id="about" className="about-section">
      <div className="container">
        {/* Centered Origin Story header */}
        <div className="about-intro">
          <span className="tagline">{subheadline}</span>
          <h2 className="section-title">{headline}</h2>
          <div className="intro-content">
            <p className="intro-text">
              {description}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          <div className="glass-card stat-card anim-1">
            <span className="stat-value">Supra L1</span>
            <span className="stat-label">Native Integration</span>
          </div>
          
          <div className="glass-card stat-card anim-2">
            <span className="stat-value">Atmos</span>
            <span className="stat-label">Protocol Graduate</span>
          </div>
        </div>

        {/* Tech Row */}
        <div className="tech-row" id="tech">
          <div className="glass-card tech-card">
            <span className="card-module-tag">// GLOOP.SYS_01</span>
            <div className="tech-icon">
              {(() => {
                const Icon = iconMap[techCard1Icon] || Zap;
                return <Icon size={30} color="var(--primary)" />;
              })()}
            </div>
            <h3>{techCard1Title}</h3>
            <p>{techCard1Desc}</p>
          </div>

          <div className="glass-card tech-card">
            <span className="card-module-tag">// GLOOP.SYS_02</span>
            <div className="tech-icon">
              {(() => {
                const Icon = iconMap[techCard2Icon] || RefreshCcw;
                return <Icon size={30} color="var(--primary)" />;
              })()}
            </div>
            <h3>{techCard2Title}</h3>
            <p>{techCard2Desc}</p>
          </div>

          <div className="glass-card tech-card">
            <span className="card-module-tag">// GLOOP.SYS_03</span>
            <div className="tech-icon">
              {(() => {
                const Icon = iconMap[techCard3Icon] || GraduationCap;
                return <Icon size={30} color="var(--primary)" />;
              })()}
            </div>
            <h3>{techCard3Title}</h3>
            <p>{techCard3Desc}</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .about-section {
          padding: 120px 0;
          background: radial-gradient(circle at 10% 10%, rgba(0, 255, 136, 0.05), transparent 50%);
        }
        
        .about-intro {
          margin: 0 auto 5rem;
          max-width: 900px;
          text-align: center; /* Centering the text content */
        }
        .tagline {
          display: block;
          margin-bottom: 1rem;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-weight: 800;
          font-size: 0.9rem;
        }
        .section-title {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          font-weight: 900;
          line-height: 1.1;
          color: #fff;
        }
        .intro-text {
          font-size: 1.3rem;
          line-height: 1.7;
          color: var(--text-muted);
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          position: relative;
          overflow: hidden;
          text-align: center;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, transparent 100%), rgba(3, 10, 7, 0.85);
          border: 1px solid rgba(0, 255, 136, 0.15);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          height: 100%;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 12px;
          height: 12px;
          border-top: 2px solid var(--primary);
          border-left: 2px solid var(--primary);
          opacity: 0.3;
          transition: all 0.3s ease;
        }

        .stat-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          border-bottom: 2px solid var(--primary);
          border-right: 2px solid var(--primary);
          opacity: 0.3;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-8px);
          border-color: rgba(0, 255, 136, 0.5);
          box-shadow: 0 15px 35px rgba(0, 255, 136, 0.15);
        }

        .stat-card:hover::before,
        .stat-card:hover::after {
          opacity: 1;
          width: 20px;
          height: 20px;
          filter: drop-shadow(0 0 5px var(--primary));
        }

        .stat-value {
          display: block;
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--primary);
          font-family: 'Space Grotesk', sans-serif;
        }
        
        .stat-label {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          margin-top: 0.5rem;
          font-weight: 600;
        }

        .tech-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .tech-card {
          position: relative;
          overflow: hidden;
          padding: 2.5rem 2rem;
          background: rgba(3, 10, 7, 0.85);
          border: 1px solid rgba(0, 255, 136, 0.15);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .tech-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 15px;
          height: 15px;
          border-top: 2px solid var(--primary);
          border-left: 2px solid var(--primary);
          opacity: 0.3;
          transition: all 0.3s ease;
        }

        .tech-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 15px;
          height: 15px;
          border-bottom: 2px solid var(--primary);
          border-right: 2px solid var(--primary);
          opacity: 0.3;
          transition: all 0.3s ease;
        }

        .tech-card:hover {
          transform: translateY(-8px);
          border-color: rgba(0, 255, 136, 0.5);
          box-shadow: 0 15px 35px rgba(0, 255, 136, 0.15), 
                      inset 0 0 15px rgba(0, 255, 136, 0.05);
        }

        .tech-card:hover::before,
        .tech-card:hover::after {
          opacity: 1;
          width: 25px;
          height: 25px;
          filter: drop-shadow(0 0 5px var(--primary));
        }

        .card-module-tag {
          font-family: 'Space Grotesk', monospace;
          font-size: 0.75rem;
          color: var(--primary);
          opacity: 0.6;
          letter-spacing: 0.15em;
          margin-bottom: 1.2rem;
          display: block;
          font-weight: 600;
        }

        .card-module-tag::after {
          content: '█';
          display: inline-block;
          margin-left: 5px;
          color: var(--primary);
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          50% { opacity: 0; }
        }

        .tech-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: rgba(0, 255, 136, 0.03);
          border: 1px solid rgba(0, 255, 136, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          position: relative;
          box-shadow: inset 0 0 10px rgba(0, 255, 136, 0.05);
          transition: all 0.3s ease;
        }

        .tech-card:hover .tech-icon {
          background: rgba(0, 255, 136, 0.1);
          border-color: var(--primary);
          box-shadow: 0 0 15px rgba(0, 255, 136, 0.2), inset 0 0 10px rgba(0, 255, 136, 0.1);
          transform: scale(1.05);
        }

        .tech-card h3 {
          margin-bottom: 0.75rem;
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.02em;
          font-family: 'Space Grotesk', sans-serif;
        }

        .tech-card p {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.6;
          font-weight: 500;
        }

        @media (max-width: 1200px) {
          .section-title { font-size: 3rem; }
        }
        @media (max-width: 992px) {
          .tech-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .section-title { font-size: 2.5rem; }
          .stats-row {
            grid-template-columns: 1fr;
          }
          .tech-row {
            grid-template-columns: 1fr;
          }
          .intro-text { font-size: 1.1rem; }
        }
      `}</style>
    </section>
  );
};

export default About;

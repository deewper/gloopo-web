"use client";
import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/utils/supabase';
import { FileText, Download } from 'lucide-react';

const WhitepaperSection = () => {
  const [whitepaperV1, setWhitepaperV1] = useState('https://docs.gloopo.xyz/whitepaper-v1');
  const [whitepaperV2, setWhitepaperV2] = useState('https://docs.gloopo.xyz/whitepaper-v2');

  useEffect(() => {
    const loadWhitepaperUrls = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase
            .from('website_settings')
            .select('value')
            .eq('key', 'general')
            .single();
          if (data && data.value) {
            setWhitepaperV1(data.value.whitepaperV1 || 'https://docs.gloopo.xyz/whitepaper-v1');
            setWhitepaperV2(data.value.whitepaperV2 || 'https://docs.gloopo.xyz/whitepaper-v2');
          }
        } catch (e) {
          console.error('Failed to load whitepaper settings:', e);
        }
      } else {
        const val = localStorage.getItem('gloopo_mock_setting_general');
        if (val) {
          try {
            const parsed = JSON.parse(val);
            setWhitepaperV1(parsed.whitepaperV1 || 'https://docs.gloopo.xyz/whitepaper-v1');
            setWhitepaperV2(parsed.whitepaperV2 || 'https://docs.gloopo.xyz/whitepaper-v2');
          } catch (e) {}
        }
      }
    };
    loadWhitepaperUrls();
  }, []);

  const getDownloadUrl = (url: string) => {
    if (!url) return '#';
    if (url.startsWith('data:')) return url;
    if (url.includes('supabase.co') && url.includes('/storage/v1/object/public/')) {
      return url.includes('?') ? `${url}&download=` : `${url}?download=`;
    }
    return url;
  };

  return (
    <section className="whitepaper-section" id="whitepapers">
      <div className="container">
        <div className="section-header">
          <span className="subtitle">Documentation</span>
          <h2 className="title">Protocol Whitepaper</h2>
          <p className="desc">
            Explore the architecture, token economics, and technical innovations driving the Gloopo ecosystem natively on the Supra L1 network.
          </p>
        </div>

        <div className="cards-grid">
          {/* Card V1 */}
          <div className="whitepaper-card">
            <div className="card-bg-glow"></div>
            <div className="card-content">
              <div className="icon-wrapper">
                <FileText size={32} className="icon-main" />
              </div>
              <h3>Whitepaper V1</h3>
              <p>The original vision laying out the foundational mechanics, token distribution models, and community rules.</p>
              <a 
                href={getDownloadUrl(whitepaperV1)} 
                download="Gloopo_Whitepaper_V1.pdf"
                className="download-btn"
                title="Download Whitepaper V1 PDF"
              >
                <Download size={18} />
                <span>Download V1</span>
              </a>
            </div>
          </div>

          {/* Card V2 */}
          <div className="whitepaper-card">
            <div className="card-bg-glow-purple"></div>
            <div className="card-content">
              <div className="icon-wrapper purple-theme">
                <FileText size={32} className="icon-main" />
              </div>
              <h3>Whitepaper V2</h3>
              <p>Advanced expansions covering next-generation utility, multi-chain expansion roadmap, and native Supra L1 integrations.</p>
              <a 
                href={getDownloadUrl(whitepaperV2)} 
                download="Gloopo_Whitepaper_V2.pdf"
                className="download-btn purple-btn"
                title="Download Whitepaper V2 PDF"
              >
                <Download size={18} />
                <span>Download V2</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .whitepaper-section {
          padding: 100px 0;
          background: #030806;
          position: relative;
          overflow: hidden;
        }

        /* Subtle grid background */
        .whitepaper-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px);
          background-size: 30px 30px;
          pointer-events: none;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          z-index: 2;
        }

        .section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 60px;
        }

        .subtitle {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--primary);
          font-weight: 800;
          display: block;
          margin-bottom: 12px;
        }

        .title {
          font-size: 2.5rem;
          font-weight: 900;
          color: #fff;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }

        .desc {
          color: var(--text-muted);
          line-height: 1.7;
          font-size: 1.05rem;
          font-weight: 500;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .whitepaper-card {
          background: rgba(13, 20, 18, 0.45);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 20px;
          padding: 3rem 2.5rem;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .whitepaper-card:hover {
          transform: translateY(-8px);
          border-color: rgba(0, 255, 136, 0.15);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 255, 136, 0.03);
        }

        /* Subtle hover glows */
        .card-bg-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(0, 255, 136, 0.05) 0%, transparent 60%);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.4s;
        }

        .card-bg-glow-purple {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(187, 255, 0, 0.05) 0%, transparent 60%);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.4s;
        }

        .whitepaper-card:hover .card-bg-glow,
        .whitepaper-card:hover .card-bg-glow-purple {
          opacity: 1;
        }

        .card-content {
          position: relative;
          z-index: 2;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
        }

        .icon-wrapper {
          width: 70px;
          height: 70px;
          border-radius: 18px;
          background: rgba(0, 255, 136, 0.08);
          border: 1px solid rgba(0, 255, 136, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          transition: all 0.3s ease;
          color: var(--primary);
        }

        .icon-wrapper.purple-theme {
          background: rgba(187, 255, 0, 0.08);
          border-color: rgba(187, 255, 0, 0.2);
          color: #bbff00;
        }

        .whitepaper-card:hover .icon-wrapper {
          transform: scale(1.1);
          background: var(--primary);
          color: #000;
          border-color: var(--primary);
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.2);
        }

        .whitepaper-card:hover .icon-wrapper.purple-theme {
          background: #bbff00;
          color: #000;
          border-color: #bbff00;
          box-shadow: 0 0 20px rgba(187, 255, 0, 0.2);
        }

        .whitepaper-card h3 {
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 16px;
        }

        .whitepaper-card p {
          color: var(--text-muted);
          line-height: 1.6;
          font-size: 0.95rem;
          margin-bottom: 32px;
          max-width: 440px;
          font-weight: 500;
          flex-grow: 1;
        }

        .download-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          background: rgba(0, 255, 136, 0.08);
          border: 1px solid rgba(0, 255, 136, 0.2);
          color: var(--primary);
          padding: 0.85rem 2rem;
          border-radius: 50px;
          font-weight: 800;
          font-size: 0.9rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
          cursor: pointer;
          width: 100%;
          max-width: 220px;
        }

        .download-btn:hover {
          background: var(--primary);
          color: #000;
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 255, 136, 0.25);
        }

        .download-btn.purple-btn {
          background: rgba(187, 255, 0, 0.08);
          border-color: rgba(187, 255, 0, 0.2);
          color: #bbff00;
        }

        .download-btn.purple-btn:hover {
          background: #bbff00;
          color: #000;
          border-color: #bbff00;
          box-shadow: 0 10px 25px rgba(187, 255, 0, 0.25);
        }

        @media (max-width: 768px) {
          .cards-grid {
            grid-template-columns: 1fr;
          }
          .whitepaper-card {
            padding: 2.5rem 1.5rem;
          }
          .title {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  );
};

export default WhitepaperSection;

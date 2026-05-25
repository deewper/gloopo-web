"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/utils/supabase';
import { Download, Copy, Check, ShieldCheck, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function BrandAssetsPage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultColors = [
    { name: 'Primary Green', hex: '#00FF88', desc: 'Core brand primary tone, representing the L1 Supra ecosystem pulse.' },
    { name: 'Accent Lime', hex: '#BBFF00', desc: 'Secondary attention marker used for highlights and premium buttons.' },
    { name: 'Obsidian Black', hex: '#030806', desc: 'Deep background space canvas for premium contrast layouts.' },
    { name: 'Ecosystem Muted', hex: '#88998e', desc: 'Elegant typography and label color for highly scannable paragraphs.' },
  ];

  const [dbColors, setDbColors] = useState<any[]>(defaultColors);

  const DEFAULT_ASSETS = [
    {
      title: 'Gloopo 3D Mascot Character',
      filename: 'gloo_character.png',
      path: '/images/gloo_character.png',
      size: '737 KB',
      dimensions: '2048 x 2048 px',
      format: 'High-Res PNG',
      desc: 'Official mascot icon for banners, listings, and profile graphics.'
    },
    {
      title: 'Gloopo Wordmark Typography',
      filename: 'gloo-text.png',
      path: '/images/gloo-text.png',
      size: '39.6 KB',
      dimensions: '800 x 300 px',
      format: 'Transparent PNG',
      desc: 'Logotype for banners, website headers, and corporate listings.'
    },
    {
      title: 'Tokenomics Pie Render',
      filename: 'token-char.png',
      path: '/images/token-char.png',
      size: '539 KB',
      dimensions: '1024 x 1024 px',
      format: 'Isolated PNG',
      desc: 'Official 3D illustrated pie chart asset for pitch decks and slides.'
    },
    {
      title: 'Space Exploration Landscape',
      filename: 'brand-kit.png',
      path: '/images/brand-kit.png',
      size: '685 KB',
      dimensions: '1920 x 1080 px',
      format: 'Wallpapers PNG',
      desc: 'Premium futuristic space vector scenery used in section backgrounds.'
    },
    {
      title: 'Gloopo Mascot Animation',
      filename: 'gloopo.gif',
      path: '/images/gloopo.gif',
      size: '15.4 MB',
      dimensions: '600 x 600 px',
      format: 'Vector GIF',
      desc: 'Motion design mascot animation for presentation overlays.'
    },
    {
      title: 'Hero Backdrop Nebula',
      filename: 'hero_bg.png',
      path: '/images/hero_bg.png',
      size: '753 KB',
      dimensions: '1920 x 1080 px',
      format: 'Futuristic JPG',
      desc: 'Dark galactic atmospheric background graphic for landing pages.'
    }
  ];

  useEffect(() => {
    async function loadAssets() {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data, error } = await supabase
            .from('website_settings')
            .select('*')
            .eq('key', 'brandkit')
            .maybeSingle();

          if (!error && data && data.value) {
            const val = data.value;
            if (Array.isArray(val.assetsList)) {
              setAssets(val.assetsList);
            } else {
              setAssets(DEFAULT_ASSETS);
            }

            if (val.primaryColor || val.accentColor || val.backgroundColor) {
              setDbColors([
                { name: 'Primary Green', hex: val.primaryColor || '#00FF88', desc: 'Core brand primary tone, representing the L1 Supra ecosystem pulse.' },
                { name: 'Accent Lime', hex: val.accentColor || '#BBFF00', desc: 'Secondary attention marker used for highlights and premium buttons.' },
                { name: 'Obsidian Black', hex: val.backgroundColor || '#030806', desc: 'Deep background space canvas for premium contrast layouts.' },
                { name: 'Ecosystem Muted', hex: '#88998e', desc: 'Elegant typography and label color for highly scannable paragraphs.' }
              ]);
            }
          } else {
            setAssets(DEFAULT_ASSETS);
          }
        } else {
          // Mock mode load from local storage
          const val = localStorage.getItem('gloopo_mock_setting_brandkit');
          if (val) {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed.assetsList)) {
              setAssets(parsed.assetsList);
            } else {
              setAssets(DEFAULT_ASSETS);
            }
            if (parsed.primaryColor || parsed.accentColor || parsed.backgroundColor) {
              setDbColors([
                { name: 'Primary Green', hex: parsed.primaryColor || '#00FF88', desc: 'Core brand primary tone, representing the L1 Supra ecosystem pulse.' },
                { name: 'Accent Lime', hex: parsed.accentColor || '#BBFF00', desc: 'Secondary attention marker used for highlights and premium buttons.' },
                { name: 'Obsidian Black', hex: parsed.backgroundColor || '#030806', desc: 'Deep background space canvas for premium contrast layouts.' },
                { name: 'Ecosystem Muted', hex: '#88998e', desc: 'Elegant typography and label color for highly scannable paragraphs.' }
              ]);
            }
          } else {
            setAssets(DEFAULT_ASSETS);
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic brand assets:', err);
        setAssets(DEFAULT_ASSETS);
      } finally {
        setLoading(false);
      }
    }
    loadAssets();
  }, []);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <main className="brand-assets-page">
      {/* Background Ornaments */}
      <div className="bg-decorations">
        <div className="glow-sphere main"></div>
        <div className="glow-sphere secondary"></div>
      </div>

      <header className="brand-assets-header">
        <div className="container">
          <div className="brand-assets-intro">
            <span className="tagline">GLOOPO MEDIA KIT</span>
            <h1 className="gradient-title">Brand Assets &amp; Resources</h1>
            <p className="subtitle">
              Download high-resolution 3D mascot vectors, official logotypes, assets, and copy ecosystem hex color codes.
            </p>
          </div>
        </div>
      </header>

      <section className="brand-assets-content">
        <div className="container">
          {/* A. LOGOS & MASCOTS GRID */}
          <div className="section-block">
            <div className="block-header">
              <ImageIcon size={22} className="block-icon" />
              <h3>Official Logos &amp; Graphics</h3>
            </div>
            
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '1rem', color: 'var(--text-muted)' }}>
                <Loader2 className="spinner-white" size={40} style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Loading brand visual library...</span>
              </div>
            ) : assets.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>No brand assets available currently.</p>
              </div>
            ) : (
              <div className="assets-grid">
                {assets.map((asset, idx) => (
                  <div key={idx} className="asset-card glass-card">
                    <div className="asset-preview-frame">
                      <img 
                        src={asset.path} 
                        alt={asset.title} 
                        className="asset-preview-img"
                      />
                    </div>
                    <div className="asset-meta">
                      <span className="asset-badge">{asset.format || 'Media Asset'}</span>
                      <h4 className="asset-name" style={{ marginBottom: '1.25rem' }}>{asset.title}</h4>

                      <a 
                        href={asset.path} 
                        download={asset.filename || 'gloopo_asset.png'} 
                        className="download-btn-action"
                      >
                        <Download size={16} />
                        <span>Download {(asset.format || 'PNG').split(' ').pop()}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* B. OFFICIAL PALETTE COLOR */}
          <div className="section-block ColorPalette">
            <div className="block-header">
              <ShieldCheck size={22} className="block-icon" />
              <h3>Official Ecosystem Palette</h3>
            </div>

            <div className="colors-grid">
              {dbColors.map((color, idx) => (
                <div key={idx} className="color-card glass-card" style={{ borderColor: `rgba(${color.hex === '#00FF88' ? '0,255,136' : color.hex === '#BBFF00' ? '187,255,0' : '255,255,255'}, 0.08)` }}>
                  <div className="color-swatch-preview" style={{ backgroundColor: color.hex }}>
                    <span className="color-swatch-badge" style={{ color: color.hex === '#030806' ? '#fff' : '#030806' }}>
                      {color.hex}
                    </span>
                  </div>
                  <div className="color-info">
                    <h4 className="color-name">{color.name}</h4>
                    <p className="color-desc">{color.desc}</p>
                    
                    <button 
                      onClick={() => copyToClipboard(color.hex)}
                      className="copy-hex-btn"
                    >
                      {copiedColor === color.hex ? (
                        <><Check size={14} className="copied-tick" /><span>Copied Hex!</span></>
                      ) : (
                        <><Copy size={14} /><span>Copy Hex Code</span></>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Styled JSX */}
      <style jsx global>{`
        .brand-assets-page {
          min-height: 100vh;
          background: #030806;
          position: relative;
          overflow-x: hidden;
          padding-bottom: 8rem;
          color: #ffffff;
        }

        .bg-decorations {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        .glow-sphere {
          position: absolute;
          filter: blur(140px);
          border-radius: 50%;
          opacity: 0.15;
          mix-blend-mode: screen;
        }

        .glow-sphere.main {
          top: -10%;
          right: 5%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, var(--primary) 0%, rgba(0,0,0,0) 70%);
        }

        .glow-sphere.secondary {
          bottom: 10%;
          left: -5%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, var(--accent) 0%, rgba(0,0,0,0) 70%);
        }

        .brand-assets-header {
          position: relative;
          z-index: 2;
          padding: 8rem 0 2rem;
          border-bottom: 1px solid rgba(0, 255, 136, 0.05);
        }


        .brand-assets-intro {
          max-width: 800px;
        }

        .brand-assets-intro .tagline {
          text-align: left;
          margin-bottom: 0.75rem;
        }

        .gradient-title {
          font-size: 3.8rem;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1.25rem;
          letter-spacing: -0.04em;
          background: linear-gradient(135deg, #ffffff 0%, #a3bdae 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          color: var(--text-muted);
          font-size: 1.15rem;
          line-height: 1.6;
          font-weight: 500;
        }

        .brand-assets-content {
          position: relative;
          z-index: 2;
          margin-top: 4rem;
        }

        .section-block {
          margin-bottom: 5.5rem;
        }

        .block-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2.25rem;
        }

        .block-icon {
          color: var(--primary);
        }

        .block-header h3 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #ffffff;
        }

        .assets-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
        }

        @media (max-width: 1100px) {
          .assets-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .assets-grid {
            grid-template-columns: 1fr;
          }
          .gradient-title {
            font-size: 2.5rem;
          }
        }

        .asset-card {
          display: flex;
          flex-direction: column;
          padding: 1.5rem !important;
          border-color: rgba(255,255,255,0.03);
          background: rgba(4, 12, 10, 0.4) !important;
        }

        .asset-card.glass-card:hover {
          transform: none !important;
          border-color: rgba(255,255,255,0.03) !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
        }



        .asset-preview-frame {
          height: 220px;
          border-radius: 12px;
          background: radial-gradient(circle, rgba(0, 255, 136, 0.05) 0%, rgba(0,0,0,0.3) 100%), #020604;
          border: 1px solid rgba(255,255,255,0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 1.25rem;
          position: relative;
        }

        .asset-preview-img {
          max-height: 80%;
          max-width: 80%;
          object-fit: contain;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }



        .asset-meta {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .asset-badge {
          align-self: flex-start;
          font-size: 0.68rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--primary);
          padding: 0.25rem 0.65rem;
          background: rgba(0, 255, 136, 0.08);
          border: 1px solid rgba(0,255,136,0.15);
          border-radius: 100px;
          margin-bottom: 0.75rem;
        }

        .asset-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }

        .asset-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 1.25rem;
          flex: 1;
        }

        .asset-stats {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 1.25rem;
          border-top: 1px solid rgba(255,255,255,0.03);
          padding-top: 0.75rem;
        }

        .dot-divider {
          color: rgba(255, 255, 255, 0.15);
        }

        .download-btn-action {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: rgba(0, 255, 136, 0.06);
          border: 1px solid rgba(0, 255, 136, 0.12);
          color: var(--primary);
          padding: 0.85rem 0;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .download-btn-action:hover {
          background: var(--primary);
          color: #030806;
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 255, 136, 0.25);
        }

        /* Color Cards layout */
        .colors-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 992px) {
          .colors-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 576px) {
          .colors-grid {
            grid-template-columns: 1fr;
          }
        }

        .color-card {
          padding: 1.25rem !important;
          background: rgba(4, 12, 10, 0.3) !important;
          border-color: rgba(255,255,255,0.02);
        }

        .color-card.glass-card:hover {
          transform: none !important;
          border-color: rgba(255,255,255,0.02) !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
        }

        .color-swatch-preview {
          height: 120px;
          border-radius: 12px;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          padding: 0.75rem;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .color-swatch-badge {
          font-size: 0.72rem;
          font-weight: 800;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(5px);
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          font-family: monospace;
          letter-spacing: -0.02em;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .color-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.4rem;
        }

        .color-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 1.25rem;
          min-height: 48px;
        }

        .copy-hex-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          color: var(--text-muted);
          padding: 0.65rem 0;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.78rem;
          transition: all 0.3s ease;
        }

        .copy-hex-btn:hover {
          background: rgba(255,255,255,0.05);
          color: #ffffff;
          border-color: rgba(255,255,255,0.12);
        }

        .copied-tick {
          color: var(--primary);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}

"use client";
import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/utils/supabase';
import { Compass } from 'lucide-react';

export default function ShowcasePage() {
  const [maintenanceMode, setMaintenanceMode] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNftsSettings = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data, error } = await supabase
            .from('website_settings')
            .select('value')
            .eq('key', 'nfts')
            .single();
          if (data && data.value) {
            setMaintenanceMode(data.value.maintenanceMode !== false);
          }
        } else {
          const val = localStorage.getItem('gloopo_mock_setting_nfts');
          if (val) {
            const parsed = JSON.parse(val);
            setMaintenanceMode(parsed.maintenanceMode !== false);
          }
        }
      } catch (err) {
        console.error('Failed to load NFTs settings:', err);
      } finally {
        setLoading(false);
      }
    };
    loadNftsSettings();
  }, []);

  const nfts = [
    { id: 1, name: 'Gloopo Prime', rarity: 'Legendary', image: '/images/gloopo.gif' },
    { id: 2, name: 'Gloopo Slime', rarity: 'Rare', image: '/images/gloopo.gif' },
    { id: 3, name: 'Gloopo Void', rarity: 'Epic', image: '/images/gloopo.gif' },
    { id: 4, name: 'Gloopo Aqua', rarity: 'Uncommon', image: '/images/gloopo.gif' },
    { id: 5, name: 'Gloopo Magma', rarity: 'Rare', image: '/images/gloopo.gif' },
    { id: 6, name: 'Gloopo Flora', rarity: 'Common', image: '/images/gloopo.gif' },
    { id: 7, name: 'Gloopo Mecha', rarity: 'Legendary', image: '/images/gloopo.gif' },
    { id: 8, name: 'Gloopo Astro', rarity: 'Epic', image: '/images/gloopo.gif' },
  ];

  if (loading) {
    return (
      <div className="showcase-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="spinner"></span>
        <style jsx>{`
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(0, 255, 136, 0.1);
            border-radius: 50%;
            border-top-color: var(--primary);
            animation: spin 1s ease-in-out infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .showcase-page {
            min-height: 100vh;
            background: #030806;
          }
        `}</style>
      </div>
    );
  }

  if (maintenanceMode) {
    return (
      <div className="maintenance-screen">
        <div className="bg-decorations">
          <div className="glow-sphere"></div>
        </div>
        <div className="maintenance-card glass-card">
          <div className="shield-icon">
            <Compass size={38} className="spin-slow" />
          </div>
          <h1>NFTs Section Under Development</h1>
          <p>
            The Gloopo Gen-1 Crystara Collection mint interface and showcase are currently under construction.
          </p>
          <div className="status-indicator">
            <span className="dot animate-pulse"></span>
            <span>DEVELOPMENT MODE ACTIVE</span>
          </div>
        </div>
        <style jsx>{`
          .maintenance-screen {
            min-height: 100vh;
            width: 100vw;
            background: #030806;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            padding: 2rem;
            box-sizing: border-box;
          }
          .bg-decorations {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 0;
          }
          .glow-sphere {
            position: absolute;
            width: 500px;
            height: 500px;
            background: #00ff88;
            border-radius: 50%;
            filter: blur(160px);
            opacity: 0.08;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .maintenance-card {
            max-width: 480px;
            width: 100%;
            padding: 3rem 2.5rem;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
            position: relative;
            z-index: 10;
            background: rgba(4, 12, 10, 0.75);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-lg);
            backdrop-filter: blur(20px);
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            box-sizing: border-box;
          }
          .shield-icon {
            width: 68px;
            height: 68px;
            border-radius: 50%;
            background: rgba(0, 255, 136, 0.05);
            border: 1px solid rgba(0, 255, 136, 0.2);
            color: #00ff88;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.15);
          }
          h1 {
            font-size: 1.8rem;
            font-weight: 900;
            letter-spacing: -0.02em;
            color: #fff;
            margin: 0;
          }
          p {
            font-size: 0.92rem;
            color: var(--text-muted);
            line-height: 1.6;
            margin: 0;
          }
          .status-indicator {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(0, 255, 136, 0.06);
            border: 1px solid rgba(0, 255, 136, 0.2);
            color: #00ff88;
            padding: 0.4rem 1.1rem;
            border-radius: 50px;
            font-size: 0.7rem;
            font-weight: 800;
            letter-spacing: 0.05em;
          }
          .status-indicator .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #00ff88;
          }
          :global(.spin-slow) {
            animation: spin-slow 15s linear infinite;
          }
          @keyframes spin-slow {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="showcase-page">
      <div className="showcase-header">
        <h1 className="showcase-title">NFT <span className="highlight">Showcase</span></h1>
        <p className="showcase-subtitle">Discover the Gen-1 Crystara Collection</p>
      </div>

      <div className="container">
        <div className="nft-grid">
          {nfts.map((nft) => (
            <div key={nft.id} className="nft-card glass-card">
              <div className="nft-image-placeholder">
                <img src={nft.image} alt={nft.name} />
              </div>
              <div className="nft-info">
                <h3>{nft.name}</h3>
                <span className={`rarity rarity-${nft.rarity.toLowerCase()}`}>{nft.rarity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .showcase-page {
          min-height: 100vh;
          padding-top: 150px;
          padding-bottom: 120px;
          background: #030806;
          position: relative;
          overflow: hidden;
        }
        
        .showcase-page::before {
          content: '';
          position: absolute;
          top: -100px;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 255, 136, 0.15), transparent 70%);
          z-index: 0;
          pointer-events: none;
        }

        .showcase-header {
          text-align: center;
          margin-bottom: 80px;
          position: relative;
          z-index: 1;
        }

        .showcase-title {
          font-size: 4rem;
          font-weight: 900;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #fff;
        }
        
        .highlight {
          color: var(--primary);
        }
        
        .showcase-subtitle {
          color: var(--text-muted);
          font-size: 1.2rem;
          font-weight: 500;
        }

        .nft-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .nft-card {
          padding: 1rem;
          border-radius: var(--radius-md);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%), rgba(13, 20, 18, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 255, 136, 0.15);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
          cursor: pointer;
        }

        .nft-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0, 255, 136, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          border-color: rgba(0, 255, 136, 0.4);
        }

        .nft-image-placeholder {
          width: 100%;
          aspect-ratio: 1;
          background: linear-gradient(145deg, rgba(0,0,0,0.4), rgba(0,255,136,0.05));
          border-radius: var(--radius-md);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          border: 1px solid rgba(255,255,255,0.02);
        }

        .nft-image-placeholder img {
          width: 75%;
          height: auto;
          filter: drop-shadow(0 0 15px rgba(0, 255, 136, 0.2));
          transition: transform 0.5s ease;
        }

        .nft-card:hover .nft-image-placeholder img {
          transform: scale(1.1) rotate(2deg);
        }

        .nft-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nft-info h3 {
          font-size: 1rem;
          font-weight: 800;
          color: #fff;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .rarity {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.3rem 0.6rem;
          border-radius: 50px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .rarity-legendary { background: rgba(255, 215, 0, 0.1); color: #FFD700; border: 1px solid rgba(255, 215, 0, 0.3); box-shadow: 0 0 10px rgba(255,215,0,0.1); }
        .rarity-epic { background: rgba(153, 50, 204, 0.1); color: #c476f2; border: 1px solid rgba(153, 50, 204, 0.3); }
        .rarity-rare { background: rgba(0, 191, 255, 0.1); color: #00BFFF; border: 1px solid rgba(0, 191, 255, 0.3); }
        .rarity-uncommon { background: rgba(50, 205, 50, 0.1); color: #32CD32; border: 1px solid rgba(50, 205, 50, 0.3); }
        .rarity-common { background: rgba(255, 255, 255, 0.05); color: #aaa; border: 1px solid rgba(255, 255, 255, 0.1); }
        
        @media (max-width: 768px) {
          .showcase-title { font-size: 2.5rem; }
          .nft-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
        }
      `}</style>
    </div>
  );
}

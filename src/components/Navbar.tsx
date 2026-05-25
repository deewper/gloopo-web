"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';
import WalletModal from './WalletModal';
import { User, LogOut, Menu, X } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/utils/supabase';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { address, balance, isConnected, setModalOpen, disconnect } = useWallet();
  const [showConnectButton, setShowConnectButton] = useState(false);
  const [showLore, setShowLore] = useState(false);
  const [showTech, setShowTech] = useState(false);
  const [showTokenomics, setShowTokenomics] = useState(false);
  const [showSwap, setShowSwap] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [showShowcase, setShowShowcase] = useState(false);
  const [showBrandKit, setShowBrandKit] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadButtonSettings = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data, error } = await supabase
            .from('website_settings')
            .select('value')
            .eq('key', 'buttons')
            .single();
          if (data && data.value) {
            setShowConnectButton(data.value.showConnectButton !== false);
            setShowLore(data.value.showLore !== false);
            setShowTech(data.value.showTech !== false);
            setShowTokenomics(data.value.showTokenomics !== false);
            setShowSwap(data.value.showSwap !== false);
            setShowRoadmap(data.value.showRoadmap !== false);
            setShowShowcase(data.value.showShowcase !== false);
            setShowBrandKit(data.value.showBrandKit !== false);
          } else {
            setShowConnectButton(true);
            setShowLore(true);
            setShowTech(true);
            setShowTokenomics(true);
            setShowSwap(true);
            setShowRoadmap(true);
            setShowShowcase(true);
            setShowBrandKit(true);
          }
        } else {
          const val = localStorage.getItem('gloopo_mock_setting_buttons');
          if (val) {
            const parsed = JSON.parse(val);
            setShowConnectButton(parsed.showConnectButton !== false);
            setShowLore(parsed.showLore !== false);
            setShowTech(parsed.showTech !== false);
            setShowTokenomics(parsed.showTokenomics !== false);
            setShowSwap(parsed.showSwap !== false);
            setShowRoadmap(parsed.showRoadmap !== false);
            setShowShowcase(parsed.showShowcase !== false);
            setShowBrandKit(parsed.showBrandKit !== false);
          } else {
            setShowConnectButton(true);
            setShowLore(true);
            setShowTech(true);
            setShowTokenomics(true);
            setShowSwap(true);
            setShowRoadmap(true);
            setShowShowcase(true);
            setShowBrandKit(true);
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic button settings:', err);
        // Fallback to true
        setShowConnectButton(true);
        setShowLore(true);
        setShowTech(true);
        setShowTokenomics(true);
        setShowSwap(true);
        setShowRoadmap(true);
        setShowShowcase(true);
        setShowBrandKit(true);
      } finally {
        setLoadingSettings(false);
      }
    };
    loadButtonSettings();
  }, []);

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'fixed' : ''}`}>
        <div className="nav-content">
          {/* Logo on the left */}
          <Link href="/" className="nav-logo">
            <img src="/images/gloo-text-green.png" alt="GLOOPO" className="logo-img logo-desktop" />
            <img src="/images/gloo-text.png" alt="GLOOPO" className="logo-img logo-mobile" />
          </Link>

          {/* Desktop Links */}
          <div className="nav-links">
            {!loadingSettings && showLore && <Link href="/#about">Lore</Link>}
            {!loadingSettings && showTech && <Link href="/#tech">Tech</Link>}
            {!loadingSettings && showTokenomics && <Link href="/#tokenomics">Tokenomics</Link>}
            {!loadingSettings && showSwap && <Link href="/swap">Swap</Link>}
            {!loadingSettings && showRoadmap && <Link href="/#roadmap">Roadmap</Link>}
            {!loadingSettings && showShowcase && <Link href="/showcase" className="showcase-nav-link">NFTs</Link>}
            {!loadingSettings && showBrandKit && <Link href="/brand-assets">Brand Kit</Link>}
          </div>
          
          {/* Desktop Wallet Connection Wrapper */}
          <div className="desktop-wallet-container">
            {!loadingSettings && showConnectButton && (
              isConnected ? (
                <div className="wallet-connected-box">
                  <div className="address-pill">
                    <span className="balance-text">{balance ? `${balance} SUPRA` : '0.00 SUPRA'}</span>
                    <div className="divider-v"></div>
                    <span>{formatAddress(address!)}</span>
                  </div>
                  <button className="logout-btn" onClick={disconnect} aria-label="Disconnect">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button className="btn-primary-sm" onClick={() => setModalOpen(true)}>
                  Connect
                </button>
              )
            )}
          </div>

          {/* Burger Button on the right (mobile only) */}
          <button 
            className="burger-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            aria-label="Toggle Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Nav Links Panel */}
        {mobileMenuOpen && (
          <div className="mobile-menu-overlay">
            <div className="mobile-links">
              {!loadingSettings && showLore && <Link href="/#about" onClick={() => setMobileMenuOpen(false)}>Lore</Link>}
              {!loadingSettings && showTech && <Link href="/#tech" onClick={() => setMobileMenuOpen(false)}>Tech</Link>}
              {!loadingSettings && showTokenomics && <Link href="/#tokenomics" onClick={() => setMobileMenuOpen(false)}>Tokenomics</Link>}
              {!loadingSettings && showSwap && <Link href="/swap" onClick={() => setMobileMenuOpen(false)}>Swap</Link>}
              {!loadingSettings && showRoadmap && <Link href="/#roadmap" onClick={() => setMobileMenuOpen(false)}>Roadmap</Link>}
              {!loadingSettings && showShowcase && <Link href="/showcase" className="showcase-nav-link" onClick={() => setMobileMenuOpen(false)}>NFTs</Link>}
              {!loadingSettings && showBrandKit && <Link href="/brand-assets" onClick={() => setMobileMenuOpen(false)}>Brand Kit</Link>}
              
              {/* Mobile Wallet Connection inside mobile menu dropdown */}
              {!loadingSettings && showConnectButton && (
                <div className="mobile-wallet-wrapper">
                  {isConnected ? (
                    <div className="wallet-connected-box mobile-wallet">
                      <div className="address-pill">
                        <span className="balance-text">{balance ? `${balance} SUPRA` : '0.00 SUPRA'}</span>
                        <div className="divider-v"></div>
                        <span>{formatAddress(address!)}</span>
                      </div>
                      <button className="logout-btn" onClick={() => { disconnect(); setMobileMenuOpen(false); }} aria-label="Disconnect">
                        <LogOut size={16} />
                      </button>
                    </div>
                  ) : (
                    <button className="btn-primary-sm mobile-connect-btn" onClick={() => { setModalOpen(true); setMobileMenuOpen(false); }}>
                      Connect Wallet
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <style jsx>{`
          .navbar {
            height: var(--nav-height);
            width: 100%;
            position: fixed;
            top: 20px;
            left: 0;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 1rem;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .navbar.fixed {
            top: 0;
            padding-top: 10px;
          }
          
          .nav-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            max-width: 800px;
            background: rgba(13, 20, 18, 0.6);
            backdrop-filter: blur(20px);
            padding: 0.6rem 1.5rem;
            border-radius: 100px;
            border: 1px solid var(--glass-border);
            box-shadow: 0 10px 40px rgba(0,0,0,0.4);
            position: relative;
            min-height: 54px;
            box-sizing: border-box;
          }
          
          .nav-links {
            display: flex;
            gap: 1.5rem;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            white-space: nowrap;
            flex-wrap: nowrap;
          }
          .nav-links a {
            font-weight: 700;
            font-size: 0.85rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            transition: color 0.3s ease;
          }
          .nav-links a:hover {
            color: var(--primary);
          }
          .showcase-nav-link {
            color: var(--primary) !important;
          }
          
          .btn-primary-sm {
            background: var(--primary);
            color: #030806;
            padding: 0.6rem 1.5rem;
            border-radius: 50px;
            font-weight: 800;
            font-size: 0.8rem;
            transition: all 0.3s ease;
          }
          .btn-primary-sm:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 255, 136, 0.3);
          }

          .wallet-connected-box {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .address-pill {
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid rgba(0, 255, 136, 0.2);
            padding: 0.5rem 1.25rem;
            border-radius: 50px;
            color: var(--primary);
            font-size: 0.8rem;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .balance-text {
            color: #fff;
            opacity: 0.9;
          }

          .divider-v {
            width: 1px;
            height: 14px;
            background: rgba(0, 255, 136, 0.3);
          }

          .logout-btn {
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-muted);
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }

          .logout-btn:hover {
            background: rgba(255, 77, 77, 0.2);
            color: #ff4d4d;
          }

          /* Logo Styles */
          .nav-logo {
            display: flex;
            align-items: center;
          }
          .logo-img {
            height: 20px;
            width: auto;
            display: block;
          }
          .logo-desktop {
            display: block;
          }
          .logo-mobile {
            display: none;
          }

          /* Desktop Wallet Container */
          .desktop-wallet-container {
            margin-left: auto;
            display: flex;
            align-items: center;
          }

          /* Burger Menu Styles */
          .burger-btn {
            display: none;
            background: transparent;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            align-items: center;
            justify-content: center;
            padding: 8px;
            border-radius: 8px;
            transition: all 0.3s ease;
            outline: none;
          }
          .burger-btn:hover {
            color: var(--primary);
            background: rgba(0, 255, 136, 0.1);
          }

          /* Mobile Menu Panel */
          .mobile-menu-overlay {
            position: absolute;
            top: 65px;
            left: 5%;
            width: 90%;
            background: rgba(13, 20, 18, 0.95);
            backdrop-filter: blur(30px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            padding: 1.5rem;
            box-shadow: 0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(0, 255, 136, 0.05);
            z-index: 999;
            animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }

          .mobile-links {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
            align-items: center;
          }

          .mobile-links a {
            font-weight: 700;
            font-size: 1rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            transition: color 0.3s ease;
            width: 100%;
            text-align: center;
            padding: 0.5rem;
            border-radius: 8px;
          }

          .mobile-links a:hover {
            color: var(--primary);
            background: rgba(0, 255, 136, 0.05);
          }

          .mobile-wallet-wrapper {
            margin-top: 1rem;
            width: 100%;
            display: flex;
            justify-content: center;
          }
          .mobile-connect-btn {
            width: 100%;
            max-width: 200px;
            text-align: center;
            justify-content: center;
          }
          .wallet-connected-box.mobile-wallet {
            margin-left: 0;
            justify-content: center;
            width: 100%;
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @media (max-width: 768px) {
            .nav-links {
              display: none;
            }
            .desktop-wallet-container {
              display: none;
            }
            .logo-desktop {
              display: none;
            }
            .logo-mobile {
              display: block;
            }
            .burger-btn {
              display: flex;
              margin-left: auto;
            }
            .nav-content {
              max-width: 100%;
              width: calc(100% - 2rem);
              margin: 0 1rem;
              padding: 0.5rem 0;
              background: transparent;
              border: none;
              box-shadow: none;
              backdrop-filter: none;
              transition: all 0.3s ease;
            }
            .navbar.fixed .nav-content {
              background: rgba(13, 20, 18, 0.85);
              backdrop-filter: blur(20px);
              border: 1px solid var(--glass-border);
              box-shadow: 0 10px 30px rgba(0,0,0,0.5);
              border-radius: 100px;
              padding: 0.5rem 1.25rem;
            }
            .address-pill {
              padding: 0.4rem 0.8rem;
              font-size: 0.75rem;
              gap: 0.5rem;
            }
            .btn-primary-sm {
              padding: 0.5rem 1.25rem;
              font-size: 0.75rem;
            }
          }
        `}</style>
      </nav>

      <WalletModal />
    </>
  );
};

export default Navbar;

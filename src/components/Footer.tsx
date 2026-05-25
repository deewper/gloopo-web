"use client";
import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/utils/supabase';

// Custom official brand icons for Gloopo (X, Telegram, Discord) styled to match color schemes
const XIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TelegramIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.578.192l-8.533 7.701-.33 4.955c.488 0 .703-.223.976-.485l2.344-2.279 4.875 3.6c.898.495 1.543.24 1.768-.83l3.195-15.059c.327-1.31-.5-1.905-1.356-1.517z" />
  </svg>
);

const DiscordIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58 1.334 18.067a.067.067 0 0 0 .025.033c1.272.94 2.49 1.505 3.568 1.884a.075.075 0 0 0 .08-.016c.46-.346.877-.736 1.246-1.157a.076.076 0 0 0-.035-.125c-1.393-.526-2.716-1.176-3.95-1.936a.076.076 0 0 1-.007-.127c.225-.164.444-.336.657-.514a.076.076 0 0 1 .075-.01c2.454 1.127 5.068 1.69 7.734 1.69s5.28-.563 7.734-1.69a.076.076 0 0 1 .075.01c.213.178.432.35.657.514a.076.076 0 0 1-.007.127c-1.234.76-2.557 1.41-3.95 1.936a.076.076 0 0 0-.035.125c.369.421.786.811 1.246 1.157a.075.075 0 0 0 .08.016c1.078-.379 2.296-.944 3.568-1.884a.067.067 0 0 0 .025-.033c1.684-4.544.757-9.056-1.353-13.67a.07.07 0 0 0-.032-.027ZM8.02 15.332c-1.18 0-2.158-1.085-2.158-2.419 0-1.333.955-2.419 2.158-2.419 1.21 0 2.176 1.095 2.158 2.419 0 1.334-.948 2.419-2.158 2.419Zm7.974 0c-1.18 0-2.158-1.085-2.158-2.419 0-1.333.955-2.419 2.158-2.419 1.21 0 2.176 1.095 2.158 2.419 0 1.334-.948 2.419-2.158 2.419Z" />
  </svg>
);

const Footer = () => {
  const [twitter, setTwitter] = useState('https://x.com/gloopo');
  const [telegram, setTelegram] = useState('https://t.me/gloopo');
  const [discord, setDiscord] = useState('https://discord.gg/gloopo');
  const [tagline, setTagline] = useState('Born natively on the Supra L1 blockchain, Gloopo is a unique entity that represents the evolution of digital exploration.');

  useEffect(() => {
    const loadFooterSettings = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: socData } = await supabase
            .from('website_settings')
            .select('value')
            .eq('key', 'socials')
            .single();
          if (socData && socData.value) {
            setTwitter(socData.value.twitter || '#');
            setTelegram(socData.value.telegram || '#');
            setDiscord(socData.value.discord || '#');
          }
          const { data: genData } = await supabase
            .from('website_settings')
            .select('value')
            .eq('key', 'general')
            .single();
          if (genData && genData.value) {
            setTagline(genData.value.metaDescription || 'Born natively on the Supra L1 blockchain, Gloopo is a unique entity.');
          }
        } catch (err) {
          console.error('Failed to load dynamic Footer settings:', err);
        }
      } else {
        const socVal = localStorage.getItem('gloopo_mock_setting_socials');
        if (socVal) {
          try {
            const parsed = JSON.parse(socVal);
            setTwitter(parsed.twitter || '#');
            setTelegram(parsed.telegram || '#');
            setDiscord(parsed.discord || '#');
          } catch (e) { }
        }
        const genVal = localStorage.getItem('gloopo_mock_setting_general');
        if (genVal) {
          try {
            const parsed = JSON.parse(genVal);
            setTagline(parsed.metaDescription || tagline);
          } catch (e) { }
        }
      }
    };
    loadFooterSettings();
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="brand-col">
            <h2 className="logo">GLOOPO<span className="dot">.</span></h2>
            <p>{tagline}</p>
            <div className="social-pills">
              <a href={twitter} target="_blank" rel="noopener noreferrer" className="pill" aria-label="X (Twitter)">
                <XIcon size={18} />
              </a>
              <a href={telegram} target="_blank" rel="noopener noreferrer" className="pill" aria-label="Telegram">
                <TelegramIcon size={18} />
              </a>
              <a href={discord} target="_blank" rel="noopener noreferrer" className="pill" aria-label="Discord">
                <DiscordIcon size={18} />
              </a>
            </div>
          </div>
          <div className="links-col">
            <div className="link-group">
              <h4>Ecosystem</h4>
              <a href="https://app.atmos.ag/en/token-studio/0xa101dd55fd41075dc42084dd00b956233dbf5b30c97bca0cb8ea0cd2e9543a82" target="_blank">Atmos</a>
              <a href="#">Crystara</a>
            </div>

            <div className="link-group">
              <h4>About</h4>
              <a href="#">Whitepaper</a>
              <a href="#brand-kit">Brand Kit</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Gloopo. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          padding: 350px 0 40px;
          background-color: #030806;
          background-image: linear-gradient(to bottom, #030806 0%, rgba(3, 8, 6, 0.65) 25%, rgba(3, 8, 6, 0.65) 100%), url('/images/footer-gloo.png');
          background-size: 100% 100%, cover;
          background-position: top, center top;
          background-repeat: no-repeat, no-repeat;
          position: relative;
        }
        .footer-main {
          display: flex;
          justify-content: space-between;
          margin-bottom: 80px;
        }
        .brand-col { max-width: 350px; }
        .logo { font-size: 2rem; font-weight: 900; color: #fff; margin-bottom: 1.5rem; }
        .logo .dot { color: var(--primary); }
        .brand-col p { color: var(--text-muted); line-height: 1.6; margin-bottom: 2rem; font-weight: 500; }
        
        .social-pills { display: flex; gap: 1rem; }
        .social-pills .pill {
          width: 45px;
          height: 45px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--glass-border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.8rem;
          color: var(--primary);
        }
        .social-pills .pill:hover { background: var(--primary); color: #000; border-color: var(--primary); }

        .links-col { display: flex; gap: 4rem; }
        .link-group h4 { margin-bottom: 1.5rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.15em; color: #fff; }
        .link-group a { display: block; color: var(--text-muted); margin-bottom: 1rem; font-size: 0.95rem; font-weight: 500; transition: color 0.3s; }
        .link-group a:hover { color: var(--primary); }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          padding-top: 40px;
          border-top: 1px solid rgba(255,255,255,0.03);
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 600;
        }

        @media (max-width: 992px) {
          .footer-main { flex-direction: column; gap: 4rem; }
          .links-col { gap: 2rem; flex-wrap: wrap; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;

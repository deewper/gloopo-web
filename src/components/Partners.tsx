"use client";
import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/utils/supabase';
import { Users } from 'lucide-react';

const MOCK_PARTNERS = [
  { name: 'supra.png', path: '◇ Supra L1', isMock: true },
  { name: 'atmos.png', path: '◇ Atmos Protocol', isMock: true },
  { name: 'crystara.png', path: '◇ Crystara Labs', isMock: true },
  { name: 'slinky.png', path: '◇ Slinky Swap', isMock: true },
  { name: 'ventures.png', path: '◇ Gloopo Ventures', isMock: true }
];

export default function Partners() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.storage.from('partners').list('', {
            limit: 20,
            sortBy: { column: 'created_at', order: 'desc' }
          });
          if (error) throw error;
          if (data && data.length > 0) {
            const files = data.filter(file => file.name !== '.emptyFolderPlaceholder');
            const mapped = files.slice(0, 10).map(file => {
              const { data: { publicUrl } } = supabase!.storage.from('partners').getPublicUrl(file.name);
              return {
                name: file.name,
                path: publicUrl
              };
            });
            setPartners(mapped);
          } else {
            setPartners([]);
          }
        } catch (err) {
          console.error('Error fetching partner logos:', err);
        } finally {
          setLoading(false);
        }
      } else {
        const val = localStorage.getItem('gloopo_mock_partners');
        if (val) {
          try {
            setPartners(JSON.parse(val));
          } catch (e) {
            setPartners(MOCK_PARTNERS);
          }
        } else {
          setPartners(MOCK_PARTNERS);
        }
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  return (
    <section id="partners" className="partners-section">
      <div className="partners-inner">
        <span className="tagline">Ecosystem</span>
        <h2 className="section-title">Strategic Partners</h2>

        {loading ? (
          <div className="partners-loading">
            <span className="spinner"></span>
          </div>
        ) : partners.length === 0 ? (
          <div className="no-partners glass-card">
            <Users size={32} className="users-icon" />
            <p>Ecosystem expansion underway. New partners announced soon.</p>
          </div>
        ) : (
          <div className="partners-grid">
            {partners.map((partner, idx) => (
              <div key={idx} className="partner-card">
                {partner.path.startsWith('◇') ? (
                  <div className="partner-fallback-badge">
                    <span className="fallback-diamond">◇</span>
                    <span className="fallback-text">{partner.path.substring(2)}</span>
                  </div>
                ) : (
                  <img src={partner.path} alt={partner.name} className="partner-logo-img" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .partners-section {
          padding: 100px 0 120px 0;
          background: #030806;
          background-image: radial-gradient(circle at 50% 50%, rgba(0, 255, 136, 0.02), transparent 60%);
          position: relative;
        }

        .partners-inner {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 2rem;
          text-align: center;
        }

        .partners-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 3rem;
        }

        .spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(0, 255, 136, 0.1);
          border-radius: 50%;
          border-top-color: var(--primary);
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .no-partners {
          max-width: 500px;
          margin: 3rem auto 0 auto;
          text-align: center;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          background: rgba(4, 12, 10, 0.5);
        }

        .users-icon {
          color: var(--primary);
          opacity: 0.6;
        }

        .no-partners p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .partners-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          margin-top: 3.5rem;
        }

        .partner-card {
          flex: 0 0 auto;
          width: 150px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .partner-logo-img {
          max-width: 90%;
          max-height: 90%;
          object-fit: contain;
          opacity: 0.7;
          transition: all 0.4s ease;
        }

        .partner-card:hover {
          transform: translateY(-5px);
        }

        .partner-card:hover .partner-logo-img {
          opacity: 1;
        }

        /* Fallback Text Badge Styling */
        .partner-fallback-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          text-align: center;
        }

        .fallback-diamond {
          font-size: 1.1rem;
          color: var(--primary);
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        .fallback-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-muted);
          transition: all 0.3s ease;
          letter-spacing: -0.01em;
        }

        .partner-card:hover .fallback-diamond {
          opacity: 1;
          transform: scale(1.1);
          text-shadow: 0 0 10px var(--primary);
        }

        .partner-card:hover .fallback-text {
          color: #fff;
        }

        @media (max-width: 768px) {
          .partners-grid {
            gap: 1.25rem;
          }
          .partner-card {
            width: 120px;
            height: 80px;
          }
          .partners-section {
            padding: 80px 0 100px 0;
          }
        }

        @media (max-width: 480px) {
          .partner-card {
            width: 100px;
            height: 70px;
          }
        }
      `}</style>
    </section>
  );
}

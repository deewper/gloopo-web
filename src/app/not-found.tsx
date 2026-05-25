'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="not-found-container">
      {/* Space Theme Background Ornaments */}
      <div className="bg-ornaments">
        <div className="nebula-glow primary"></div>
        <div className="nebula-glow accent"></div>
      </div>

      {/* Main 404 Card Frame */}
      <div className="glass-card error-card">
        <span className="error-badge">
          <AlertTriangle size={16} />
          <span>ORBITAL DRIFT</span>
        </span>
        
        <h1 className="error-code">404</h1>
        <h2 className="error-title">LOST IN DEEP SPACE</h2>
        
        <p className="error-desc" style={{ marginBottom: '0.5rem' }}>
          The coordinate grid you are trying to reach does not exist or has drifted out of our sector.
        </p>
      </div>

      <style jsx>{`
        .not-found-container {
          min-height: calc(100vh - var(--nav-height) - 100px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          color: #fff;
          text-align: center;
          padding: 8rem 2rem 6rem;
          z-index: 1;
          overflow: hidden;
        }

        .bg-ornaments {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
        }

        .nebula-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(150px);
          opacity: 0.12;
          animation: float-glow 8s infinite ease-in-out;
        }

        .nebula-glow.primary {
          width: 400px;
          height: 400px;
          background: var(--primary);
          top: 15%;
          left: 10%;
        }

        .nebula-glow.accent {
          width: 400px;
          height: 400px;
          background: var(--accent);
          bottom: 15%;
          right: 10%;
          animation-delay: -4s;
        }

        @keyframes float-glow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, -20px) scale(1.1);
          }
        }

        .error-card {
          max-width: 600px;
          background: rgba(4, 12, 10, 0.75) !important;
          border-color: var(--glass-border) !important;
          padding: 3.5rem 3rem !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5) !important;
        }

        .error-card:hover {
          transform: translateY(-4px) !important;
          border-color: rgba(0, 255, 136, 0.25) !important;
          box-shadow: 0 25px 60px rgba(0, 255, 136, 0.05) !important;
        }

        .error-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 77, 77, 0.08);
          border: 1px solid rgba(255, 77, 77, 0.25);
          color: #ff4d4d;
          padding: 0.5rem 1.1rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }

        .error-code {
          font-size: 8rem;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 900;
          line-height: 1;
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 25px rgba(0, 255, 136, 0.15));
          margin-bottom: 0.5rem;
          letter-spacing: -0.05em;
          animation: pulse-zoom 4s infinite ease-in-out;
        }

        @keyframes pulse-zoom {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        .error-title {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #fff;
          margin-bottom: 1.25rem;
        }

        .error-desc {
          font-size: 1rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        @media (max-width: 600px) {
          .not-found-container {
            padding: 6rem 1rem 4rem;
          }
          .error-card {
            padding: 2.5rem 1.5rem !important;
          }
          .error-code {
            font-size: 6rem;
          }
          .error-title {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </div>
  );
}

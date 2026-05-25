"use client";
import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';

const WalletModal: React.FC = () => {
  const { isModalOpen, setModalOpen, connect } = useWallet();
  const [starkeyDetected, setStarkeyDetected] = useState(false);
  const [ribbitDetected, setRibbitDetected] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      setStarkeyDetected(!!(window as any).starkey?.supra);
      setRibbitDetected(!!(window as any).ribbit);
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const onClose = () => setModalOpen(false);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Signup / Login</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="wallet-options">
          {/* Starkey Wallet */}
          <div 
            className={`wallet-item ${!starkeyDetected ? 'not-detected' : ''}`}
            onClick={() => connect('starkey')}
          >
            <div className="wallet-icon-box">
              <img src="/images/starkey-logo.png" alt="Starkey" className="wallet-logo" />
            </div>
            <div className="wallet-info">
              <h3>{starkeyDetected ? 'Starkey' : 'Download Starkey'}</h3>
              <div className={`status-pill ${starkeyDetected ? 'detected' : 'missing'}`}>
                <div className="status-dot"></div>
                {starkeyDetected ? 'Detected' : 'Not detected'}
              </div>
            </div>
          </div>

          {/* Ribbit Wallet */}
          <div 
            className={`wallet-item ${!ribbitDetected ? 'not-detected' : ''}`}
            onClick={() => connect('ribbit')}
          >
            <div className="wallet-icon-box">
              <img src="/images/ribbit-logo.png" alt="Ribbit" className="wallet-logo" />
            </div>
            <div className="wallet-info">
              <h3>{ribbitDetected ? 'Ribbit Wallet' : 'Download Ribbit Wallet'}</h3>
              <div className={`status-pill ${ribbitDetected ? 'detected' : 'missing'}`}>
                <div className="status-dot"></div>
                {ribbitDetected ? 'Detected' : 'Not detected'}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <p>
            By connecting a wallet, you agree to Atmos Protocol's <br />
            <a href="#">Terms of Service</a> and consent to its <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.3s ease;
        }

        .modal-card {
          width: 100%;
          max-width: 440px;
          background: #040c0a;
          border: 1px solid rgba(0, 255, 136, 0.2);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-header {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .modal-header h2 {
          font-size: 1.25rem;
          color: #fff;
          font-weight: 700;
          letter-spacing: 0.02em;
          margin: 0;
        }

        .close-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0, 255, 136, 0.1);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          border: 1px solid rgba(0, 255, 136, 0.2);
        }

        .close-btn:hover {
          background: var(--primary);
          color: #000;
        }

        .wallet-options {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .wallet-item {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .wallet-item:hover {
          background: rgba(0, 255, 136, 0.05);
          border-color: rgba(0, 255, 136, 0.3);
          transform: translateY(-2px);
        }

        .wallet-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          overflow: hidden;
          background: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wallet-logo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .wallet-info h3 {
          font-size: 1.1rem;
          color: var(--primary);
          margin-bottom: 0.25rem;
          font-weight: 700;
        }

        .status-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .detected .status-dot {
          background: var(--primary);
          box-shadow: 0 0 10px var(--primary);
        }

        .missing .status-dot {
          background: #ff4d4d;
          box-shadow: 0 0 10px #ff4d4d;
        }

        .modal-footer {
          padding: 1.5rem;
          text-align: center;
        }

        .modal-footer p {
          font-size: 0.75rem;
          color: #4a5568;
          line-height: 1.6;
          margin: 0;
        }

        .modal-footer a {
          color: var(--primary);
          font-weight: 700;
          text-decoration: none;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default WalletModal;

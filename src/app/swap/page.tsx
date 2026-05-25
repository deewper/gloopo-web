"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';
import { ArrowDown, Settings, Wallet } from 'lucide-react';

// Constants for Supra and Gloopo
const TOKENS = {
  SUPRA: {
    symbol: 'SUPRA',
    name: 'Supra Coin',
    address: '0x0000000000000000000000000000000000000000000000000000000000000001::supra_coin::SupraCoin',
    decimals: 8,
    icon: 'S'
  },
  GLOOPO: {
    symbol: 'GLOOPO',
    name: 'Gloopo',
    address: '0xa101dd55fd41075dc42084dd00b956233dbf5b30c97bca0cb8ea0cd2e9543a82',
    decimals: 6,
    icon: 'G'
  }
};

const SwapPage = () => {
  const { address, isConnected, balance, setModalOpen } = useWallet();
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromToken, setFromToken] = useState(TOKENS.SUPRA);
  const [toToken, setToToken] = useState(TOKENS.GLOOPO);
  const [loading, setLoading] = useState(false);
  const [rate, setRate] = useState<number | null>(null);
  const [swapData, setSwapData] = useState<any>(null);

  const fetchQuote = useCallback(async (amount: string, from: typeof TOKENS.SUPRA, to: typeof TOKENS.SUPRA) => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setToAmount('');
      setRate(null);
      return;
    }

    setLoading(true);
    try {
      // Convert amount to base units (atomic units)
      const atomicAmount = Math.floor(Number(amount) * Math.pow(10, from.decimals)).toString();

      const response = await fetch('/api/atmos/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          srcCoin: from.address,
          dstCoin: to.address,
          srcAmount: atomicAmount,
          dstAddress: address || '0x0'
        })
      });

      const data = await response.json();
      if (data.dstAmount) {
        const estimatedTo = Number(data.dstAmount) / Math.pow(10, to.decimals);
        setToAmount(estimatedTo.toFixed(6));
        setRate(estimatedTo / Number(amount));
        setSwapData(data); // Store the full response for execution
      }
    } catch (error) {
      console.error('Failed to fetch quote:', error);
    } finally {
      setLoading(false);
    }
  }, [address]);

  // Debounce quote fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuote(fromAmount, fromToken, toToken);
    }, 500);
    return () => clearTimeout(timer);
  }, [fromAmount, fromToken, toToken, fetchQuote]);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount('');
  };

  const executeSwap = async () => {
    if (!isConnected || !swapData) return;
    
    setLoading(true);
    try {
      // Actual execution logic using Starkey/Ribbit would go here
      // For example: await window.starkey.supra.signAndSubmitTransaction(swapData.payload);
      alert('Transaction Payload Received! Ready to sign with wallet.');
      console.log('Swap Payload:', swapData);
    } catch (error) {
      console.error('Swap execution failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="swap-container">
      <div className="swap-bg">
        <div className="grid-overlay"></div>
        <div className="gradient-sphere pos-1"></div>
        <div className="gradient-sphere pos-2"></div>
      </div>

      <div className="swap-content">
        <div className="swap-card">
          <div className="swap-header">
            <h2>Swap</h2>
            <button className="settings-btn" aria-label="Settings">
              <Settings size={20} />
            </button>
          </div>

          <div className="input-group">
            <div className="input-label">
              <span>From</span>
              <span>Balance: {isConnected && fromToken.symbol === 'SUPRA' ? (balance || '0.00') : '0.00'}</span>
            </div>
            <div className="input-row">
              <input 
                type="number" 
                placeholder="0.0" 
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
              />
              <button className="token-select static">
                <span className={`token-icon ${fromToken.symbol === 'SUPRA' ? '' : 'secondary'}`}>{fromToken.icon}</span>
                {fromToken.symbol}
              </button>
            </div>
          </div>

          <div className="swap-divider">
            <button className="swap-icon-btn" onClick={handleSwapTokens} aria-label="Switch Tokens">
              <ArrowDown size={20} />
            </button>
          </div>

          <div className="input-group">
            <div className="input-label">
              <span>To (estimated)</span>
              <span>Balance: {isConnected && toToken.symbol === 'SUPRA' ? (balance || '0.00') : '0.00'}</span>
            </div>
            <div className="input-row">
              <input 
                type="text" 
                placeholder="0.0" 
                value={loading ? 'Loading...' : toAmount}
                readOnly
              />
              <button className="token-select static">
                <span className={`token-icon ${toToken.symbol === 'SUPRA' ? '' : 'secondary'}`}>{toToken.icon}</span>
                {toToken.symbol}
              </button>
            </div>
          </div>

          <div className="swap-info">
            {rate && (
              <div className="info-row">
                <span>Exchange Rate</span>
                <span>1 {fromToken.symbol} = {rate.toFixed(4)} {toToken.symbol}</span>
              </div>
            )}
            <div className="info-row">
              <span>Slippage Tolerance</span>
              <span>0.5%</span>
            </div>
          </div>

          {isConnected ? (
            <button 
              className={`swap-button ${loading || !fromAmount ? 'disabled' : ''}`}
              disabled={loading || !fromAmount}
              onClick={executeSwap}
            >
              {loading ? 'Processing...' : 'Swap'}
            </button>
          ) : (
            <button className="swap-button" onClick={() => setModalOpen(true)}>
              <Wallet size={18} style={{ marginRight: '8px' }} />
              Connect Wallet
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .swap-container {
          min-height: 100vh;
          background: #030806;
          padding-top: 120px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          position: relative;
          overflow: hidden;
        }

        .swap-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(circle at center, black 30%, transparent 90%);
          z-index: 2;
        }

        .gradient-sphere {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
          z-index: 1;
        }

        .pos-1 {
          width: 500px;
          height: 500px;
          background: var(--primary);
          top: -100px;
          left: -100px;
        }

        .pos-2 {
          width: 400px;
          height: 400px;
          background: #BBFF00;
          bottom: -50px;
          right: -50px;
        }

        .swap-content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 460px;
          padding: 1rem;
        }

        .swap-card {
          background: rgba(4, 12, 10, 0.7);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(0, 255, 136, 0.1);
          border-radius: 24px;
          padding: 1.75rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        }

        .swap-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .swap-header h2 {
          font-size: 1.5rem;
          color: white;
          margin: 0;
        }

        .settings-btn {
          background: transparent;
          color: var(--text-muted);
          transition: color 0.3s ease;
        }

        .settings-btn:hover {
          color: var(--primary);
        }

        .input-group {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 18px;
          padding: 1rem;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }

        .input-group:focus-within {
          border-color: rgba(0, 255, 136, 0.3);
          background: rgba(255, 255, 255, 0.05);
        }

        .input-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
        }

        .input-row {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .input-row input {
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 1.5rem;
          font-weight: 600;
          width: 100%;
          font-family: inherit;
        }

        .token-select {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 0.4rem 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: white;
          font-weight: 700;
          font-size: 0.9rem;
          white-space: nowrap;
          transition: all 0.3s ease;
        }

        .token-select:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .token-icon {
          width: 24px;
          height: 24px;
          background: var(--primary);
          color: #030806;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 900;
        }

        .token-icon.secondary {
          background: #BBFF00;
        }

        .swap-divider {
          display: flex;
          justify-content: center;
          margin: -15px 0;
          position: relative;
          z-index: 5;
        }

        .swap-icon-btn {
          background: #101a16;
          border: 4px solid #030806;
          border-radius: 12px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .swap-icon-btn:hover {
          transform: rotate(180deg) scale(1.1);
          color: white;
          background: var(--primary);
        }

        .swap-info {
          margin: 1.5rem 0;
          padding: 0 0.5rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }

        .swap-button {
          width: 100%;
          background: var(--primary);
          color: #030806;
          padding: 1.1rem;
          border-radius: 16px;
          font-weight: 800;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.2);
        }

        .swap-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4);
          background: var(--primary-bright);
        }

        @media (max-width: 480px) {
          .swap-card {
            padding: 1.25rem;
          }
          .input-row input {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </main>
  );
};

export default SwapPage;

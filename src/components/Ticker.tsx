"use client";
import React from 'react';

const Ticker = () => {
  const text = "THE TICKER IS $GLOOPO";
  const separator = " — ";
  const content = Array(15).fill(`${text}${separator}`).join("");

  return (
    <div className="ticker-wrapper">
      <div className="ticker-content">
        <span className="ticker-text">{content}</span>
        <span className="ticker-text">{content}</span>
      </div>

      <style jsx>{`
        .ticker-wrapper {
          width: 100%;
          overflow: hidden;
          background: #00FF88;
          padding: 1rem 0;
          white-space: nowrap;
          position: relative;
          z-index: 20;
          border-top: 1px solid rgba(0,0,0,0.1);
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        .ticker-content {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
        .ticker-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.2rem;
          font-weight: 900;
          color: #030806;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding-right: 0;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default Ticker;

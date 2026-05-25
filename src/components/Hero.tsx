"use client";
import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-bg">
        <img
          src="/images/hero_bg.png"
          alt="Gloopo Hero BG"
          className="bg-img"
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Scroll Down Indicator - visible on mobile only */}
      <div className="scroll-down-mobile">
        <span className="scroll-text">Scroll to Explore</span>
        <div className="scroll-arrow-box">
          <ChevronDown className="scroll-arrow" size={20} />
        </div>
      </div>

      <div className="container hero-container">
        <div className="hero-content">
          <div className="title-wrapper">
            <img
              src="/images/gloo-text.png"
              alt="GLOOPO"
              className="brand-img"
            />
          </div>

          <div className="character-display">
            <img
              src="/images/gloopo.gif"
              alt="Gloopo Mascot"
              className="mascot-img"
            />
            <div className="mascot-glow"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding-top: 60px;
          padding-bottom: 0;
          overflow: hidden;
          background: #030806;
          text-align: center;
        }
        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        .bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.4;
        }
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, transparent 0%, #030806 85%);
          z-index: 2;
        }
        .hero-container {
          position: relative;
          z-index: 10;
          width: 100%;
        }
        
        .title-wrapper {
          margin-bottom: 0;
          display: flex;
          justify-content: center;
          transform: translateY(40px);
          position: relative;
          z-index: 11;
        }
        .brand-img {
          width: 100%;
          max-width: 450px;
          height: auto;
          filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.1));
        }

        .character-display {
          position: relative;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          line-height: 0;
        }
        .mascot-img {
          width: 100%;
          height: auto;
          max-width: 650px;
          z-index: 5;
          display: block;
          filter: drop-shadow(0 0 50px rgba(0, 255, 136, 0.3));
        }
        .mascot-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 255, 136, 0.2) 0%, transparent 70%);
          z-index: 1;
          filter: blur(100px);
          bottom: 0;
        }

        .scroll-down-mobile {
          display: none;
        }

        @media (max-width: 992px) {
          .brand-img { max-width: 350px; }
          .mascot-img { max-width: 500px; }
        }
        @media (max-width: 768px) {
          .hero {
            min-height: 100vh;
            min-height: 100dvh;
            padding-top: 100px;
            padding-bottom: 0;
          }
          .title-wrapper {
            display: none;
          }
          .brand-img {
            max-width: 260px;
          }
          .mascot-img {
            max-width: 480px;
          }
          .mascot-glow {
            width: 400px;
            height: 400px;
          }
          
          /* Mobile Scroll Down styles */
          .scroll-down-mobile {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 42%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
            gap: 10px;
            pointer-events: none;
          }
          .scroll-text {
            font-size: 0.7rem;
            color: var(--primary);
            text-transform: uppercase;
            letter-spacing: 0.2em;
            font-weight: 700;
            text-shadow: 0 0 10px rgba(0, 255, 136, 0.4);
            animation: pulse-opacity 2s infinite ease-in-out;
          }
          .scroll-arrow-box {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(0, 255, 136, 0.05);
            border: 1px solid rgba(0, 255, 136, 0.25);
            box-shadow: 0 0 15px rgba(0, 255, 136, 0.1);
            animation: bounce-arrow 2s infinite ease-in-out;
          }
          .scroll-arrow {
            color: var(--primary);
            filter: drop-shadow(0 0 5px rgba(0, 255, 136, 0.5));
          }
        }
        @media (max-width: 480px) {
          .hero {
            min-height: 100vh;
            min-height: 100dvh;
            padding-top: 90px;
            padding-bottom: 0;
          }
          .brand-img {
            max-width: 200px;
          }
          .mascot-img {
            max-width: 360px;
          }
          .scroll-down-mobile {
            top: 38%;
          }
        }

        @keyframes bounce-arrow {
          0%, 100% {
            transform: translateY(0);
            box-shadow: 0 0 15px rgba(0, 255, 136, 0.1);
            border-color: rgba(0, 255, 136, 0.2);
          }
          50% {
            transform: translateY(6px);
            box-shadow: 0 0 25px rgba(0, 255, 136, 0.3);
            border-color: rgba(0, 255, 136, 0.5);
          }
        }

        @keyframes pulse-opacity {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export default Hero;

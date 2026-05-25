"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';
import Link from 'next/link';

const BrandKit = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="brand-kit" 
      ref={sectionRef}
      className={`brand-kit-section ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="brand-kit-full-box">
        {/* Background Image Layer */}
        <div className="bg-image-layer"></div>
        <div className="bg-overlay"></div>

        <div className="container">
          <div className="content-wrapper">
            <span className="tagline">Brand style guide</span>
            <h2 className="title">Media Pack</h2>
            <p className="description">
              Download the official Gloopo logo files and brand assets.
            </p>
            
            <Link href="/brand-assets" style={{ textDecoration: 'none' }}>
              <button className="brand-kit-btn">
                <Download size={20} />
                <span>Download Assets</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .brand-kit-section {
          padding: 0;
          background: var(--background);
          width: 100%;
          overflow: hidden;
        }

        .brand-kit-full-box {
          background: #00ff88;
          width: 100%;
          padding: 8rem 0;
          position: relative;
          color: #030806;
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
          transform: translateY(20px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .is-visible .brand-kit-full-box {
          opacity: 1;
          transform: translateY(0);
        }

        .bg-image-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('/images/brand-kit.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.8;
          z-index: 0;
        }

        .bg-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, rgba(0, 255, 136, 0.4), rgba(0, 255, 136, 0.6));
          z-index: 1;
        }

        .content-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .tagline {
          color: rgba(3, 8, 6, 0.6);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          display: block;
        }

        .title {
          font-size: 4.5rem;
          font-weight: 900;
          color: #030806;
          margin-bottom: 1.5rem;
          font-family: 'Space Grotesk', sans-serif;
          line-height: 1;
        }

        .description {
          color: rgba(3, 8, 6, 0.85);
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2.5rem;
          max-width: 600px;
          font-weight: 600;
        }

        .brand-kit-btn {
          background: #030806;
          color: #00ff88;
          border: none;
          padding: 1.2rem 3.5rem;
          border-radius: 100px;
          font-weight: 800;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        .brand-kit-btn:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          background: #000;
        }

        @media (max-width: 992px) {
          .title {
            font-size: 3.5rem;
          }
          .brand-kit-full-box {
            padding: 6rem 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .title {
            font-size: 3rem;
          }
          .description {
            font-size: 1.1rem;
          }
        }

        @media (max-width: 576px) {
          .title {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default BrandKit;

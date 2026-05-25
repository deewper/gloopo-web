'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/utils/supabase';
import { Shield } from 'lucide-react';

export default function MaintenanceWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdminRoute) {
      setLoading(false);
      return;
    }

    const loadMaintenanceSetting = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data, error } = await supabase
            .from('website_settings')
            .select('value')
            .eq('key', 'general')
            .single();
          if (data && data.value) {
            setMaintenanceMode(data.value.maintenanceMode === true);
          }
        } else {
          const val = localStorage.getItem('gloopo_mock_setting_general');
          if (val) {
            const parsed = JSON.parse(val);
            setMaintenanceMode(parsed.maintenanceMode === true);
          }
        }
      } catch (err) {
        console.error('Failed to load maintenance mode:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMaintenanceSetting();
  }, [pathname, isAdminRoute]);

  if (isAdminRoute) {
    return <>{children}</>;
  }

  if (loading) {
    // Return a simple dark screen during the initial load check to prevent flashing
    return (
      <div style={{ minHeight: '100vh', width: '100vw', background: '#030806' }} />
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
            <Shield size={38} />
          </div>
          <h1>System Upgrades in Progress</h1>
          <p>
            Gloopo is currently undergoing protocol optimizations on the Supra L1 mainnet interface. We will resume shortly.
          </p>
          <div className="status-indicator">
            <span className="dot animate-ping"></span>
            <span>MAINTENANCE MODE ACTIVE</span>
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
            background: rgba(255, 159, 67, 0.06);
            border: 1px solid rgba(255, 159, 67, 0.2);
            color: #ff9f43;
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
            background: #ff9f43;
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}

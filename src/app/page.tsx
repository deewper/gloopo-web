"use client";

import React, { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import About from '@/components/About';
import Tokenomics from '@/components/Tokenomics';
import Roadmap from '@/components/Roadmap';
import BrandKit from '@/components/BrandKit';
import Partners from '@/components/Partners';
import WhitepaperSection from '@/components/WhitepaperSection';
import { supabase, isSupabaseConfigured } from '@/utils/supabase';

export default function Home() {
  const [siteTitle, setSiteTitle] = useState('Gloopo - Community-Driven Assets on Supra L1');

  useEffect(() => {
    const loadGeneralSettings = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase
            .from('website_settings')
            .select('value')
            .eq('key', 'general')
            .single();
          if (data && data.value) {
            const title = data.value.siteTitle || 'Gloopo - Community-Driven Assets on Supra L1';
            setSiteTitle(title);
            document.title = title;
            
            // Update description meta tag dynamically
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc && data.value.metaDescription) {
              metaDesc.setAttribute('content', data.value.metaDescription);
            }
          }
        } catch (e) {
          console.error('Failed to load dynamic general settings:', e);
        }
      } else {
        const val = localStorage.getItem('gloopo_mock_setting_general');
        if (val) {
          try {
            const parsed = JSON.parse(val);
            const title = parsed.siteTitle || 'Gloopo - Community-Driven Assets on Supra L1';
            setSiteTitle(title);
            document.title = title;
          } catch (e) {}
        }
      }
    };
    loadGeneralSettings();
  }, []);

  // Visitor Traffic Tracking
  useEffect(() => {
    const trackVisitor = async () => {
      const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const lastVisitDate = localStorage.getItem('gloopo_visited_today');
      const isUnique = lastVisitDate !== todayStr;
      
      if (isUnique) {
        localStorage.setItem('gloopo_visited_today', todayStr);
      }

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.rpc('track_visit', { is_unique: isUnique });
        } catch (err) {
          console.error('Failed to log visitor traffic to Supabase:', err);
        }
      } else {
        // Mock Mode LocalStorage Tracker
        try {
          const stored = localStorage.getItem('gloopo_mock_traffic_stats');
          let stats: any[] = stored ? JSON.parse(stored) : [];
          
          // If empty, generate simulated history for the last 7 days (to make the chart look nice)
          if (stats.length === 0) {
            const today = new Date();
            for (let i = 6; i >= 0; i--) {
              const d = new Date();
              d.setDate(today.getDate() - i);
              const dStr = d.toISOString().split('T')[0];
              // Random realistic views/visitors
              stats.push({
                date: dStr,
                page_views: Math.floor(Math.random() * 80) + 100,
                unique_visitors: Math.floor(Math.random() * 30) + 40
              });
            }
          }
          
          // Increment today's stats
          const todayEntryIndex = stats.findIndex(s => s.date === todayStr);
          if (todayEntryIndex !== -1) {
            stats[todayEntryIndex].page_views += 1;
            if (isUnique) {
              stats[todayEntryIndex].unique_visitors += 1;
            }
          } else {
            // New day
            stats.push({
              date: todayStr,
              page_views: 1,
              unique_visitors: isUnique ? 1 : 0
            });
            // Keep only last 10 days of mock stats
            if (stats.length > 10) {
              stats.shift();
            }
          }
          
          localStorage.setItem('gloopo_mock_traffic_stats', JSON.stringify(stats));
        } catch (err) {
          console.error('Failed to update mock traffic stats:', err);
        }
      }
    };
    trackVisitor();
  }, []);

  return (
    <main>
      <Hero />
      <Ticker />
      <About />
      <Tokenomics />
      <BrandKit />
      <Roadmap />
      <WhitepaperSection />
      <Partners />
    </main>
  );
}

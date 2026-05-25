"use client";

import React, { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import About from '@/components/About';
import Tokenomics from '@/components/Tokenomics';
import Roadmap from '@/components/Roadmap';
import BrandKit from '@/components/BrandKit';
import Partners from '@/components/Partners';
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

  return (
    <main>
      <Hero />
      <Ticker />
      <About />
      <Tokenomics />
      <BrandKit />
      <Roadmap />
      <Partners />
    </main>
  );
}

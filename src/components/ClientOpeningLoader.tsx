'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import to prevent SSR flash
const OpeningLoader = dynamic(() => import('./OpeningLoader'), { ssr: false });

export default function ClientOpeningLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show on every fresh page load / refresh (not on Next.js client-side nav)
    // We detect a fresh load by absence of a sessionStorage flag set after first hide
    const alreadyShown = sessionStorage.getItem('gloopo_intro_shown');
    if (!alreadyShown) {
      setShow(true);
    }
  }, []);

  const handleFinish = useCallback(() => {
    sessionStorage.setItem('gloopo_intro_shown', '1');
    setShow(false);
  }, []);

  if (!show) return null;
  return <OpeningLoader onFinish={handleFinish} />;
}

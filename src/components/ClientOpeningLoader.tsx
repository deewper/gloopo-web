'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import to prevent SSR flash
const OpeningLoader = dynamic(() => import('./OpeningLoader'), { ssr: false });

export default function ClientOpeningLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Skip entirely on any /admin route
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return;
    }
    // Show on every hard refresh / first load — no sessionStorage guard
    setShow(true);
  }, []);

  const handleFinish = useCallback(() => {
    setShow(false);
  }, []);

  if (!show) return null;
  return <OpeningLoader onFinish={handleFinish} />;
}


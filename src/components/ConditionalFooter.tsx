'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

const ConditionalFooter = () => {
  const pathname = usePathname();
  
  // Hide footer on swap page and admin routes
  if (pathname === '/swap' || pathname.startsWith('/admin')) {
    return null;
  }

  return <Footer />;
};

export default ConditionalFooter;

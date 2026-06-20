import type { Metadata } from "next";
import "./globals.css";
import Script from 'next/script';
import ConditionalNavbar from '@/components/ConditionalNavbar';
import ConditionalFooter from '@/components/ConditionalFooter';
import ScrollToTop from '@/components/ScrollToTop';
import MaintenanceWrapper from '@/components/MaintenanceWrapper';
import ClientOpeningLoader from '@/components/ClientOpeningLoader';
import { WalletProvider } from "@/context/WalletContext";

export const metadata: Metadata = {
  title: "Gloopo - Community-Driven Assets on Supra L1",
  description: "Gloopo is a next-generation digital asset project architected natively on the Supra Layer 1 blockchain.",
  keywords: ["Gloopo", "Supra L1", "Crypto", "Tokenomics", "NFT", "Blockchain"],
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the inline script below mutates <html> class
    // before React hydrates, which is intentional and safe to suppress.
    <html lang="en" suppressHydrationWarning>
      <body>
        {/*
          Runs synchronously before any page code (beforeInteractive).
          Adds `gloopo-loading` to <html> on non-admin pages so that
          globals.css hides body content until the loader finishes —
          eliminating the flash of page content on refresh.
        */}
        <Script
          id="gloopo-loader-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(!window.location.pathname.startsWith('/admin')){document.documentElement.classList.add('gloopo-loading');}}catch(e){}})();`
          }}
        />
        <ClientOpeningLoader />
        <WalletProvider>
          <MaintenanceWrapper>
            <ConditionalNavbar />
            {children}
            <ConditionalFooter />
            <ScrollToTop />
          </MaintenanceWrapper>
        </WalletProvider>
      </body>
    </html>
  );
}

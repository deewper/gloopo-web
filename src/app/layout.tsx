import type { Metadata } from "next";
import "./globals.css";
import ConditionalNavbar from '@/components/ConditionalNavbar';
import ConditionalFooter from '@/components/ConditionalFooter';
import ScrollToTop from '@/components/ScrollToTop';
import MaintenanceWrapper from '@/components/MaintenanceWrapper';

export const metadata: Metadata = {
  title: "Gloopo - Community-Driven Assets on Supra L1",
  description: "Gloopo is a next-generation digital asset project architected natively on the Supra Layer 1 blockchain.",
  keywords: ["Gloopo", "Supra L1", "Crypto", "Tokenomics", "NFT", "Blockchain"],
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
};

import { WalletProvider } from "@/context/WalletContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
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

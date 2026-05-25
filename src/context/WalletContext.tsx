"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  address: string | null;
  balance: string | null;
  isConnected: boolean;
  walletType: 'starkey' | 'ribbit' | null;
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  connect: (type: 'starkey' | 'ribbit') => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const isConnected = !!address;
  const [balance, setBalance] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<'starkey' | 'ribbit' | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const refreshBalance = async () => {
    if (!address) return;
    try {
      // Use internal proxy to bypass CORS and ensure fresh data
      const res = await fetch(`/api/supra/balance/${address}`, { cache: 'no-store' });
      if (res.ok) {
        const resources = await res.json();
        
        // Supra RPC /resources returns a JSON array of resources directly
        // The previous code was looking for resources.result.find, which is incorrect
        const coinResource = Array.isArray(resources) ? resources.find(
          (r: any) => r.type === '0x1::coin::CoinStore<0x1::supra_coin::SupraCoin>'
        ) : null;

        if (coinResource) {
          const rawBalance = coinResource.data?.coin?.value || '0';
          // Supra has 8 decimals
          const formatted = (Number(rawBalance) / 1e8).toFixed(4);
          setBalance(formatted);
        } else {
          setBalance('0.0000');
        }
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  // Poll balance every 5 seconds when connected for a more real-time feel
  useEffect(() => {
    if (isConnected) {
      refreshBalance();
      const interval = setInterval(refreshBalance, 5000);
      return () => clearInterval(interval);
    } else {
      setBalance(null);
    }
  }, [address, isConnected]);

  // Listen for Starkey wallet events (account switch, disconnect)
  useEffect(() => {
    const supra = (window as any).starkey?.supra;
    if (!supra) return;

    const handleAccountChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAddress(accounts[0]);
      } else {
        setAddress(null);
        setBalance(null);
        setWalletType(null);
      }
    };

    const handleDisconnect = () => {
      setAddress(null);
      setBalance(null);
      setWalletType(null);
    };

    supra.on('accountChanged', handleAccountChanged);
    supra.on('disconnect', handleDisconnect);

    return () => {
      supra.removeListener?.('accountChanged', handleAccountChanged);
      supra.removeListener?.('disconnect', handleDisconnect);
    };
  }, []);

  const connect = async (type: 'starkey' | 'ribbit') => {
    try {
      if (type === 'starkey') {
        const supra = (window as any).starkey?.supra;
        if (!supra) {
          window.open('https://starkey.app/', '_blank');
          return;
        }
        
        const accounts = await supra.connect();
        if (accounts && accounts.length > 0) {
          const addr = accounts[0];
          
          // Request Signature for Verification
          const nonce = Math.floor(Math.random() * 1000000);
          const message = `Welcome to Gloopo! Sign this message to verify your identity.\n\nAddress: ${addr}\nNonce: ${nonce}`;
          // Convert UTF-8 message to hex string as required by Starkey
          const hexMessage = '0x' + Array.from(new TextEncoder().encode(message)).map(b => b.toString(16).padStart(2, '0')).join('');
          
          try {
            await supra.signMessage({ message: hexMessage });
            setAddress(addr);
            setWalletType('starkey');
            setModalOpen(false);
          } catch (signError) {
            console.error('Signature rejected:', signError);
            alert('Koneksi dibatalkan: Anda harus menandatangani pesan untuk memverifikasi identitas.');
          }
        }
      } else {
        // Ribbit wallet logic
        const ribbit = (window as any).ribbit;
        if (!ribbit) {
          window.open('https://ribbitwallet.com/', '_blank');
          return;
        }
        
        const accounts = await ribbit.connect();
        if (accounts && accounts.length > 0) {
          const addr = accounts[0];
          
          // Request Signature for Verification
          const nonce = Math.floor(Math.random() * 1000000);
          const message = `Welcome to Gloopo! Sign this message to verify your identity.\n\nAddress: ${addr}\nNonce: ${nonce}`;
          
          try {
            await ribbit.signMessage(message);
            setAddress(addr);
            setWalletType('ribbit');
            setModalOpen(false);
          } catch (signError) {
            console.error('Signature rejected:', signError);
            alert('Koneksi dibatalkan: Anda harus menandatangani pesan untuk memverifikasi identitas.');
          }
        }
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setBalance(null);
    setWalletType(null);
  };


  return (
    <WalletContext.Provider value={{ 
      address, 
      balance,
      isConnected, 
      walletType, 
      isModalOpen,
      setModalOpen,
      connect, 
      disconnect,
      refreshBalance
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

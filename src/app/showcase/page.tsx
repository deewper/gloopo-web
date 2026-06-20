"use client";
import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/utils/supabase';
import { Compass, Search, SlidersHorizontal, X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface NftImageProps {
  src: string;
  alt: string;
  isMetadataLoading: boolean;
}

function NftImage({ src, alt, isMetadataLoading }: NftImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [src]);

  return (
    <div className="nft-image-container">
      {(isMetadataLoading || !imageLoaded) && (
        <div className="image-loading-skeleton">
          <div className="pulse-shimmer"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setImageLoaded(true)}
        className={`nft-image-el ${imageLoaded && !isMetadataLoading ? 'loaded' : 'loading'}`}
      />
      <style jsx>{`
        .nft-image-container {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .image-loading-skeleton {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(13, 20, 18, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .pulse-shimmer {
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.08), transparent);
          animation: skeleton-loading 1.6s infinite;
        }
        .nft-image-el {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: drop-shadow(0 0 15px rgba(0, 255, 136, 0.2));
          transition: transform 0.5s ease, opacity 0.4s ease;
          opacity: 0;
        }
        .nft-image-el.loaded {
          opacity: 1;
        }
        .nft-image-el.loading {
          opacity: 0;
          position: absolute;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

function CustomDropdown({ value, onChange, options, placeholder }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="custom-dropdown-container" ref={dropdownRef}>
      <button 
        type="button" 
        onClick={() => setIsOpen(prev => !prev)} 
        className={`custom-dropdown-header ${isOpen ? 'active' : ''}`}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <span className="custom-dropdown-arrow"></span>
      </button>
      
      {isOpen && (
        <ul className="custom-dropdown-options-list">
          {options.map((opt) => (
            <li 
              key={opt.value} 
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`custom-dropdown-option ${opt.value === value ? 'selected' : ''}`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
      
      <style jsx>{`
        .custom-dropdown-container {
          width: 100%;
          position: relative;
        }

        .custom-dropdown-header {
          width: 100%;
          padding: 0.5rem 2.25rem 0.5rem 0.75rem;
          background: rgba(3, 8, 6, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          color: #fff;
          outline: none;
          font-size: 0.82rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s ease;
          box-sizing: border-box;
          text-align: left;
        }

        .custom-dropdown-header:focus,
        .custom-dropdown-header.active {
          border-color: rgba(0, 255, 136, 0.4);
          box-shadow: 0 0 12px rgba(0, 255, 136, 0.15);
          background: rgba(3, 8, 6, 0.75);
        }

        .custom-dropdown-arrow {
          position: absolute;
          right: 0.88rem;
          top: 50%;
          width: 5px;
          height: 5px;
          border-right: 1.5px solid rgba(255, 255, 255, 0.4);
          border-bottom: 1.5px solid rgba(255, 255, 255, 0.4);
          transform: translateY(-60%) rotate(45deg);
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .custom-dropdown-header.active .custom-dropdown-arrow {
          border-color: var(--primary);
          transform: translateY(-20%) rotate(-135deg);
        }

        .custom-dropdown-options-list {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          width: 100%;
          background: rgba(13, 20, 18, 0.95);
          border: 1px solid rgba(0, 255, 136, 0.18);
          border-radius: 8px;
          padding: 0.4rem 0;
          margin: 0;
          list-style: none;
          z-index: 100;
          backdrop-filter: blur(20px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          max-height: 200px;
          overflow-y: auto;
          box-sizing: border-box;
        }

        .custom-dropdown-options-list::-webkit-scrollbar {
          width: 4px;
        }
        .custom-dropdown-options-list::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-dropdown-options-list::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 136, 0.15);
          border-radius: 4px;
        }
        .custom-dropdown-options-list::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 136, 0.4);
        }

        .custom-dropdown-option {
          padding: 0.5rem 0.88rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .custom-dropdown-option:hover {
          background: rgba(0, 255, 136, 0.08);
          color: #fff;
          padding-left: 1.05rem;
        }

        .custom-dropdown-option.selected {
          background: rgba(0, 255, 136, 0.12);
          color: var(--primary);
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}

export default function ShowcasePage() {
  const [maintenanceMode, setMaintenanceMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [crystaraCreator, setCrystaraCreator] = useState('');
  const [crystaraCollection, setCrystaraCollection] = useState('');
  const [crystaraApiKey, setCrystaraApiKey] = useState('');
  const [crystaraNetwork, setCrystaraNetwork] = useState<'mainnet' | 'testnet'>('mainnet');

  // Collection-specific name, creator, and maintenance states
  const [ogpassCollection, setOgpassCollection] = useState('');
  const [ogpassMaintenance, setOgpassMaintenance] = useState(true);
  const [ogpassCreator, setOgpassCreator] = useState('');
  const [gen01Collection, setGen01Collection] = useState('');
  const [gen01Maintenance, setGen01Maintenance] = useState(false);
  const [gen01Creator, setGen01Creator] = useState('');
  const [gen02Collection, setGen02Collection] = useState('');
  const [gen02Maintenance, setGen02Maintenance] = useState(true);
  const [gen02Creator, setGen02Creator] = useState('');
  const [gen03Collection, setGen03Collection] = useState('');
  const [gen03Maintenance, setGen03Maintenance] = useState(true);
  const [gen03Creator, setGen03Creator] = useState('');

  const [tokens, setTokens] = useState<any[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  // Collection Info State
  const [totalSupply, setTotalSupply] = useState<number | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('All');
  const [selectedTraits, setSelectedTraits] = useState<Record<string, string>>({});

  const [activeTab, setActiveTab] = useState<'ogpass' | 'gen01' | 'gen02' | 'gen03'>('gen01');
  
  // Modal Detail State
  const [activeNft, setActiveNft] = useState<any | null>(null);

  useEffect(() => {
    const loadNftsSettings = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data, error } = await supabase
            .from('website_settings')
            .select('value')
            .eq('key', 'nfts')
            .single();
          if (data && data.value) {
            setMaintenanceMode(data.value.maintenanceMode !== false);
            setCrystaraCreator(data.value.crystaraCreator || '');
            setCrystaraCollection(data.value.crystaraCollection || '');
            setCrystaraNetwork(data.value.crystaraNetwork || 'mainnet');
            setOgpassCollection(data.value.ogpassCollection || '');
            setOgpassMaintenance(data.value.ogpassMaintenance !== false);
            setOgpassCreator(data.value.ogpassCreator || data.value.crystaraCreator || '');
            setGen01Collection(data.value.gen01Collection || '');
            setGen01Maintenance(data.value.gen01Maintenance !== undefined ? data.value.gen01Maintenance : (data.value.maintenanceMode !== false));
            setGen01Creator(data.value.gen01Creator || data.value.crystaraCreator || '');
            setGen02Collection(data.value.gen02Collection || '');
            setGen02Maintenance(data.value.gen02Maintenance !== false);
            setGen02Creator(data.value.gen02Creator || data.value.crystaraCreator || '');
            setGen03Collection(data.value.gen03Collection || '');
            setGen03Maintenance(data.value.gen03Maintenance !== false);
            setGen03Creator(data.value.gen03Creator || data.value.crystaraCreator || '');
          }
        } else {
          const val = localStorage.getItem('gloopo_mock_setting_nfts');
          const keyVal = localStorage.getItem('gloopo_mock_setting_crystara_api_key');
          if (val) {
            const parsed = JSON.parse(val);
            setMaintenanceMode(parsed.maintenanceMode !== false);
            setCrystaraCreator(parsed.crystaraCreator || '');
            setCrystaraCollection(parsed.crystaraCollection || '');
            setCrystaraNetwork(parsed.crystaraNetwork || 'mainnet');
            setOgpassCollection(parsed.ogpassCollection || '');
            setOgpassMaintenance(parsed.ogpassMaintenance !== false);
            setOgpassCreator(parsed.ogpassCreator || parsed.crystaraCreator || '');
            setGen01Collection(parsed.gen01Collection || '');
            setGen01Maintenance(parsed.gen01Maintenance !== undefined ? parsed.gen01Maintenance : (parsed.maintenanceMode !== false));
            setGen01Creator(parsed.gen01Creator || parsed.crystaraCreator || '');
            setGen02Collection(parsed.gen02Collection || '');
            setGen02Maintenance(parsed.gen02Maintenance !== false);
            setGen02Creator(parsed.gen02Creator || parsed.crystaraCreator || '');
            setGen03Collection(parsed.gen03Collection || '');
            setGen03Maintenance(parsed.gen03Maintenance !== false);
            setGen03Creator(parsed.gen03Creator || parsed.crystaraCreator || '');
          }
          if (keyVal) {
            const parsedKey = JSON.parse(keyVal);
            setCrystaraApiKey(parsedKey.apiKey || '');
          }
        }
      } catch (err) {
        console.error('Failed to load NFTs settings:', err);
      } finally {
        setLoading(false);
      }
    };
    loadNftsSettings();
  }, []);

  const mockNfts = [
    { 
      id: 1, 
      name: 'Gloopo Prime', 
      rarity: 'Legendary', 
      image: '/images/gloopo.gif',
      description: 'The absolute ruler of the Gloopo realm, infused with pure L1 energy.',
      traits: [{ trait_type: 'Core', value: 'Alpha' }, { trait_type: 'Liquid', value: 'Gold' }] 
    },
    { 
      id: 2, 
      name: 'Gloopo Slime', 
      rarity: 'Rare', 
      image: '/images/gloopo.gif',
      description: 'A flexible explorer of the deep layers of the Atmos Protocol.',
      traits: [{ trait_type: 'Core', value: 'Beta' }, { trait_type: 'Liquid', value: 'Bio Slime' }] 
    },
    { 
      id: 3, 
      name: 'Gloopo Void', 
      rarity: 'Epic', 
      image: '/images/gloopo.gif',
      description: 'Forged in the consensus vacuum, wielding sub-second latency.',
      traits: [{ trait_type: 'Core', value: 'Gamma' }, { trait_type: 'Liquid', value: 'Void Fluid' }] 
    },
    { 
      id: 4, 
      name: 'Gloopo Aqua', 
      rarity: 'Uncommon', 
      image: '/images/gloopo.gif',
      description: 'Flowing through the liquid pools of the smart contracts.',
      traits: [{ trait_type: 'Core', value: 'Delta' }, { trait_type: 'Liquid', value: 'Pure Water' }] 
    },
    { 
      id: 5, 
      name: 'Gloopo Magma', 
      rarity: 'Rare', 
      image: '/images/gloopo.gif',
      description: 'High-temperature element designed for maximum stress testing.',
      traits: [{ trait_type: 'Core', value: 'Beta' }, { trait_type: 'Liquid', value: 'Lava' }] 
    },
    { 
      id: 6, 
      name: 'Gloopo Flora', 
      rarity: 'Common', 
      image: '/images/gloopo.gif',
      description: 'Organic growth module adapting to the decentralized ecosystem.',
      traits: [{ trait_type: 'Core', value: 'Epsilon' }, { trait_type: 'Liquid', value: 'Sap' }] 
    },
    { 
      id: 7, 
      name: 'Gloopo Mecha', 
      rarity: 'Legendary', 
      image: '/images/gloopo.gif',
      description: 'Robotic structure optimized for automated gas price prediction.',
      traits: [{ trait_type: 'Core', value: 'Alpha' }, { trait_type: 'Liquid', value: 'Coolant' }] 
    },
    { 
      id: 8, 
      name: 'Gloopo Astro', 
      rarity: 'Epic', 
      image: '/images/gloopo.gif',
      description: 'Navigating the starry heights of cross-chain bridging.',
      traits: [{ trait_type: 'Core', value: 'Gamma' }, { trait_type: 'Liquid', value: 'Stardust' }] 
    },
  ];

  const activeCollection = activeTab === 'ogpass' ? ogpassCollection :
                           activeTab === 'gen01' ? (gen01Collection || crystaraCollection) :
                           activeTab === 'gen02' ? gen02Collection :
                           gen03Collection;

  const activeCreator = activeTab === 'ogpass' ? ogpassCreator :
                        activeTab === 'gen01' ? (gen01Creator || crystaraCreator) :
                        activeTab === 'gen02' ? gen02Creator :
                        gen03Creator;

  const activeMaintenance = activeTab === 'ogpass' ? ogpassMaintenance :
                            activeTab === 'gen01' ? (gen01Maintenance !== undefined ? gen01Maintenance : maintenanceMode) :
                            activeTab === 'gen02' ? gen02Maintenance :
                            gen03Maintenance;

  useEffect(() => {
    if (loading) return;
    if (activeMaintenance) {
      setTokens([]);
      setTotalSupply(null);
      setFetchError(null);
      return;
    }
    if (!activeCreator || !activeCollection || (!isSupabaseConfigured && !crystaraApiKey)) return;

    let cancelled = false;

    const fetchCrystaraTokensPage = async (pageNo: number) => {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.functions.invoke('crystara-proxy', {
          body: {
            creator: activeCreator,
            collection: activeCollection,
            page: pageNo,
            limit: 50,
            network: crystaraNetwork
          }
        });
        if (error) {
          throw new Error(error.message || 'Failed to invoke Supabase Edge Function');
        }
        return data;
      } else {
        const baseUrl = crystaraNetwork === 'testnet' ? 'https://api.crystara.trade/testnet' : 'https://api.crystara.trade/mainnet';
        const url = `${baseUrl}/tokens-by-collection?creator=${encodeURIComponent(activeCreator)}&collection=${encodeURIComponent(activeCollection)}&page=${pageNo}&limit=50`;
        const res = await fetch(url, {
          headers: { 'x-api-key': crystaraApiKey }
        });
        if (!res.ok) {
          throw new Error(`API returned error: ${res.status} ${res.statusText}`);
        }
        return await res.json();
      }
    };

    const fetchAllCrystaraTokens = async () => {
      setLoadingTokens(true);
      setFetchError(null);
      try {
        // 1. Fetch page 1 first to read total items/supply
        const json1 = await fetchCrystaraTokensPage(1);

        let page1Tokens = [];
        if (json1.success && Array.isArray(json1.data)) {
          page1Tokens = json1.data;
        } else if (json1.success && json1.data && Array.isArray(json1.data.tokens)) {
          page1Tokens = json1.data.tokens;
        } else if (json1.tokens && Array.isArray(json1.tokens)) {
          page1Tokens = json1.tokens;
        } else if (Array.isArray(json1)) {
          page1Tokens = json1;
        } else {
          throw new Error('Unexpected API response format');
        }

        const supplyFromResponse =
          json1.collection?.totalSupply ?? json1.pagination?.totalItems ??
          json1.total ?? json1.totalCount ?? json1.totalSupply ??
          json1.data?.total ?? json1.data?.totalCount ?? json1.data?.totalSupply ?? 1000;
        
        const totalItems = Number(supplyFromResponse);
        setTotalSupply(totalItems);

        const limit = json1.pagination?.limit ?? 50;
        const totalP = Math.max(1, Math.ceil(totalItems / limit));

        if (cancelled) return;

        // Setup initial tokens
        let accumulatedTokens = [...page1Tokens];
        setTokens(accumulatedTokens);

        // 2. Fetch remaining pages in parallel
        if (totalP > 1) {
          const pagePromises = Array.from({ length: totalP - 1 }, (_, idx) => idx + 2).map(async (pageNo) => {
            try {
              const data = await fetchCrystaraTokensPage(pageNo);
              return data.tokens || data.data?.tokens || data.data || [];
            } catch (err) {
              console.error(`Failed to fetch page ${pageNo}:`, err);
            }
            return [];
          });

          const pagesResults = await Promise.all(pagePromises);
          if (cancelled) return;
          pagesResults.forEach((pageTokens) => {
            accumulatedTokens.push(...pageTokens);
          });
        }

        // Sort tokens numerically by their tokenName sequence (TOKEN_1, TOKEN_2, ...)
        accumulatedTokens.sort((a, b) => {
          const nameA = a.tokenName || '';
          const nameB = b.tokenName || '';
          return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' });
        });

        if (cancelled) return;
        setTokens(accumulatedTokens);

        // 3. Load metadata cache from localStorage
        const cacheKey = `gloopo_metadata_cache_${activeCreator}_${activeCollection}`;
        let localCache: Record<string, any> = {};
        try {
          const stored = localStorage.getItem(cacheKey);
          if (stored) {
            localCache = JSON.parse(stored);
          }
        } catch (err) {
          console.error("Failed to parse metadata cache:", err);
        }

        // Apply cache immediately
        setTokens(prev => 
          prev.map(t => {
            const uri = t.tokenUri || t.uri;
            if (uri && localCache[uri]) {
              return { ...t, metadata: localCache[uri] };
            }
            return t;
          })
        );

        // 4. Fetch missing metadata in background parallel batches
        const tokensToFetch = accumulatedTokens.filter(t => {
          const uri = t.tokenUri || t.uri;
          return uri && !localCache[uri];
        });

        if (tokensToFetch.length > 0 && !cancelled) {
          const batchSize = 35;
          for (let i = 0; i < tokensToFetch.length; i += batchSize) {
            if (cancelled) break;
            const batch = tokensToFetch.slice(i, i + batchSize);

            await Promise.all(
              batch.map(async (t) => {
                const uri = t.tokenUri || t.uri;
                if (!uri) return;
                try {
                  const metadataRes = await fetch(`/api/metadata?url=${encodeURIComponent(uri)}`);
                  if (metadataRes.ok) {
                    const meta = await metadataRes.json();
                    localCache[uri] = meta;

                    // Update token metadata in state
                    setTokens(prev =>
                      prev.map(item => {
                        const itemUri = item.tokenUri || item.uri;
                        if (itemUri === uri) {
                          return { ...item, metadata: meta };
                        }
                        return item;
                      })
                    );
                  }
                } catch (metaErr) {
                  // ignore
                }
              })
            );

            // Save cache periodically
            try {
              localStorage.setItem(cacheKey, JSON.stringify(localCache));
            } catch (err) {
              // Ignore quota errors if storage is full
            }
          }
        }

      } catch (err: any) {
        console.error('Failed to fetch from Crystara API:', err);
        setFetchError(err.message || 'Unknown API error');
      } finally {
        if (!cancelled) {
          setLoadingTokens(false);
        }
      }
    };

    fetchAllCrystaraTokens();

    return () => {
      cancelled = true;
    };
  }, [loading, activeMaintenance, activeCreator, activeCollection, crystaraApiKey, crystaraNetwork, isSupabaseConfigured]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCreator, activeCollection, crystaraNetwork]);

  const isConfigured = Boolean(activeCreator && activeCollection && (isSupabaseConfigured || crystaraApiKey));

  const normalizeToken = (t: any) => {
    // Deduce numerical ID from tokenName (e.g., "TOKEN_600" -> "600")
    const match = t.tokenName?.match(/TOKEN_(\d+)/i);
    const tokenNo = match ? match[1] : null;
    const prefix = activeTab === 'ogpass' ? 'Gloopo OG Pass' : 'Gloopo';
    const deducedName = tokenNo ? `${prefix} #${tokenNo}` : null;

    const name = t.metadata?.name || deducedName || t.name || t.tokenName || `NFT #${t.tokenId || t.id || '?'}`;
    
    let image = t.image || t.metadata?.image || t.url;
    if (!image && t.tokenUri) {
      // Deduce the thumbnail image URL from tokenUri to load instantly
      image = t.tokenUri.replace('/metadata.json', '/image_360.webp');
    }
    if (!image) {
      image = '/images/gloopo.gif';
    }
    if (image.startsWith('ipfs://')) {
      image = image.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }

    let attributes = [];
    if (Array.isArray(t.attributes)) {
      attributes = t.attributes;
    } else if (t.metadata && Array.isArray(t.metadata.attributes)) {
      attributes = t.metadata.attributes;
    } else if (t.traits && Array.isArray(t.traits)) {
      attributes = t.traits;
    }

    let rarity = 'Sprout';
    const rarityAttr = attributes.find(
      (a: any) => a.trait_type?.toLowerCase() === 'rarity'
    );
    if (rarityAttr) {
      rarity = (rarityAttr.value || 'Sprout').trim();
    } else if (t.rarityName) {
      rarity = t.rarityName.trim();
    } else if (t.rarity) {
      rarity = (t.rarity || 'Sprout').trim();
    }

    const traits = attributes.filter(
      (a: any) => a.trait_type?.toLowerCase() !== 'rarity'
    );

    return {
      id: t.id || t.tokenId || name,
      name,
      image,
      rarity,
      traits,
      description: t.description || t.metadata?.description || 'Discover the traits and rarity of this unique NFT.',
      metadata: t.metadata || null
    };
  };

  const activeList = isConfigured
    ? tokens.map(normalizeToken)
    : [];

  const allRarities = isConfigured
    ? ['Sprout', 'Hatching', 'Alpha', 'Apex', 'Ancient']
    : Array.from(new Set(activeList.map(n => n.rarity)));

  const handleRarityChange = (rarity: string) => {
    setSelectedRarity(rarity);
    setCurrentPage(1);
  };

  const traitCategories: Record<string, string[]> = {};
  activeList.forEach(nft => {
    if (Array.isArray(nft.traits)) {
      nft.traits.forEach((t: any) => {
        if (t.trait_type && t.value) {
          if (!traitCategories[t.trait_type]) {
            traitCategories[t.trait_type] = [];
          }
          if (!traitCategories[t.trait_type].includes(t.value)) {
            traitCategories[t.trait_type].push(t.value);
          }
        }
      });
    }
  });

  const handleTraitSelect = (category: string, value: string) => {
    setSelectedTraits(prev => {
      const updated = { ...prev };
      if (value === 'All') {
        delete updated[category];
      } else {
        updated[category] = value;
      }
      return updated;
    });
    setCurrentPage(1); // Reset page to 1
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedRarity('All');
    setSelectedTraits({});
    setCurrentPage(1);
  };

  useEffect(() => {
    resetFilters();
  }, [activeTab]);

  // Filter the full activeList client-side (bypass filters completely for OG PASS)
  const filteredNfts = activeTab === 'ogpass' ? activeList : activeList.filter(nft => {
    // 1. Search Query: match name, description or ID
    const matchesSearch = searchQuery === '' ||
      nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (nft.description && nft.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      nft.id.toString().includes(searchQuery);

    // 2. Trait filter: match all selected traits
    const matchesTraits = Object.entries(selectedTraits).every(([category, value]) => {
      return nft.traits?.some((t: any) => t.trait_type === category && t.value === value);
    });

    // 3. Rarity filter
    const matchesRarity = selectedRarity === 'All' || 
      nft.rarity.toLowerCase() === selectedRarity.toLowerCase();

    return matchesSearch && matchesRarity && matchesTraits;
  });

  // Client-side page slice
  const DISPLAY_PAGE_SIZE = 50;
  const displayList = filteredNfts.slice((currentPage - 1) * DISPLAY_PAGE_SIZE, currentPage * DISPLAY_PAGE_SIZE);

  // Effective pagination values
  const effectiveTotalPages = Math.max(1, Math.ceil(filteredNfts.length / DISPLAY_PAGE_SIZE));
  const effectiveCurrentPage = currentPage;
  const effectiveLoadingTokens = loadingTokens;
  const effectiveSetPage = (p: number) => setCurrentPage(p);
  const effectiveHasMore = currentPage < effectiveTotalPages;

  if (loading) {
    return (
      <div className="showcase-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="spinner"></span>
        <style jsx>{`
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(0, 255, 136, 0.1);
            border-radius: 50%;
            border-top-color: var(--primary);
            animation: spin 1s ease-in-out infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .showcase-page {
            min-height: 100vh;
            background: #030806;
          }
        `}</style>
      </div>
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
            <Compass size={38} className="spin-slow" />
          </div>
          <h1>NFTs Section Under Development</h1>
          <p>
            The Gloopo Gen-1 Crystara Collection mint interface and showcase are currently under construction.
          </p>
          <div className="status-indicator">
            <span className="dot animate-pulse"></span>
            <span>DEVELOPMENT MODE ACTIVE</span>
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
            background: rgba(0, 255, 136, 0.06);
            border: 1px solid rgba(0, 255, 136, 0.2);
            color: #00ff88;
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
            background: #00ff88;
          }
          :global(.spin-slow) {
            animation: spin-slow 15s linear infinite;
          }
          @keyframes spin-slow {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="showcase-page">
      <div className="bg-decorations">
        <div className="glow-sphere"></div>
      </div>

      <div className="showcase-header">
        <div className="header-badge-row">
          <h1 className="showcase-title">NFT <span className="highlight">Showcase</span></h1>
        </div>
        
        {/* Navigation Tabs */}
        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'ogpass' ? 'active' : ''}`}
            onClick={() => setActiveTab('ogpass')}
          >
            OG PASS
          </button>
          <button 
            className={`tab-btn ${activeTab === 'gen01' ? 'active' : ''}`}
            onClick={() => setActiveTab('gen01')}
          >
            Gen 01
          </button>
          <button 
            className={`tab-btn ${activeTab === 'gen02' ? 'active' : ''}`}
            onClick={() => setActiveTab('gen02')}
          >
            Gen 02
          </button>
          <button 
            className={`tab-btn ${activeTab === 'gen03' ? 'active' : ''}`}
            onClick={() => setActiveTab('gen03')}
          >
            Gen 03
          </button>
        </div>

        {isConfigured && (
          <div className="collection-stats-row">
            <div className="stat-badge">
              <span className="stat-dot"></span>
              <span className="stat-label">Total Supply</span>
              <span className="stat-value">
                {totalSupply !== null
                  ? totalSupply.toLocaleString()
                  : loadingTokens
                  ? <span className="stat-loading">…</span>
                  : '—'
                }
              </span>
            </div>
            {activeList.length > 0 && (
              <div className="stat-badge">
                <span className="stat-label">Current Page</span>
                <span className="stat-value">{displayList.length.toLocaleString()} NFTs</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="container">
        {!activeMaintenance ? (
          <div className={`showcase-layout ${isConfigured && activeList.length > 0 && activeTab !== 'ogpass' ? 'has-sidebar' : ''}`}>
          {/* Left Column: Sidebar Filters */}
          {isConfigured && activeList.length > 0 && activeTab !== 'ogpass' && (
            <aside className="sidebar-filters glass-card">
              <div className="sidebar-header">
                <h3>Filters</h3>
                {(searchQuery || selectedRarity !== 'All' || Object.keys(selectedTraits).length > 0) && (
                  <button onClick={resetFilters} className="reset-link-btn">
                    Reset All
                  </button>
                )}
              </div>

              <div className="sidebar-group">
                <label className="sidebar-label">Search</label>
                <div className="search-wrapper">
                  <Search size={16} className="search-icon-inside" />
                  <input 
                    type="text" 
                    placeholder="Search name or ID..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="search-clear-btn"
                      title="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="sidebar-group">
                <label className="sidebar-label">Rarity</label>
                <CustomDropdown
                  value={selectedRarity}
                  onChange={handleRarityChange}
                  options={[
                    { value: 'All', label: 'All Rarities' },
                    ...allRarities.map(rarity => ({ value: rarity, label: rarity }))
                  ]}
                />
              </div>

              {/* Dynamic trait categories */}
              {Object.entries(traitCategories).map(([category, values]) => (
                <div key={category} className="sidebar-group">
                  <label className="sidebar-label">{category}</label>
                  <CustomDropdown
                    value={selectedTraits[category] || 'All'}
                    onChange={(value) => handleTraitSelect(category, value)}
                    options={[
                      { value: 'All', label: `All ${category}s` },
                      ...values.map(val => ({ value: val, label: val }))
                    ]}
                  />
                </div>
              ))}
            </aside>
          )}

          {/* Right Column: Main Content */}
          <main className="main-content">
            {effectiveLoadingTokens ? (
              <div className="nft-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="skeleton-card"></div>
                ))}
              </div>
            ) : !isConfigured ? (
              <div className="no-results glass-card">
                <h3>Genesis Collection Coming Soon</h3>
                <p>Our Crystara NFT collection is currently preparing for launch. Stay tuned for the official mint details!</p>
              </div>
            ) : fetchError ? (
              <div className="no-results glass-card">
                <h3>Collection Temporarily Offline</h3>
                <p>We are currently updating our showcase data. Please check back later.</p>
              </div>
            ) : filteredNfts.length === 0 ? (
              <div className="no-results glass-card">
                <h3>No NFTs Found</h3>
                <p>No collections match your selected search or traits combination. Try resetting your filters.</p>
                <button onClick={resetFilters} className="btn-primary-sm" style={{ marginTop: '1rem', background: 'var(--primary)', color: '#030806', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="nft-grid">
                  {displayList.map((nft) => {
                    const isMetadataLoading = isConfigured && !nft.metadata;
                    return (
                      <div key={nft.id} className="nft-card glass-card" onClick={() => setActiveNft(nft)}>
                        <div className="nft-image-placeholder">
                          <NftImage src={nft.image} alt={nft.name} isMetadataLoading={isMetadataLoading} />
                        </div>
                        <div className="nft-info">
                          <h3>{nft.name}</h3>
                          <span className={`rarity rarity-${nft.rarity.toLowerCase()}`}>{nft.rarity}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Smart Windowed Pagination */}
                {effectiveTotalPages !== null && effectiveTotalPages > 1 && (
                  <div className="pagination-controls">
                    {/* Prev button */}
                    <button
                      onClick={() => {
                        effectiveSetPage(Math.max(effectiveCurrentPage - 1, 1));
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                      }}
                      disabled={effectiveCurrentPage === 1 || effectiveLoadingTokens}
                      className="pagination-btn"
                      title="Previous Page"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {/* Page number buttons */}
                    <div className="pagination-pages">
                      {(() => {
                        const pages: (number | '...')[] = [];
                        const tp = effectiveTotalPages;
                        const cp = effectiveCurrentPage;
                        const delta = 1;

                        const rangeStart = Math.max(2, cp - delta);
                        const rangeEnd = Math.min(tp - 1, cp + delta);

                        pages.push(1);
                        if (rangeStart > 2) pages.push('...');
                        for (let p = rangeStart; p <= rangeEnd; p++) pages.push(p);
                        if (rangeEnd < tp - 1) pages.push('...');
                        if (tp > 1) pages.push(tp);

                        return pages.map((p, i) =>
                          p === '...' ? (
                            <span key={`ellipsis-${i}`} className="pagination-ellipsis">…</span>
                          ) : (
                            <button
                              key={p}
                              onClick={() => {
                                effectiveSetPage(p as number);
                                window.scrollTo({ top: 350, behavior: 'smooth' });
                              }}
                              disabled={effectiveLoadingTokens}
                              className={`pagination-page-btn ${p === cp ? 'active' : ''}`}
                            >
                              {p}
                            </button>
                          )
                        );
                      })()}
                    </div>

                    {/* Next button */}
                    <button
                      onClick={() => {
                        if (effectiveHasMore) {
                          effectiveSetPage(effectiveCurrentPage + 1);
                          window.scrollTo({ top: 350, behavior: 'smooth' });
                        }
                      }}
                      disabled={!effectiveHasMore || effectiveLoadingTokens}
                      className="pagination-btn"
                      title="Next Page"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
        ) : (
          <div className="coming-soon-container glass-card">
            <Compass size={48} className="coming-soon-icon" />
            {activeTab === 'ogpass' ? (
              <>
                <h2>OG PASS Coming Soon</h2>
                <p>The Gloopo OG Pass is under development. Explorers with the OG Pass will unlock premium rewards, exclusive early access to drops, and DAO voting weight. Stay tuned!</p>
              </>
            ) : activeTab === 'gen01' ? (
              <>
                <h2>Generation 01 Coming Soon</h2>
                <p>The Gloopo Gen-1 NFT collection is preparing for launch. Stay tuned for the official release!</p>
              </>
            ) : (
              <>
                <h2>Generation {activeTab === 'gen02' ? '02' : '03'} Coming Soon</h2>
                <p>We are currently designing and preparing the next generation of Gloopo NFTs. Stay tuned for the official release!</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Elegant Glassmorphic Detail Modal */}
      {activeNft && (
        <div className="modal-overlay" onClick={() => setActiveNft(null)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveNft(null)}>
              <X size={24} />
            </button>
            <div className="modal-body">
              <div className="modal-image-sec">
                <img src={activeNft.image} alt={activeNft.name} />
              </div>
              <div className="modal-info-sec">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span className={`rarity rarity-${activeNft.rarity.toLowerCase()}`}>{activeNft.rarity}</span>
                  {isConfigured && tokens.length > 0 && (
                    <a 
                      href="https://crystara.trade/inventory"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="crystara-link"
                      title="View on Crystara.trade"
                    >
                      <ExternalLink size={14} />
                      <span>Crystara</span>
                    </a>
                  )}
                </div>
                <h2>{activeNft.name}</h2>
                <p className="modal-desc">{activeNft.description}</p>
                
                <div className="modal-traits-section">
                  <h3>Traits &amp; Attributes</h3>
                  {activeNft.traits && activeNft.traits.length > 0 ? (
                    <div className="traits-grid">
                      {activeNft.traits.map((t: any, idx: number) => (
                        <div key={idx} className="trait-item">
                          <span className="trait-label">{t.trait_type}</span>
                          <span className="trait-val">{t.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-traits">This NFT has no traits listed.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .tabs-container {
          display: inline-flex;
          background: rgba(13, 20, 18, 0.65);
          border: 1px solid rgba(0, 255, 136, 0.12);
          border-radius: 50px;
          padding: 0.3rem;
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          z-index: 10;
          position: relative;
        }

        .tab-btn {
          background: transparent;
          border: none;
          outline: none;
          color: rgba(255, 255, 255, 0.6);
          padding: 0.6rem 1.8rem;
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tab-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.03);
        }

        .tab-btn.active {
          background: var(--primary);
          color: #030806;
          box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
        }

        .coming-soon-container {
          max-width: 600px;
          margin: 4rem auto;
          padding: 4rem 2.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          background: rgba(4, 12, 10, 0.45);
          border: 1px solid rgba(0, 255, 136, 0.15);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(12px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          box-sizing: border-box;
          z-index: 10;
          position: relative;
        }

        .coming-soon-icon {
          color: var(--primary);
          animation: spin-slow 15s linear infinite;
          filter: drop-shadow(0 0 10px rgba(0, 255, 136, 0.3));
        }

        .coming-soon-container h2 {
          font-size: 1.8rem;
          font-weight: 900;
          color: #fff;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .coming-soon-container p {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0;
        }

        .showcase-page {
          min-height: 100vh;
          padding-top: 150px;
          padding-bottom: 120px;
          background: #030806;
          position: relative;
          overflow-x: hidden;
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
          width: 800px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 255, 136, 0.08), transparent 70%);
          top: -100px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 0;
        }

        .showcase-header {
          text-align: center;
          margin-bottom: 60px;
          position: relative;
          z-index: 1;
        }

        .header-badge-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .showcase-title {
          font-size: 4rem;
          font-weight: 900;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #fff;
        }
        
        .highlight {
          color: var(--primary);
        }
        
        .showcase-subtitle {
          color: var(--text-muted);
          font-size: 1.2rem;
          font-weight: 500;
          margin-top: 1rem;
        }

        .collection-stats-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }

        .stat-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(13, 20, 18, 0.6);
          border: 1px solid rgba(0, 255, 136, 0.18);
          border-radius: 50px;
          padding: 0.4rem 1rem 0.4rem 0.75rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .stat-badge:hover {
          border-color: rgba(0, 255, 136, 0.35);
          box-shadow: 0 4px 20px rgba(0, 255, 136, 0.1), inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .stat-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--primary);
          flex-shrink: 0;
          animation: pulse 1.8s ease-in-out infinite;
        }

        .stat-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .stat-value {
          font-size: 0.9rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.01em;
        }

        .stat-loading {
          color: var(--text-muted);
          font-weight: 400;
          animation: pulse 1s ease-in-out infinite;
        }

        .api-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(0, 255, 136, 0.05);
          border: 1px solid rgba(0, 255, 136, 0.2);
          color: var(--primary);
          padding: 0.35rem 0.9rem;
          border-radius: 50px;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .api-badge .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--primary);
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }

        /* Alert Banner Styles */
        .alert-banner {
          margin-bottom: 2rem;
          padding: 1.25rem 1.5rem;
          border-radius: var(--radius-md);
          position: relative;
          z-index: 1;
        }

        .alert-banner.warning {
          background: rgba(255, 187, 0, 0.03);
          border: 1px solid rgba(255, 187, 0, 0.2);
        }

        .alert-banner.error {
          background: rgba(255, 77, 77, 0.03);
          border: 1px solid rgba(255, 77, 77, 0.2);
        }

        .alert-content {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .alert-icon {
          font-size: 1.5rem;
          line-height: 1;
        }

        .alert-content h4 {
          margin: 0 0 0.25rem 0;
          font-size: 0.95rem;
          font-weight: 800;
          color: #fff;
        }

        .alert-content p {
          margin: 0;
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .alert-link {
          color: var(--primary);
          text-decoration: underline;
          font-weight: 700;
        }

        /* Filter Layout & Sidebar Styles */
        .showcase-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: start;
          position: relative;
          z-index: 10;
        }
        
        @media (min-width: 992px) {
          .showcase-layout.has-sidebar {
            grid-template-columns: 280px 1fr;
          }
        }

        .sidebar-filters {
          background: rgba(13, 20, 18, 0.45);
          border: 1px solid rgba(0, 255, 136, 0.15);
          padding: 1.15rem;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.88rem;
          position: sticky;
          top: 120px;
          backdrop-filter: blur(12px);
          box-sizing: border-box;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 0.75rem;
          margin-bottom: 0.25rem;
        }

        .sidebar-header h3 {
          font-size: 1.1rem;
          font-weight: 800;
          color: #fff;
          margin: 0;
          letter-spacing: 0.02em;
        }

        .reset-link-btn {
          background: none;
          border: none;
          color: var(--primary);
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          transition: opacity 0.2s ease;
        }

        .reset-link-btn:hover {
          opacity: 0.8;
        }

        .sidebar-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .sidebar-label {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .main-content {
          flex: 1;
        }

        .search-wrapper {
          width: 100%;
          position: relative;
        }

        .search-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(3, 8, 6, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          transition: all 0.3s ease;
          box-sizing: border-box;
          color: rgba(255, 255, 255, 0.4);
        }

        .search-wrapper:focus-within {
          border-color: rgba(0, 255, 136, 0.4);
          box-shadow: 0 0 12px rgba(0, 255, 136, 0.15);
          background: rgba(3, 8, 6, 0.75);
          color: var(--primary);
        }

        .search-icon-inside {
          transition: color 0.3s ease;
          flex-shrink: 0;
        }

        .search-input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 0.82rem;
          padding: 0;
          margin: 0;
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .search-clear-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .search-clear-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }

        .reset-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff;
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .reset-btn:hover {
          background: rgba(0, 255, 136, 0.06);
          border-color: rgba(0, 255, 136, 0.3);
          color: var(--primary);
        }

        /* Results Statuses */
        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          border-radius: var(--radius-md);
          background: rgba(13, 20, 18, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .no-results h3 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
          margin: 0 0 0.5rem 0;
        }

        .no-results p {
          color: var(--text-muted);
          margin: 0;
          font-size: 0.9rem;
        }

        /* Skeletons */
        .skeleton-card {
          height: 280px;
          background: rgba(13, 20, 18, 0.4);
          border: 1px dashed rgba(0, 255, 136, 0.1);
          border-radius: var(--radius-md);
          position: relative;
          overflow: hidden;
        }

        .skeleton-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.03), transparent);
          animation: skeleton-loading 1.6s infinite;
        }

        @keyframes skeleton-loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* NFT Grid and Cards */
        .nft-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .nft-card {
          padding: 1rem;
          border-radius: var(--radius-md);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%), rgba(13, 20, 18, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 255, 136, 0.15);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
          cursor: pointer;
        }

        .nft-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0, 255, 136, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          border-color: rgba(0, 255, 136, 0.4);
        }

        .nft-image-placeholder {
          width: 100%;
          aspect-ratio: 1;
          background: linear-gradient(145deg, rgba(0,0,0,0.4), rgba(0,255,136,0.05));
          border-radius: var(--radius-md);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          border: 1px solid rgba(255,255,255,0.02);
        }

        .nft-image-placeholder img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: drop-shadow(0 0 15px rgba(0, 255, 136, 0.2));
          transition: transform 0.5s ease;
        }

        .nft-card:hover .nft-image-placeholder img {
          transform: scale(1.1) rotate(2deg);
        }

         .nft-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
        }

        .nft-info h3 {
          font-size: 1rem;
          font-weight: 800;
          color: #fff;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
          flex: 1;
        }

        .rarity {
          font-size: 0.62rem;
          font-weight: 800;
          padding: 0.2rem 0.5rem;
          border-radius: 50px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }

        .rarity-sprout { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); box-shadow: 0 0 10px rgba(59, 130, 246, 0.1); }
        .rarity-hatching { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); box-shadow: 0 0 10px rgba(16, 185, 129, 0.1); }
        .rarity-alpha { background: rgba(217, 70, 239, 0.1); color: #d946ef; border: 1px solid rgba(217, 70, 239, 0.3); box-shadow: 0 0 10px rgba(217, 70, 239, 0.1); }
        .rarity-apex { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); box-shadow: 0 0 10px rgba(239, 68, 68, 0.1); }
        .rarity-ancient { background: rgba(250, 204, 21, 0.1); color: #facc15; border: 1px solid rgba(250, 204, 21, 0.3); box-shadow: 0 0 10px rgba(250, 204, 21, 0.1); }
        .rarity-mythic { background: rgba(255, 68, 68, 0.1); color: #FF4444; border: 1px solid rgba(255, 68, 68, 0.3); box-shadow: 0 0 10px rgba(255,68,68,0.1); }
        .rarity-zodiac { background: rgba(0, 255, 255, 0.1); color: #00FFFF; border: 1px solid rgba(0, 255, 255, 0.3); box-shadow: 0 0 10px rgba(0,255,255,0.1); }
        .rarity-legendary, .rarity-legend { background: rgba(255, 215, 0, 0.1); color: #FFD700; border: 1px solid rgba(255, 215, 0, 0.3); box-shadow: 0 0 10px rgba(255,215,0,0.1); }
        .rarity-epic { background: rgba(153, 50, 204, 0.1); color: #c476f2; border: 1px solid rgba(153, 50, 204, 0.3); }
        .rarity-rare { background: rgba(0, 191, 255, 0.1); color: #00BFFF; border: 1px solid rgba(0, 191, 255, 0.3); }
        .rarity-uncommon { background: rgba(50, 205, 50, 0.1); color: #32CD32; border: 1px solid rgba(50, 205, 50, 0.3); }
        .rarity-common { background: rgba(255, 255, 255, 0.05); color: #aaa; border: 1px solid rgba(255, 255, 255, 0.1); }

        /* Pagination Controls */
        .pagination-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 3rem;
          position: relative;
          z-index: 10;
          flex-wrap: wrap;
        }

        .pagination-btn {
          background: rgba(13, 20, 18, 0.6);
          border: 1px solid rgba(0, 255, 136, 0.2);
          color: #fff;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          outline: none;
          flex-shrink: 0;
        }

        .pagination-btn:hover:not(:disabled) {
          background: rgba(0, 255, 136, 0.15);
          border-color: var(--primary);
          color: var(--primary);
          box-shadow: 0 0 15px rgba(0, 255, 136, 0.2);
        }

        .pagination-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          border-color: rgba(255, 255, 255, 0.08);
        }

        .pagination-pages {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .pagination-page-btn {
          background: rgba(13, 20, 18, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.65);
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.82rem;
          font-weight: 700;
          transition: all 0.2s ease;
          outline: none;
          flex-shrink: 0;
        }

        .pagination-page-btn:hover:not(:disabled) {
          background: rgba(0, 255, 136, 0.1);
          border-color: rgba(0, 255, 136, 0.3);
          color: #fff;
        }

        .pagination-page-btn.active {
          background: rgba(0, 255, 136, 0.15);
          border-color: var(--primary);
          color: var(--primary);
          box-shadow: 0 0 12px rgba(0, 255, 136, 0.2);
          cursor: default;
        }

        .pagination-page-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .pagination-ellipsis {
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.9rem;
          width: 28px;
          text-align: center;
          letter-spacing: 0.05em;
          user-select: none;
        }

        /* Modal Overlay & Card Content */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(3, 8, 6, 0.85);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: modal-fadeIn 0.3s ease forwards;
        }

        .modal-content {
          width: 90%;
          max-width: 820px;
          height: auto;
          max-height: 88vh;
          overflow: hidden;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%), rgba(13, 20, 18, 0.9);
          border: 1px solid rgba(0, 255, 136, 0.2);
          border-radius: var(--radius-lg);
          position: relative;
          padding: 2rem 2.5rem;
          box-shadow: 0 30px 60px rgba(0,0,0,0.6);
          animation: modal-slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        .modal-content::-webkit-scrollbar { display: none; }

        .modal-close {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          background: none;
          border: none;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          transition: color 0.2s, transform 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border-radius: 50%;
        }

        .modal-close:hover {
          color: #fff;
          background: rgba(255,255,255,0.05);
          transform: rotate(90deg);
        }

        .modal-body {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 2rem;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }

        .modal-image-sec {
          background: linear-gradient(145deg, rgba(0,0,0,0.4), rgba(0,255,136,0.05));
          border-radius: var(--radius-md);
          border: 1px solid rgba(255,255,255,0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          aspect-ratio: 1;
          max-height: 100%;
          overflow: hidden;
        }

        .modal-image-sec img {
          max-width: 100%;
          max-height: 100%;
          border-radius: var(--radius-md);
          filter: drop-shadow(0 0 20px rgba(0, 255, 136, 0.3));
          object-fit: contain;
        }

        .modal-info-sec {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.75rem;
          overflow: hidden;
          min-height: 0;
        }

        .modal-info-sec h2 {
          font-size: 1.9rem;
          font-weight: 900;
          margin: 0;
          color: #fff;
          letter-spacing: -0.01em;
          line-height: 1.1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .modal-desc {
          color: var(--text-muted);
          line-height: 1.5;
          font-size: 0.88rem;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .modal-traits-section {
          width: 100%;
          margin-top: 0.5rem;
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .modal-traits-section h3 {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--primary);
          margin: 0 0 0.6rem 0;
          font-weight: 800;
          flex-shrink: 0;
        }

        .traits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 0.5rem;
          width: 100%;
          overflow-y: auto;
          max-height: 220px;
          align-content: start;
          padding-right: 4px;
        }

        .traits-grid::-webkit-scrollbar {
          width: 4px;
        }
        .traits-grid::-webkit-scrollbar-track {
          background: transparent;
        }
        .traits-grid::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 136, 0.15);
          border-radius: 4px;
        }
        .traits-grid::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 136, 0.4);
        }

        .trait-item {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(0, 255, 136, 0.12);
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          min-width: 0;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.02);
          transition: all 0.2s ease;
        }

        .trait-item:hover {
          background: rgba(0, 255, 136, 0.04);
          border-color: rgba(0, 255, 136, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 255, 136, 0.05), inset 0 1px 0 rgba(255,255,255,0.02);
        }

        .trait-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.03em;
          font-weight: 700;
          white-space: normal;
          line-height: 1.2;
        }

        .trait-val {
          font-size: 0.78rem;
          font-weight: 800;
          color: #fff;
          white-space: normal;
          line-height: 1.3;
          word-break: break-word;
        }

        .no-traits {
          color: var(--text-muted);
          font-style: italic;
          font-size: 0.85rem;
          margin: 0;
        }

        .crystara-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff;
          padding: 0.3rem 0.7rem;
          border-radius: 50px;
          font-size: 0.7rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .crystara-link:hover {
          background: rgba(0, 255, 136, 0.08);
          border-color: rgba(0, 255, 136, 0.3);
          color: var(--primary);
        }

        @keyframes modal-fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modal-slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @media (max-width: 768px) {
          .showcase-title { font-size: 2.5rem; }
          .nft-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
          .modal-body { grid-template-columns: 1fr; gap: 1rem; }
          .modal-image-sec { max-height: 200px; aspect-ratio: auto; }
          .modal-content { padding: 1.25rem; max-height: 92vh; }
          .modal-info-sec h2 { font-size: 1.4rem; }
        }
      `}</style>
    </div>
  );
}
